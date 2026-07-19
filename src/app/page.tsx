"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Archive } from "lucide-react"
import Link from "next/link"
import { SearchBox } from "@/components/SearchBox"
import { SearchResultList, SearchResult } from "@/components/SearchResultList"

// Expanded Mock data for scrolling
const MOCK_RESULTS: SearchResult[] = [
  { id: "1", nomorWarkah: "1234/2026", pemilik: "Budi Santoso", status: "Tersedia", ruang: "Ruang Yuridis Utama", lokasi: "Rak A1 • Baris 2 • Kolom 3 • Box 15", peminjam: "Belum pernah dipinjam" },
  { id: "2", nomorWarkah: "5678/2025", pemilik: "PT. Maju Bersama", status: "Dipinjam", ruang: "Ruang Fisik 2", lokasi: "Rak B3 • Baris 1 • Kolom 5 • Box 42", peminjam: "Siti Aminah", jatuhTempo: "2026-07-20", isTerlambat: true },
  { id: "3", nomorWarkah: "9012/2026", pemilik: "Agus Pratama", status: "Tersedia", ruang: "Ruang Fisik 1", lokasi: "Rak C2 • Baris 4 • Kolom 1 • Box 08", peminjam: "Belum pernah dipinjam" },
  { id: "4", nomorWarkah: "3456/2024", pemilik: "Sinta Maharani", status: "Tersedia", ruang: "Ruang Yuridis Utama", lokasi: "Rak A3 • Baris 1 • Kolom 2 • Box 22", peminjam: "Belum pernah dipinjam" },
  { id: "5", nomorWarkah: "7890/2026", pemilik: "Koperasi Sejahtera", status: "Dipinjam", ruang: "Ruang Fisik 1", lokasi: "Rak C1 • Baris 3 • Kolom 4 • Box 11", peminjam: "Budi", jatuhTempo: "2026-07-25", isTerlambat: false },
  { id: "6", nomorWarkah: "1122/2023", pemilik: "Rina Kusuma", status: "Tersedia", ruang: "Ruang Fisik 2", lokasi: "Rak B1 • Baris 2 • Kolom 2 • Box 30", peminjam: "Belum pernah dipinjam" },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState(MOCK_RESULTS)

  const handleSearch = (query: string) => {
    setIsSearching(true)
    setSearchQuery(query)
    
    // Simulate search delay
    setTimeout(() => {
      if (!query) {
        setResults(MOCK_RESULTS)
      } else {
        const filtered = MOCK_RESULTS.filter(r => 
          r.nomorWarkah.toLowerCase().includes(query.toLowerCase()) || 
          r.pemilik.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered)
      }
      setIsSearching(false)
    }, 500)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Tampilan Notifikasi Jumlah Pinjaman Terlambat */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full text-red-600">
                <Archive className="h-5 w-5" />
              </div>
              <div>
                <p className="text-red-800 font-semibold">Peringatan: 3 Pinjaman Terlambat!</p>
                <p className="text-sm text-red-600">Ada arsip yang sudah melampaui batas waktu peminjaman.</p>
              </div>
            </div>
            <Link href="/notifikasi">
              <Button variant="destructive" size="sm">
                Lihat Detail
              </Button>
            </Link>
          </div>

          <section className="text-center space-y-6 py-8 md:py-12">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Pencarian Arsip Cepat
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                Temukan lokasi fisik warkah atau dokumen pertanahan dengan cepat berdasarkan nomor warkah, nomor hak, atau nama pemilik.
              </p>
            </div>
            
            <div className="relative max-w-2xl mx-auto">
              <SearchBox onSearch={handleSearch} />
            </div>
          </section>

          <SearchResultList 
            results={results} 
            isSearching={isSearching} 
            searchQuery={searchQuery} 
          />

      </div>
    </main>
  )
}
