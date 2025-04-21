import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const WEBHOOK_SECRET = process.env.REPLICATE_WEBHOOK_SECRET

function verifySignature(signature: string, timestamp: string, body: string): boolean {
  if (!WEBHOOK_SECRET) {
    // If no webhook secret is set, skip verification (development mode)
    console.log('No webhook secret set, skipping verification')
    return true
  }

  try {
    const signed_content = `${timestamp}.${body}`
    const secretBytes = Buffer.from(WEBHOOK_SECRET.split('_')[1], 'base64')
    const hmac = crypto.createHmac('sha256', secretBytes)
    hmac.update(signed_content)
    const computedSignature = hmac.digest('base64')

    // Extract signatures from the header
    const expectedSignatures = signature.split(' ').map(sig => sig.split(',')[1])
    return expectedSignatures.some(expectedSig => expectedSig === computedSignature)
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const headersList = await headers()
    const body = await req.text() // Get raw body for signature verification
    const signature = headersList.get('webhook-signature') || ''
    const timestamp = headersList.get('webhook-timestamp') || ''

    // Log headers for debugging
    console.log('Webhook received:', {
      signature,
      timestamp,
    })

    // Verify signature if in production
    if (process.env.NODE_ENV === 'production') {
      const isValid = verifySignature(signature, timestamp, body)
      if (!isValid) {
        console.error('Invalid webhook signature')
        return Response.json({ success: false, error: 'Invalid signature' }, { status: 401 })
      }
    }

    const prediction = JSON.parse(body)
    console.log('Full webhook payload:', JSON.stringify(prediction, null, 2))
    console.log('Prediction status:', prediction.status)
    console.log('Prediction output:', prediction.output)
    console.log('Prediction ID:', prediction.id)

    if (prediction.status === 'succeeded') {
      // Get the generated image URL from the prediction output
      const generatedImageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output
      console.log('Generated image URL:', generatedImageUrl)

      const { data, error } = await supabase
        .from('design_requests')
        .update({ 
          status: 'completed',
          generated_image_url: generatedImageUrl
        })
        .eq('replicate_prediction_id', prediction.id)
        .select()

      if (error) {
        console.error('Error updating design request:', error)
        throw error
      }

      console.log('Updated design request:', data)
    } else if (prediction.status === 'failed') {
      const { error } = await supabase
        .from('design_requests')
        .update({ status: 'failed' })
        .eq('replicate_prediction_id', prediction.id)

      if (error) {
        console.error('Error updating failed status:', error)
        throw error
      }

      console.log('Updated design request status to failed')
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return Response.json({ success: false, error: 'Webhook processing failed' }, { status: 500 })
  }
} 