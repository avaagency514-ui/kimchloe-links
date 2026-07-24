export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 1. DÉTECTION NATIVE DES BOTS CLOUDFLARE
    // On utilise les headers natifs fournis par Cloudflare
    const isBot = request.cf?.botManagement?.score < 30 || 
                  request.headers.get('cf-visitor')?.includes('bot');

    const country = request.cf?.country || 'Unknown';
    const city = request.cf?.city || 'Unknown';
    const ip = request.headers.get('cf-connecting-ip');
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // ==========================================
    // CAS 1 : INTERCEPTION DES CLICS (/r/...)
    // ==========================================
    if (path.startsWith('/r/') && request.method === 'GET') {
      const linkId = path.split('/')[2];
      
      // On bloque les bots pour ne pas fausser les stats de clics
      if (isBot) return new Response('Bot access denied', { status: 403 });

      // 1. Incrémenter le clic avec ta fonction RPC existante (increment_clicks)
      const rpcUrl = `${env.SUPABASE_URL}/rest/v1/rpc/increment_clicks`;
      ctx.waitUntil(
        fetch(rpcUrl, {
          method: 'POST',
          headers: {
            'apikey': env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ link_id: linkId })
        })
      );

      // 2. Récupérer l'URL de destination pour rediriger (via l'API REST Supabase)
      const linkQuery = await fetch(`${env.SUPABASE_URL}/rest/v1/links?id=eq.${linkId}&select=url`, {
        headers: { 'apikey': env.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}` }
      });
      const linkData = await linkQuery.json();
      
      if (linkData && linkData.length > 0) {
        return Response.redirect(linkData[0].url, 302);
      } else {
        return new Response('Lien introuvable', { status: 404 });
      }
    }

    // ==========================================
    // CAS 2 : VISITE D'UN PROFIL PUBLIC (/u/...)
    // ==========================================
    if (path.startsWith('/u/') && request.method === 'GET') {
      const username = path.split('/')[2];

      // On enregistre la visite en arrière-plan sans bloquer l'utilisateur
      if (!isBot && username) {
        ctx.waitUntil(
          (async () => {
             // D'abord, trouver le profile_id à partir du username
             const profileRes = await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?username=eq.${username}&select=id`, {
               headers: { 'apikey': env.SUPABASE_ANON_KEY }
             });
             const profileData = await profileRes.json();
             
             if (profileData && profileData.length > 0) {
                // Insérer dans la table `visits`
                await fetch(`${env.SUPABASE_URL}/rest/v1/visits`, {
                  method: 'POST',
                  headers: {
                    'apikey': env.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                  },
                  body: JSON.stringify({
                    profile_id: profileData[0].id,
                    ip: ip,
                    user_agent: userAgent,
                    country: country,
                    city: city,
                    is_bot: false
                  })
                });
             }
          })()
        );
      }

      // Quoi qu'il arrive, on sert la page depuis Netlify (ton site principal)
      // Cloudflare va chercher la page sur Netlify et la renvoie au visiteur.
      const netlifyUrl = `https://ton-site-netlify.netlify.app${path}`;
      return fetch(netlifyUrl, request);
    }

    // ==========================================
    // CAS 3 : LE RESTE DU TRAFIC (Dashboard, Login, etc.)
    // ==========================================
    // Tout le reste est transmis tel quel à Netlify
    // N'oublie pas de remplacer l'URL par la vraie URL de ton Netlify
    const defaultNetlifyUrl = `https://ton-site-netlify.netlify.app${path}`;
    return fetch(defaultNetlifyUrl, request);
  }
};
