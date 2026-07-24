'use client'

import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Code, Share2, Users, ArrowRight, Sparkles, Activity, Globe } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import * as framerMotion from 'framer-motion'
const { motion } = framerMotion;

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-sans selection:bg-primary/30 text-foreground transition-colors duration-700">
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-40"></div>
      
      
      <div className="relative container mx-auto px-6 py-24 max-w-6xl">
        {/* Navigation / Header simple if needed */}
        <nav className="absolute top-10 left-10 right-10 flex justify-between items-center z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="text-3xl font-black tracking-tighter text-foreground italic uppercase">
            bio<span className="text-primary">link.</span><span className="text-muted-foreground/30 font-light ml-1 text-sm uppercase tracking-widest not-italic">pro</span>
          </div>
          <div className="flex items-center gap-8">
            <ThemeToggle />
            <Link href="/login" className="text-xs font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest italic">
               Se connecter
            </Link>
            <Link href="/register" className={buttonVariants({ variant: "outline", className: "rounded-2xl border-border bg-card/50 text-foreground hover:bg-muted font-black uppercase tracking-widest text-[10px] px-8 h-12 shadow-2xl transition-all active:scale-95" })}>
               Démarrer gratuitement
            </Link>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 items-center mt-12">
          
          {/* Left Column: Copy & Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-card border border-border text-[10px] font-black text-muted-foreground mb-10 uppercase tracking-[0.2em] shadow-xl italic group cursor-pointer hover:border-primary/30 transition-all">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span>Nouveauté : Analytics Géo-localisés</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black text-foreground mb-10 leading-[0.85] tracking-tighter italic uppercase">
              Un seul <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 underline decoration-primary/10 decoration-8 underline-offset-[20px]">
                Lien Pro.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-lg leading-relaxed italic font-medium opacity-60">
              Propulsez votre présence en ligne avec une page de profil ultra-rapide et professionnelle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Link href="/register" className={buttonVariants({ size: "lg", className: "h-20 px-12 text-lg rounded-[2rem] bg-foreground text-background hover:scale-[1.05] transition-all font-black uppercase tracking-widest shadow-2xl shadow-foreground/10" })}>
                  Commencer l'aventure
              </Link>
              <Link href="/demo" className={buttonVariants({ variant: "outline", size: "lg", className: "h-20 px-12 text-lg rounded-[2rem] bg-transparent border-border text-foreground hover:bg-muted transition-all group font-black uppercase tracking-widest" })}>
                  Voir la démo <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform text-primary" />
              </Link>
            </div>
            
            <div className="mt-16 flex items-center gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] italic opacity-50">
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-2xl border-4 border-background bg-muted flex items-center justify-center shadow-2xl">👨‍💻</div>
                <div className="w-12 h-12 rounded-2xl border-4 border-background bg-muted flex items-center justify-center shadow-2xl scale-110 z-10">👩‍🎨</div>
                <div className="w-12 h-12 rounded-2xl border-4 border-background bg-muted flex items-center justify-center shadow-2xl">🤳</div>
              </div>
              <p>Adopté par <span className="text-foreground font-black underline decoration-primary/30">100,000+</span> créateurs</p>
            </div>
          </motion.div>
          
          {/* Right Column: Premium Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }} 
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative lg:ml-auto w-full flex justify-center lg:justify-end"
          >
             {/* Floating cards around phone */}
             <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-16 -left-20 z-20 bg-card/80 p-6 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-border flex items-center gap-5 backdrop-blur-xl group hover:scale-105 transition-all"
              >
                <div className="p-4 bg-primary/20 text-primary rounded-2xl shadow-inner"><Activity className="w-7 h-7" /></div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic opacity-60">Visites</p>
                  <p className="text-2xl font-black text-foreground italic tracking-tighter">+12.4k</p>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 20, 0] }} 
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-32 -right-16 z-20 bg-card/80 p-6 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-border flex items-center gap-5 backdrop-blur-xl group hover:scale-105 transition-all"
              >
                <div className="p-4 bg-muted text-foreground rounded-2xl shadow-inner"><Globe className="w-7 h-7 text-primary" /></div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic opacity-60">Global</p>
                  <p className="text-2xl text-foreground font-black italic tracking-tighter uppercase">Pro Reach</p>
                </div>
              </motion.div>

            {/* The Phone */}
            <div className="relative w-[340px] h-[680px] bg-card rounded-[3.5rem] border-[12px] border-muted shadow-[0_64px_128px_-24px_rgba(0,0,0,0.6)] p-[2px] overflow-hidden rotate-2 transform-gpu ring-1 ring-border">
              {/* Screen Content */}
              <div className="relative w-full h-full bg-background rounded-[3rem] pt-16 px-8 overflow-hidden">
                {/* Dynamic Island */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-card rounded-full z-30 border border-border shadow-inner"></div>
                
                {/* User avatar & Name */}
                <div className="flex flex-col items-center mt-10 text-center">
                  <div className="w-28 h-28 bg-muted border border-border p-1 rounded-full shadow-2xl mb-8 items-center justify-center flex transition-transform hover:scale-105">
                     <div className="w-full h-full bg-card rounded-full flex items-center justify-center shadow-inner">
                        <Users className="w-12 h-12 text-primary opacity-40" />
                     </div>
                  </div>
                  <h3 className="text-3xl font-black text-foreground italic uppercase tracking-tighter underline decoration-primary/20 underline-offset-4">VOTRE NOM</h3>
                  <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] mt-3 opacity-40 italic">Professional Creator</p>
                </div>
                
                {/* Links mock */}
                <div className="mt-16 space-y-4 w-full">
                   {[
                     { text: "Portfolio", bg: "bg-muted border-border text-foreground" },
                     { text: "Latest Projects", bg: "bg-primary text-white border-primary shadow-[0_16px_32px_-8px_rgba(var(--primary),0.4)]" },
                     { text: "Newsletter", bg: "bg-muted border-border text-foreground" },
                     { text: "Contact Me", bg: "bg-muted border-border text-muted-foreground opacity-50" }
                   ].map((link, i) => (
                     <div 
                       key={i}
                       className={`w-full h-16 rounded-2xl border flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all hover:scale-102 ${link.bg}`}
                     >
                       <span>{link.text}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
            
            {/* Soft Shadow under phone */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-[30px] bg-slate-900/40 filter blur-xl rounded-full"></div>
          </motion.div>
        </div>
        
        {/* Trusted By Section (Redesigned) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-60 text-center pb-40"
        >
          <p className="text-[10px] font-black tracking-[0.4em] uppercase text-muted-foreground mb-12 italic opacity-40">Professional Grade Infrastructure</p>
          <div className="flex flex-wrap gap-16 justify-center items-center opacity-20 hover:opacity-60 transition-all duration-1000 grayscale hover:grayscale-0">
            <div className="flex items-center gap-4 text-2xl font-black italic uppercase tracking-tighter"><Code className="w-8 h-8 text-primary"/> dev.api</div>
            <div className="flex items-center gap-4 text-2xl font-black italic uppercase tracking-tighter"><Globe className="w-8 h-8 text-primary"/> geo.stats</div>
            <div className="flex items-center gap-4 text-2xl font-black italic uppercase tracking-tighter"><Share2 className="w-8 h-8 text-primary"/> automation</div>
            <div className="flex items-center gap-4 text-2xl font-black italic uppercase tracking-tighter"><Users className="w-8 h-8 text-primary"/> insights</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
