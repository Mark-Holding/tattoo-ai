import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define the incoming request body structure (matches client-side)
interface DesignRequestClientPayload {
  style: string;
  bodyPlacement: string;
  detailLevel: string;
  modifier: string;
  negativePrompt: string;
  description: string;
  referenceImage: string | null; // Base64 data URL or null
  freestyleDrawing: string | null; // Base64 data URL or null
  // timestamp is generated server-side or ignored if client sends
}

// Helper function to convert base64 Data URL to Blob (Node.js runtime)
function base64ToBlobNode(base64: string): Blob | null {
    try {
        const parts = base64.split(';base64,');
        if (parts.length !== 2) {
            console.error('Invalid base64 string format');
            return null;
        }
        const contentType = parts[0].split(':')[1];
        // Use Buffer for Node.js runtime
        const buffer = Buffer.from(parts[1], 'base64');
        return new Blob([buffer], { type: contentType });
    } catch (error) {
        console.error("Error converting base64 to Blob (Node):", error);
        return null;
    }
}


// Initialize Supabase client ONCE
// Use the SERVICE ROLE KEY for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Ensure environment variables are set
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL or Service Role Key is missing in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body: DesignRequestClientPayload = await request.json();

    let referenceImageUrl: string | null = null;
    let freestyleDrawingUrl: string | null = null;
    const timestamp = Date.now(); // Use server timestamp

    // --- Handle Reference Image Upload ---
    if (body.referenceImage) {
      const blob = base64ToBlobNode(body.referenceImage);

      if (blob) {
        const filePath = `public/reference-${timestamp}.png`; // Define a unique path
        const { error: uploadError } = await supabase
          .storage
          .from('user-images') // Updated bucket name
          .upload(filePath, blob, {
            cacheControl: '3600',
            upsert: false,
            contentType: blob.type
          });

        if (uploadError) {
          console.error('Supabase reference image upload error:', uploadError);
          throw new Error(`Failed to upload reference image: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase
          .storage
          .from('user-images') // Updated bucket name
          .getPublicUrl(filePath);

        referenceImageUrl = urlData?.publicUrl ?? null;
         console.log("Reference Image URL:", referenceImageUrl);
      } else {
          console.error("Failed to convert reference image base64 to Blob.");
      }
    }

    // --- Handle Freestyle Drawing Upload ---
    if (body.freestyleDrawing) {
      const blob = base64ToBlobNode(body.freestyleDrawing);

      if (blob) {
        const filePath = `public/freestyle-${timestamp}.png`; // Define a unique path
        const { error: uploadError } = await supabase
          .storage
          .from('user-images') // Updated bucket name
          .upload(filePath, blob, {
             cacheControl: '3600',
             upsert: false,
             contentType: blob.type
          });

        if (uploadError) {
          console.error('Supabase freestyle drawing upload error:', uploadError);
          throw new Error(`Failed to upload freestyle drawing: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase
          .storage
          .from('user-images') // Updated bucket name
          .getPublicUrl(filePath);

        freestyleDrawingUrl = urlData?.publicUrl ?? null;
        console.log("Freestyle Drawing URL:", freestyleDrawingUrl);
      } else {
          console.error("Failed to convert freestyle drawing base64 to Blob.");
      }
    }

    // --- Insert data into Supabase table ---
    const { data: insertData, error: insertError } = await supabase
      .from('design_requests') // YOUR TABLE NAME HERE
      .insert([
        {
          // user_id: userId, // Add if you have user authentication
          style: body.style,
          body_placement: body.bodyPlacement,
          detail_level: body.detailLevel,
          modifier: body.modifier,
          negative_prompt: body.negativePrompt,
          description: body.description,
          reference_image_url: referenceImageUrl,
          freestyle_drawing_url: freestyleDrawingUrl,
          status: 'pending', // Initial status
          // created_at is handled by Supabase default value
        },
      ])
      .select() // Return the inserted data
      .single(); // Expecting a single row back

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      throw new Error(`Failed to save design request: ${insertError.message}`);
    }

    console.log('Successfully inserted design request:', insertData);

    // You could potentially trigger the Replicate job here,
    // or have another process watch the database table.

    return NextResponse.json({
        success: true,
        message: 'Design request received and stored.',
        data: insertData // Return the newly created record
    }, { status: 201 }); // 201 Created status

  } catch (error: unknown) {
    console.error('API Error:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message; // Safely access message if it's an Error instance
    }
    return NextResponse.json({
        success: false,
        message: errorMessage
    }, { status: 500 });
  }
} 