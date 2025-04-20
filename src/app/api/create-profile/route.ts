import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { userId, email, name } = await request.json()

    // If admin client is not available, try with regular client
    const client = supabaseAdmin || supabase

    const { error } = await client
      .from('profiles')
      .insert([
        {
          id: userId,
          email: email,
          name: name
        }
      ])
      .single()

    if (error) {
      console.error('Profile creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 