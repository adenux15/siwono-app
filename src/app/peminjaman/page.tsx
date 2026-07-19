"use client"

import { useState, Suspense, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Calendar, FileText, User, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createPeminjaman, getRiwayatPeminjaman } from "./actions"

function PeminjamanFormContent() {
  const searchParams = useSearchParams()
  const warkahParam = searchParams.get('warkah') || ""

  const [formData, setFormData] = useState({
    nomorWarkah: warkahParam,
    namaPeminjam: "",
    tanggalPinjam: new Date().toISOString().split('T')[0],
    durasiHari: "7",
    catatan: ""
  })



  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg("")
    
    try {
      const result = await createPeminjaman(formData)
      if (result.success) {
        setIsSuccess(true)
      } else {
        setErrorMsg(result.error || "Gagal mencatat peminjaman.")
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSuccess) {
    return (
      <Card className="border-green-200 bg-green-50 shadow-md">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800">Peminjaman Berhasil Dicatat</h2>
          <p className="text-green-700 text-lg">Arsip Warkah No. <strong>{formData.nomorWarkah}</strong> telah dipinjam oleh <strong>{formData.namaPeminjam}</strong>.</p>
          <div className="pt-4">
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md border-t-4 border-t-blue-600">
      <CardHeader className="border-b bg-slate-50/50 pb-5">
        <CardTitle className="text-2xl font-bold text-slate-800">Form Peminjaman Arsip</CardTitle>
        <CardDescription className="text-sm">
          Isi form di bawah ini untuk mencatat peminjaman fisik warkah. Pastikan data peminjam valid.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6 pb-6">
          <div className="space-y-2">
            <Label htmlFor="nomorWarkah" className="text-slate-700 font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />
              Nomor Warkah
            </Label>
            <Input 
              id="nomorWarkah" 
              name="nomorWarkah"
              placeholder="Contoh: 1234/2026" 
              required 
              value={formData.nomorWarkah}
              onChange={handleChange}
              className="h-11 bg-slate-50"
              readOnly={!!warkahParam} // Make readonly if coming from detail view
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="namaPeminjam" className="text-slate-700 font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              Nama Peminjam
            </Label>
            <Input 
              id="namaPeminjam" 
              name="namaPeminjam"
              placeholder="Nama lengkap peminjam" 
              required 
              value={formData.namaPeminjam}
              onChange={handleChange}
              className="h-11 focus-visible:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="tanggalPinjam" className="text-slate-700 font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                Tanggal Pinjam
              </Label>
              <Input 
                id="tanggalPinjam" 
                name="tanggalPinjam"
                type="date"
                required 
                value={formData.tanggalPinjam}
                onChange={handleChange}
                className="h-11 focus-visible:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="durasiHari" className="text-slate-700 font-semibold">Durasi (Hari)</Label>
              <Input 
                id="durasiHari" 
                name="durasiHari"
                type="number" 
                min="1"
                required 
                value={formData.durasiHari}
                onChange={handleChange}
                className="h-11 focus-visible:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="catatan" className="text-slate-700 font-semibold">Keperluan / Catatan</Label>
            <Textarea 
              id="catatan" 
              name="catatan"
              placeholder="Keperluan peminjaman arsip ini..." 
              rows={3}
              value={formData.catatan}
              onChange={handleChange}
              className="resize-none focus-visible:ring-blue-600"
            />
          </div>
        </CardContent>
        {errorMsg && (
          <div className="px-6 pb-2 text-red-600 font-medium text-sm text-center">
            {errorMsg}
          </div>
        )}
        <CardFooter className="border-t bg-slate-50/50 py-5 flex justify-end gap-3 rounded-b-xl">
          <Link href="/">
            <Button type="button" variant="outline" className="border-slate-300">
              Batal
            </Button>
          </Link>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Peminjaman"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

function RiwayatListContent() {
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // don't hardcode usr_1, use empty to fetch own history via session
    getRiwayatPeminjaman().then((res) => {
      if (res.success && res.data) {
        setHistory(res.data)
      }
      setIsLoading(false)
    })
  }, [])

  const aktif = history.filter(h => h.status !== "Selesai")

  if (isLoading) return <div className="text-center p-8 text-slate-500">Memuat riwayat peminjaman...</div>

  if (aktif.length === 0) {
    return (
      <Card className="py-12 text-center border-dashed">
        <CardContent>
          <p className="text-slate-500">Tidak ada arsip yang sedang dipinjam.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {aktif.map((item) => (
        <Card key={item.id} className={`shadow-sm border-l-4 ${item.status === 'Terlambat' ? 'border-l-red-500' : 'border-l-blue-500'}`}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-500" />
                  Warkah No. {item.archiveNumber}
                </CardTitle>
                <CardDescription>Peminjam: {item.borrowerName}</CardDescription>
              </div>
              <Badge 
                variant={item.status === "Terlambat" ? "destructive" : "default"} 
                className={item.status === "Terlambat" ? "" : "bg-blue-100 text-blue-700 hover:bg-blue-100"}
              >
                {item.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Calendar className="h-3 w-3"/> Tanggal Pinjam</p>
                <p className="text-sm font-semibold text-slate-700">{new Date(item.borrowDate).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Clock className="h-3 w-3"/> Batas Waktu</p>
                <p className={`text-sm font-semibold ${item.status === 'Terlambat' ? 'text-red-600' : 'text-slate-700'}`}>{new Date(item.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t mt-4 gap-2">
              <Link href={`/peminjaman/alih/${item.id}`}>
                <Button variant="outline" size="sm" className="bg-white">
                  Alih Peminjaman
                </Button>
              </Link>
              <Link href={`/peminjaman/kembali/${item.id}`}>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  Proses Pengembalian
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function PeminjamanPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl font-sans">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors bg-slate-200/50 hover:bg-slate-200 px-3 py-1.5 rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="grid md:grid-cols-[1fr_400px] gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Riwayat Peminjaman Aktif</h2>
            <RiwayatListContent />
          </div>

          <div>
            <Suspense fallback={<div className="h-[400px] flex items-center justify-center text-slate-500">Memuat form...</div>}>
              <PeminjamanFormContent />
            </Suspense>
          </div>
        </div>
    </main>
  )
}
