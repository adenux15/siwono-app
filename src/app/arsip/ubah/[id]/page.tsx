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
import { use } from "react"

const MOCK_LOKASI = {
  yuridis: {
    name: "Yuridis Utama",
    rak: {
      a1: { name: "Rak A1", baris: ["Baris 1", "Baris 2", "Baris 3", "Baris 4", "Baris 5"] },
      a2: { name: "Rak A2", baris: ["Baris 1", "Baris 2", "Baris 3"] },
      b1: { name: "Rak B1", baris: ["Baris 1", "Baris 2", "Baris 3", "Baris 4"] },
    }
  },
  fisik1: {
    name: "Fisik 1",
    rak: {
      c1: { name: "Rak C1", baris: ["Baris 1", "Baris 2", "Baris 3"] },
      c2: { name: "Rak C2", baris: ["Baris 1", "Baris 2"] },
    }
  }
}

export default function UbahArsipPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [ruangan, setRuangan] = useState<string>("yuridis")
  const [rak, setRak] = useState<string>("a1")
  const [baris, setBaris] = useState<string>("Baris 2")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dummy prefilled data based on ID
  const [formData, setFormData] = useState({
    idWarkah: id,
    dokumen: "SHM 1234/Lamongan",
    pemilik: "Budi Santoso",
    tanggal: "2023-01-15",
    keterangan: "Dokumen dalam kondisi baik."
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/arsip?success=updated')
    }, 1500)
  }

  const handleRuanganChange = (value: string) => {
    setRuangan(value)
    setRak("")
    setBaris("")
  }

  const handleRakChange = (value: string) => {
    setRak(value)
    setBaris("")
  }

  type RakData = Record<string, { name: string, baris: string[] }>
  const currentRakData: RakData = ruangan ? MOCK_LOKASI[ruangan as keyof typeof MOCK_LOKASI].rak : {}
  const currentBarisData = rak && currentRakData[rak] ? currentRakData[rak].baris : []

  return (
    <main className="p-6 max-w-4xl mx-auto w-full font-sans">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/arsip" className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors bg-slate-100">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Ubah Data Arsip</h1>
      </div>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Informasi Arsip Warkah</h2>
              <p className="text-sm text-slate-500 mt-1">Perbarui detail informasi warkah yang tersimpan dalam sistem.</p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium border border-blue-100">
              ID: {id}
            </div>
          </div>
          
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="id-warkah" className="text-slate-700">Nomor Warkah <span className="text-red-500">*</span></Label>
                <Input id="id-warkah" value={formData.idWarkah} onChange={(e) => setFormData({...formData, idWarkah: e.target.value})} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dokumen" className="text-slate-700">Nomor Hak / Dokumen <span className="text-red-500">*</span></Label>
                <Input id="dokumen" value={formData.dokumen} onChange={(e) => setFormData({...formData, dokumen: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pemilik" className="text-slate-700">Nama Pemilik <span className="text-red-500">*</span></Label>
                <Input id="pemilik" value={formData.pemilik} onChange={(e) => setFormData({...formData, pemilik: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tanggal" className="text-slate-700">Tanggal Masuk <span className="text-red-500">*</span></Label>
                <Input id="tanggal" type="date" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} />
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-md font-semibold text-slate-800 mb-4">Lokasi Penyimpanan Fisik</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700">Ruangan</Label>
                  <Select value={ruangan} onValueChange={(val) => val && handleRuanganChange(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Ruangan" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MOCK_LOKASI).map(([key, val]) => (
                        <SelectItem key={key} value={key}>{val.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700">Nomor Rak</Label>
                  <Select value={rak} onValueChange={(val) => val && handleRakChange(val)} disabled={!ruangan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Rak" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(currentRakData).map(([key, val]) => (
                        <SelectItem key={key} value={key}>{val.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700">Baris / Tingkat</Label>
                  <Select value={baris} onValueChange={(val) => val && setBaris(val)} disabled={!rak}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Baris" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentBarisData.map((b: string) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                  placeholder="Tambahkan catatan khusus jika ada..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Link href="/arsip">
                <Button variant="outline" type="button" className="gap-2" disabled={isSubmitting}>
                  <X className="h-4 w-4" />
                  Batal
                </Button>
              </Link>
              <Button type="submit" className="gap-2 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </div>
    </main>
  )
}
