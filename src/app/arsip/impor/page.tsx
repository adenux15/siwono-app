"use client"

import { useState } from "react"
import { ArrowLeft, Upload, FileSpreadsheet, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { read, utils } from "xlsx"

export default function ImporArsipPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setError("")
      setSuccess("")
      setPreviewData([])
      
      const reader = new FileReader()
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result
          const wb = read(bstr, { type: 'binary' })
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          const data = utils.sheet_to_json(ws)
          setPreviewData(data.slice(0, 5)) // Preview top 5 rows
        } catch (err) {
          setError("Gagal membaca file Excel. Pastikan format file benar.")
        }
      }
      reader.readAsBinaryString(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Pilih file terlebih dahulu.")
      return
    }

    setIsProcessing(true)
    setError("")
    
    // Convert file to base64
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const base64 = (e.target?.result as string).split(',')[1]
        
        const res = await fetch('/api/arsip/impor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fileData: base64, fileName: file.name })
        })
        
        const json = await res.json()
        
        if (json.success) {
          setSuccess(`Berhasil mengimpor ${json.count} data arsip.`)
          setTimeout(() => {
            router.push('/arsip')
          }, 2000)
        } else {
          setError(json.error || "Gagal mengimpor data.")
        }
      } catch (err) {
        setError("Terjadi kesalahan jaringan.")
      } finally {
        setIsProcessing(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <main className="p-6 max-w-4xl mx-auto w-full font-sans">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/arsip" className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors bg-slate-100">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Impor Data Excel</h1>
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Unggah File KKP (Excel/CSV)</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-emerald-100 text-emerald-700 rounded-md border border-emerald-200 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <p className="text-sm">{success}</p>
          </div>
        )}

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-12 bg-slate-50">
          <FileSpreadsheet className="h-12 w-12 text-slate-400 mb-4" />
          <p className="text-slate-600 mb-2">Pilih file Excel (.xlsx, .xls, .csv)</p>
          <Input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            className="max-w-xs cursor-pointer"
            onChange={handleFileChange}
          />
        </div>
        
        {previewData.length > 0 && (
          <div className="mt-6 border rounded-lg overflow-hidden">
            <div className="bg-slate-100 p-3 text-sm font-medium border-b text-slate-700">
              Pratinjau 5 Baris Pertama
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                  <tr>
                    {Object.keys(previewData[0]).map(key => (
                      <th key={key} className="px-4 py-2">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="px-4 py-2 text-slate-600 truncate max-w-[150px]">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleUpload} 
            disabled={!file || isProcessing} 
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {isProcessing ? 'Memproses...' : 'Mulai Impor'}
          </Button>
        </div>
      </div>
    </main>
  )
}
