import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Next.js middleware passes the real IP via x-forwarded-for
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  
  if (ip === 'unknown') {
    return new Response(JSON.stringify({ error: 'IP unknown' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // FREE IP Geolocation API (ipapi.co - 30k req/jour FREE)
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`)
    const geo = await geoRes.json()

    if (geo.error) {
       return new Response(JSON.stringify({ error: geo.reason }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      country: geo.country_name,
      city: geo.city,
      region: geo.region,
      lat: geo.latitude,
      lon: geo.longitude,
      isp: geo.org
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch geo' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
