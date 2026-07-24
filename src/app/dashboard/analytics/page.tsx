'use client'

import Link from 'next/link'
import { Play, Heart, MessageCircle, Share2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ANALYTICS_PLATFORMS = [
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: Play, 
    color: '#000000', 
    desc: 'Suivez la croissance de vos abonnés et la performance de vos vidéos.', 
    path: '/dashboard/analytics/tiktok' 
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: Heart, 
    color: '#E1306C', 
    desc: 'Analysez la performance de vos réels et l\'engagement de votre audience.', 
    path: '/dashboard/analytics/instagram' 
  },
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: Share2, 
    color: '#1DA1F2', 
    desc: 'Bientôt disponible • Entièrement débloqué pour vous.', 
    disabled: true 
  },
  { 
    id: 'threads', 
    name: 'Threads', 
    icon: MessageCircle, 
    color: '#000000', 
    desc: 'Bientôt disponible • Entièrement débloqué pour vous.', 
    disabled: true 
  }
]

export default function AnalyticsMenu() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-5xl font-black text-white tracking-tight italic">Analyses Sociales</h1>
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">Choisissez une plateforme pour voir vos statistiques</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ANALYTICS_PLATFORMS.map((p) => {
          const Icon = p.icon
          return (
            <Link 
              key={p.id} 
              href={p.disabled ? '#' : p.path || '#'}
              className={`premium-card p-10 group transition-all h-[300px] flex flex-col justify-between border-zinc-800 bg-zinc-900/50 ${p.disabled ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:scale-[1.02] cursor-pointer hover:border-zinc-700'}`}
            >
              <div className="flex justify-between items-start">
                 <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-xl flex items-center justify-center transition-transform group-hover:scale-110">
                    <Icon className="w-8 h-8" style={{ color: p.color === '#000000' ? '#ffffff' : p.color }} />
                 </div>
                 {!p.disabled && (
                   <div className="px-4 py-1.5 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Premium Accès
                   </div>
                 )}
              </div>
              
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight italic">{p.name}</h2>
                <p className="text-zinc-500 text-sm font-medium mt-2">{p.desc}</p>
                {!p.disabled && (
                   <div className="mt-8 flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                      Analyser les données <ArrowRight className="w-4 h-4" />
                   </div>
                 )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
