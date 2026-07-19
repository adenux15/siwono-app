"use client"

import { useState } from "react"
import { ArrowLeft, Save, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TambahRakPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    kodeRak: "",
    namaRak: "",
    ruangan: "",
    kapasitas: "",
    keterangan: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/rak?success=true')
    }, 1500)
  }

  return (
    <main className="p-6 max-w-3xl mx-auto w-full font-sans">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/rak" className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors bg-slate-100">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Tambah Rak Baru</h1>
      </div>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-800">Informasi Rak Penyimpanan</h2>
            <p className="text-sm text-slate-500 mt-1">Masukkan detail informasi rak baru untuk menyimpan warkah.</p>
          </div>
          
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="kode-rak" className="text-slate-700">Kode Rak <span className="text-red-500">*</span></Label>
                <Input 
                  id="kode-rak" 
                  placeholder="Contoh: RK-006"
                  value={formData.kodeRak}
                  onChange={(e) => setFormData({...formData, kodeRak: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nama-rak" className="text-slate-700">Nama Rak <span className="text-red-500">*</span></Label>
                <Input 
                  id="nama-rak" 
                  placeholder="Contoh: Rak C3"
                  value={formData.namaRak}
                  onChange={(e) => setFormData({...formData, namaRak: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700">Ruangan <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.ruangan} 
                  onValueChange={(val) => val && setFormData({...formData, ruangan: val})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Ruangan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yuridis Utama">Yuridis Utama</SelectItem>
                    <SelectItem value="Fisik 1">Fisik 1</SelectItem>
                    <SelectItem value="Fisik 2">Fisik 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kapasitas" className="text-slate-700">Kapasitas (Jumlah Album) <span className="text-red-500">*</span></Label>
                <Input 
                  id="kapasitas" 
                  type="number"
                  placeholder="Contoh: 300"
                  value={formData.kapasitas}
                  onChange={(e) => setFormData({...formData, kapasitas: e.target.value})}
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="keterangan" className="text-slate-700">Keterangan Tambahan</Label>
                <textarea 
                  id="keterangan" 
                  value={formData.keterangan}
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                  className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tambahkan catatan khusus tentang rak ini jika ada..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Link href="/rak">
                <Button variant="outline" type="button" className="gap-2" disabled={isSubmitting}>
                  <X className="h-4 w-4" />
                  Batal
                </Button>
              </Link>
              <Button type="submit" className="gap-2 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSubmitting ? 'Menyimpan...' : 'Simpan Rak'}
              </Button>
            </div>
          </form>
        </div>
    </main>
  )
}
