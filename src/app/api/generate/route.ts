import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  let requestId: string | undefined

  try {
    const {
      id,
      style,
      bodyPlacement,
      detailLevel,
      modifier,
      negativePrompt,
      description,
      referenceImage,
      freestyleDrawing
    } = await req.json()

    requestId = id

    // Update status to processing
    await supabase
      .from('design_requests')
      .update({ status: 'processing' })
      .eq('id', id)

    // Construct the prompt
    const prompt = `Create a ${style} tattoo design for ${bodyPlacement} with ${detailLevel} detail level. Style should be ${modifier}. The design should be: ${description}`

    // Get the webhook URL
    let webhookUrl: string
    if (process.env.NODE_ENV === 'development' && process.env.NGROK_URL) {
      // In development, use the ngrok URL from environment variable
      webhookUrl = `${process.env.NGROK_URL}/api/replicate-webhook`
      console.log('Using development webhook URL:', webhookUrl)
      console.log('NGROK_URL env var:', process.env.NGROK_URL)
    } else {
      // In production or if no ngrok URL is set, use the host header
      const host = req.headers.get('host')
      webhookUrl = `https://${host}/api/replicate-webhook`
      console.log('Using production webhook URL:', webhookUrl)
      console.log('Host header:', host)
    }
    
    // Log the prediction request
    console.log('Sending prediction request to Replicate:', {
      prompt,
      webhook: webhookUrl,
      webhook_events_filter: ["completed"]
    })

    // Start the prediction with webhook
    const prediction = await replicate.predictions.create({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      input: {
        prompt: prompt,
        negative_prompt: negativePrompt,
        ...(referenceImage || freestyleDrawing ? { image: referenceImage || freestyleDrawing } : {}), // Make image optional
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: 50,
      },
      webhook: webhookUrl,
      webhook_events_filter: ["completed"] // We only want the final result
    })

    console.log('Prediction created:', {
      id: prediction.id,
      status: prediction.status,
      webhook: prediction.webhook
    })

    // Update the database with the prediction ID
    await supabase
      .from('design_requests')
      .update({ 
        replicate_prediction_id: prediction.id,
        status: 'generating'
      })
      .eq('id', id)

    return Response.json({ success: true, prediction })
  } catch (error) {
    console.error('Generation error:', error)
    let errorMessage = 'Generation failed'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    // Update the request status to failed
    if (requestId) {
      await supabase
        .from('design_requests')
        .update({ status: 'failed' })
        .eq('id', requestId)
    }
    return Response.json({ success: false, error: errorMessage }, { status: 500 })
  }
} 