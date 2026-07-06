// RorkParity - Consume Credit Edge Function
// Uses Supabase Edge Runtime built-in client
// The function param carries context for the authenticated user

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

serve(async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers })
  }
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers }
    )
  }

  try {
    const authHdr = req.headers.get('Authorization') || ''
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHdr } },
        auth: { persistSession: false },
      }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authentication' }),
        { status: 401, headers }
      )
    }

    const body = await req.json().catch(() => ({}))
    const amount = body.amount ?? 1
    const description = body.description ?? 'Game generation'
    if (amount < 1 || amount > 100) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid amount (1-100)' }),
        { status: 400, headers }
      )
    }

    const { data, error } = await supabaseClient.rpc('consume_credits', {
      p_amount: amount,
    })
    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400, headers }
      )
    }

    await supabaseClient.from('credit_ledger').insert({
      user_id: user.id,
      amount: -amount,
      balance_after: data,
      reason: description,
      source: 'edge_function',
    }).catch(e => console.warn('Ledger log failed:', e))

    return new Response(
      JSON.stringify({
        success: true,
        credits_remaining: data,
        credits_consumed: amount,
      }),
      { status: 200, headers }
    )

  } catch (err) {
    console.error('Fatal:', err)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }}
    )
  }
})
