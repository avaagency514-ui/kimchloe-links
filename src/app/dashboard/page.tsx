'use client'

import { useEffect, useState } from 'react'
import { 
  BarChart, Globe, MousePointer2, 
  TrendingUp, Trophy, Zap, Activity
} from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Bar as ReBar
} from 'recharts'
import { format, subDays, eachDayOfInterval } from 'date-fns'

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#2563eb'];

export default function PremiumDashboard() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalClicks: 0,
    countries: [] as [string, number][],
    chartData: [] as any[],
    topLinks: [] as any[],
    topLocation: { country: 'Loading...', count: 0, flag: '🇺🇸' },
    trafficSources: [
      { name: 'Social', value: 45, color: '#3b82f6' },
      { name: 'Direct', value: 30, color: '#60a5fa' },
      { name: 'Search', value: 25, color: '#93c5fd' }
    ]
  })
  const [loading, setLoading] = useState(true)
  const [recentVisitors, setRecentVisitors] = useState<any[]>([])
  const supabase = supabaseBrowser()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [visitsRes, linksRes] = await Promise.all([
      supabase
        .from('visits')
        .select('*')
        .eq('profile_id', user.id)
        .eq('is_bot', false)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('clicks', { ascending: false })
    ])

    const { data: allVisits } = await supabase
      .from('visits')
      .select('created_at, country')
      .eq('profile_id', user.id)
      .eq('is_bot', false)

    const visits = allVisits || []
    const links = linksRes.data || []
    setRecentVisitors(visitsRes.data || [])

    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date()
    })

    const chartData = last7Days.map(day => ({
      name: format(day, 'MMM dd'),
      visits: visits.filter(v => format(new Date(v.created_at), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length
    }))

    const countryCounts: Record<string, number> = visits.reduce((acc: any, v: any) => {
      acc[v.country || 'Unknown'] = (acc[v.country || 'Unknown'] || 0) + 1
      return acc
    }, {})

    const sortedCountries = Object.entries(countryCounts).sort((a,b) => b[1] - a[1])

    setStats({
      totalVisits: visits.length,
      totalClicks: links.reduce((acc, curr) => acc + (curr.clicks || 0), 0),
      countries: sortedCountries.slice(0, 5),
      chartData,
      topLinks: links.slice(0, 3),
      topLocation: sortedCountries[0] ? { country: sortedCountries[0][0], count: sortedCountries[0][1], flag: '🇺🇸' } : { country: 'No data', count: 0, flag: '🌍' },
      trafficSources: [
        { name: 'Social', value: 45, color: '#3b82f6' },
        { name: 'Direct', value: 30, color: '#60a5fa' },
        { name: 'Search', value: 25, color: '#93c5fd' }
      ]
    })
    setLoading(false)
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div className="premium-card p-8 group overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Meilleure Localisation</span>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">🇺🇸</div>
            </div>
            <h3 className="text-3xl font-black text-foreground leading-tight">{stats.topLocation.country}</h3>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Globe className="w-24 h-24 text-foreground" />
          </div>
        </div>

        <div className="premium-card p-8 group overflow-hidden relative">
           <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total des Clics</span>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-primary/20 shadow-lg">
                 <MousePointer2 className="w-5 h-5" />
              </div>
           </div>
           <p className="text-5xl font-black text-foreground tracking-tighter">{stats.totalClicks.toLocaleString()}</p>
        </div>

        <div className="premium-card p-6 flex items-center gap-6">
           <div className="w-24 h-24 flex-shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.trafficSources} innerRadius={28} outerRadius={36} paddingAngle={4} dataKey="value">
                    {stats.trafficSources.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-xs font-black text-foreground">{stats.totalVisits}</span>
              </div>
           </div>
           <div className="space-y-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Trafic</p>
              {stats.trafficSources.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-bold">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                   <span className="text-muted-foreground">{s.name === 'Social' ? 'Sociaux' : s.name === 'Direct' ? 'Direct' : 'Recherche'}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="premium-card p-8 relative overflow-hidden group">
           <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Meilleur Lien</span>
              <Trophy className="w-5 h-5 text-yellow-500" />
           </div>
           <p className="text-2xl font-black text-primary truncate">@{stats.topLinks[0]?.title || 'Lien'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-8 space-y-10">
           <div className="premium-card p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Analyse des visites</h3>
                  <p className="text-sm text-muted-foreground font-medium font-sans">Performance sur les 7 derniers jours</p>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData}>
                    <defs>
                      <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 700 }} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 700 }} width={30} />
                    <Tooltip cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" name="Visites" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorMain)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="premium-card overflow-hidden">
              <div className="p-10 border-b border-border flex justify-between items-center">
                 <div>
                   <h3 className="text-2xl font-black text-foreground tracking-tight">Activité des Visiteurs</h3>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-muted/40">
                       <tr>
                          <th className="px-10 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Heure</th>
                          <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pays</th>
                          <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lien</th>
                          <th className="px-10 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Statut</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-sans">
                       {recentVisitors.map((v, i) => (
                         <tr key={i} className="hover:bg-muted/40 transition-colors">
                            <td className="px-10 py-6 text-sm font-bold text-muted-foreground">{format(new Date(v.created_at), 'HH:mm')}</td>
                            <td className="px-6 py-6 font-black text-foreground flex items-center gap-2">
                               <span className="text-lg">📍</span> {v.country || 'Inconnu'}
                            </td>
                            <td className="px-6 py-6 text-primary font-black">BioLink</td>
                            <td className="px-10 py-6 text-right">
                               <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center ml-auto">
                                  <Zap className="w-3 h-3 fill-primary" />
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
           <div className="premium-card p-10 group">
              <div className="flex justify-between items-start mb-10 font-sans">
                 <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                       <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--primary)/0.5)]"></div>
                       Activité en Direct
                    </h3>
                 </div>
                 <div className="px-4 py-2 bg-background border border-border rounded-xl text-center min-w-[60px]">
                    <span className="text-lg font-black text-foreground">12</span>
                    <span className="block text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Actifs</span>
                 </div>
              </div>
              <div className="h-40 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData.slice(-10)}>
                    <Area type="stepBefore" dataKey="visits" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Log Récent
                 </p>
                 {[1,2,3].map(i => (
                   <div key={i} className="flex gap-4 p-4 hover:bg-muted rounded-xl transition-colors cursor-pointer border border-transparent hover:border-border font-sans">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                         <Globe className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-foreground">Nouvelle visite détectée</p>
                         <p className="text-[10px] font-bold text-muted-foreground mt-0.5">San Francisco, US • Actif</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}
