'use client'

import { useState } from 'react'
import { 
  CheckCircle2, CreditCard, HelpCircle, 
  History, Plane, Rocket, ShieldCheck, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const FAQ = [
  { 
    q: "Comment changer mon plan ?", 
    a: "Vous êtes actuellement sur le Plan Gratuit Ultime. Toutes les fonctionnalités sont déjà débloquées pour vous, il n'y a donc pas besoin de mettre à jour ou de rétrograder." 
  },
  { 
    q: "Quand serai-je facturé ?", 
    a: "Jamais ! BioLink Free est 100% gratuit à vie pour les premiers utilisateurs." 
  },
  { 
    q: "Comment annuler mon abonnement ?", 
    a: "Puisque vous n'êtes pas facturé, il n'y a pas d'abonnement à annuler. Votre compte restera actif tant que vous l'utiliserez." 
  },
  { 
    q: "Puis-je obtenir un remboursement ?", 
    a: "Comme tous les services sont fournis gratuitement, les remboursements ne sont pas applicables." 
  }
]

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly')

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div>
        <h1 className="text-5xl font-black text-foreground tracking-tight italic uppercase">Facturation</h1>
        <p className="text-muted-foreground font-medium mt-2 italic uppercase tracking-widest opacity-60">Gérez votre abonnement et vos détails de facturation</p>
      </div>

      {/* Current Plan Overview */}
      <div className="premium-card p-10 bg-card border-2 border-primary/20 shadow-xl">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-foreground uppercase italic tracking-tight">Votre Plan Actuel : <span className="text-primary underline decoration-primary/20 underline-offset-8">Gratuit Ultime</span></h2>
            <div className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-primary/20">Actif</div>
         </div>
         <p className="text-muted-foreground font-medium uppercase tracking-tight opacity-80 decoration-primary/5">Toutes les fonctionnalités premium sont débloquées pour votre espace de travail. Profitez de liens illimités et d'analyses avancées sans frais.</p>
      </div>

      {/* Available Plans */}
      <div className="space-y-10">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <h3 className="text-3xl font-black text-foreground tracking-tight italic uppercase underline decoration-primary/10 decoration-8 underline-offset-[12px]">Plans Disponibles</h3>
            <div className="flex items-center gap-4 bg-muted p-1.5 rounded-2xl border border-border">
               <span className={`px-6 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all uppercase tracking-widest ${billingCycle === 'monthly' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setBillingCycle('monthly')}>Mensuel</span>
               <span className={`px-6 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all uppercase tracking-widest ${billingCycle === 'annually' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setBillingCycle('annually')}>Annuel <span className="text-emerald-500 ml-1">Économisez 20%</span></span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="premium-card p-10 bg-card border border-border flex flex-col justify-between group hover:border-primary/30 transition-all">
               <div>
                  <div className="w-14 h-14 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:rotate-12">
                     <Plane className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-black text-primary tracking-widest uppercase italic">Standard</h4>
                  <div className="flex items-baseline gap-1 mt-4">
                     <span className="text-5xl font-black text-foreground">0€</span>
                     <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest opacity-60">/ mois</span>
                  </div>
                  <p className="text-muted-foreground mt-6 font-medium text-sm italic uppercase tracking-widest opacity-60">Parfait pour commencer.</p>
                  
                  <ul className="mt-10 space-y-4">
                     {['1 Lien Direct', '1 Page de Destination', 'Analyses Basiques', 'Optimisé Mobile'].map(it => (
                       <li key={it} className="flex items-center gap-3 text-sm font-bold text-foreground/80 uppercase tracking-tight">
                          <CheckCircle2 className="w-4 h-4 text-primary" /> {it}
                       </li>
                     ))}
                  </ul>
               </div>
               <Button variant="outline" className="mt-12 h-14 rounded-2xl border-border text-muted-foreground font-black cursor-not-allowed uppercase tracking-widest text-[10px]" disabled>Degradé impossible</Button>
            </div>

            {/* Creator Plan (Unlocked for user) */}
            <div className="premium-card p-10 bg-card border-2 border-primary shadow-2xl flex flex-col justify-between relative overflow-hidden group">
               <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-bl-2xl shadow-xl">Plan Actuel</div>
               <div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110">
                     <Zap className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-black text-primary tracking-widest uppercase italic">L'Ultime</h4>
                  <div className="flex items-baseline gap-1 mt-4">
                     <span className="text-5xl font-black text-foreground">0€</span>
                     <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest opacity-60">/ toujours</span>
                  </div>
                  <p className="text-muted-foreground mt-6 font-medium text-sm italic uppercase tracking-widest opacity-60">Accès complet pour les pionniers.</p>
                  
                  <ul className="mt-10 space-y-4">
                     {['Liens Illimités', 'Pages Illimitées', 'Analyses Temps Réel', 'Protection Anti-Bot', 'Analyses Réseaux Sociaux', 'Domaines Personnalisés'].map(it => (
                       <li key={it} className="flex items-center gap-3 text-sm font-bold text-foreground/90 uppercase tracking-tight">
                          <CheckCircle2 className="w-4 h-4 text-primary" /> {it}
                       </li>
                     ))}
                  </ul>
               </div>
               <Button className="mt-12 h-14 rounded-2xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest">Gérer l'abonnement</Button>
            </div>

            {/* Agency Plan */}
            <div className="premium-card p-10 bg-white border border-slate-100 flex flex-col justify-between opacity-50 grayscale">
               <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-8">
                     <Rocket className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-400 tracking-widest uppercase">Agency</h4>
                  <div className="flex items-baseline gap-1 mt-4 font-sans">
                     <span className="text-5xl font-black text-slate-400">109€</span>
                     <span className="text-slate-300 font-bold">/ mois</span>
                  </div>
                  <p className="text-slate-400 mt-6 font-medium text-sm italic">Pour faire croître votre équipe.</p>
               </div>
               <Button variant="outline" className="mt-12 h-14 rounded-2xl border-slate-200 text-slate-400 font-black cursor-not-allowed" disabled>Contacter le Support</Button>
            </div>
         </div>
      </div>

      {/* History Section */}
      <div className="premium-card overflow-hidden bg-card border border-border mt-12">
         <div className="p-10 border-b border-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center shadow-inner">
               <History className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-foreground tracking-tight italic uppercase">Historique de Facturation</h3>
         </div>
         <div className="p-20 text-center space-y-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground/20 shadow-inner">
               <CreditCard className="w-12 h-12" />
            </div>
            <p className="text-muted-foreground font-black tracking-widest text-lg italic uppercase opacity-60">Aucun paiement trouvé pour le moment.</p>
         </div>
      </div>

      {/* FAQ Section */}
      <div className="premium-card p-10 bg-card space-y-12 border border-border mt-12">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-[1.25rem] bg-primary/10 text-primary flex items-center justify-center shadow-inner transition-transform hover:rotate-6">
               <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-foreground tracking-tight italic uppercase underline decoration-primary/10 decoration-4 underline-offset-8">Questions Fréquentes</h3>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {FAQ.map((item, i) => (
              <div key={i} className="space-y-4 font-sans group">
                 <h4 className="font-black text-foreground text-lg leading-snug group-hover:text-primary transition-colors cursor-default transition-all uppercase italic flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full transition-transform group-hover:scale-150" />
                    {item.q}
                 </h4>
                 <p className="text-muted-foreground font-medium leading-relaxed opacity-80 pl-4 border-l-2 border-border group-hover:border-primary/30 transition-all">{item.a}</p>
              </div>
            ))}
         </div>
      </div>

    </div>
  )
}
