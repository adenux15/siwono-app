"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Archive, ArrowLeft, Calendar, Clock, FileText, User, AlertCircle, Building2, Layers, Package, MapPin } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { returnPeminjaman } from "@/app/peminjaman/actions"

// Mock Data
type LoanHistory = {
  tanggal: string;
  petugas: string;
  aksi: string;
}

type LoanDetail = {
  id: string;
  nomorWarkah: string;
  pemilik: string;
  tanggalPinjam: string;
  batasWaktu: string;
  status: string;
  keterlambatan: number;
  catatan: string;
  lokasiAwal: {
    ruang: string;
    detail: string[];
  };
  histori: LoanHistory[];
}

const mockLoanDetails: Record<string, LoanDetail> = {
  "1": {
    id: "1",
    nomorWarkah: "1234/2026",
    pemilik: "Siti Aminah",
    tanggalPinjam: "2026-07-15",
    batasWaktu: "2026-07-22",
    status: "Aktif",
    keterlambatan: 0,
    catatan: "Untuk keperluan verifikasi lapangan.",
    lokasiAwal: {
      ruang: "Ruang Arsip Utama",
      detail: ["Rak A1", "Baris 2", "Kolom 4", "Box 12"]
    },
    histori: [
      { tanggal: "2026-07-15 08:30", petugas: "Budi Santoso", aksi: "Dipinjam" },
      { tanggal: "2026-07-15 08:00", petugas: "Sistem", aksi: "Request Peminjaman" }
    ]
  },
  "2": {
    id: "2",
    nomorWarkah: "456/2025",
    pemilik: "Budi Raharjo",
    tanggalPinjam: "2026-07-01",
    batasWaktu: "2026-07-08",
    status: "Terlambat",
    keterlambatan: 10,
    catatan: "Pengecekan sertifikat ganda.",
    lokasiAwal: {
      ruang: "Ruang Arsip Sementara",
      detail: ["Rak B2", "Baris 1", "Kolom 1", "Box 5"]
    },
    histori: [
      { tanggal: "2026-07-09 00:00", petugas: "Sistem", aksi: "Ditandai Terlambat" },
      { tanggal: "2026-07-01 10:15", petugas: "Budi Santoso", aksi: "Dipinjam" }
    ]
  }
}

export default function DetailPinjamanPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const data = mockLoanDetails[id] || mockLoanDetails["1"]

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleReturn = async () => {
    setIsLoading(true)
    setError(null)
    const result = await returnPeminjaman(id)
    setIsLoading(false)
    
    if (result.success) {
      alert("Pengembalian berhasil diproses.")
      router.refresh() // Or redirect
    } else {
      setError(result.error || "Terjadi kesalahan")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Archive className="h-6 w-6 text-blue-600" />
            <h1 className="font-bold text-xl tracking-tight text-slate-800">SIWONO</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">Budi Santoso</span>
            <div className="h-8 w-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">BS</div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/riwayat" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Riwayat
          </Link>
          <Badge 
            variant={data.status === "Terlambat" ? "destructive" : "default"} 
            className={`text-sm px-4 py-1.5 ${data.status === "Terlambat" ? "" : "bg-blue-100 text-blue-700 hover:bg-blue-100"}`}
          >
            Status: {data.status}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Kolom Kiri: Detail Utama */}
          <div className="md:col-span-2 space-y-6">
            <Card className={`shadow-sm border-t-4 ${data.status === 'Terlambat' ? 'border-t-red-500' : 'border-t-blue-500'}`}>
              <CardHeader className="pb-4 border-b bg-slate-50/50">
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Detail Pinjaman: Warkah No. {data.nomorWarkah}
                </CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Pemilik: <span className="font-semibold text-slate-800">{data.pemilik}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                {data.status === "Terlambat" && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Peringatan Keterlambatan</h4>
                      <p className="text-sm mt-1">Peminjaman ini telah melampaui batas waktu selama <strong>{data.keterlambatan} hari</strong>. Harap segera kembalikan ke ruang arsip.</p>
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2"><Calendar className="h-4 w-4"/> Tanggal Pinjam</p>
                    <p className="text-lg font-semibold text-slate-800">{data.tanggalPinjam}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2"><Clock className="h-4 w-4"/> Batas Waktu</p>
                    <p className={`text-lg font-semibold ${data.status === 'Terlambat' ? 'text-red-600' : 'text-slate-800'}`}>{data.batasWaktu}</p>
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <p className="text-sm font-medium text-slate-500">Catatan Peminjaman</p>
                    <p className="text-base text-slate-700 bg-slate-50 p-3 rounded border">{data.catatan}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-3 items-center">
                  {error && <span className="text-red-500 text-sm">{error}</span>}
                  <Link href={`/peminjaman/alih/${id}`}>
                    <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50" disabled={isLoading || data.status === "Selesai"}>
                      Alih Peminjaman
                    </Button>
                  </Link>
                  <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" disabled={isLoading}>Ajukan Perpanjangan</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleReturn} disabled={isLoading || data.status === "Selesai"}>
                    {isLoading ? "Memproses..." : "Proses Pengembalian"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">Riwayat Aktivitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent pl-10 md:pl-0">
                  {data.histori.map((h: LoanHistory, idx: number) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-slate-100 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm absolute left-[-42px] md:static">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] bg-white p-4 rounded-md shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-slate-800">{h.aksi}</p>
                          <span className="text-xs text-slate-500">{h.tanggal.split(" ")[1]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <User className="h-3 w-3" /> {h.petugas} • {h.tanggal.split(" ")[0]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Lokasi Fisik */}
          <div className="space-y-6">
            <Card className="shadow-sm bg-slate-50 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Lokasi Awal Fisik
                </CardTitle>
                <CardDescription>Lokasi arsip sebelum dipinjam.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm border">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Gedung / Ruang</p>
                      <p className="text-sm font-bold text-slate-800">{data.lokasiAwal.ruang}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pl-4 relative before:absolute before:left-[-1px] before:top-[-10px] before:h-full before:w-px before:bg-slate-300">
                    {data.lokasiAwal.detail.map((part: string, idx: number) => {
                      const icons = [<Layers key="1" className="h-3.5 w-3.5"/>, <Layers key="2" className="h-3.5 w-3.5"/>, <Layers key="3" className="h-3.5 w-3.5"/>, <Package key="4" className="h-4 w-4"/>]
                      return (
                        <div key={idx} className="flex items-center gap-3 relative before:absolute before:left-[-17px] before:top-1/2 before:w-[17px] before:h-px before:bg-slate-300">
                          <div className="p-1.5 rounded shrink-0 z-10 relative bg-white border text-slate-600 shadow-sm">
                            {icons[idx] || <Package className="h-3.5 w-3.5"/>}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">{part}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
