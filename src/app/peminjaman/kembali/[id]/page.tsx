"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { returnPeminjaman } from "../../actions"

export default function ProsesPengembalianPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const loanId = params.id
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleReturn = async () => {
    setIsSubmitting(true)
    setErrorMsg("")
    try {
      const res = await returnPeminjaman(loanId)
      if (res.success) {
        setIsSuccess(true)
      } else {
        setErrorMsg(res.error || "Gagal memproses pengembalian.")
      }
    } catch (err: any) {
      setErrorMsg("Terjadi kesalahan sistem.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-lg font-sans">
        <Card className="border-green-200 bg-green-50 shadow-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-green-800">Pengembalian berhasil</h2>
            <p className="text-green-700 text-lg">Peminjaman telah diselesaikan dan arsip telah kembali ke ruang penyimpanan.</p>
            <div className="pt-4">
              <Link href="/peminjaman">
                <Button className="bg-green-600 hover:bg-green-700">
                  Kembali ke Daftar Peminjaman
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-lg font-sans">
      <div className="mb-6">
        <Link href="/peminjaman" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Batal & Kembali
        </Link>
      </div>

      <Card className="shadow-md">
        <CardHeader className="border-b bg-slate-50 pb-5">
          <CardTitle className="text-2xl font-bold text-slate-800">Proses Pengembalian</CardTitle>
          <CardDescription>
            Konfirmasi bahwa arsip warkah fisik telah dikembalikan ke ruang penyimpanan dan diterima dalam kondisi baik.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <p className="text-slate-700 mb-4">
            Apakah Anda yakin ingin menyelesaikan peminjaman ini? 
            Setelah diproses, status arsip akan kembali "Tersedia".
          </p>
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md mb-4 text-sm font-medium">
              {errorMsg}
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-slate-50 border-t py-4 flex justify-end gap-3">
          <Link href="/peminjaman">
            <Button variant="outline">
              Batal
            </Button>
          </Link>
          <Button 
            onClick={handleReturn} 
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Konfirmasi Pengembalian"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
