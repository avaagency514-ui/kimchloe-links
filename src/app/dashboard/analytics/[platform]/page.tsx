'use client'

import { useParams } from 'next/navigation'
import { 
  TrendingUp, TrendingDown, Users, Eye, 
  MousePointer2, Share2, Play, Heart, 
  MessageCircle, Bookmark, Calendar, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { format, subDays, eachDayOfInterval } from 'date-fns'

const MOCK_DATA = {
  tiktok: {
    color: '#000000',
    icon: Play,
    followers: '124.5K',
    growth: '+12%',
    views: '2.4M',
    engagement: '8.2%',
    chartData: [
      { name: 'Mon', followers: 120 },
      { name: 'Tue', followers: 121 },
      { name: 'Wed', followers: 121.5 },
      { name: 'Thu', followers: 122 },
      { name: 'Fri', followers: 123 },
      { name: 'Sat', followers: 124 },
      { name: 'Sun', followers: 124.5 },
    ]
  },
  instagram: {
    color: '#E1306C',
    icon: Heart,
    followers: '82.1K',
    growth: '+5.4%',
    views: '890K',
    engagement: '4.1%',
    chartData: [
      { name: 'Mon', followers: 80 },
      { name: 'Tue', followers: 80.5 },
      { name: 'Wed', followers: 81 },
      { name: 'Thu', followers: 81.2 },
      { name: 'Fri', followers: 81.5 },
      { name: 'Sat', followers: 81.8 },
      { name: 'Sun', followers: 82.1 },
    ]
  }
}

export default function SocialAnalyticsPage() {
  const params = useParams()
  const platform = (params.platform as string) || 'tiktok'
  const data = (MOCK_DATA as any)[platform] || MOCK_DATA.tiktok
  const Icon = data.icon

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="px-3 py-1 bg-violet-100 text-violet-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                Plan Actuel : Gratuit
             </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight capitalize">Analyses {platform}</h1>
          <p className="text-slate-500 font-medium mt-2">Insights détaillés sur l'audience et suivi des performances.</p>
        </div>
        <div className="flex items-center gap-3 p-1.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
           <Button variant="ghost" className="rounded-xl h-10 px-6 text-xs font-black text-slate-900">7 Jours</Button>
           <Button variant="ghost" className="rounded-xl h-10 px-6 text-xs font-black text-slate-400">30 Jours</Button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <div className="premium-card p-8 bg-white group">
            <div className="flex justify-between items-start mb-6">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Abonnés</span>
               <Icon className="w-5 h-5" style={{ color: data.color }} />
            </div>
            <p className="text-4xl font-black text-slate-900">{data.followers}</p>
            <div className="mt-4 flex items-center gap-2">
               <span className="flex items-center text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3 mr-1" /> {data.growth}
               </span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">vs semaine dernière</span>
            </div>
         </div>

         <div className="premium-card p-8 bg-white group">
            <div className="flex justify-between items-start mb-6">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vues</span>
               <Eye className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-4xl font-black text-slate-900">{data.views}</p>
            <div className="mt-4 flex items-center gap-2">
               <span className="flex items-center text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3 mr-1" /> +2.1%
               </span>
            </div>
         </div>

         <div className="premium-card p-8 bg-white">
            <div className="flex justify-between items-start mb-6">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engagement</span>
               <MessageCircle className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-4xl font-black text-slate-900">{data.engagement}</p>
            <div className="mt-4 flex items-center gap-2">
               <span className="flex items-center text-xs font-black text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                  <TrendingDown className="w-3 h-3 mr-1" /> -0.4%
               </span>
            </div>
         </div>

         <div className="premium-card p-8 bg-white">
            <div className="flex justify-between items-start mb-6">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meilleur Moment</span>
               <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-4xl font-black text-slate-900 italic">21:00</p>
            <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Heure la plus active</p>
         </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8">
            <div className="premium-card p-10 bg-white">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Croissance de l'Audience</h3>
               </div>
               <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={data.chartData}>
                        <defs>
                           <linearGradient id="colorPlat" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={data.color} stopOpacity={0.15}/>
                              <stop offset="95%" stopColor={data.color} stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={15} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} width={30} />
                        <Tooltip cursor={{ stroke: data.color, strokeWidth: 2 }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '16px' }} />
                        <Area type="monotone" name="Abonnés" dataKey="followers" stroke={data.color} strokeWidth={5} fillOpacity={1} fill="url(#colorPlat)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4">
            <div className="premium-card p-10 bg-white h-full flex flex-col">
               <h3 className="text-xl font-black text-slate-900 mb-10">Performance Vidéo</h3>
               <div className="flex-1 space-y-6">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200 transition-all group cursor-pointer">
                       <div className="w-16 h-20 rounded-xl bg-slate-200 flex-shrink-0 relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                             <Play className="w-6 h-6 fill-white" />
                          </div>
                       </div>
                       <div className="flex flex-col justify-center">
                          <p className="text-xs font-black text-slate-800 line-clamp-2">Comment créer un SaaS en 24 heures...</p>
                          <div className="flex items-center gap-3 mt-2">
                             <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                                <Play className="w-3 h-3" /> 12K
                             </span>
                             <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                                <Heart className="w-3 h-3" /> 1.2K
                             </span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               <Button variant="ghost" className="mt-10 w-full h-14 rounded-2xl text-xs font-black text-slate-400 hover:text-slate-900 border border-slate-100">
                  Voir Posts Détaillés <ChevronRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
         </div>
      </div>
    </div>
  )
}
