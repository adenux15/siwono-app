"use client"

import { useState, useEffect, use } from "react"
import { ArrowLeft, Save, X, Loader2, ArrowRightLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { transferPeminjaman, getLoanDetail } from "../../actions"

export default function AlihPeminjamanPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id
  
  const [loan, setLoan] = useState<any>(null)
  const [newBorrowerName, setNewBorrowerName] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getLoanDetail(id).then(res => {
      if (res.success && res.data) {
        setLoan(res.data.loan)
      } else {
        setError("Peminjaman tidak ditemukan.")
      }
      setIsLoading(false)
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    
    try {
      const res = await transferPeminjaman({
        loanId: id,
        newBorrowerName,
        notes,
      })

      if (res.success) {
        router.push(`/riwayat/${id}?success=transferred`)
      } else {
        setError(res.error || "Gagal mengalihkan peminjaman.")
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="p-10 text-center text-slate-500">Memuat data...</div>
  }

  if (!loan) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/riwayat"><Button>Kembali ke Riwayat</Button></Link>
      </div>
    )
  }

  return (
    <main className="p-6 max-w-4xl mx-auto w-full font-sans">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/riwayat/${id}`} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors bg-slate-100">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Alih Peminjaman (Chain of Custody)</h1>
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-amber-50/50">
          <h2 className="text-lg font-semibold text-amber-800 flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Pengalihan Tanggung Jawab Arsip
          </h2>
          <p className="text-sm text-amber-700/80 mt-1">Gunakan formulir ini jika arsip dipindahtangankan ke pihak lain sebelum dikembalikan ke ruang arsip.</p>
        </div>
        
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md border border-red-200 text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border">
            <div>
              <p className="text-sm text-slate-500">Nomor Warkah</p>
              <p className="font-semibold text-slate-800">{loan.archiveNumber}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Peminjam Saat Ini</p>
              <p className="font-semibold text-slate-800">{loan.borrowerName}</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="newBorrower" className="text-slate-700">Nama Penerima / Peminjam Baru <span className="text-red-500">*</span></Label>
              <Input 
                id="newBorrower" 
                value={newBorrowerName} 
                onChange={(e) => setNewBorrowerName(e.target.value)} 
                required 
                placeholder="Nama pihak yang menerima arsip" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-700">Catatan / Alasan Pengalihan</Label>
              <textarea 
                id="notes" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                placeholder="Tambahkan catatan khusus mengapa arsip dialihkan..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Link href={`/riwayat/${id}`}>
              <Button variant="outline" type="button" className="gap-2" disabled={isSubmitting}>
                <X className="h-4 w-4" />
                Batal
              </Button>
            </Link>
            <Button type="submit" className="gap-2 bg-amber-600 hover:bg-amber-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRightLeft className="h-4 w-4" />}
              {isSubmitting ? 'Menyimpan...' : 'Alihkan Peminjaman'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
