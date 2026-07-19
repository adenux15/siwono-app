import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Clock, FileText } from "lucide-react"
import { ArchiveDetailDialog } from "./ArchiveDetailDialog"

export type SearchResult = {
  id: string
  nomorWarkah: string
  pemilik: string
  status: string
  ruang: string
  lokasi: string
  peminjam: string
  jatuhTempo?: string
  isTerlambat?: boolean
}

interface SearchResultListProps {
  results: SearchResult[]
  isSearching: boolean
  searchQuery: string
}

export function SearchResultList({ results, isSearching, searchQuery }: SearchResultListProps) {
  const [selectedArchive, setSelectedArchive] = useState<SearchResult | null>(null)
  
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : "Hasil Pencarian (Mock)"}
        </h3>
        <Badge variant="outline" className="text-slate-500">
          {isSearching ? "Mencari..." : `${results.length} Ditemukan`}
        </Badge>
      </div>

      <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-white shadow-inner">
        {results.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Warkah No. {result.nomorWarkah}
                      </CardTitle>
                      <CardDescription>Pemilik: {result.pemilik}</CardDescription>
                    </div>
                    <Badge 
                      variant={result.status === "Tersedia" ? "default" : "destructive"} 
                      className={result.status === "Tersedia" ? "bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-800 font-medium" : "font-medium"}
                    >
                      {result.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{result.ruang}</p>
                      <p className="text-sm text-slate-500">{result.lokasi}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {result.status === "Tersedia" ? "Status Peminjaman" : "Sedang Dipinjam Oleh"}
                      </p>
                      <p className="text-sm text-slate-500">{result.peminjam}</p>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button 
                      variant={result.status === "Tersedia" ? "secondary" : "outline"}
                      size="sm" 
                      className={result.status === "Tersedia" ? "w-full sm:w-auto" : "w-full sm:w-auto text-slate-600"}
                      onClick={() => setSelectedArchive(result)}
                    >
                      {result.status === "Tersedia" ? "Lihat Detail & Pinjam" : "Lacak Posisi"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          !isSearching && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500 h-full">
              <FileText className="h-12 w-12 text-slate-300 mb-4" />
              <p>Tidak ada arsip yang cocok dengan pencarian Anda.</p>
            </div>
          )
        )}
      </ScrollArea>

      <ArchiveDetailDialog 
        isOpen={!!selectedArchive} 
        onClose={() => setSelectedArchive(null)} 
        archive={selectedArchive} 
      />
    </section>
  )
}
