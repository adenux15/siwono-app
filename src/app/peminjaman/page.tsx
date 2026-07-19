"use client"

import { useState, Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Calendar, FileText, User } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createPeminjaman } from "./actions"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const result = await createPeminjaman(formData)
      if (result.success) {
        setIsSuccess(true)
      } else {
        alert(result.error || "Gagal mencatat peminjaman.")
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.")
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

export default function PeminjamanPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl font-sans">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors bg-slate-200/50 hover:bg-slate-200 px-3 py-1.5 rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Pencarian
          </Link>
        </div>

        <Suspense fallback={<div className="h-[400px] flex items-center justify-center text-slate-500">Memuat form...</div>}>
          <PeminjamanFormContent />
        </Suspense>
    </main>
  )
}
