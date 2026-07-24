'use client'
import { motion } from 'framer-motion'
import { supabaseBrowser } from '@/lib/supabase'
import { MousePointer } from 'lucide-react'

export default function LinkButton({ link, profileId }: { link: any, profileId: string }) {
  const supabase = supabaseBrowser()

  const handleClick = async () => {
    // Note: ensure increment_clicks RPC is safely handling errors if it fails
    await supabase.rpc('increment_clicks', { link_id: link.id })
  }

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block w-full"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 hover:border-white shadow-xl hover:shadow-2xl rounded-3xl p-6 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg`} 
               style={{ backgroundColor: link.color || '#3B82F6' }}>
            {link.icon ? (
              <span>{link.icon}</span> 
            ) : (
               <MousePointer className="h-7 w-7 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{link.title}</h3>
            <p className="text-sm text-slate-500">{link.clicks || 0} clics</p>
          </div>
        </div>
      </div>
    </motion.a>
  )
}
