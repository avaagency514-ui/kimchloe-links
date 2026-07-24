'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronLeft, ChevronRight, Plus, Trash2, 
  Smartphone, Monitor, Sparkles, Globe, 
  User, Palette, Link as LinkIcon, Share2, 
  Zap, Clock, Users, Camera, Play,
  Settings2, RefreshCcw, ChartArea, ArrowRight, ExternalLink,
  Heart, CheckCircle2, ShieldCheck, MousePointer2, ShieldAlert,
  ChevronDown, Type, SunMoon, Sun, Moon, Eye, EyeOff, Info, Layout
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'
import { supabaseBrowser } from '@/lib/supabase'
import { toast } from 'sonner'
import ImageEditorModal from '@/components/ImageEditorModal'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useWorkspace } from '../layout'

// Constants
const TEMPLATES = [
  {
    id: 'ethereal',
    layout: 'classic',
    name: 'Ethereal',
    bgColor: 'bg-[#f0f4ff]',
    font: 'var(--font-outfit)',
    button: 'pill',
    textColor: 'dark',
    previewImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'
  },
  {
    id: 'dreamy',
    layout: 'card',
    name: 'Dreamy',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-violet-100',
    font: 'var(--font-outfit)',
    button: 'rounded-2xl',
    textColor: 'dark'
  },
  {
    id: 'nightfall',
    layout: 'featured-top',
    name: 'Nightfall',
    bgColor: 'bg-slate-900',
    font: 'var(--font-poppins)',
    button: 'rounded-full',
    textColor: 'light'
  },
  {
    id: 'bold',
    layout: 'classic',
    name: 'Bold',
    bgColor: 'bg-blue-600',
    font: 'var(--font-montserrat)',
    button: 'rounded-none',
    textColor: 'light'
  },
  {
    id: 'hero',
    layout: 'hero',
    name: 'Hero',
    bgColor: 'bg-slate-50',
    font: 'var(--font-dm-sans)',
    button: 'rounded-full',
    textColor: 'dark'
  },
  {
    id: 'bento',
    layout: 'bento',
    name: 'Bento',
    bgColor: 'bg-slate-100',
    font: 'var(--font-inter)',
    button: 'rounded-2xl',
    textColor: 'dark'
  },
  {
    id: 'terrain',
    layout: 'classic',
    name: 'Terrain',
    bgColor: 'bg-[#fdfbf7]',
    font: 'var(--font-outfit)',
    button: 'rounded-xl',
    textColor: 'dark'
  },
  {
    id: 'luminescent',
    layout: 'glow',
    name: 'Luminescent',
    bgColor: 'bg-black',
    font: 'var(--font-poppins)',
    button: 'rounded-xl',
    textColor: 'light'
  },
  {
    id: 'tag',
    layout: 'tag',
    name: 'Luggage Tag',
    bgColor: 'bg-[#f0ece9]',
    font: 'var(--font-inter)',
    button: 'rounded-lg',
    textColor: 'dark'
  },
  {
    id: 'clay',
    layout: 'clay',
    name: 'Clay',
    bgColor: 'bg-[#f4f7fa]',
    font: 'var(--font-outfit)',
    button: 'rounded-3xl',
    textColor: 'dark'
  }
]

const DEEPLINK_OVERLAYS = [
  { id: 'slate', name: 'Slate', color: 'bg-[#0f172a]', textColor: 'text-white' },
  { id: 'yellow', name: 'Yellow Pop', color: 'bg-[#ffcc33]', textColor: 'text-slate-900' },
  { id: 'white', name: 'Pure White', color: 'bg-white', textColor: 'text-slate-900' },
  { id: 'cream', name: 'Warm Cream', color: 'bg-[#fff5e6]', textColor: 'text-slate-900' },
  { id: 'beige', name: 'Light Beige', color: 'bg-[#f5f5dc]', textColor: 'text-slate-900' },
  { id: 'glass-dark', name: 'Glass Dark', color: 'bg-[#1a1a1a]', textColor: 'text-white' },
  { id: 'charcoal', name: 'Charcoal', color: 'bg-[#262626]', textColor: 'text-white' },
  { id: 'neon', name: 'Dark Neon', color: 'bg-[#000000]', textColor: 'text-[#ccff00]' },
  { id: 'frosted', name: 'Frosted', color: 'bg-[#f0f0f0]', textColor: 'text-slate-800' },
  { id: 'hacker', name: 'Hacker', color: 'bg-[#0a0f1a]', textColor: 'text-[#00ffcc]' },
  { id: 'gradient', name: 'Gradient', color: 'bg-gradient-to-br from-purple-600 to-rose-500', textColor: 'text-white' },
  { id: 'bold-solid', name: 'Bold', color: 'bg-slate-900', textColor: 'text-white' },
  { id: 'stone', name: 'Stone', color: 'bg-[#444444]', textColor: 'text-white' },
  { id: 'blush', name: 'Blush', color: 'bg-[#ffe4e1]', textColor: 'text-slate-800' },
  { id: 'bloom', name: 'Sky Bloom', color: 'bg-[#e0f7fa]', textColor: 'text-slate-800' },
  { id: 'indigo', name: 'Indigo', color: 'bg-[#3f51b5]', textColor: 'text-white' },
]

const FONTS = [
  { name: 'Inter', value: 'var(--font-inter)' },
  { name: 'Poppins', value: 'var(--font-poppins)' },
  { name: 'Outfit', value: 'var(--font-outfit)' },
  { name: 'Montserrat', value: 'var(--font-montserrat)' },
  { name: 'DM Sans', value: 'var(--font-dm-sans)' }
]

// Components
const StepIndicator = ({ step, setStep }: { step: number, setStep: (s: number) => void }) => (
  <div className="flex items-center gap-2 mb-10">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="flex items-center">
        <button 
          onClick={() => setStep(i)}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 shadow-sm cursor-pointer hover:scale-110 active:scale-95 ${step === i ? 'bg-primary text-primary-foreground shadow-primary/20' : step > i ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}
        >
          {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
        </button>
        {i < 6 && <div className={`w-8 h-1 transition-all duration-700 ${step > i ? 'bg-primary/20' : 'bg-muted'}`} />}
      </div>
    ))}
  </div>
);

const DirectLinkView = ({ formData, setFormData, linkGroups, onAddGroup, onCancel }: { formData: any, setFormData: any, linkGroups: any[], onAddGroup: () => void, onCancel: () => void }) => {
  const [openSections, setOpenSections] = useState<string[]>(['dest'])
  const toggleSection = (id: string) => setOpenSections(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const Section = ({ id, icon: Icon, title, desc, children, badge }: any) => (
    <div className="premium-card bg-card overflow-hidden transition-all mb-4">
       <div onClick={() => toggleSection(id)} className="p-8 flex items-center justify-between cursor-pointer hover:bg-muted/50">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center"><Icon className="w-6 h-6" /></div>
             <div>
                <h4 className="font-black text-foreground flex items-center gap-3">
                   {title}
                   {badge && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[8px] font-black uppercase rounded">{badge}</span>}
                </h4>
                <p className="text-xs text-muted-foreground font-bold">{desc}</p>
             </div>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${openSections.includes(id) ? 'rotate-180' : ''}`} />
       </div>
       <AnimatePresence>
          {openSections.includes(id) && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-border">
               <div className="p-10">{children}</div>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  )

  return (
    <div className="space-y-12 pb-20">
       <div className="space-y-4">
          <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">TYPE DE LIEN</Label>
          <div className="grid grid-cols-2 gap-6">
             <div onClick={() => setFormData({...formData, type: 'landing'})} className={`p-10 rounded-[2.5rem] border-4 transition-all cursor-pointer ${formData.type === 'landing' ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                <h3 className="text-2xl font-black italic">Page de Destination</h3>
             </div>
             <div onClick={() => setFormData({...formData, type: 'direct'})} className={`p-10 rounded-[2.5rem] border-4 border-primary bg-primary/5 cursor-pointer ring-4 ring-primary/10`}>
                <h3 className="text-2xl font-black italic">Lien Direct</h3>
             </div>
          </div>
       </div>

       <div className="pt-8">
          <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">CONFIGURATION</Label>
          <div className="premium-card p-10 bg-card border border-border mt-4 space-y-10">
             <div className="space-y-4">
                <Label className="flex items-center gap-2 text-xs font-black text-foreground italic uppercase tracking-widest">
                   <LinkIcon className="w-3 h-3" /> Lien Court
                </Label>
                <div className="flex flex-row items-center h-16 bg-muted rounded-2xl border border-border px-6 focus-within:ring-4 ring-primary/10 transition-all gap-2">
                   <span className="text-sm font-black text-muted-foreground whitespace-nowrap mr-2">biolink.com /</span>
                   <Input 
                    className="border-none bg-transparent text-lg font-black text-foreground focus-visible:ring-0" 
                    placeholder="alias-unique" 
                    value={formData.shortUrl}
                    onChange={e => setFormData({...formData, shortUrl: e.target.value})}
                   />
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                   <Label className="flex items-center gap-2 text-xs font-black text-foreground italic uppercase tracking-widest text-[8px]">
                      # Nom pour le Tableau de bord
                   </Label>
                   <Input 
                    className="h-14 rounded-2xl bg-card border-2 border-muted font-bold font-sans px-6" 
                    placeholder="ex: Lien Bio Instagram" 
                    value={formData.internalName}
                    onChange={e => setFormData({...formData, internalName: e.target.value})}
                   />
                </div>
                <div className="space-y-4">
                   <Label className="flex items-center gap-2 text-xs font-black text-foreground italic uppercase tracking-widest text-[8px]">
                      📂 Groupe
                   </Label>
                   <Select 
                     value={formData.groupId || ''} 
                     onValueChange={(val) => {
                       if (val === 'new') onAddGroup()
                       else setFormData({...formData, groupId: val === 'none' ? null : val})
                     }}
                   >
                     <SelectTrigger className="h-14 rounded-2xl bg-muted border-2 border-muted px-6 font-black text-sm text-muted-foreground hover:bg-accent transition-all ring-offset-background focus:ring-4 ring-primary/10">
                       <SelectValue placeholder="Aucun Groupe" />
                     </SelectTrigger>
                     <SelectContent className="bg-card border-border rounded-2xl shadow-2xl p-2">
                       <SelectItem value="none" className="text-xs font-bold py-3 rounded-xl focus:bg-muted italic">Aucun Groupe</SelectItem>
                       {linkGroups.map((g) => (
                          <SelectItem key={g.id} value={g.id} className="text-xs font-bold py-3 rounded-xl focus:bg-muted">
                             {g.name}
                          </SelectItem>
                       ))}
                       <div className="h-px bg-border my-2 mx-2" />
                       <button 
                         onClick={(e) => { e.preventDefault(); onAddGroup(); }} 
                         className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-all"
                       >
                          <Plus className="w-3 h-3" /> Nouveau Groupe
                       </button>
                     </SelectContent>
                   </Select>
                </div>
             </div>
          </div>
       </div>

       <Section id="adv" icon={Settings2} title="Paramètres Avancés" desc="Sécurité et deep link">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-card border border-border rounded-2xl flex justify-between items-center">
                 <div><h4 className="font-black italic">Bot Protection</h4><p className="text-[10px] text-muted-foreground">Bloquez les robots</p></div>
                 <Switch checked={formData.botProtection} onCheckedChange={(val) => setFormData({...formData, botProtection: val})} />
              </div>
          </div>
       </Section>
       <div className="pt-10 flex justify-end gap-4">
          <Button variant="ghost" className="h-16 px-10 font-black text-slate-400" onClick={onCancel}>Annuler</Button>
          <Button className="btn-premium h-16 px-12 font-black text-lg" onClick={() => toast.success("Lien Créé !")}>Créer le Lien</Button>
       </div>
    </div>
  );
};


const MobilePreview = ({ data, countdownTime, showOverlay }: { data: any, countdownTime: { h: number, m: number, s: number }, showOverlay?: boolean }) => {
  const overlay = DEEPLINK_OVERLAYS.find(o => o.id === data.deeplinkOverlay) || DEEPLINK_OVERLAYS[0]
  return (
    <div className="sticky top-10 w-[350px] h-[700px] border-[12px] border-border bg-card rounded-[3rem] shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 w-full h-8 flex justify-center items-end z-20 pointer-events-none text-white/10"><div className="w-32 h-6 bg-border rounded-b-2xl"></div></div>
      <div className={`h-full overflow-y-auto pt-16 px-6 pb-10 transition-all ${data.bgColor}`} style={{ fontFamily: data.fontFamily, color: data.textColor === 'light' ? 'white' : 'inherit' }}>
          <div className="flex flex-col items-center">
            {/* Horizontal Panoramic Cover */}
            <div className="w-full h-44 -mx-6 bg-muted relative overflow-hidden mb-8">
              {data.coverImage ? <img src={data.coverImage} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20" />}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/90" />
            </div>
            {/* Raised Profile Header */}
            <div className="relative -mt-24 mb-10 flex flex-col items-center w-full px-8">
              <div className="w-32 h-32 rounded-3xl border-[6px] border-card shadow-2xl overflow-hidden bg-white mb-6">
                {data.profileImage ? <img src={data.profileImage} className="w-full h-full object-cover" /> : <User className="w-12 h-12 m-auto mt-10 text-slate-200" />}
              </div>
              <h2 className="text-3xl font-black tracking-tighter italic uppercase text-center w-full">{data.displayName || 'Votre Nom'}</h2>
              <p className="text-xs font-bold leading-relaxed opacity-60 uppercase tracking-widest text-center mt-2 px-4 w-full">{data.bio || 'Votre bio...'}</p>
            </div>
            {/* Centered Links */}
            <div className="w-full space-y-4">
              {data.links?.map((link: any, i: number) => (
                <div key={i} className="flex items-center justify-center text-sm font-black h-14 w-full shadow-sm bg-card border border-border rounded-2xl text-foreground text-center px-4">
                  {link.title || 'Lien'}
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  )
};

const DesktopPreview = ({ data, countdownTime, showOverlay }: { data: any, countdownTime: { h: number, m: number, s: number }, showOverlay?: boolean }) => {
  const overlay = DEEPLINK_OVERLAYS.find(o => o.id === data.deeplinkOverlay) || DEEPLINK_OVERLAYS[0]
  
  return (
    <div className="sticky top-10 w-full max-w-[1000px] h-[700px] border-[12px] border-border bg-card rounded-[3rem] shadow-2xl overflow-hidden relative mx-auto">
      <div className="absolute top-0 w-full h-8 flex justify-center items-end z-20 pointer-events-none">
        <div className="w-32 h-6 bg-border rounded-b-2xl"></div>
      </div>

      {showOverlay ? (
        <div className={`h-full w-full ${overlay.color} flex flex-col items-center justify-between p-20 text-center animate-in fade-in zoom-in duration-500`}>
          <div className="pt-20 w-full flex flex-col items-center max-w-2xl">
             <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-12 shadow-2xl ${overlay.textColor} bg-white/10 backdrop-blur-md border border-white/10`}>
                <Globe className="w-12 h-12" />
             </div>
             <h3 className={`text-5xl font-black leading-tight mb-8 tracking-tighter ${overlay.textColor}`}>
                Ouvrez dans votre navigateur pour continuer
             </h3>
             <p className={`text-base font-bold opacity-60 mb-16 tracking-widest uppercase ${overlay.textColor}`}>Suivez ces deux étapes simples :</p>
             
             <div className="grid grid-cols-2 gap-8 w-full">
                <div className="bg-black/10 backdrop-blur-md p-8 rounded-2xl flex items-center gap-6 text-left border border-white/5 shadow-xl">
                   <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-lg">1</div>
                   <p className={`text-sm font-black ${overlay.textColor}`}>Appuyez sur <span className="p-1 px-2 bg-black/20 rounded-lg mx-1">...</span> en haut à droite</p>
                </div>
                <div className="bg-black/10 backdrop-blur-md p-8 rounded-2xl flex items-center gap-6 text-left border border-white/5 shadow-xl">
                   <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-lg">2</div>
                   <p className={`text-sm font-black ${overlay.textColor}`}>Puis cliquez sur <span className="italic">"Ouvrir dans le navigateur"</span></p>
                </div>
             </div>
          </div>

          <div className="w-full pb-10 flex flex-col items-center gap-8">
             <p className={`text-xs font-bold opacity-50 max-w-lg leading-relaxed ${overlay.textColor}`}>
                Ou appuyez longuement sur le bouton et choisissez "Ouvrir dans Safari"
             </p>
             <button className="h-20 px-16 bg-white text-slate-900 rounded-2xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl">
                <ExternalLink className="w-6 h-6" /> Appui long pour ouvrir
             </button>
             <button className={`text-sm font-black opacity-40 uppercase tracking-widest ${overlay.textColor}`}>Annuler la redirection</button>
          </div>
        </div>
      ) : (
        <div className={`h-full overflow-y-auto no-scrollbar pt-16 px-6 pb-10 transition-all duration-500 ${data.bgColor}`} style={{ fontFamily: data.fontFamily, color: data.textColor === 'light' ? 'white' : 'inherit' }}>
           <div className="max-w-xl mx-auto">
             {data.type === 'direct' ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-20 font-sans min-h-[500px]">
                   <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-10 shadow-2xl animate-pulse">
                      <RefreshCcw className="w-12 h-12 text-white" />
                   </div>
                   <h2 className="text-4xl font-black text-foreground mb-4 italic uppercase tracking-tighter">Redirection active</h2>
                   <p className="text-sm text-muted-foreground font-bold leading-relaxed uppercase tracking-widest opacity-60">
                      Vos visiteurs seront automatiquement redirigés vers :
                      <br />
                      <span className="text-primary font-black mt-4 block break-all text-2xl lowercase">{data.destinationUrl || 'Destination URL'}</span>
                   </p>
                </div>
             ) : (
                <div className="flex flex-col items-center">
                   {/* Desktop Layout-specific Header */}
                   {data.layout === 'featured-top' ? (
                     <div className="w-full relative px-8 pt-8">
                       <div className="w-full h-[400px] bg-slate-200 relative rounded-2xl overflow-hidden shadow-2xl">
                         {data.profileImage ? (
                           <img src={data.profileImage} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                             <User className="w-32 h-32" />
                           </div>
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                         <div className="absolute bottom-12 left-12 text-left">
                           <h2 className="text-5xl font-black text-white tracking-tighter mb-4">{data.displayName || 'Votre Nom'}</h2>
                           <p className="text-lg font-bold text-white/70 max-w-lg">{data.bio || 'Votre bio...'}</p>
                         </div>
                         {data.online && (
                            <div className="absolute bottom-12 right-12 px-4 py-2 bg-emerald-500 rounded-full text-xs font-black text-white flex items-center gap-2 shadow-2xl">
                               <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> ONLINE NOW
                            </div>
                         )}
                       </div>
                     </div>
                   ) : data.layout === 'card' ? (
                     <div className="w-full px-12 pt-12">
                       <div className="bg-card rounded-[4rem] px-16 pb-20 shadow-2xl border border-border/40 flex flex-col items-center text-center border border-indigo-50/50">
                          <div className="relative mb-10">
                             <div className="w-48 h-48 rounded-2xl overflow-hidden bg-slate-50 border-8 border-white shadow-2xl">
                                {data.profileImage ? (
                                  <img src={data.profileImage} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-20 h-20 text-slate-300 m-auto mt-14" />
                                )}
                             </div>
                             {data.online && (
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 rounded-full border-[6px] border-white shadow-lg" />
                             )}
                          </div>
                          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{data.displayName || 'Votre Nom'}</h2>
                          <p className="text-base font-bold text-violet-600 uppercase tracking-[0.3em] mt-3">Verified Content Creator</p>
                          <p className="text-lg text-slate-400 font-medium mt-6 leading-relaxed max-w-lg">{data.bio || 'Votre bio...'}</p>
                       </div>
                     </div>
                   ) : data.layout === 'hero' ? (
                     <div className="w-full flex flex-col items-center">
                        <div className="w-full h-[450px] bg-slate-100 relative group overflow-hidden rounded-t-[3rem]">
                          {data.profileImage ? (
                            <img src={data.profileImage} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20" />
                          )}
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[4px]">
                             <h2 className="text-6xl font-black text-white italic tracking-tighter mb-6">{data.displayName || 'Votre Nom'}</h2>
                             {data.online && (
                                <div className="px-6 py-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full flex items-center gap-3">
                                   <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                                   <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em]">Direct connection online</span>
                                </div>
                             )}
                          </div>
                        </div>
                     </div>
                   ) : data.layout === 'tag' ? (
                     <div className="w-full px-12 pt-16">
                        <div className="bg-white border-4 border-slate-900 rounded-2xl p-12 relative overflow-hidden shadow-[20px_20px_0px_0px_#0f172a]">
                           <div className="absolute top-0 right-0 h-full w-4 bg-slate-900/10" />
                           <div className="flex gap-8">
                              <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 shrink-0 overflow-hidden border-4 border-slate-900">
                                 {data.profileImage ? <img src={data.profileImage} className="w-full h-full object-cover" /> : <User className="w-16 h-16 m-auto mt-8 text-slate-300" />}
                              </div>
                              <div className="flex flex-col justify-center">
                                 <h2 className="text-4xl font-black text-slate-900 leading-tight uppercase tracking-tighter">{data.displayName || 'Votre Nom'}</h2>
                                 <p className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] mt-2">GLOBAL ID: BL-19-452-87</p>
                                 <div className="mt-4 flex gap-2">
                                    <div className="h-6 w-1 bg-slate-900" />
                                    <div className="h-6 w-1 bg-slate-900" />
                                    <div className="h-6 w-0.5 bg-slate-900" />
                                    <div className="h-6 w-2 bg-slate-900" />
                                    <div className="h-6 w-1 bg-slate-900" />
                                 </div>
                              </div>
                           </div>
                           <div className="mt-10 pt-10 border-t-4 border-dashed border-slate-100">
                              <p className="text-sm font-black text-zinc-500 leading-relaxed uppercase tracking-[0.3em]">Verified Digital Identity / Connectivity Established</p>
                           </div>
                        </div>
                     </div>
                   ) : data.layout === 'glow' ? (
                      <div className="w-full flex flex-col items-center pt-16 pb-12">
                         <div className="relative">
                            <div className="absolute inset-0 bg-violet-600 blur-[80px] opacity-40 animate-pulse rounded-full" />
                            <div className="w-56 h-56 rounded-full border-[3px] border-violet-500/50 p-4 relative z-10 bg-black shadow-[0_0_60px_-15px_rgba(139,92,246,0.5)]">
                               <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-4 border-white/20">
                                  {data.profileImage ? <img src={data.profileImage} className="w-full h-full object-cover" /> : <User className="m-auto mt-16 text-white/20 w-16 h-16" />}
                               </div>
                            </div>
                            {data.online && (
                               <div className="absolute bottom-4 right-4 w-12 h-12 bg-emerald-500 rounded-full border-[8px] border-black z-20 shadow-2xl" />
                            )}
                         </div>
                         <h2 className="text-5xl font-black text-white mt-12 tracking-tight text-glow-indigo text-center">{data.displayName || 'Votre Nom'}</h2>
                         <p className="text-lg font-medium text-white/50 mt-4 italic px-20 text-center max-w-2xl">{data.bio || 'Votre bio...'}</p>
                      </div>
                   ) : data.layout === 'clay' ? (
                      <div className="w-full px-12 pt-16">
                         <div className="bg-slate-50 rounded-[5rem] p-20 shadow-[40px_40px_80px_#d9d9d9,-40px_-40px_80px_#ffffff] flex flex-col items-center border border-white/50">
                            <div className="w-48 h-48 rounded-full bg-slate-100 shadow-[inset_20px_20px_40px_#d9d9d9,inset_-20px_-20px_40px_#ffffff] p-4 mb-10">
                               <div className="w-full h-full rounded-full overflow-hidden">
                                  {data.profileImage ? <img src={data.profileImage} className="w-full h-full object-cover" /> : <User className="m-auto mt-12 text-slate-300 w-16 h-16" />}
                               </div>
                            </div>
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight">{data.displayName || 'Votre Nom'}</h2>
                            <p className="text-lg font-bold text-slate-400 mt-4 max-w-lg text-center leading-relaxed">{data.bio || 'Votre bio...'}</p>
                         </div>
                      </div>
                   ) : (
                     <div className="flex flex-col items-center">
                        {/* Desktop Classic Layout */}
                        <div className="w-full h-64 bg-slate-100 overflow-hidden relative rounded-t-[3rem]">
                          {data.coverImage ? (
                            <img src={data.coverImage} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-violet-100 to-indigo-500 opacity-20" />
                          )}
                        </div>
                        <div className="relative -mt-28 mb-10">
                          <div className="w-48 h-48 rounded-full border-[10px] border-white shadow-2xl overflow-hidden bg-slate-50 relative group">
                             {data.profileImage ? (
                               <img src={data.profileImage} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                  <User className="w-20 h-20" />
                               </div>
                             )}
                          </div>
                          {data.online && (
                             <div className="absolute bottom-4 right-4 w-10 h-10 bg-emerald-500 rounded-full border-8 border-white animate-pulse shadow-lg" />
                          )}
                        </div>
                        <h2 className="text-4xl font-black tracking-tight" style={{ color: data.textColor === 'light' ? 'white' : '#0f172a' }}>{data.displayName || 'Votre Nom'}</h2>
                        <p className="text-lg font-medium mt-3 text-center line-clamp-3 px-20 opacity-70" style={{ color: data.textColor === 'light' ? 'white' : 'inherit' }}>{data.bio || 'Votre bio apparaîtra ici...'}</p>
                     </div>
                   )}
                   
                   {/* Desktop Common elements */}
                   {data.layout !== 'featured-top' && data.layout !== 'card' && data.layout !== 'hero' && data.layout !== 'glow' && data.layout !== 'tag' && data.layout !== 'clay' && (
                      <>
                        {data.responseTime && (
                          <div className="mt-6 px-6 py-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-full flex items-center gap-3">
                             <Clock className="w-5 h-5 text-amber-500" />
                             <span className="text-xs font-black uppercase text-current tracking-widest">{data.responseTimeValue || 'Répond en < 1h'}</span>
                          </div>
                        )}
                      </>
                   )}

                   {/* Desktop Social Icons row */}
                   <div className={cn(
                      "flex flex-wrap justify-center gap-6 mt-12",
                      data.layout === 'tag' && "justify-start px-12 w-full mt-10"
                   )}>
                      {data.socials?.map((s: any, i: number) => (
                         <div key={i} className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-md hover:shadow-xl",
                            data.textColor === 'light' ? "bg-white/10 backdrop-blur-md border border-white/20 text-white" : "bg-white border border-slate-100 text-slate-900"
                         )}>
                            <Share2 className="w-7 h-7" />
                         </div>
                      ))}
                   </div>

                   {/* Desktop Countdown and Links */}
                   <div className={cn(
                      "w-full mt-12 px-12 space-y-8",
                      data.layout === 'bento' && "grid grid-cols-2 gap-8 space-y-0 pb-12"
                   )}>
                      {data.countdown && (
                         <div className={cn(
                            "w-full",
                            data.layout === 'bento' && "col-span-2"
                         )}>
                            <div className={cn(
                               "rounded-2xl p-12 text-white flex flex-col items-center justify-center shadow-2xl",
                               data.layout === 'glow' ? "bg-violet-900/40 border-2 border-violet-500/30 backdrop-blur-md" : "bg-slate-900"
                            )}>
                               <p className="text-xs font-black uppercase tracking-[0.4em] text-white/50 mb-6 italic px-4">{data.countdownValue || 'PROCHAINE SORTIE'}</p>
                               <div className="flex gap-16">
                                  <div className="text-center"><p className="text-5xl font-black leading-none mb-2">{String(countdownTime.h).padStart(2, '0')}</p><p className="text-[10px] opacity-50 uppercase font-black">Heures</p></div>
                                  <div className="text-center"><p className="text-5xl font-black leading-none mb-2">{String(countdownTime.m).padStart(2, '0')}</p><p className="text-[10px] opacity-50 uppercase font-black">Minutes</p></div>
                                  <div className="text-center"><p className="text-5xl font-black leading-none mb-2">{String(countdownTime.s).padStart(2, '0')}</p><p className="text-[10px] opacity-50 uppercase font-black">Secondes</p></div>
                               </div>
                            </div>
                         </div>
                      )}

                      {/* Featured Media */}
                      {data.featuredMedia?.url && (
                         <div className={cn(
                            "w-full aspect-video rounded-2xl overflow-hidden shadow-2xl",
                            data.layout === 'bento' && "col-span-2",
                            data.layout === 'clay' ? "shadow-[inset_20px_20px_40px_#d9d9d9,inset_-20px_-20px_40px_#ffffff]" : "border-4 border-slate-50"
                         )}>
                            {data.featuredMedia.type === 'video' ? (
                               <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white italic text-xl">
                                  <Play className="w-12 h-12 mr-4" /> (Vidéo en lecture HD)
                                </div>
                            ) : (
                               <img src={data.featuredMedia.url} className="w-full h-full object-cover" />
                            )}
                         </div>
                      )}

                      {/* Links */}
                      <div className={cn(
                         "w-full space-y-6",
                         data.layout === 'bento' && "col-span-2 grid grid-cols-2 gap-6 space-y-0"
                      )}>
                         {data.links?.map((link: any, i: number) => (
                            <a 
                              key={i} 
                              className={cn(
                                "flex items-center justify-center text-xl font-black transition-all cursor-pointer px-10 text-center h-20 w-full shadow-md hover:shadow-2xl hover:scale-[1.02]",
                                data.buttonStyle === 'rounded-2xl' ? 'rounded-2xl' : data.buttonStyle === 'rounded-none' ? 'rounded-none' : 'rounded-full',
                                data.layout === 'glow' ? "bg-violet-600/10 backdrop-blur-xl border-2 border-violet-500/40 text-white" : 
                                data.textColor === 'light' ? "bg-white/10 backdrop-blur-md border-2 border-white/20 text-white" : "bg-white border-2 border-slate-50 text-slate-900",
                                data.layout === 'clay' && "bg-slate-50 shadow-[20px_20px_40px_#d9d9d9,-20px_-20px_40px_#ffffff] border-none"
                              )}
                            >
                               {link.title || 'Titre du Lien'}
                            </a>
                         ))}
                      </div>
                   </div>
                </div>
             )}
           </div>
        </div>
      )}
    </div>
  )
}

export default function WizardPage() {
  const [isWizard, setIsWizard] = useState(false)
  const [step, setStep] = useState(1)
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [formData, setFormData] = useState<any>({
    type: 'landing',
    shortUrl: '',
    theme: 'dreamy',
    displayName: '',
    bio: '',
    profileImage: null,
    coverImage: null,
    featuredMedia: { type: 'none', url: '' },
    links: [],
    socials: [],
    botProtection: false,
    deeplink: false,
    deeplinkOverlay: 'slate',
    strictDeeplink: false,
    online: true,
    responseTime: false,
    responseTimeValue: 'Répond en < 1h',
    promoText: false,
    promoTextValue: '⚡ OFFRE SPÉCIALE EN COURS - PROFITEZ-EN MAINTENANT !',
    countdown: false,
    countdownValue: 'LANCEMENT DE LA COLLECTION',
    ambientAudio: false,
    audioValue: null,
    audioFileName: '',
    internalName: '',
    groupId: null,
    buttonStyle: 'rounded',
    fontFamily: 'var(--font-outfit)',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-violet-100',
    textColor: 'dark',
    layout: 'card'
  })
  const [showOverlayPreview, setShowOverlayPreview] = useState(false)
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
  const [socialInput, setSocialInput] = useState('')
  const [countdownTime, setCountdownTime] = useState({ h: 14, m: 55, s: 59 })
  
  const { activeWorkspace } = useWorkspace()
  const [linkGroups, setLinkGroups] = useState<any[]>([])
  const [savedLinks, setSavedLinks] = useState<any[]>([])
  const [boardLoading, setBoardLoading] = useState(true)
  const supabase = supabaseBrowser()

  useEffect(() => {
    if (activeWorkspace) {
      fetchBoardData()
    }
  }, [activeWorkspace])

  const fetchBoardData = async () => {
    setBoardLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !activeWorkspace) return

    const [groupsRes, linksRes] = await Promise.all([
      supabase.from('link_groups').select('*').eq('workspace_id', activeWorkspace.id).order('created_at', { ascending: true }),
      supabase.from('links').select('*').eq('workspace_id', activeWorkspace.id).order('created_at', { ascending: false })
    ])
    
    setLinkGroups(groupsRes.data || [])
    setSavedLinks(linksRes.data || [])
    
    if (groupsRes.data && groupsRes.data.length > 0) {
      setFormData((prev: any) => ({ ...prev, groupId: groupsRes.data[0].id }))
    }
    setBoardLoading(false)
  }

  const handleCreateGroup = () => {
    setIsNewGroupModalOpen(true)
  }

  const confirmCreateGroup = async () => {
    const name = newGroupName.trim()
    if (!name || !activeWorkspace) return
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase.from('link_groups').insert([{ workspace_id: activeWorkspace.id, name }]).select().single()
    if (data) {
      setLinkGroups([...linkGroups, data])
      setFormData({...formData, groupId: data.id})
      toast.success(`Groupe ${name} créé !`)
      setIsNewGroupModalOpen(false)
      setNewGroupName('')
    } else {
      toast.error(`Erreur : ${error?.message || "Échec de la création du groupe"}`)
      console.error("Group creation error:", error)
    }
  }

  const toggleLinkStatus = async (linkId: string, currentStatus: boolean) => {
    const { error } = await supabase.from('links').update({ is_active: !currentStatus }).eq('id', linkId)
    if (!error) {
      setSavedLinks(prev => prev.map(l => l.id === linkId ? { ...l, is_active: !currentStatus } : l))
      toast.success(currentStatus ? "Raccourci désactivé" : "Raccourci activé")
    } else {
      toast.error("Erreur de mise à jour")
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownTime(prev => {
        let { h, m, s } = prev
        if (s > 0) s--
        else {
          s = 59
          if (m > 0) m--
          else {
            m = 59
            if (h > 0) h--
          }
        }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const [editorState, setEditorState] = useState<{
    isOpen: boolean;
    imageSrc: string | null;
    aspectRatio: number;
    targetField: string;
    title: string;
  }>({
    isOpen: false,
    imageSrc: null,
    aspectRatio: 1,
    targetField: '',
    title: "Éditer l'image"
  })

  const handleAddSocial = (platform?: string) => {
    let url = socialInput
    if (platform && !url) {
      url = `https://${platform.toLowerCase()}.com/votre-nom`
    }
    if (!url) return
    
    // Auto-detect platform from URL if not provided
    const detectedPlatform = platform || (url.includes('instagram') ? 'Instagram' : url.includes('tiktok') ? 'TikTok' : url.includes('twitter') ? 'Twitter' : url.includes('onlyfans') ? 'OnlyFans' : 'Lien')
    
    setFormData({
      ...formData,
      socials: [...formData.socials, { platform: detectedPlatform, url }]
    })
    setSocialInput('')
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 6))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  return (
    <div className="min-h-screen">
      <div className="flex gap-16 animate-in slide-in-from-right-10 duration-700">
          {/* Form Side */}
          <div className="flex-1 max-w-3xl">
             <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-bold" onClick={() => setIsWizard(false)}>
                   <ChevronLeft className="w-5 h-5 mr-2" /> Retour au Tableau de bord
                </Button>
                <div className="text-right">
                   <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Création de Profil</p>
                   <p className="text-sm font-black text-foreground">Étape {step} sur 6</p>
                </div>
             </div>

             {formData.type === 'landing' && <StepIndicator step={step} setStep={setStep} />}

              {formData.type === 'direct' ? (
                <DirectLinkView 
                  formData={formData} 
                  setFormData={setFormData} 
                  linkGroups={linkGroups}
                  onAddGroup={handleCreateGroup}
                  onCancel={() => setIsWizard(false)} 
                />
              ) : (
                <AnimatePresence mode="wait">
                   {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                      <div className="flex items-center justify-between">
                         <div>
                            <h2 className="text-3xl font-black text-foreground tracking-tight italic uppercase">Basics</h2>
                            <p className="text-sm text-muted-foreground font-medium mt-1 uppercase tracking-widest opacity-60">Step 1 of 6</p>
                         </div>
                         <Button variant="outline" className="rounded-xl border-primary/20 text-primary bg-primary/5 font-black h-10 px-6">
                            <Palette className="w-4 h-4 mr-2" /> Templates
                         </Button>
                      </div>

                      <div className="space-y-6">
                         <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">LINK TYPE</Label>
                         <div className="grid grid-cols-2 gap-6">
                            {[
                               { id: 'landing', title: 'Landing Page', icon: Smartphone, desc: 'A customizable page to showcase multiple links, social profiles, and content.' },
                               { id: 'direct', title: 'Direct Link', icon: Zap, desc: 'Redirect visitors directly to a destination URL with optional protection.' }
                            ].map((t) => (
                               <div 
                                 key={t.id}
                                 onClick={() => setFormData({...formData, type: t.id})}
                                 className={`p-10 rounded-2xl border-2 cursor-pointer transition-all relative group ${formData.type === t.id ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-border hover:border-muted-foreground/30 bg-card'}`}
                               >
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${formData.type === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:text-primary'}`}>
                                     <t.icon className="w-6 h-6" />
                                  </div>
                                  <h4 className="font-black text-foreground text-xl mb-2 italic uppercase">{t.title}</h4>
                                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{t.desc}</p>
                                  <div className="mt-6">
                                     <span className="px-3 py-1 bg-muted text-muted-foreground text-[9px] font-black uppercase tracking-widest rounded-full">0 / 1 used</span>
                                  </div>
                                  {formData.type === t.id && (
                                     <div className="absolute top-6 right-6 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg animate-in zoom-in">
                                        <CheckCircle2 className="w-5 h-5" />
                                     </div>
                                  )}
                               </div>
                            ))}
                         </div>

                         <div className="mt-8 space-y-4">
                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">ASSIGNATION AU GROUPE</Label>
                            <Select 
                              value={formData.groupId || ''} 
                              onValueChange={(val) => {
                                if (val === 'new') handleCreateGroup()
                                else setFormData({...formData, groupId: val})
                              }}
                            >
                              <SelectTrigger className="h-16 rounded-2xl bg-card border-2 border-border px-8 font-black text-foreground hover:border-primary/30 transition-all focus:ring-4 ring-primary/10">
                                <SelectValue placeholder="Choisir un Groupe (Optionnel)" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border rounded-2xl shadow-2xl p-2">
                                <SelectItem value="none" className="text-xs font-bold py-3 rounded-xl focus:bg-muted italic">Aucun Groupe</SelectItem>
                                {linkGroups.map((g) => (
                                   <SelectItem key={g.id} value={g.id} className="text-xs font-bold py-3 rounded-xl focus:bg-muted">
                                      {g.name}
                                   </SelectItem>
                                ))}
                                <div className="h-px bg-border my-2 mx-2" />
                                <button 
                                  onClick={(e) => { e.preventDefault(); handleCreateGroup(); }} 
                                  className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-all"
                                >
                                   <Plus className="w-3 h-3" /> Nouveau Groupe
                                </button>
                              </SelectContent>
                            </Select>
                         </div>
                      </div>

                      <div className="premium-card overflow-hidden">
                         <div className="p-8 flex items-center justify-between group cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-6">
                               <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                  <Settings2 className="w-6 h-6" />
                               </div>
                               <div>
                                  <h3 className="text-lg font-black text-foreground italic tracking-tight uppercase">Advanced Settings</h3>
                                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">Configure security, access and deeplink settings</p>
                               </div>
                            </div>
                            <ChevronDown className="w-6 h-6 text-muted-foreground" />
                         </div>
                         
                         <div className="p-10 bg-muted/20 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                               { id: 'botProtection', title: 'Bot Protection', icon: ShieldCheck, desc: 'Blocks bots and crawlers from accessing your page...', warning: 'Not recommended if you rely on organic reach' },
                               { id: 'deeplink', title: 'Deeplink', icon: Smartphone, desc: 'Attempt to escape in-app browsers and open the destination...' },
                               { id: 'strictDeeplink', title: 'Strict Deeplink', icon: ShieldAlert, desc: 'On Meta platforms, forces users to open in their default browser...' }
                            ].map((s) => (
                               <div key={s.id} className="premium-card p-6 bg-card space-y-6">
                                  <div className="flex items-center justify-between">
                                     <div className="w-10 h-10 bg-muted text-muted-foreground rounded-xl flex items-center justify-center">
                                        <s.icon className="w-5 h-5" />
                                     </div>
                                     <Switch 
                                       checked={formData[s.id]}
                                       onCheckedChange={(val) => setFormData({...formData, [s.id]: val})}
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <h4 className="font-black text-foreground text-sm uppercase italic">{s.title}</h4>
                                     <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{s.desc}</p>
                                  </div>
                                  {s.warning && (
                                     <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2">
                                        <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
                                        <p className="text-[8px] font-bold text-amber-600 leading-tight">{s.warning}</p>
                                     </div>
                                  )}
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-6">
                         <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">CONFIGURATION</Label>
                         <div className="premium-card p-10 bg-card space-y-10">
                            <div className="space-y-4">
                               <Label className="flex items-center gap-2 text-xs font-black text-foreground uppercase tracking-widest italic">
                                  <LinkIcon className="w-3 h-3" /> Short Link
                               </Label>
                               <div className="flex flex-row items-center h-16 bg-muted rounded-2xl border border-border px-6 focus-within:ring-4 ring-primary/10 transition-all gap-2">
                                  <span className="text-sm font-black text-muted-foreground whitespace-nowrap mr-2">biolink.com /</span>
                                  <Input 
                                   className="border-none bg-transparent text-lg font-black text-foreground focus-visible:ring-0" 
                                   placeholder="unique-alias" 
                                   value={formData.shortUrl}
                                   onChange={e => setFormData({...formData, shortUrl: e.target.value})}
                                  />
                               </div>
                            </div>

                            <div className="grid grid-cols-2 gap-10">
                               <div className="space-y-4">
                                  <Label className="flex items-center gap-2 text-xs font-black text-foreground uppercase tracking-widest italic">
                                     # Nom pour le Tableau de bord
                                  </Label>
                                  <Input 
                                   className="h-14 rounded-2xl bg-card border-2 border-border font-bold font-sans px-6" 
                                   placeholder="ex: Lien Bio Instagram" 
                                   value={formData.internalName}
                                   onChange={e => setFormData({...formData, internalName: e.target.value})}
                                  />
                               </div>
                               <div className="space-y-4">
                                  <Label className="flex items-center gap-2 text-xs font-black text-foreground uppercase tracking-widest italic">
                                     📂 Groupe
                                  </Label>
                                  <Select value={formData.groupId || "no-group"} onValueChange={(val) => {
                                      if (val === 'new') {
                                        handleCreateGroup()
                                      } else {
                                        setFormData({...formData, groupId: val === "no-group" ? null : val})
                                      }
                                  }}>
                                     <SelectTrigger className="h-14 rounded-2xl bg-muted border-2 border-border px-6 cursor-pointer hover:bg-accent transition-colors font-black text-muted-foreground [&>span]:w-full [&>span]:text-left">
                                        <SelectValue placeholder="Aucun Groupe" />
                                     </SelectTrigger>
                                     <SelectContent className="rounded-2xl border-border shadow-xl p-2 bg-popover">
                                        <SelectItem value="no-group" className="text-sm font-black text-muted-foreground cursor-pointer rounded-xl italic">Aucun Groupe</SelectItem>
                                        {linkGroups.map(group => (
                                          <SelectItem key={group.id} value={group.id} className="text-sm font-black text-foreground cursor-pointer rounded-xl">{group.name}</SelectItem>
                                        ))}
                                        <div className="border-t border-border my-1 mx-2" />
                                        <button 
                                          onClick={(e) => { e.preventDefault(); handleCreateGroup(); }} 
                                          className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-all"
                                        >
                                           <Plus className="w-3 h-3" /> Nouveau Groupe
                                        </button>
                                     </SelectContent>
                                  </Select>
                               </div>
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  )}
                     {step === 2 && (
                   <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                     {/* Select a Theme */}
                     <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Select a Theme</Label>
                            <button className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-colors">
                               <Layout className="w-3 h-3" /> Templates
                            </button>
                         </div>
                         <div className="grid grid-cols-4 gap-6">
                            {TEMPLATES.map((t) => (
                               <div 
                                key={t.id} 
                                onClick={() => setFormData({
                                  ...formData, 
                                  theme: t.id,
                                  layout: t.layout,
                                  bgColor: t.bgColor,
                                  fontFamily: t.font,
                                  buttonStyle: t.button,
                                  textColor: t.textColor
                                })}
                                className={`group cursor-pointer space-y-4 transition-all`}
                               >
                                  <div className={`aspect-[9/14] rounded-2xl border-4 transition-all overflow-hidden relative shadow-sm ${formData.theme === t.id ? 'border-primary ring-4 ring-primary/10 scale-105 shadow-2xl' : 'border-border bg-muted hover:border-muted-foreground/30'}`}>
                                    {t.previewImg ? (
                                      <img src={t.previewImg} className="w-full h-full object-cover" />
                                    ) : (
                                       <div className={`w-full h-full ${t.bgColor} p-4 flex flex-col items-center gap-2`}>
                                          <div className={`w-8 h-8 rounded-full border-2 border-white/50 bg-muted/20 mt-4 shadow-sm`} />
                                          <div className="w-12 h-1 bg-muted/30 rounded-full mt-2" />
                                          <div className="w-full mt-4 space-y-2">
                                             {[1, 2, 3].map(i => (
                                                <div key={i} className={`h-3 w-full bg-muted/20 backdrop-blur-md rounded-lg shadow-inner opacity-60`} />
                                             ))}
                                          </div>
                                       </div>
                                    )}
                                    {formData.theme === t.id && (
                                       <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-xl animate-in zoom-in duration-300">
                                          <CheckCircle2 className="w-3 h-3" />
                                       </div>
                                    )}
                                  </div>
                                  <p className={`text-center text-[10px] font-black uppercase tracking-widest transition-colors ${formData.theme === t.id ? 'text-primary' : 'text-muted-foreground'}`}>
                                     {t.name}
                                  </p>
                               </div>
                            ))}
                         </div>
                      </div>

                     {/* Deeplink Overlay Section */}
                     <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Deeplink Overlay</Label>
                               <TooltipProvider>
                                  <Tooltip>
                                     <TooltipTrigger>
                                        <Info className="w-3 h-3 text-muted-foreground" />
                                     </TooltipTrigger>
                                     <TooltipContent className="bg-popover text-popover-foreground border-border">L'écran affiché sur Instagram/Facebook pour forcer l'ouverture dans le navigateur.</TooltipContent>
                                  </Tooltip>
                               </TooltipProvider>
                            </div>
                            <button 
                              onClick={() => setShowOverlayPreview(!showOverlayPreview)}
                              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${showOverlayPreview ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                            >
                               {showOverlayPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                               {showOverlayPreview ? 'Hide preview' : 'View preview'}
                            </button>
                         </div>
                         <div className="grid grid-cols-4 gap-4">
                            {DEEPLINK_OVERLAYS.map((overlay) => (
                               <div 
                                  key={overlay.id}
                                  onClick={() => setFormData({...formData, deeplinkOverlay: overlay.id})}
                                  className={`group cursor-pointer p-1 rounded-[1.25rem] border-2 transition-all ${formData.deeplinkOverlay === overlay.id ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]' : 'border-border bg-card'}`}
                               >
                                  <div className={`aspect-video rounded-xl ${overlay.color} flex flex-col items-center justify-center gap-1.5 shadow-inner relative overflow-hidden`}>
                                     <div className={`w-4 h-4 rounded-full border border-white/20 bg-black/10`} />
                                     <div className="w-6 h-1 bg-black/10 rounded-full" />
                                     {formData.deeplinkOverlay === overlay.id && (
                                        <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px] flex items-center justify-center">
                                           <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg">
                                              <CheckCircle2 className="w-3 h-3" />
                                           </div>
                                        </div>
                                     )}
                                  </div>
                                  <div className="mt-2 px-1 text-center">
                                     <p className={`text-[9px] font-black uppercase tracking-widest leading-none ${formData.deeplinkOverlay === overlay.id ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {overlay.name}
                                     </p>
                                  </div>
                               </div>
                            ))}
                         </div>
                     </div>

                     {/* Advanced Customization */}
                     <div className="premium-card overflow-hidden">
                         <div className="p-8 flex items-center justify-between group cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-6">
                               <div className="w-14 h-14 bg-primary/10 text-primary rounded-[1.25rem] flex items-center justify-center transition-transform group-hover:rotate-12">
                                  <Sparkles className="w-7 h-7" />
                               </div>
                               <div>
                                  <h3 className="text-xl font-black text-foreground italic tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8 uppercase">Advanced Customization</h3>
                                  <p className="text-sm text-muted-foreground font-medium mt-1">Fine-tune colors, fonts, and button styles</p>
                               </div>
                            </div>
                            <ChevronDown className="w-6 h-6 text-muted-foreground" />
                         </div>
                         <div className="p-10 bg-muted/30 border-t border-border space-y-12">
                            {/* Background & Typography Row */}
                            <div className="grid grid-cols-2 gap-12">
                               {/* Background */}
                               <div className="space-y-6">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center shadow-sm text-muted-foreground">
                                        <Palette className="w-4 h-4" />
                                     </div>
                                     <p className="text-[11px] font-black uppercase text-foreground tracking-widest">Background</p>
                                  </div>
                                  <div className="flex flex-wrap gap-4">
                                     {[
                                        'bg-[#f0f4ff]', 'bg-slate-50', 'bg-rose-50', 'bg-[#fff5e6]', 'bg-slate-900', 'bg-[#6366f1]'
                                     ].map((c) => (
                                        <div 
                                           key={c}
                                           onClick={() => setFormData({...formData, bgColor: c, theme: 'custom'})}
                                           className={`w-10 h-10 rounded-full cursor-pointer transition-all border-4 shadow-sm ${c} ${formData.bgColor === c ? 'border-primary scale-110 ring-4 ring-primary/10' : 'border-card hover:scale-105'}`}
                                        />
                                     ))}
                                  </div>
                               </div>

                               {/* Buttons Style */}
                               <div className="space-y-6">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center shadow-sm text-muted-foreground">
                                        <MousePointer2 className="w-4 h-4" />
                                     </div>
                                     <p className="text-[11px] font-black uppercase text-foreground tracking-widest">Buttons</p>
                                  </div>
                                  <div className="flex gap-3">
                                     {[
                                        { id: 'rounded', label: 'Rounded', radius: 'rounded-xl' },
                                        { id: 'square', label: 'Square', radius: 'rounded-none' },
                                        { id: 'pill', label: 'Pill', radius: 'rounded-full' }
                                     ].map((b) => (
                                        <button 
                                           key={b.id}
                                           onClick={() => setFormData({...formData, buttonStyle: b.id})}
                                           className={`flex-1 h-14 border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                                              formData.buttonStyle === b.id ? 'border-primary bg-primary text-primary-foreground shadow-lg' : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 shadow-sm'
                                           } ${b.radius}`}
                                        >
                                           {b.label}
                                        </button>
                                     ))}
                                  </div>
                               </div>
                            </div>

                            {/* Typography & Text color */}
                            <div className="grid grid-cols-2 gap-12">
                               {/* Typography */}
                               <div className="space-y-6">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center shadow-sm text-muted-foreground">
                                        <Type className="w-4 h-4" />
                                     </div>
                                     <p className="text-[11px] font-black uppercase text-foreground tracking-widest">Typography</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                     {FONTS.map((f) => (
                                        <button 
                                           key={f.name}
                                           onClick={() => setFormData({...formData, fontFamily: f.value})}
                                           style={{ fontFamily: f.value }}
                                           className={`h-12 bg-card border-2 rounded-xl flex items-center px-4 transition-all ${
                                              formData.fontFamily === f.value ? 'border-primary text-primary shadow-md ring-2 ring-primary/10' : 'border-transparent text-muted-foreground hover:border-border shadow-sm'
                                           }`}
                                        >
                                           <span className="text-xs font-bold">{f.name}</span>
                                        </button>
                                     ))}
                                  </div>
                               </div>

                               {/* Text Color Toggle */}
                               <div className="space-y-6">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center shadow-sm text-muted-foreground">
                                        <SunMoon className="w-4 h-4" />
                                     </div>
                                     <p className="text-[11px] font-black uppercase text-foreground tracking-widest">Text Color</p>
                                  </div>
                                  <div className="flex gap-4 p-1.5 bg-muted rounded-2xl border-2 border-border shadow-sm">
                                     {[
                                        { id: 'light', label: 'Light', icon: Sun },
                                        { id: 'dark', label: 'Dark', icon: Moon }
                                     ].map((c) => (
                                        <button 
                                           key={c.id}
                                           onClick={() => setFormData({...formData, textColor: c.id})}
                                           className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-3 text-xs font-black transition-all ${
                                              formData.textColor === c.id ? 'bg-foreground text-background shadow-xl' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                           }`}
                                        >
                                           <c.icon className="w-4 h-4" /> {c.label}
                                        </button>
                                     ))}
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div>
                      <h2 className="text-4xl font-black text-foreground tracking-tight italic uppercase">Profil</h2>
                      <p className="text-muted-foreground font-medium mt-2 uppercase tracking-widest opacity-60">Comment les gens doivent-ils vous voir ?</p>
                    </div>
                    <div className="space-y-10">
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <Label className="font-black text-foreground uppercase italic tracking-widest mb-2 block">Photo de Profil</Label>
                             <input 
                                type="file" 
                                id="profile-upload" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    const reader = new FileReader()
                                    reader.onload = (re) => setEditorState({
                                       isOpen: true,
                                       imageSrc: re.target?.result as string,
                                       aspectRatio: 1,
                                       targetField: 'profileImage',
                                       title: "Photo de Profil (1:1)"
                                    })
                                    reader.readAsDataURL(file)
                                  }
                                }}
                             />
                             <div 
                              onClick={() => document.getElementById('profile-upload')?.click()}
                              className="h-44 w-full rounded-[2.5rem] border-4 border-dashed border-border bg-muted flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all overflow-hidden group relative shadow-inner"
                             >
                                {formData.profileImage ? (
                                  <>
                                    <img src={formData.profileImage} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                       <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                                          <Palette className="w-6 h-6 text-primary" />
                                       </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <Camera className="w-10 h-10 text-muted-foreground mb-4 opacity-40 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Lancer l'Import</span>
                                  </>
                                )}
                             </div>
                          </div>
                          <div className="space-y-4">
                             <Label className="font-black text-foreground uppercase italic tracking-widest mb-2 block">Couverture</Label>
                             <input 
                                type="file" 
                                id="cover-upload" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    const reader = new FileReader()
                                    reader.onload = (re) => setEditorState({
                                       isOpen: true,
                                       imageSrc: re.target?.result as string,
                                       aspectRatio: 2.5, // Horizontal Panoramic Ratio
                                       targetField: 'coverImage',
                                       title: "Photo de Couverture (Panoramique)"
                                    })
                                    reader.readAsDataURL(file)
                                  }
                                }}
                             />
                             <div 
                              onClick={() => document.getElementById('cover-upload')?.click()}
                              className="h-44 w-full rounded-[2.5rem] border-4 border-dashed border-border bg-muted flex flex-col items-center justify-center cursor-pointer hover:border-violet-300 transition-colors overflow-hidden group relative"
                             >
                                {formData.coverImage ? (
                                  <>
                                    <img src={formData.coverImage} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                       <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                                          <Palette className="w-5 h-5 text-violet-600" />
                                       </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-8 h-8 text-muted-foreground mb-2" />
                                    <span className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest">Importer l'image</span>
                                  </>
                                )}
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <Label className="font-black text-foreground uppercase italic tracking-widest mb-2 block">Nom d'affichage</Label>
                          <Input 
                            className="h-14 rounded-2xl bg-card border-border text-lg font-bold font-sans px-6" 
                            placeholder="ex: Jean Dupont" 
                            value={formData.displayName}
                            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                          />
                       </div>
                       <div className="space-y-4">
                          <Label className="font-black text-foreground uppercase italic tracking-widest mb-2 block">Bio</Label>
                          <textarea 
                            className="w-full h-32 rounded-2xl bg-card border border-border p-6 text-lg font-medium outline-none focus:ring-4 ring-primary/10 transition-all font-sans" 
                            placeholder="Parlez de vous aux visiteurs..."
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          />
                       </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-4xl font-black text-foreground tracking-tight italic uppercase">Contenu</h2>
                        <p className="text-muted-foreground font-medium mt-2 uppercase tracking-widest opacity-60">Ajoutez des médias et des liens.</p>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => {
                            if (formData.featuredMedia?.type !== 'none') {
                              setFormData({...formData, featuredMedia: { type: 'none', url: '' }})
                            } else {
                              setFormData({...formData, featuredMedia: { type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80' }})
                            }
                          }} 
                          variant={formData.featuredMedia?.type !== 'none' ? "secondary" : "outline"} 
                          className={`rounded-xl font-bold h-12 px-6 ${formData.featuredMedia?.type !== 'none' ? 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20' : 'border-border text-muted-foreground'}`}
                        >
                           {formData.featuredMedia?.type !== 'none' ? <Trash2 className="w-5 h-5 mr-2" /> : <Smartphone className="w-5 h-5 mr-2" />}
                           {formData.featuredMedia?.type !== 'none' ? 'Retirer Média' : 'Photo/Vidéo'}
                        </Button>
                        <Button onClick={() => setFormData({...formData, links: [...formData.links, { title: '', url: '' }]})} variant="outline" className="rounded-xl border-primary/20 text-primary font-bold h-12 px-6 bg-primary/5 hover:bg-primary/10">
                           <Plus className="w-5 h-5 mr-2" /> Ajouter un Lien
                        </Button>
                      </div>
                    </div>
                    
                    {formData.featuredMedia?.type !== 'none' && (
                       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-10 bg-muted/20 border-2 border-border space-y-8">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-primary shadow-sm">
                                   {formData.featuredMedia.type === 'video' ? <Play className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                                </div>
                                <div>
                                   <p className="font-black text-foreground italic uppercase">Configuration du Média</p>
                                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">Personnalisez votre contenu visuel</p>
                                </div>
                             </div>
                             <div className="flex bg-muted p-1 rounded-xl border border-border">
                                <button 
                                 onClick={() => setFormData({...formData, featuredMedia: {...formData.featuredMedia, type: 'image'}})}
                                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.featuredMedia.type === 'image' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                                >Image</button>
                                <button 
                                 onClick={() => setFormData({...formData, featuredMedia: {...formData.featuredMedia, type: 'video'}})}
                                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.featuredMedia.type === 'video' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                                >Vidéo</button>
                             </div>
                          </div>
                          
                          <div className="space-y-4">
                             <Label className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest">URL du {formData.featuredMedia.type === 'video' ? 'Vidéo (YouTube/MP4)' : 'Image'}</Label>
                             <div className="flex items-center justify-center py-4 bg-muted/5 rounded-2xl border-2 border-dashed border-border min-h-[100px]">
                                <input 
                                   type="file" 
                                   id="media-upload" 
                                   className="hidden" 
                                   accept="image/*,video/*"
                                   onChange={(e) => {
                                     const file = e.target.files?.[0]
                                     if (file) {
                                       if (file.type.startsWith('video')) {
                                          const reader = new FileReader()
                                          reader.onload = (re) => setFormData({...formData, featuredMedia: { type: 'video', url: re.target?.result }})
                                          reader.readAsDataURL(file)
                                       } else {
                                          const reader = new FileReader()
                                          reader.onload = (re) => setEditorState({
                                             isOpen: true,
                                             imageSrc: re.target?.result as string,
                                             aspectRatio: 1.77, // 16:9 for Featured Media
                                             targetField: 'featuredMedia.url',
                                             title: "Contenu Visuel (16:9)"
                                          })
                                          reader.readAsDataURL(file)
                                       }
                                     }
                                   }}
                                />
                                <Button 
                                  onClick={() => document.getElementById('media-upload')?.click()}
                                  className="h-14 rounded-2xl bg-card border-2 border-border text-foreground hover:bg-muted font-black px-10 shadow-none hover:scale-105 transition-all flex items-center gap-3"
                                >
                                   <Camera className="w-5 h-5 text-primary" />
                                   {formData.featuredMedia.url ? 'Changer le fichier' : 'Parcourir les fichiers'}
                                </Button>
                             </div>
                          </div>
                       </motion.div>
                    )}

                    <div className="space-y-4">
                       {formData.links.map((link: any, i: number) => (
                         <div key={i} className="p-8 rounded-2xl bg-card border border-border shadow-sm relative group">
                            <button 
                             onClick={() => {
                               const nl = [...formData.links]; nl.splice(i, 1); setFormData({...formData, links: nl})
                             }}
                             className="absolute top-6 right-6 text-muted-foreground hover:text-destructive transition-colors"
                            >
                               <Trash2 className="w-5 h-5" />
                            </button>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-2">
                                  <Label className="text-[10px] uppercase font-black text-muted-foreground italic mb-2 block">Titre du Lien</Label>
                                  <Input className="h-12 rounded-xl bg-muted border-none font-bold px-6" value={link.title} onChange={(e) => {
                                    const nl = [...formData.links]; nl[i].title = e.target.value; setFormData({...formData, links: nl})
                                  }} placeholder="Visitez mon Site" />
                               </div>
                               <div className="space-y-2">
                                  <Label className="text-[10px] uppercase font-black text-muted-foreground italic mb-2 block">Destination URL</Label>
                                  <Input className="h-12 rounded-xl bg-muted border-none font-bold px-6" value={link.url} onChange={(e) => {
                                    const nl = [...formData.links]; nl[i].url = e.target.value; setFormData({...formData, links: nl})
                                  }} placeholder="https://..." />
                               </div>
                            </div>
                         </div>
                       ))}
                       {formData.links.length === 0 && (
                         <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl bg-muted/5">
                            <p className="text-muted-foreground font-bold italic">Aucun lien ajouté pour le moment.</p>
                         </div>
                       )}
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div>
                      <h2 className="text-4xl font-black text-foreground tracking-tight italic uppercase">Réseaux Sociaux</h2>
                      <p className="text-muted-foreground font-medium mt-2 uppercase tracking-widest opacity-60">Connectez vos profils sociaux.</p>
                    </div>
                    <div className="space-y-10">
                        <div className="space-y-6">
                           <div className="flex gap-4">
                              <Input 
                                className="h-14 rounded-2xl bg-card border-border text-lg font-bold font-sans px-6" 
                                placeholder="Collez l'URL (ex: Instagram, TikTok...)" 
                                value={socialInput}
                                onChange={(e) => setSocialInput(e.target.value)}
                              />
                              <Button onClick={() => handleAddSocial()} className="btn-premium h-14 px-8 font-black">Ajouter</Button>
                           </div>
                           <div className="grid grid-cols-4 gap-4">
                              {['Instagram', 'TikTok', 'Twitter', 'OnlyFans'].map(p => (
                                <button 
                                  key={p} 
                                  onClick={() => handleAddSocial(p)}
                                  className="h-14 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-muted text-[10px] font-black uppercase text-muted-foreground transition-all focus:ring-4 ring-primary/10"
                                >
                                   {p}
                                </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-4">
                           <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic mb-2 block">PROFILS CONNECTÉS</Label>
                           {formData.socials.length === 0 ? (
                              <div className="py-12 bg-muted/20 border border-dashed border-border rounded-[2.5rem] flex items-center justify-center">
                                 <p className="text-muted-foreground font-bold italic">Aucun réseau social connecté.</p>
                              </div>
                           ) : (
                              <div className="space-y-3">
                                 {formData.socials.map((s: any, i: number) => (
                                    <div key={i} className="p-6 bg-card border border-border rounded-3xl flex items-center justify-between group hover:border-primary/30 transition-all">
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                             <Share2 className="w-5 h-5" />
                                          </div>
                                          <div>
                                             <p className="font-black text-foreground italic uppercase">{s.platform}</p>
                                             <p className="text-xs text-muted-foreground font-medium">{s.url}</p>
                                          </div>
                                       </div>
                                       <button 
                                          onClick={() => {
                                             const ns = [...formData.socials];
                                             ns.splice(i, 1);
                                             setFormData({...formData, socials: ns})
                                          }}
                                          className="w-10 h-10 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all flex items-center justify-center"
                                       >
                                          <Trash2 className="w-5 h-5" />
                                       </button>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                    </div>
                  </motion.div>
                )}

                {step === 6 && (
                  <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div>
                      <h2 className="text-4xl font-black text-foreground tracking-tight italic uppercase">Avancé</h2>
                      <p className="text-muted-foreground font-medium mt-2 uppercase tracking-widest opacity-60">Fonctionnalités Premium (Maintenant Entièrement Gratuites)</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                       {[
                          { id: 'online', title: 'Indicateur de présence', icon: Users, color: 'emerald', desc: 'Affiche un point vert dynamique pour montrer que vous êtes actif en direct.' },
                          { id: 'responseTime', title: 'Temps de Réponse', icon: Clock, color: 'amber', desc: 'Rassurez vos fans en affichant votre rapidité.', field: 'responseTimeValue', placeholder: 'ex: Répond en < 1h' },
                          { id: 'promoText', title: 'Texte de Promotion', icon: Sparkles, color: 'primary', desc: 'Bannière défilante pour vos annonces importantes.', field: 'promoTextValue', placeholder: 'Texte de votre annonce...' },
                          { id: 'countdown', title: 'Compte à Rebours', icon: Zap, color: 'primary', desc: 'Créez l\'urgence pour un lancement ou événement.', field: 'countdownValue', placeholder: 'Titre de l\'événement...' },
                          { id: 'ambientAudio', title: 'Audio Ambiant', icon: Play, color: 'emerald', desc: 'Plongez vos visiteurs dans votre univers musical.', isAudio: true }
                       ].map((opt) => (
                          <div 
                           key={opt.id}
                           className={`p-8 rounded-2xl border transition-all flex flex-col gap-6 group ${formData[opt.id] ? `border-${opt.color}/50 bg-${opt.color}/5 shadow-xl shadow-${opt.color}/10` : 'border-border bg-card hover:border-muted-foreground/30'}`}
                          >
                             <div className="flex items-center justify-between pointer-events-none">
                                <div className="flex items-center gap-6">
                                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${formData[opt.id] ? `bg-primary text-primary-foreground shadow-lg` : 'bg-muted text-muted-foreground'}`}>
                                      <opt.icon className="w-7 h-7" />
                                   </div>
                                   <div className="max-w-[180px]">
                                      <p className="font-black text-foreground text-base italic uppercase">{opt.title}</p>
                                      <p className="text-[10px] text-muted-foreground font-medium leading-tight mt-1">{opt.desc}</p>
                                   </div>
                                </div>
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData({...formData, [opt.id]: !formData[opt.id]})
                                  }}
                                  className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer pointer-events-auto ${formData[opt.id] ? `bg-primary shadow-lg` : 'bg-muted-foreground/30'}`}
                                >
                                   <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${formData[opt.id] ? 'translate-x-6' : ''}`}></div>
                                </div>
                             </div>

                             {formData[opt.id] && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-border">
                                   {opt.field ? (
                                      <div className="space-y-3">
                                         <Label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic mb-2 block">Modifier le contenu</Label>
                                         <Input 
                                           className="h-12 rounded-xl bg-muted border-none font-bold text-sm px-4"
                                           placeholder={opt.placeholder}
                                           value={formData[opt.field]}
                                           onChange={(e) => setFormData({...formData, [opt.field]: e.target.value})}
                                         />
                                      </div>
                                   ) : opt.isAudio ? (
                                      <div className="space-y-4">
                                         <Label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic mb-2 block">Importer votre fichier audio</Label>
                                         <div className="flex gap-4">
                                            <Button 
                                              onClick={() => document.getElementById('audio-upload')?.click()}
                                              className="flex-1 h-12 bg-card text-primary border border-primary/20 hover:bg-primary/5 rounded-xl font-black text-xs"
                                            >
                                               {formData.audioFileName ? 'Changer l\'Audio' : 'Sélectionner un fichier'}
                                            </Button>
                                            <input 
                                              id="audio-upload"
                                              type="file"
                                              accept="audio/*"
                                              className="hidden"
                                              onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                   const reader = new FileReader()
                                                   reader.onload = (ev) => {
                                                      setFormData({...formData, audioValue: ev.target?.result, audioFileName: file.name})
                                                      toast.success(`Audio "${file.name}" importé !`)
                                                   }
                                                   reader.readAsDataURL(file)
                                                }
                                              }}
                                            />
                                         </div>
                                         {formData.audioFileName && (
                                            <p className="text-[10px] text-primary font-bold italic truncate">✓ {formData.audioFileName}</p>
                                         )}
                                      </div>
                                   ) : null}
                                </motion.div>
                             )}
                          </div>
                       ))}
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>
           )}

              {formData.type === 'landing' && (
                <div className="mt-20 flex justify-between pt-10 border-t border-border">
                   <Button variant="ghost" className="h-16 px-10 text-lg font-black text-muted-foreground uppercase" onClick={prevStep} disabled={step === 1}>
                      Précédent
                   </Button>
                   <Button className="btn-premium h-16 px-12 text-lg font-black uppercase" onClick={step === 6 ? () => toast.success("Créé !") : nextStep}>
                      {step === 6 ? 'Créer la Page' : 'Continuer'} <ChevronRight className="w-6 h-6 ml-2" />
                   </Button>
                </div>
              )}
          </div>

          {/* Preview Side */}
          <div className="hidden lg:block relative pt-20">
             <div className="sticky top-10 flex flex-col items-center">
                <div className="flex bg-muted p-1.5 rounded-2xl mb-8 border border-border">
                   <button 
                     onClick={() => setPreviewMode('mobile')}
                     className={`px-6 py-2 rounded-xl text-xs font-black flex items-center gap-2 tracking-tight transition-all ${previewMode === 'mobile' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                   >
                      <Smartphone className={`w-4 h-4 ${previewMode === 'mobile' ? 'text-primary' : ''}`} /> Mobile
                   </button>
                   <button 
                     onClick={() => setPreviewMode('desktop')}
                     className={`px-6 py-2 rounded-xl text-xs font-black flex items-center gap-2 tracking-tight transition-all ${previewMode === 'desktop' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                   >
                      <Monitor className={`w-4 h-4 ${previewMode === 'desktop' ? 'text-primary' : ''}`} /> Desktop
                   </button>
                </div>
                
                {previewMode === 'mobile' ? (
                  <MobilePreview data={formData} countdownTime={countdownTime} showOverlay={showOverlayPreview} />
                ) : (
                  <DesktopPreview data={formData} countdownTime={countdownTime} showOverlay={showOverlayPreview} />
                )}
                
                <p className="mt-8 text-xs font-black text-muted-foreground uppercase tracking-widest text-center opacity-60">
                   Aperçu en Direct
                </p>
             </div>
          </div>
        </div>

      {/* Image Editor Modal */}
      <ImageEditorModal 
        isOpen={editorState.isOpen}
        imageSrc={editorState.imageSrc}
        aspectRatio={editorState.aspectRatio}
        title={editorState.title}
        onClose={() => setEditorState({...editorState, isOpen: false})}
        onSave={(croppedImage) => {
           if (editorState.targetField === 'featuredMedia.url') {
              setFormData({
                ...formData, 
                featuredMedia: { ...formData.featuredMedia, type: 'image', url: croppedImage }
              })
           } else {
              setFormData({
                ...formData, 
                [editorState.targetField]: croppedImage
              })
           }
           toast.success("Image mise à jour avec succès")
        }}
      />

      {/* New Group Modal */}
      <Dialog open={isNewGroupModalOpen} onOpenChange={setIsNewGroupModalOpen}>
        <DialogContent className="bg-card border-border shadow-2xl p-10 max-w-sm rounded-[2.5rem]">
           <div className="space-y-8">
              <div className="text-center">
                 <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                    <Plus className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-black text-foreground italic uppercase">Nouveau Groupe</h3>
                 <p className="text-muted-foreground text-xs mt-2 font-medium uppercase tracking-widest opacity-60">Identifiez votre VA ou Membre</p>
              </div>

              <div className="space-y-4">
                 <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic mb-2 block">NOM DU GROUPE</Label>
                 <Input 
                   value={newGroupName}
                   onChange={(e) => setNewGroupName(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && confirmCreateGroup()}
                   placeholder="ex: Team Marketing / VA Jean"
                   className="h-14 rounded-2xl bg-muted border-none font-bold text-lg px-6"
                 />
              </div>

              <div className="flex gap-4 pt-4">
                 <Button 
                   variant="ghost" 
                   onClick={() => { setIsNewGroupModalOpen(false); setNewGroupName(''); }}
                   className="flex-1 h-16 rounded-2xl font-black uppercase text-xs text-muted-foreground hover:bg-muted"
                 >
                    Annuler
                 </Button>
                 <Button 
                   onClick={confirmCreateGroup}
                   className="btn-premium flex-1 h-16 rounded-2xl font-black uppercase text-xs"
                 >
                    Créer
                 </Button>
              </div>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
