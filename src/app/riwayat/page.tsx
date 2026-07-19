"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Archive, ArrowLeft, Calendar, Clock, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { NotificationCenter } from "@/components/NotificationCenter"

// Mock Data untuk Riwayat Peminjaman Saya (Budi Santoso)
const mockHistory = [
  {
    id: "1",
    nomorWarkah: "1234/2026",
    pemilik: "Siti Aminah",
    tanggalPinjam: "2026-07-15",
    batasWaktu: "2026-07-22",
    status: "Aktif",
    keterlambatan: 0,
  },
  {
    id: "2",
    nomorWarkah: "456/2025",
    pemilik: "Budi Raharjo",
    tanggalPinjam: "2026-07-01",
    batasWaktu: "2026-07-08",
    status: "Terlambat",
    keterlambatan: 10,
  },
  {
    id: "3",
    nomorWarkah: "7890/2024",
    pemilik: "Ahmad Fauzi",
    tanggalPinjam: "2026-06-10",
    batasWaktu: "2026-06-17",
    status: "Selesai",
    keterlambatan: 0,
  },
  {
    id: "4",
    nomorWarkah: "112/2026",
    pemilik: "Rina Kusuma",
    tanggalPinjam: "2026-05-20",
    batasWaktu: "2026-05-27",
    status: "Selesai",
    keterlambatan: 2,
  }
]

export default function RiwayatPage() {
  const aktif = mockHistory.filter(h => h.status !== "Selesai")
  const selesai = mockHistory.filter(h => h.status === "Selesai")

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Archive className="h-6 w-6 text-blue-600" />
            <h1 className="font-bold text-xl tracking-tight text-slate-800">SIWONO</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <div className="flex items-center gap-3 border-l pl-4 ml-2">
              <span className="text-sm font-medium text-slate-600">Budi Santoso</span>
              <div className="h-8 w-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">BS</div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Riwayat Peminjaman Saya</h2>
          <p className="text-slate-500 mt-2">Daftar arsip warkah yang sedang Anda pinjam dan yang sudah dikembalikan.</p>
        </div>

        <Tabs defaultValue="aktif" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
            <TabsTrigger value="aktif">Sedang Dipinjam ({aktif.length})</TabsTrigger>
            <TabsTrigger value="selesai">Selesai ({selesai.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="aktif" className="space-y-4">
            {aktif.length === 0 ? (
              <Card className="py-12 text-center border-dashed">
                <CardContent>
                  <p className="text-slate-500">Tidak ada arsip yang sedang dipinjam.</p>
                </CardContent>
              </Card>
            ) : (
              aktif.map((item) => (
                <Link href={`/riwayat/${item.id}`} key={item.id} className="block">
                  <Card className={`shadow-sm border-l-4 ${item.status === 'Terlambat' ? 'border-l-red-500' : 'border-l-blue-500'} hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-slate-500" />
                          Warkah No. {item.nomorWarkah}
                        </CardTitle>
                        <CardDescription>Pemilik: {item.pemilik}</CardDescription>
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
                        <p className="text-sm font-semibold text-slate-700">{item.tanggalPinjam}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Clock className="h-3 w-3"/> Batas Waktu</p>
                        <p className={`text-sm font-semibold ${item.status === 'Terlambat' ? 'text-red-600' : 'text-slate-700'}`}>{item.batasWaktu}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        {item.status === "Terlambat" && (
                          <div className="bg-red-50 text-red-700 p-2 rounded text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            Terlambat {item.keterlambatan} hari! Segera kembalikan.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end pt-2 border-t mt-4">
                      <Button variant="outline" size="sm" className="bg-white">
                        Ajukan Perpanjangan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="selesai" className="space-y-4">
            {selesai.length === 0 ? (
              <Card className="py-12 text-center border-dashed">
                <CardContent>
                  <p className="text-slate-500">Belum ada riwayat peminjaman yang selesai.</p>
                </CardContent>
              </Card>
            ) : (
              selesai.map((item) => (
                <Link href={`/riwayat/${item.id}`} key={item.id} className="block">
                <Card className="shadow-sm border-l-4 border-l-green-500 opacity-80 hover:opacity-100 transition-all hover:shadow-md cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-slate-400" />
                          Warkah No. {item.nomorWarkah}
                        </CardTitle>
                        <CardDescription>Pemilik: {item.pemilik}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Dikembalikan
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Dipinjam: {item.tanggalPinjam}</span>
                      </div>
                      {item.keterlambatan > 0 && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertCircle className="h-4 w-4" />
                          <span>Terlambat {item.keterlambatan} hari</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
