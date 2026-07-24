'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { supabaseBrowser } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = supabaseBrowser()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError
      
      router.push('/dashboard')
      
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans transition-colors duration-500">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] opacity-40"></div>
      
      <div className="w-full max-w-md bg-card rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-border p-12 relative z-10 transition-all">
        <div className="text-center mb-12">
          <div className="text-3xl font-black tracking-tighter text-foreground mb-8 italic uppercase underline decoration-primary/20 decoration-4 underline-offset-8">
            bio<span className="text-primary">link.</span>
          </div>
          <h1 className="text-4xl font-black text-foreground mb-3 italic tracking-tighter uppercase underline decoration-primary/10 decoration-8 underline-offset-[12px]">Ravi de vous revoir.</h1>
          <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] opacity-40">Accédez à votre espace pro premium</p>
        </div>

        {error && (
          <div className="mb-8 p-6 text-[10px] font-black uppercase tracking-widest text-destructive bg-destructive/10 rounded-2xl border border-destructive/20 text-center italic">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2 opacity-50 italic">Adresse Email</label>
            <input 
              type="email"
              required
              className="w-full px-6 py-4 rounded-2xl bg-muted border-none text-foreground font-black focus:outline-none focus:shadow-[0_0_0_2px_rgba(var(--primary),0.2)] transition-all placeholder:text-muted-foreground/20 text-lg"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2 opacity-50 italic">Mot de passe</label>
            <input 
              type="password"
              required
              className="w-full px-6 py-4 rounded-2xl bg-muted border-none text-foreground font-black focus:outline-none focus:shadow-[0_0_0_2px_rgba(var(--primary),0.2)] transition-all placeholder:text-muted-foreground/20 text-lg"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} className="btn-premium w-full h-16 text-sm font-black uppercase tracking-[0.2em] mt-6 rounded-2xl shadow-2xl shadow-primary/20 transition-all active:scale-95">
            {loading ? 'Authentification...' : 'Se connecter'}
          </Button>
        </form>

        <p className="text-center text-[10px] font-black text-muted-foreground mt-12 uppercase tracking-widest opacity-60">
          Pas encore membre ? <Link href="/register" className="text-primary hover:underline underline-offset-4 transition-colors">Créer un compte pro</Link>
        </p>
      </div>
    </div>
  )
}
