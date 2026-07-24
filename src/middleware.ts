import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const KNOWN_BOTS = [
  'Googlebot', 'bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider',
  'YandexBot', 'facebookexternalhit', 'Twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'bytespider', 'MJ12bot', 'AhrefsBot'
]

export async function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || ''
  const isBot = (
    KNOWN_BOTS.some(bot => ua.includes(bot)) ||
    ua.toLowerCase().includes('bot') ||
    ua.toLowerCase().includes('crawler') ||
    request.headers.get('sec-ch-ua-mobile') === '?1'
  )

  if (request.nextUrl.searchParams.has('honeypot') && request.nextUrl.searchParams.get('honeypot') !== '') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-is-bot', isBot ? 'true' : 'false')

  if (request.nextUrl.pathname.startsWith('/u/') && !isBot) {
    const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown'
    try {
      const geoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/geo-lookup`
      const geoRes = await fetch(geoUrl, {
        method: 'POST',
        headers: {
          'x-forwarded-for': ip
        }
      })
      if (geoRes.ok) {
        const geo = await geoRes.json()
        if(geo.country) requestHeaders.set('x-geo-country', geo.country)
        if(geo.city) requestHeaders.set('x-geo-city', geo.city)
      }
    } catch(e) {
      console.log('Geo lookup failed:', e)
    }
  }

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Prevent logged-in users from accessing login/register pages
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && user) {
     return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
