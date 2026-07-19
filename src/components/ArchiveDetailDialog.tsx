"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, FileText, User, Building2, Package, Layers, Hash } from "lucide-react"
import { SearchResult } from "./SearchResultList"

interface ArchiveDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  archive: SearchResult | null
}

export function ArchiveDetailDialog({ isOpen, onClose, archive }: ArchiveDetailDialogProps) {
  if (!archive) return null

  const isAvailable = archive.status === "Tersedia"

  // Parse location for hierarchy display (assuming format "Rak X • Baris Y • Kolom Z • Box W")
  const locationParts = archive.lokasi.split("•").map(p => p.trim())
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 text-slate-800">
              <FileText className="h-6 w-6 text-blue-600" />
              Detail Warkah
            </DialogTitle>
            <Badge 
              variant={isAvailable ? "default" : "destructive"} 
              className={`text-sm px-3 py-1 ${isAvailable ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}`}
            >
              {archive.status}
            </Badge>
          </div>
          <DialogDescription>
            Informasi lengkap arsip dan posisi fisik penyimpanan.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Identitas Arsip */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 border-b pb-2">Identitas Arsip</h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Nomor Warkah</p>
                  <p className="text-base font-semibold text-slate-800">{archive.nomorWarkah}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Nama Pemilik</p>
                  <p className="text-base text-slate-800">{archive.pemilik}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Status Peminjaman</p>
                  <p className="text-base text-slate-800">{archive.peminjam}</p>
                  {archive.jatuhTempo && (
                    <p className={`text-sm mt-1 font-medium ${archive.isTerlambat ? 'text-red-600' : 'text-orange-600'}`}>
                      {archive.isTerlambat ? 'Terlambat sejak: ' : 'Jatuh tempo: '} {archive.jatuhTempo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hierarki Lokasi Fisik */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-slate-900 border-b pb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Hierarki Lokasi Fisik
            </h4>
            
            <div className="space-y-3 pl-2">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-700 p-1.5 rounded shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium leading-none mb-1">Ruang</p>
                  <p className="text-sm font-bold text-slate-800 leading-none">{archive.ruang}</p>
                </div>
              </div>
              
              {locationParts.map((part, idx) => {
                const isLast = idx === locationParts.length - 1;
                const icons = [<Layers key="1" className="h-3.5 w-3.5"/>, <Layers key="2" className="h-3.5 w-3.5"/>, <Layers key="3" className="h-3.5 w-3.5"/>, <Package key="4" className="h-4 w-4"/>]
                return (
                  <div key={idx} className="flex items-center gap-3 ml-3 relative before:absolute before:left-[-11px] before:top-[-12px] before:h-full before:w-px before:bg-slate-300 after:absolute after:left-[-11px] after:top-1/2 after:w-[11px] after:h-px after:bg-slate-300">
                    <div className={`p-1.5 rounded shrink-0 z-10 relative ${isLast ? 'bg-orange-100 text-orange-700' : 'bg-white border text-slate-600'}`}>
                      {icons[idx] || <Package className="h-3.5 w-3.5"/>}
                    </div>
                    <div>
                      <p className={`text-sm ${isLast ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{part}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <Separator />
        
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
          {isAvailable ? (
            <Link href={`/peminjaman?warkah=${archive.nomorWarkah}`}>
              <Button className="bg-blue-600 hover:bg-blue-700">Proses Peminjaman</Button>
            </Link>
          ) : (
            <Link href={`/riwayat/${archive.id}`}>
              <Button variant="secondary">Lacak Rantai Peminjaman</Button>
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
