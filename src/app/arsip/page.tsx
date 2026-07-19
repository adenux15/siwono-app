import { Search, Filter, Plus, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
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
import { getArchiveList } from "./actions"

export const dynamic = "force-dynamic"

export default async function DaftarArsipPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : ""
  const status = typeof resolvedParams.status === 'string' && resolvedParams.status !== 'all' ? resolvedParams.status : undefined
  const sortBy = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : "createdAt"
  const sortOrder = typeof resolvedParams.order === 'string' ? resolvedParams.order : "desc"
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1
  const limit = 10

  const { data: archives, total, totalPages } = await getArchiveList({
    search: q,
    status,
    sortBy: sortBy as any,
    sortOrder: sortOrder as any,
    page,
    limit,
  })

  // Function helper to create new URL params for sorting/filtering (client-side approach replaced with traditional form/links)
  return (
    <main className="p-6 max-w-7xl mx-auto w-full font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Daftar Induk Arsip Warkah</h1>
      </div>
      
      {/* Search & Filter Form */}
      <form className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" action="/arsip" method="GET">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              name="q"
              defaultValue={q}
              placeholder="Cari nomor warkah, pemilik..." 
              className="pl-9 bg-white"
            />
            <input type="hidden" name="status" value={status || 'all'} />
            <input type="hidden" name="sort" value={sortBy} />
            <input type="hidden" name="order" value={sortOrder} />
          </div>
          <div className="flex gap-2 w-full sm:w-auto items-center">
            <Select name="status" defaultValue={status || 'all'}>
              <SelectTrigger className="w-[180px] bg-white">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Tersedia">Tersedia</SelectItem>
                <SelectItem value="Dipinjam">Dipinjam</SelectItem>
                <SelectItem value="Dimusnahkan">Dimusnahkan</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="secondary" className="bg-slate-200">Filter</Button>
            <Link href="/arsip/tambah">
              <Button type="button" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 ml-2">
                <Plus className="h-4 w-4" />
                Tambah Arsip
              </Button>
            </Link>
          </div>
      </form>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">ID Warkah</TableHead>
              <TableHead className="font-semibold text-slate-700">Jenis Dokumen</TableHead>
              <TableHead className="font-semibold text-slate-700">Pemilik</TableHead>
              <TableHead className="font-semibold text-slate-700">Lokasi Rak</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archives && archives.length > 0 ? archives.map((arsip: any) => (
              <TableRow key={arsip.id} className={`hover:bg-slate-50 transition-colors ${arsip.status === 'Dimusnahkan' ? 'opacity-50' : ''}`}>
                <TableCell className="font-medium text-blue-600 hover:underline">
                  <Link href={`/arsip/ubah/${arsip.id}`}>
                    {arsip.archiveNumber}
                  </Link>
                </TableCell>
                <TableCell className={arsip.status === 'Dimusnahkan' ? 'line-through' : ''}>{arsip.docType}</TableCell>
                <TableCell className={arsip.status === 'Dimusnahkan' ? 'line-through' : ''}>{arsip.ownerName || '-'}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-xs text-slate-600">
                    <span className="font-medium">{arsip.roomName || 'Ruang belum diset'}</span>
                    <span>Rak {arsip.rackCode || '-'}, Album {arsip.albumCode || '-'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    arsip.status === 'Tersedia' ? 'default' : 
                    arsip.status === 'Dipinjam' ? 'secondary' : 
                    arsip.status === 'Dimusnahkan' ? 'outline' : 'destructive'
                  } className={
                    arsip.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0' :
                    arsip.status === 'Dipinjam' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0' :
                    arsip.status === 'Dimusnahkan' ? 'bg-slate-200 text-slate-600 border-slate-300' :
                    'bg-red-100 text-red-700 hover:bg-red-100 border-0'
                  }>
                    {arsip.status}
                  </Badge>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                  Tidak ada arsip yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t bg-slate-50 text-sm text-slate-500 flex justify-between items-center">
          <span>Total {total || 0} arsip</span>
          <div className="flex gap-1">
            <Link href={`/arsip?q=${q}&status=${status||'all'}&page=${Math.max(1, page - 1)}`}>
              <Button variant="outline" size="sm" disabled={page <= 1}>Sebelumnya</Button>
            </Link>
            <span className="flex items-center px-2">Halaman {page} dari {totalPages || 1}</span>
            <Link href={`/arsip?q=${q}&status=${status||'all'}&page=${Math.min(totalPages || 1, page + 1)}`}>
              <Button variant="outline" size="sm" disabled={page >= (totalPages || 1)}>Selanjutnya</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
