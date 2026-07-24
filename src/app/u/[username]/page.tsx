import { supabaseServer } from '@/lib/supabase-server'
import LinkButton from '@/components/link-button'
import ProfileHeader from '@/components/profile-header'
import { cookies, headers } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function PublicProfile({ params }: { params: { username: string } }) {
  const cookieStore = await cookies()
  const supabase = supabaseServer(cookieStore)
  const reqHeaders = await headers()
  
  // Fetch profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()
    
  if (error || !profile) {
    notFound()
  }

  const isBot = reqHeaders.get('x-is-bot') === 'true'

  // Log visite (non-blocking, could be edge function but done here for DB logic)
  if (!isBot) {
    const country = reqHeaders.get('x-geo-country') || null
    const city = reqHeaders.get('x-geo-city') || null
    
    supabase.from('visits').insert({
      profile_id: profile.id, // Using profile.id instead of username string for the UUID reference
      ip: reqHeaders.get('x-forwarded-for') || 'unknown',
      user_agent: reqHeaders.get('user-agent'),
      country: country,
      city: city,
      is_bot: false
    }).then() // Fire and forget
  }

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .order('position')

  // Theme defaults
  const theme = profile.theme || { primary: '#3B82F6', bg: { from: '#e0c3fc', to: '#8ec5fc' } }

  return (
    <div className="min-h-screen" style={{ 
      background: `linear-gradient(135deg, ${theme.bg?.from || '#fdfbfb'}, ${theme.bg?.to || '#ebedee'})`
    }}>
      <form action="" className="hidden">
        <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />
      </form>
      <div className="max-w-md mx-auto py-12 px-4 shadow-2xl min-h-screen bg-white/20 backdrop-blur-3xl">
        <ProfileHeader profile={profile} />
        <div className="space-y-4 mt-8">
          {links?.map((link: any) => (
            <LinkButton key={link.id} link={link} profileId={profile.id} />
          ))}
          {(!links || links.length === 0) && (
            <div className="text-center p-8 text-slate-500 bg-white/50 rounded-3xl">
              Aucun lien pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
