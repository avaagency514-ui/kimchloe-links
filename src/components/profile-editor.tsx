'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { supabaseBrowser } from '@/lib/supabase'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ProfileEditor({ profile, onUpdate }: { profile: any, onUpdate: (p: any) => void }) {
  const supabase = supabaseBrowser()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    avatar_url: ''
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || ''
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        avatar_url: formData.avatar_url
      })
      .eq('id', user.id)

    if (error) {
      toast.error('Erreur lors de la mise à jour')
    } else {
      toast.success('Profil mis à jour avec succès !')
      onUpdate({ ...profile, ...formData })
    }
    setLoading(false)
  }

  if (!profile) return <div className="p-8 text-center bg-white rounded-3xl animate-pulse">Chargement...</div>

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Ton Profil</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-32 w-32 border-4 border-slate-50 shadow-md">
            <AvatarImage src={formData.avatar_url} />
            <AvatarFallback className="text-4xl text-slate-300">{formData.full_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <Label htmlFor="avatar_url" className="text-xs text-slate-500">URL de l'avatar</Label>
            <Input id="avatar_url" name="avatar_url" value={formData.avatar_url} onChange={handleChange} className="mt-1" placeholder="https://..." />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleChange} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="full_name">Nom complet</Label>
              <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} className="mt-2" />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" name="bio" value={formData.bio} onChange={handleChange} className="mt-2" />
          </div>
          <Button onClick={handleSave} disabled={loading} className="w-full h-12 text-lg mt-4 shadow-lg hover:shadow-xl transition-all">
            {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </Button>
        </div>
      </div>
    </div>
  )
}
