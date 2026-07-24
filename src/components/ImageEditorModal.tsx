
'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { RotateCcw, RotateCw, ZoomIn, Sun, Contrast, Check, Palette, X } from 'lucide-react'
import getCroppedImg from '@/lib/image-utils'
import { cn } from '@/lib/utils'

interface ImageEditorModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string | null
  onSave: (croppedImage: string) => void
  aspectRatio?: number
  title?: string
}

export default function ImageEditorModal({ 
  isOpen, 
  onClose, 
  imageSrc, 
  onSave, 
  aspectRatio = 1,
  title = "Éditer l'image"
}: ImageEditorModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  
  const [filters, setFilters] = useState({
    contrast: 100,
    brightness: 100,
    saturate: 100
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setIsProcessing(true)
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        { horizontal: false, vertical: false },
        filters
      )
      if (croppedImage) {
        onSave(croppedImage)
        onClose()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!imageSrc) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[90vh] overflow-hidden rounded-[2.5rem] border-border/40 bg-card/80 backdrop-blur-3xl shadow-2xl p-0 flex flex-col">
        {/* Premium Header */}
        <div className="p-8 border-b border-border/40 flex items-center justify-between bg-card/50">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                 <Palette className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-xl font-black text-foreground italic uppercase tracking-tight">{title}</h2>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Creative Studio / Edition</p>
              </div>
           </div>
           <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
              <X className="w-5 h-5 text-muted-foreground" />
           </Button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           <div className="p-10 space-y-12">
              {/* Cropper Container */}
              <div className="relative w-full aspect-video sm:h-[450px] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-muted/50 group">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  style={{
                    containerStyle: {
                      filter: `contrast(${filters.contrast}%) brightness(${filters.brightness}%) saturate(${filters.saturate}%)`
                    }
                  }}
                />
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[9px] font-black text-white uppercase tracking-widest z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                   Mode Édition Actif
                </div>
              </div>

              {/* Controls Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {/* Left: Spatial Controls */}
                 <div className="bg-muted/30 rounded-[2.5rem] p-10 border border-border/40 space-y-10">
                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                             <ZoomIn className="w-4 h-4 text-primary" /> Zoom
                          </span>
                          <span className="text-xs font-black text-foreground px-3 py-1 bg-primary/10 rounded-lg">{Math.round(zoom * 100)}%</span>
                       </div>
                       <Slider 
                        value={[zoom]} 
                        min={1} 
                        max={3} 
                        step={0.1} 
                        onValueChange={(val) => setZoom(val[0])}
                        className="py-2"
                        // Custom styles to avoid "black circles"
                       />
                    </div>

                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                          <RotateCcw className="w-4 h-4 text-primary" /> Rotation
                       </span>
                       <div className="flex gap-4">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-2xl h-14 w-14 border-border/60 bg-card hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                            onClick={() => setRotation(r => r - 90)}
                          >
                             <RotateCcw className="w-5 h-5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-2xl h-14 w-14 border-border/60 bg-card hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                            onClick={() => setRotation(r => r + 90)}
                          >
                             <RotateCw className="w-5 h-5" />
                          </Button>
                       </div>
                    </div>
                 </div>

                 {/* Right: Filter Controls */}
                 <div className="bg-muted/30 rounded-[2.5rem] p-10 border border-border/40 space-y-10">
                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                             <Contrast className="w-4 h-4 text-violet-500" /> Contraste
                          </span>
                          <span className="text-xs font-black text-foreground">{filters.contrast}%</span>
                       </div>
                       <Slider 
                        value={[filters.contrast]} 
                        min={50} 
                        max={150} 
                        step={1} 
                        onValueChange={(val) => setFilters(f => ({...f, contrast: val[0]}))}
                        className="py-2"
                       />
                    </div>
                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                             <Sun className="w-4 h-4 text-yellow-500" /> Luminosité
                          </span>
                          <span className="text-xs font-black text-foreground">{filters.brightness}%</span>
                       </div>
                       <Slider 
                        value={[filters.brightness]} 
                        min={50} 
                        max={150} 
                        step={1} 
                        onValueChange={(val) => setFilters(f => ({...f, brightness: val[0]}))}
                        className="py-2"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Premium Footer */}
        <div className="p-8 border-t border-border/40 flex gap-4 bg-card/50">
           <Button 
             variant="ghost" 
             onClick={onClose} 
             className="h-16 flex-1 sm:flex-none px-10 rounded-2xl font-black uppercase text-xs text-muted-foreground hover:bg-muted"
           >
              Annuler
           </Button>
           <Button 
             onClick={handleSave} 
             disabled={isProcessing}
             className="btn-premium h-16 flex-1 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-4 transition-transform active:scale-95"
           >
              {isProcessing ? (
                "Traitement..."
              ) : (
                <>
                  <Check className="w-5 h-5" /> Enregistrer les modifications
                </>
              )}
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
