'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, Link as LinkIcon, BarChart2, User, 
  CreditCard, Users, Globe, Settings, Bell, ChevronDown,
  Heart, HelpCircle, LifeBuoy, LogOut, Plus, ShieldCheck, Trash2
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { supabaseBrowser } from '@/lib/supabase'
import { ThemeToggle } from '@/components/theme-toggle'

const SIDEBAR_ITEMS = [
  { group: 'Panneau de Contrôle', items: [
    { name: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Liens', icon: LinkIcon, path: '/dashboard/links' },
    { name: 'Gestion d\'Équipe', icon: Users, path: '/dashboard/team' },
  ]},
  { group: 'Compte', items: [
    { name: 'Profil', icon: User, path: '/dashboard/profile' },
    { name: 'Domaines', icon: Globe, path: '/dashboard/domains' },
  ]}
]

export const WorkspaceContext = createContext<any>(null)
export const useWorkspace = () => useContext(WorkspaceContext)

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [activeWorkspace, setActiveWorkspace] = useState<any>(null)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [loadingApp, setLoadingApp] = useState(true)
  const router = useRouter()
  const supabase = supabaseBrowser()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
         router.push('/login')
         return
      }
      
      const { data } = await supabase
        .from('workspace_members')
        .select(`
          workspaces ( id, name, icon, type )
        `)
        .eq('user_id', user.id)
        
      let wsList = data ? data.map((d: any) => d.workspaces).filter((w: any) => w !== null) : []
      
      if (wsList.length === 0) {
         const { data: fallBackWs } = await supabase.from('workspaces').insert([
            { name: 'Personnel', type: 'Espace personnel', icon: 'P' }
         ]).select().single()
         
         if (fallBackWs) {
            await supabase.from('workspace_members').insert([
               { workspace_id: fallBackWs.id, user_id: user.id, role: 'Owner' }
            ])
            wsList = [fallBackWs]
         }
      }

      setWorkspaces(wsList)
      if (wsList.length > 0) setActiveWorkspace(wsList[0])
      
      setLoadingApp(false)
    }
    loadData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleCreateTeam = async () => {
    if (!newTeamName) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: wsData, error } = await supabase.from('workspaces').insert([
      { name: newTeamName, type: "Espace d'équipe", icon: newTeamName.charAt(0).toUpperCase() }
    ]).select().single()

    if (error || !wsData) {
       toast.error("Erreur ! " + error?.message)
       return
    }

    await supabase.from('workspace_members').insert([
       { workspace_id: wsData.id, user_id: user.id, role: 'Owner' }
    ])

    const updatedWs = [...workspaces, wsData]
    setWorkspaces(updatedWs)
    setActiveWorkspace(wsData)
    setNewTeamName('')
    setIsTeamModalOpen(false)
    toast.success(`Équipe "${newTeamName}" créée définitivement !`)
  }

  const handleDeleteTeam = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const { error } = await supabase.from('workspaces').delete().eq('id', id)
    if (error) {
       toast.error("Erreur : " + error.message)
       return
    }
    const newWorkspaces = workspaces.filter(ws => ws.id !== id)
    setWorkspaces(newWorkspaces)
    if (activeWorkspace && activeWorkspace.id === id) {
      setActiveWorkspace(newWorkspaces[0])
    }
    toast.success("Équipe supprimée définitivement")
  }

  if (loadingApp || !activeWorkspace) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-bold animate-pulse">Chargement de votre espace de travail...</p>
         </div>
      </div>
    )
  }

  return (
    <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, setWorkspaces, setActiveWorkspace, loadingApp }}>
      <div className="min-h-screen bg-background flex font-sans overflow-hidden text-foreground">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-card border-r border-border flex flex-col hidden md:flex sticky top-0 h-screen z-40">
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary transition-transform group-hover:scale-110">
               <Heart className="w-5 h-5 fill-primary" />
            </div>
            <span className="text-xl font-black text-foreground tracking-tight">BioLink Pro</span>
          </div>
          <div className="relative cursor-pointer hover:bg-muted p-2 rounded-full transition-colors">
             <Bell className="w-5 h-5 text-muted-foreground" />
             <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
          </div>
        </div>
        
        {/* Workspace Switcher */}
        <div className="px-4 mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <div className="p-1 rounded-2xl bg-muted border border-border cursor-pointer group hover:bg-accent transition-all duration-300">
                <div className="w-full flex items-center justify-between p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">
                      {activeWorkspace.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-foreground leading-tight">{activeWorkspace.name}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5">{activeWorkspace.type}</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-2 rounded-2xl bg-popover border-border shadow-2xl ml-4" align="start">
               <div className="space-y-1">
                  <p className="px-4 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vos Espaces</p>
                  {workspaces.map((ws) => (
                    <div 
                      key={ws.id}
                      onClick={() => setActiveWorkspace(ws)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeWorkspace.id === ws.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-muted-foreground'}`}
                    >
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${activeWorkspace.id === ws.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {ws.icon}
                       </div>
                       <div className="flex flex-col flex-1">
                          <span className="text-xs font-black">{ws.name}</span>
                          <span className="text-[8px] font-bold uppercase opacity-60 italic">{ws.type}</span>
                       </div>
                       <div className="flex items-center gap-1">
                          {activeWorkspace.id === ws.id && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
                          {ws.id !== 'personal' && (
                             <div 
                                onClick={(e) => handleDeleteTeam(e, ws.id)} 
                                className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors text-muted-foreground"
                                title="Supprimer l'équipe"
                             >
                                <Trash2 className="w-3.5 h-3.5" />
                             </div>
                          )}
                       </div>
                    </div>
                  ))}
                  
                  <div className="my-2 border-t border-border" />
                  
                  <div 
                    onClick={() => setIsTeamModalOpen(true)}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-primary/10 text-primary transition-all font-black"
                  >
                     <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                     </div>
                     <span className="text-xs uppercase tracking-widest">Créer une Équipe</span>
                  </div>
               </div>
            </PopoverContent>
          </Popover>
        </div>

        <AnimatePresence>
          {isTeamModalOpen && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9, y: 20 }}
                   className="bg-card rounded-2xl p-12 max-w-md w-full shadow-2xl border border-border"
                >
                   <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-10 border border-primary/20">
                      <Users className="w-10 h-10" />
                   </div>
                   <h2 className="text-3xl font-black text-foreground tracking-tight mb-4">Nouvel Espace d'Équipe</h2>
                   <p className="text-muted-foreground font-medium mb-10 italic text-sm">Collaborez avec vos collègues sur vos liens intelligents.</p>
                   
                   <div className="space-y-4 mb-10">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nom de l'équipe</Label>
                      <Input 
                        autoFocus
                        placeholder="ex: Marketing USA"
                        className="h-14 rounded-xl bg-background border-border font-bold px-6 focus:ring-primary transition-all text-foreground"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
                      />
                   </div>
                   
                   <div className="flex gap-4">
                      <Button variant="ghost" onClick={() => setIsTeamModalOpen(false)} className="h-14 flex-1 rounded-xl font-black text-muted-foreground hover:text-foreground">Annuler</Button>
                      <Button onClick={handleCreateTeam} className="bg-primary text-primary-foreground h-14 flex-1 rounded-xl font-black px-10 hover:opacity-90 transition-opacity">
                         Créer
                      </Button>
                   </div>
                </motion.div>
             </div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 no-scrollbar">
          {SIDEBAR_ITEMS.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-4">{group.group}</h3>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.path
                  const Icon = item.icon
                  return (
                    <Link key={item.name} href={item.path} 
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-accent hover:text-foreground group'}`}>
                      <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>
        
        {/* Profile Footer */}
        <div className="p-6 mt-auto border-t border-border bg-muted/20">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3 p-1 cursor-pointer">
              <Avatar className="w-10 h-10 ring-1 ring-border shadow-sm border border-background transition-transform group-hover:scale-105">
                 <AvatarFallback className="bg-muted text-muted-foreground font-bold">AL</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-black text-foreground truncate">alvin2838</span>
                <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Plan Pro</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen bg-background text-foreground">
         {/* Premium Topbar */}
         <header className="h-20 bg-background/50 backdrop-blur-md border-b border-border flex items-center justify-between px-10 sticky top-0 z-30">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
                 {activeWorkspace.name} <span className="text-muted font-light">—</span> <span className="text-muted-foreground uppercase text-xs tracking-widest italic">
                   {SIDEBAR_ITEMS.flatMap(g => g.items).find(i => i.path === pathname)?.name || 'Tableau de bord'}
                 </span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button onClick={() => setIsTeamModalOpen(true)} className="bg-primary text-primary-foreground px-6 py-5 font-bold h-auto text-sm rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/10">
                 <Plus className="w-4 h-4 mr-2" />
                 Équipe
              </Button>
              <div className="flex items-center p-1 bg-muted rounded-xl border border-border">
                <Button onClick={() => toast.info("Filtre: Tous les liens appliqué")} variant="ghost" size="sm" className="bg-background shadow-sm text-foreground text-xs font-bold px-4 hover:bg-background h-8 rounded-lg">
                   Tous
                </Button>
                <Button onClick={() => toast.info("Filtre: Aujourd'hui appliqué")} variant="ghost" size="sm" className="text-muted-foreground text-xs font-bold px-4 hover:text-foreground h-8">
                  Recent
                </Button>
              </div>
            </div>
         </header>
         
         <div className="flex-1 overflow-auto p-10 custom-scrollbar">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
         </div>
      </main>
    </div>
    </WorkspaceContext.Provider>
  )
}
