"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getRooms, getRacks, getAlbums, createArchive } from "../actions"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TambahArsipPage() {
  const router = useRouter()
  
  // Data for selects
  const [rooms, setRooms] = useState<any[]>([])
  const [racks, setRacks] = useState<any[]>([])
  const [albums, setAlbums] = useState<any[]>([])
  
  // Form state
  const [archiveNumber, setArchiveNumber] = useState("")
  const [docType, setDocType] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [regionCode, setRegionCode] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [selectedRack, setSelectedRack] = useState<string>("")
  const [selectedAlbum, setSelectedAlbum] = useState<string>("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    getRooms().then(res => {
      if (res.success && res.data) setRooms(res.data)
    })
  }, [])

  const handleRoomChange = (value: string | null) => {
    if (!value) return
    setSelectedRoom(value)
    setSelectedRack("")
    setSelectedAlbum("")
    setRacks([])
    setAlbums([])
    
    getRacks(value).then(res => {
      if (res.success && res.data) setRacks(res.data)
    })
  }

  const handleRackChange = (value: string | null) => {
    if (!value) return
    setSelectedRack(value)
    setSelectedAlbum("")
    setAlbums([])
    
    getAlbums(value).then(res => {
      if (res.success && res.data) setAlbums(res.data)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    
    try {
      if (!selectedAlbum) {
        setError("Pilih album/box penyimpanan.")
        setIsSubmitting(false)
        return
      }

      const res = await createArchive({
        archiveNumber,
        docType,
        ownerName,
        regionCode,
        albumId: selectedAlbum
      })

      if (res.success) {
        router.push('/arsip?success=true')
      } else {
        setError(res.error || "Gagal menyimpan arsip.")
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="p-6 max-w-4xl mx-auto w-full font-sans">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/arsip" className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors bg-slate-100">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Tambah Arsip Warkah Baru</h1>
      </div>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-800">Informasi Arsip Warkah</h2>
            <p className="text-sm text-slate-500 mt-1">Masukkan detail informasi warkah yang akan disimpan ke dalam sistem.</p>
          </div>
          
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md border border-red-200 text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="archiveNumber" className="text-slate-700">Nomor Warkah <span className="text-red-500">*</span></Label>
                <Input id="archiveNumber" value={archiveNumber} onChange={(e) => setArchiveNumber(e.target.value)} required placeholder="Contoh: W-2023-0100" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="docType" className="text-slate-700">Jenis Arsip (BT/SU/Warkah/GU/PBT) <span className="text-red-500">*</span></Label>
                <Select value={docType} onValueChange={(val) => val && setDocType(val)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BT">Buku Tanah (BT)</SelectItem>
                    <SelectItem value="SU">Surat Ukur (SU)</SelectItem>
                    <SelectItem value="Warkah">Warkah (DI208)</SelectItem>
                    <SelectItem value="GU">Gambar Ukur (GU)</SelectItem>
                    <SelectItem value="PBT">Peta Bidang Tanah (PBT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ownerName" className="text-slate-700">Nama Pemilik <span className="text-red-500">*</span></Label>
                <Input id="ownerName" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required placeholder="Nama sesuai dokumen" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="regionCode" className="text-slate-700">Kode Wilayah (Desa/Kec)</Label>
                <Input id="regionCode" value={regionCode} onChange={(e) => setRegionCode(e.target.value)} placeholder="Contoh: 35.24.01" />
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-md font-semibold text-slate-800 mb-4">Lokasi Penyimpanan Fisik</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700">Ruangan</Label>
                  <Select value={selectedRoom} onValueChange={handleRoomChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Ruangan" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700">Nomor Rak</Label>
                  <Select value={selectedRack} onValueChange={handleRackChange} disabled={!selectedRoom} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Rak" />
                    </SelectTrigger>
                    <SelectContent>
                      {racks.map((rack) => (
                        <SelectItem key={rack.id} value={rack.id}>{rack.code}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700">Album / Box</Label>
                  <Select value={selectedAlbum} onValueChange={(val) => val && setSelectedAlbum(val)} disabled={!selectedRack} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Album" />
                    </SelectTrigger>
                    <SelectContent>
                      {albums.map((album) => (
                        <SelectItem key={album.id} value={album.id}>{album.code} (Baris {album.rowPos}, Kol {album.colPos}) - {album.capacity - album.currentFill} slot sisa</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                {isSubmitting ? 'Menyimpan...' : 'Simpan Arsip'}
              </Button>
            </div>
          </form>
        </div>
    </main>
  )
}
