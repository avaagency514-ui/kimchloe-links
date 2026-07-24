'use client'

import { useState } from 'react'
import { 
  Globe, Plus, ShieldCheck, 
  Trash2, ExternalLink, Info,
  BadgeCheck, ArrowRight, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DomainsPage() {
  const [domains, setDomains] = useState([
    { name: 'avaagency.me', status: 'Active', created: '2 days ago' }
  ])
  const [newDomain, setNewDomain] = useState('')

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-foreground tracking-tight italic uppercase">Domaines Personnalisés</h1>
          <p className="text-muted-foreground font-medium mt-2 italic uppercase tracking-widest opacity-60">Connectez votre propre domaine pour une expérience entièrement personnalisée</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/5">
           <Zap className="w-4 h-4 animate-pulse" /> Premium Débloqué
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* Add Domain Section */}
           <div className="premium-card p-10 bg-card border-border border-2">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-8 italic">Ajouter un Nouveau Domaine</h3>
              <div className="flex gap-4">
                 <div className="flex-1 relative">
                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50" />
                    <Input 
                      className="h-16 px-14 rounded-2xl bg-muted border-none focus:bg-muted font-bold transition-all text-lg font-sans placeholder:font-medium placeholder:text-muted-foreground/30" 
                      placeholder="monlabel.com"
                      value={newDomain}
                      onChange={e => setNewDomain(e.target.value)}
                    />
                 </div>
                 <Button className="btn-premium h-16 px-10 font-black shadow-none whitespace-nowrap uppercase tracking-widest text-sm">
                    Connecter <Plus className="w-5 h-5 ml-2" />
                 </Button>
              </div>
              <div className="mt-8 flex items-start gap-4 p-8 bg-muted/40 rounded-[2rem] border border-border font-sans group">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                    <p className="text-sm font-black text-foreground uppercase italic tracking-tight">Configuration DNS Requise</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">Après avoir ajouté votre domaine, vous devrez faire pointer votre enregistrement A vers <span className="text-primary font-black underline decoration-primary/30 underline-offset-4">76.76.21.21</span> dans les paramètres de votre bureau d'enregistrement.</p>
                 </div>
              </div>
           </div>

           {/* Connected Domains List */}
           <div className="premium-card overflow-hidden bg-card border-border border">
              <div className="p-10 border-b border-border bg-muted/20">
                 <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] italic">Domaines Connectés</h3>
              </div>
              
              <div className="divide-y divide-border">
                 {domains.map((d, i) => (
                    <div key={i} className="p-10 hover:bg-muted/30 transition-all flex items-center justify-between group">
                       <div className="flex items-center gap-8">
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6">
                             <Globe className="w-8 h-8" />
                          </div>
                          <div>
                             <div className="flex items-center gap-3">
                                <p className="text-2xl font-black text-foreground italic uppercase tracking-tighter">{d.name}</p>
                                <BadgeCheck className="w-6 h-6 text-primary fill-primary/10" />
                             </div>
                             <p className="text-[10px] font-black text-muted-foreground mt-1 uppercase tracking-widest opacity-60">Ajouté il y a {d.created === '2 days ago' ? '2 jours' : d.created}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-lg mr-4 border border-emerald-500/20">
                             Actif
                          </div>
                          <Button variant="ghost" className="w-12 h-12 rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                             <ExternalLink className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" className="w-12 h-12 rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                             <Trash2 className="w-5 h-5" />
                          </Button>
                       </div>
                    </div>
                 ))}
                 {domains.length === 0 && (
                    <div className="p-24 text-center items-center justify-center flex flex-col gap-6">
                       <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground/20 italic">
                          <Globe className="w-10 h-10" />
                       </div>
                       <p className="text-muted-foreground font-black tracking-widest text-lg italic uppercase opacity-40">
                          Aucun domaine personnalisé pour le moment.
                       </p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Sidebar Help */}
        <div className="lg:col-span-4 space-y-8">
           <div className="premium-card p-10 bg-card border-2 border-primary/20 relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                 <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-xl transition-transform group-hover:-rotate-12">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                 </div>
                 <div>
                    <h4 className="text-primary font-black uppercase tracking-widest text-[10px] italic mb-4">Pourquoi utiliser des domaines ?</h4>
                    <div className="space-y-6">
                       <div className="flex gap-4">
                          <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                          <p className="text-xs font-medium text-muted-foreground leading-relaxed italic uppercase tracking-tight">Renforcez la confiance avec une identité de marque professionnelle.</p>
                       </div>
                       <div className="flex gap-4">
                          <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                          <p className="text-xs font-medium text-muted-foreground leading-relaxed italic uppercase tracking-tight">Améliorez le SEO de vos pages de destination.</p>
                       </div>
                       <div className="flex gap-4">
                          <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                          <p className="text-xs font-medium text-muted-foreground leading-relaxed italic uppercase tracking-tight">Créez des liens mémorables et faciles à partager.</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl transition-all group-hover:scale-150"></div>
           </div>

           <div className="premium-card p-8 bg-muted/20 border border-border space-y-8">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic opacity-60">Aide & Instructions</h4>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed font-sans italic opacity-80">
                 Connecter un domaine personnalisé est simple. Ajoutez votre nom de domaine dans le formulaire et cliquez sur "Connecter". Vous devrez ensuite mettre à jour vos enregistrements DNS auprès de votre bureau d'enregistrement (comme GoDaddy ou Namecheap).
              </p>
              <Button variant="ghost" className="w-full h-14 rounded-2xl text-primary font-black text-xs uppercase tracking-widest border border-primary/20 hover:bg-primary/5 transition-all">
                 Lire le Guide Complet
              </Button>
           </div>
        </div>

      </div>
    </div>
  )
}
