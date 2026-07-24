'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GripVertical, Trash2, ExternalLink } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase'
import { toast } from 'sonner'

export default function LinkCard({ link, onDelete }: { link: any, onDelete: () => void }) {
  const supabase = supabaseBrowser()

  const deleteLink = async () => {
    await supabase.from('links').delete().eq('id', link.id)
    toast.success('Lien supprimé')
    onDelete()
  }

  return (
    <Card className="p-6 shadow-xl hover:shadow-2xl transition-all group border-0 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <GripVertical className="h-5 w-5 text-slate-400 cursor-grab mt-1 flex-shrink-0 focus:outline-none" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-slate-900 mb-1">{link.title}</h3>
          <p className="text-sm text-slate-500 truncate">{link.url}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <span>🔥 {link.clicks} clics</span>
          </div>
        </div>
        <div className="flex gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-all">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={deleteLink} className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
