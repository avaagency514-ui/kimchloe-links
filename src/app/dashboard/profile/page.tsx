'use client'

import { useState } from 'react'
import { 
  User, Mail, Lock, Camera, 
  Trash2, Save, BadgeCheck, ShieldAlert,
  ChevronRight, RefreshCcw, Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    username: 'avaagency',
    email: 'avaagency514@gmail.com',
    avatar: null
  })

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-foreground tracking-tight italic uppercase">Mon Profil</h1>
          <p className="text-muted-foreground font-medium mt-2 italic uppercase tracking-widest opacity-60">Gérez votre identité et votre sécurité</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/5">
           <BadgeCheck className="w-4 h-4 animate-pulse" /> Compte Vérifié
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* Photo Section */}
           <div className="premium-card p-10 bg-card border-border border-2">
              <div className="flex items-center gap-10">
                 <div className="relative group cursor-pointer">
                    <Avatar className="w-32 h-32 border-4 border-card shadow-2xl ring-4 ring-muted transition-transform group-hover:scale-105">
                       <AvatarImage src="" />
                       <AvatarFallback className="bg-muted text-muted-foreground text-4xl">
                          <User className="w-16 h-16" />
                       </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-primary/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                       <Camera className="w-8 h-8 text-white" />
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <h3 className="text-3xl font-black text-foreground italic uppercase tracking-tighter">@{profile.username}</h3>
                       <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded border border-emerald-500/20">Vérifié</span>
                    </div>
                    <div className="flex gap-3">
                       <Button className="btn-premium h-11 px-8 shadow-none uppercase tracking-widest text-[10px] font-black">Télécharger une Photo</Button>
                       <Button variant="ghost" className="h-11 px-6 text-muted-foreground font-black hover:text-destructive hover:bg-destructive/10 uppercase tracking-widest text-[10px] transition-all">Supprimer</Button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Personal Info */}
           <div className="premium-card p-10 bg-card border-border border-2 space-y-10">
              <div>
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-8 italic opacity-60">Informations Personnelles</h3>
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <Label className="font-black text-foreground uppercase italic tracking-widest text-xs mb-2 block">Prénom</Label>
                      <div className="relative">
                         <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50" />
                         <Input className="h-16 px-14 rounded-2xl bg-muted border-none focus:bg-muted font-bold transition-all text-lg" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <Label className="font-black text-foreground uppercase italic tracking-widest text-xs mb-2 block">Nom</Label>
                      <div className="relative">
                         <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50" />
                         <Input className="h-16 px-14 rounded-2xl bg-muted border-none focus:bg-muted font-bold transition-all text-lg" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} />
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                 <Label className="font-black text-foreground uppercase italic tracking-widest text-xs mb-2 block">Nom d'utilisateur</Label>
                 <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-primary transition-all group-hover:scale-125">@</span>
                    <Input className="h-16 px-12 rounded-2xl bg-muted/50 border border-border/50 font-black text-muted-foreground/50 transition-all cursor-not-allowed text-lg" value={profile.username} disabled />
                 </div>
                 <p className="text-[10px] text-muted-foreground font-bold italic tracking-widest uppercase opacity-40">Le nom d'utilisateur ne peut être modifié après la création.</p>
              </div>

              <div className="pt-10 border-t border-border flex justify-end">
                 <Button className="btn-premium h-16 px-12 font-black shadow-2xl shadow-primary/20 uppercase tracking-widest text-sm">
                    <Save className="w-5 h-5 mr-3" /> Enregistrer les changements
                 </Button>
              </div>
           </div>

           {/* Email Section */}
           <div className="premium-card p-10 bg-card border-border border">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-8 italic opacity-60">Adresse E-mail</h3>
              <div className="flex gap-6 items-end font-sans">
                 <div className="flex-1 space-y-4">
                    <Label className="font-black text-foreground uppercase italic tracking-widest text-xs mb-2 block">E-mail Principal</Label>
                    <div className="relative">
                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50" />
                       <Input className="h-16 px-14 rounded-2xl bg-muted/50 border border-border/50 font-bold text-muted-foreground/50 transition-all text-lg" value={profile.email} disabled />
                    </div>
                 </div>
                 <Button variant="outline" className="h-16 px-10 rounded-2xl border-border text-foreground font-black hover:bg-muted transition-all uppercase tracking-widest text-[10px]">
                    Changer l'E-mail
                 </Button>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold mt-4 italic tracking-widest uppercase opacity-40">Le changement d'e-mail nécessite une vérification par code.</p>
           </div>

           {/* Security Section */}
           <div className="premium-card p-10 bg-card border-border border">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-8 italic opacity-60">Sécurité</h3>
              <div className="flex gap-6 items-end">
                 <div className="flex-1 space-y-4">
                    <Label className="font-black text-foreground uppercase italic tracking-widest text-xs mb-2 block">Mot de passe</Label>
                    <div className="relative">
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50" />
                       <Input type="password" value="••••••••••••" className="h-16 px-14 rounded-2xl bg-muted/50 border border-border/50 font-bold text-muted-foreground/50 transition-all text-lg" disabled />
                    </div>
                 </div>
                 <Button variant="outline" className="h-16 px-10 rounded-2xl border-border text-foreground font-black hover:bg-muted transition-all uppercase tracking-widest text-[10px]">
                    Mettre à Jour
                 </Button>
              </div>
           </div>

        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
           <div className="premium-card p-10 bg-primary text-primary-foreground relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-10 font-sans">
                    <div className="w-16 h-16 bg-white/20 border border-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform group-hover:rotate-12 group-hover:scale-110">
                       <Globe className="w-8 h-8" />
                    </div>
                    <span className="px-4 py-1.5 bg-white text-primary rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl">Gratuit</span>
                 </div>
                 <h4 className="text-primary-foreground/60 font-bold uppercase tracking-widest text-[10px] italic">Votre Plan Actuel</h4>
                 <p className="text-4xl font-black mt-2 italic uppercase tracking-tighter">Personnel</p>
                 <p className="text-primary-foreground/80 text-sm font-medium mt-4 uppercase tracking-widest opacity-60">Abonnement Gratuit à Vie</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-all group-hover:scale-150"></div>
           </div>

           <div className="premium-card p-8 bg-card space-y-8 border-border border">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic opacity-60">Aperçu du Compte</h4>
              <div className="space-y-6">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black italic">
                       <span className="text-muted-foreground uppercase opacity-60">Liens Directs</span>
                       <span className="text-primary tracking-widest uppercase">0 / ∞</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-primary w-[0%] shadow-lg shadow-primary/30"></div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black italic">
                       <span className="text-muted-foreground uppercase opacity-60">Pages de Destination</span>
                       <span className="text-primary tracking-widest uppercase">0 / ∞</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-primary w-[0%] shadow-lg shadow-primary/30"></div>
                    </div>
                 </div>
              </div>
              <p className="text-[9px] font-black text-muted-foreground/40 text-center uppercase tracking-[0.2em] italic mt-8">Toutes les limites sont levées pour vous</p>
           </div>
        </div>

      </div>
    </div>
  )
}
