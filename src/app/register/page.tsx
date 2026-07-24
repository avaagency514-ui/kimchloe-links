'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { supabaseBrowser } from '@/lib/supabase'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = supabaseBrowser()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase.from('profiles').insert([
          { 
            id: data.user.id, 
            username: username || email.split('@')[0]
          }
        ])

        if (profileError) throw profileError

        // Create default personal workspace
        const { data: wsData, error: wsError } = await supabase.from('workspaces').insert([
          { name: 'Personnel', type: 'Espace personnel', icon: 'P' }
        ]).select().single()

        if (!wsError && wsData) {
           await supabase.from('workspace_members').insert([
             { workspace_id: wsData.id, user_id: data.user.id, role: 'Owner' }
           ])
        }
        
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] opacity-40"></div>
      
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="text-2xl font-black tracking-tighter text-white mb-6">
            bio<span className="text-blue-500">link.</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 italic">Créer un compte.</h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Lancez votre page premium aujourd'hui</p>
        </div>

        {error && (
          <div className="mb-6 p-4 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nom d'utilisateur</label>
            <input 
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="votre_pseudo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Adresse Email</label>
            <input 
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Mot de passe</label>
            <input 
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-14 text-sm font-black uppercase tracking-widest mt-4 bg-white text-black hover:bg-zinc-200 border-none transition-all">
            {loading ? 'Configuration...' : 'Démarrer maintenant'}
          </Button>
        </form>

        <p className="text-center text-xs font-bold text-zinc-500 mt-10">
          Déjà inscrit ? <Link href="/login" className="text-blue-500 hover:text-blue-400 transition-colors">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
