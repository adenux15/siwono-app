"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getRackList } from "./actions"

export default function DaftarRakPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ruanganFilter, setRuanganFilter] = useState("all")
  
  const [racks, setRacks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getRackList({ limit: 100 }).then((res) => {
      if (res.success && res.data) {
        setRacks(res.data)
      }
      setIsLoading(false)
    }).catch(err => {
      console.error(err)
      setIsLoading(false)
    })
  }, [])

  const filteredData = racks.filter(rak => {
    const q = searchQuery.toLowerCase()
    const matchSearch = rak.code.toLowerCase().includes(q) ||
           (rak.roomName || '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || rak.status === statusFilter
    const matchRuangan = ruanganFilter === 'all' || rak.roomName === ruanganFilter
    
    return matchSearch && matchStatus && matchRuangan
  })

  return (
    <main className="p-6 max-w-7xl mx-auto w-full font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Rak</h1>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Cari kode rak atau ruangan..." 
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto items-center">
            <Select value={ruanganFilter} onValueChange={(val) => val && setRuanganFilter(val)}>
              <SelectTrigger className="w-[180px] bg-white">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Ruangan" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Ruangan</SelectItem>
                <SelectItem value="Yuridis Utama">Yuridis Utama</SelectItem>
                <SelectItem value="Fisik 1">Fisik 1</SelectItem>
                <SelectItem value="Fisik 2">Fisik 2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
              <SelectTrigger className="w-[180px] bg-white">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Tersedia">Tersedia</SelectItem>
                <SelectItem value="Hampir Penuh">Hampir Penuh</SelectItem>
                <SelectItem value="Penuh">Penuh</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/rak/tambah">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Tambah Rak
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">ID / Kode</TableHead>
                  <TableHead className="font-semibold text-slate-700">Ruangan</TableHead>
                  <TableHead className="font-semibold text-slate-700">Kapasitas</TableHead>
                  <TableHead className="font-semibold text-slate-700">Keterisian</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((rak) => {
                  const percent = Math.round((rak.terisi/rak.kapasitas)*100)
                  return (
                  <TableRow key={rak.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium text-blue-600 hover:underline">
                      <Link href={`/rak/${rak.id}`}>
                        {rak.code}
                      </Link>
                    </TableCell>
                    <TableCell>{rak.roomName}</TableCell>
                    <TableCell>{rak.kapasitas} Slot</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{rak.terisi}</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              percent > 90 ? 'bg-red-500' :
                              percent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        rak.status === 'Tersedia' ? 'default' : 
                        rak.status === 'Hampir Penuh' ? 'secondary' : 'destructive'
                      } className={
                        rak.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                        rak.status === 'Hampir Penuh' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                        'bg-red-100 text-red-700 hover:bg-red-100'
                      }>
                        {rak.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )})}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-8 text-slate-500">
                      Tidak ada data rak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
    </main>
  )
}
