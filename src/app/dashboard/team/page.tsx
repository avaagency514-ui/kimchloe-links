'use client'

import { useState } from 'react'
import { 
  Users, Mail, Shield, ShieldCheck, 
  Trash2, UserPlus, Settings, 
  ChevronRight, Search, Zap,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export default function TeamManagementPage() {
  const [members, setMembers] = useState([
    { id: 1, name: 'Alvin Agency', email: 'alvin2838@gmail.com', role: 'Owner', status: 'Active', avatar: 'AL' },
    { id: 2, name: 'Marie Dupont', email: 'marie@example.com', role: 'Admin', status: 'Active', avatar: 'MD' },
    { id: 3, name: 'Jean Martin', email: 'jean@test.com', role: 'Member', status: 'Pending', avatar: 'JM' },
  ])

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Member')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail) return
    
    const newMember = {
      id: Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Pending',
      avatar: inviteEmail.substring(0, 2).toUpperCase()
    }
    
    setMembers([newMember, ...members])
    setInviteEmail('')
    toast.success(`Invitation envoyée à ${inviteEmail} !`)
  }

  const removeMember = (id: number) => {
    setMembers(members.filter(m => m.id !== id))
    toast.info("Membre retiré de l'équipe.")
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-foreground tracking-tight italic uppercase">Gestion d'Équipe</h1>
          <p className="text-muted-foreground font-medium mt-3 italic flex items-center gap-3 uppercase tracking-widest opacity-60">
            <Users className="w-5 h-5 text-primary" /> Collaborez avec votre équipe et gérez les permissions.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-6 py-4 bg-card border border-border shadow-2xl rounded-2xl flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none italic">Membres</p>
                 <p className="text-xl font-black text-foreground leading-none mt-2 italic tracking-tighter">{members.length} / ∞</p>
              </div>
              <div className="w-12 h-12 rounded-[1rem] bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                 <Users className="w-6 h-6" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Invite & Members */}
        <div className="lg:col-span-8 space-y-10">
           
           {/* Invite Section */}
           <div className="premium-card p-10 bg-card border-border border-2 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-110">
                 <UserPlus className="w-32 h-32 text-primary" />
              </div>
              
              <div className="relative z-10">
                 <h2 className="text-xl font-black text-foreground mb-10 italic uppercase tracking-widest underline decoration-primary/20 decoration-4 underline-offset-8">Inviter un nouveau membre</h2>
                 <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
                    <div className="relative md:col-span-7">
                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50 pointer-events-none" />
                       <input 
                        className="h-16 w-full pl-16 pr-6 rounded-2xl bg-muted border-none font-black transition-all text-sm placeholder:text-muted-foreground/30 focus:shadow-xl outline-none"
                        placeholder="exemple@email.com"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                       />
                    </div>
                    
                    <div className="md:col-span-3">
                       <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger className="w-full h-16 rounded-2xl bg-muted border-none font-black text-xs uppercase tracking-widest shadow-none">
                             <SelectValue placeholder="Rôle" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-border bg-card shadow-2xl">
                             <SelectItem value="Member" className="font-black py-4 uppercase text-[10px] tracking-widest">Membre</SelectItem>
                             <SelectItem value="Admin" className="font-black py-4 uppercase text-[10px] tracking-widest">Administrateur</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="md:col-span-2">
                       <Button type="submit" className="w-full btn-premium h-16 font-black text-sm rounded-2xl shadow-2xl shadow-primary/20 uppercase tracking-widest">
                          Inviter <ChevronRight className="w-5 h-5 ml-2" />
                       </Button>
                    </div>
                 </form>
                 <p className="text-[10px] text-muted-foreground font-black mt-6 italic uppercase tracking-widest opacity-40">
                    Un e-mail d'invitation sera envoyé à votre collaborateur pour rejoindre l'espace.
                 </p>
              </div>
           </div>

           {/* Members List */}
           <div className="premium-card bg-card border-border border-2 overflow-hidden">
              <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
                 <h3 className="text-lg font-black text-foreground tracking-tight italic uppercase underline decoration-primary/10 decoration-4 underline-offset-8">Membres Actifs</h3>
                 <div className="relative font-sans">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                    <Input className="h-11 pl-11 pr-4 rounded-xl bg-muted border-none text-xs font-black w-72 shadow-inner italic" placeholder="Rechercher par nom ou email..." />
                 </div>
              </div>
              
              <div className="divide-y divide-border">
                 <AnimatePresence mode="popLayout">
                    {filteredMembers.map((member) => (
                       <motion.div 
                        key={member.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-8 flex items-center justify-between hover:bg-muted/30 transition-all group"
                       >
                          <div className="flex items-center gap-8">
                             <Avatar className="w-16 h-16 border-4 border-card shadow-2xl group-hover:scale-110 transition-transform">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-black text-lg">
                                   {member.avatar}
                                </AvatarFallback>
                             </Avatar>
                             <div>
                                <p className="font-black text-foreground text-xl italic uppercase tracking-tighter">{member.name}</p>
                                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest opacity-60">{member.email}</p>
                             </div>
                          </div>

                          <div className="flex items-center gap-12">
                             <div className="text-right flex flex-col items-end gap-3">
                                <div className="flex items-center gap-3">
                                   {member.role === 'Owner' ? (
                                      <ShieldCheck className="w-5 h-5 text-amber-500" />
                                   ) : (
                                      <Shield className="w-5 h-5 text-primary/40" />
                                   )}
                                   <span className={`text-[10px] font-black uppercase tracking-widest italic ${member.role === 'Owner' ? 'text-amber-500 underline decoration-amber-500/20 underline-offset-4' : 'text-muted-foreground opacity-60'}`}>
                                      {member.role}
                                   </span>
                                </div>
                                <span className={`text-[9px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest border ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                                   {member.status}
                                </span>
                             </div>

                             {member.role !== 'Owner' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeMember(member.id)}
                                  className="w-14 h-14 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                >
                                   <Trash2 className="w-6 h-6" />
                                </Button>
                             )}
                          </div>
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Right Column: Info & Settings */}
        <div className="lg:col-span-4 space-y-10">
           
           <div className="premium-card p-10 bg-primary text-primary-foreground relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-12 font-sans">
                    <div className="w-16 h-16 bg-white/20 border border-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-12">
                       <Zap className="w-8 h-8" />
                    </div>
                    <span className="px-4 py-1.5 bg-white text-primary rounded-full text-[10px] font-black tracking-widest uppercase shadow-2xl">Gratuit</span>
                 </div>
                 <h4 className="text-primary-foreground/60 font-black uppercase tracking-widest text-[10px] italic">Espace de Travail Actif</h4>
                 <p className="text-4xl font-black mt-3 italic uppercase tracking-tighter underline decoration-white/20 underline-offset-8">Assistants US</p>
                 <p className="text-primary-foreground font-medium mt-6 italic leading-relaxed opacity-80 uppercase tracking-tight text-sm">
                    Vous partagez actuellement tous les liens et analyses avec les membres de cette équipe.
                 </p>
                 
                 <Button onClick={() => toast.info("Ouverture des paramètres de l'équipe")} variant="ghost" className="w-full mt-12 h-16 bg-white/10 text-white border border-white/20 rounded-2xl font-black hover:bg-white/20 uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl">
                    <Settings className="w-5 h-5 mr-3 animate-spin-slow" /> Paramètres d'Équipe
                 </Button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-all group-hover:scale-150"></div>
              <div className="absolute top-0 right-0 p-4">
                 <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping shadow-2xl shadow-white"></div>
              </div>
           </div>

           <div className="premium-card p-10 bg-card border-border border-2 space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-500" />
                 </div>
                 <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest italic">Guide des Permissions</h4>
              </div>
              
              <div className="space-y-6">
                 <div className="p-6 bg-muted/40 rounded-2xl border border-border group hover:border-primary/30 transition-all">
                    <p className="text-[11px] font-black text-foreground uppercase mb-3 italic underline decoration-primary/20 underline-offset-4 tracking-widest">Administrateur</p>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tight leading-relaxed opacity-60">Peut gérer les liens, voir les analyses, et gérer les membres de l'équipe.</p>
                 </div>
                 <div className="p-6 bg-muted/40 rounded-2xl border border-border group hover:border-primary/30 transition-all">
                    <p className="text-[11px] font-black text-foreground uppercase mb-3 italic underline decoration-primary/20 underline-offset-4 tracking-widest">Membre</p>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tight leading-relaxed opacity-60">Peut voir les liens et les analyses, mais ne peut pas gérer l'équipe.</p>
                 </div>
              </div>

              <div className="pt-10 border-t border-border">
                 <p className="text-[10px] text-muted-foreground/30 font-black text-center italic uppercase tracking-[0.3em]">
                    BioLink Free — Collaboration Illimitée
                 </p>
              </div>
           </div>

        </div>

      </div>
    </div>
  )
}
