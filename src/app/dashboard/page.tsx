"use client"

import { useState, useEffect } from "react"
import { Clock, LayoutDashboard, Archive, FileStack, Users } from "lucide-react"
import { getDashboardData } from "./actions"

type ShelfData = {
  id: string;
  name: string;
  fill: number;
  capacity: number;
};

type DashboardData = {
  summary: {
    totalArchives: number;
    availableArchives: number;
    currentlyBorrowed: number;
    addedThisMonth: number;
    lateReturns: number;
    availabilityPercentage: number;
  };
  shelves: {
    yuridis: ShelfData[];
    fisik1: ShelfData[];
  };
};

// Define default empty data structure to prevent UI flash or errors during initial load
const emptyData: DashboardData = {
  summary: {
    totalArchives: 0,
    availableArchives: 0,
    currentlyBorrowed: 0,
    addedThisMonth: 0,
    lateReturns: 0,
    availabilityPercentage: 0,
  },
  shelves: {
    yuridis: [],
    fisik1: [],
  }
};

export default function DashboardPage() {
  const [time, setTime] = useState<Date | null>(null)
  const [data, setData] = useState(emptyData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    
    // Initial set wrapped in setTimeout to avoid synchronous setState warning
    setTimeout(() => setTime(new Date()), 0)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Initial fetch
    getDashboardData().then((result) => {
      setData(result);
      setLoading(false);
    }).catch(console.error);

    // Auto-refresh polling
    const pollInterval = setInterval(() => {
      getDashboardData().then(setData).catch(console.error);
    }, 5000) // Poll every 5 seconds for dashboard

    return () => clearInterval(pollInterval)
  }, [])

  if (loading) {
    return (
      <div className="bg-slate-900 text-white font-sans flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-slate-400">Memuat data dashboard...</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 text-white font-sans flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Dashboard Header */}
      <div className="bg-slate-950 border-b border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between shadow-lg gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl shadow-blue-900/50 shadow-lg">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dasbor Monitor</h1>
            <p className="text-slate-400 text-lg hidden sm:block">Pemantauan Ruang Arsip Real-time</p>
          </div>
        </div>
        
        {time && (
          <div className="flex items-center gap-4 bg-slate-900 px-6 py-3 rounded-2xl border border-slate-700 shadow-inner">
            <Clock className="h-8 w-8 text-blue-400" />
            <div className="text-right">
              <div className="text-3xl font-bold font-mono tracking-wider">
                {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-sm text-slate-400 font-medium uppercase tracking-widest">
                {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area - Grid Layout for TV */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* Ringkasan Status Arsip */}
        <div className="col-span-12 grid grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-slate-700 opacity-20">
              <Archive className="h-32 w-32" />
            </div>
            <p className="text-slate-400 font-medium text-lg uppercase tracking-wider mb-2">Total Arsip Warkah</p>
            <p className="text-5xl font-extrabold text-white">{data.summary.totalArchives.toLocaleString()}</p>
            <p className="text-emerald-400 text-sm mt-3 font-medium">+{data.summary.addedThisMonth} bulan ini</p>
          </div>
          
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-slate-700 opacity-20">
              <FileStack className="h-32 w-32" />
            </div>
            <p className="text-slate-400 font-medium text-lg uppercase tracking-wider mb-2">Arsip Tersedia</p>
            <p className="text-5xl font-extrabold text-blue-400">{data.summary.availableArchives.toLocaleString()}</p>
            <p className="text-slate-500 text-sm mt-3 font-medium">{data.summary.availabilityPercentage}% dari total arsip</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-slate-700 opacity-20">
              <Users className="h-32 w-32" />
            </div>
            <p className="text-slate-400 font-medium text-lg uppercase tracking-wider mb-2">Sedang Dipinjam</p>
            <p className="text-5xl font-extrabold text-amber-400">{data.summary.currentlyBorrowed}</p>
            <p className="text-red-400 text-sm mt-3 font-medium">{data.summary.lateReturns} pinjaman terlambat!</p>
          </div>
        </div>

        {/* Peta Keterisian Rak */}
        <div className="col-span-12 grid grid-cols-2 gap-6 mt-2">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileStack className="h-5 w-5 text-blue-400" />
                Peta Keterisian: Ruang Yuridis Utama
              </h3>
              <div className="flex gap-4 text-sm font-medium">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-500"></div>Tersedia</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-amber-500"></div>Hampir Penuh</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-500"></div>Penuh</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 flex-1">
              {data.shelves.yuridis.map((shelf) => {
                const color = shelf.fill > 90 ? 'bg-red-500' : shelf.fill > 70 ? 'bg-amber-500' : 'bg-emerald-500';
                return (
                  <div key={`yuridis-${shelf.id}`} className="bg-slate-700 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group border border-slate-600">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg text-slate-200">Rak {shelf.id}</span>
                      <span className="text-sm font-mono text-slate-400">{shelf.fill}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 mt-4 overflow-hidden border border-slate-600">
                      <div className={`h-3 rounded-full ${color}`} style={{ width: `${shelf.fill}%` }}></div>
                    </div>
                    
                    {/* Hover Detail */}
                    <div className="absolute inset-0 bg-slate-900/95 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl p-2 z-10 border border-slate-500">
                      <span className="text-white font-bold text-sm mb-1">Kapasitas</span>
                      <span className="text-slate-300 text-xs text-center">{Math.floor(shelf.fill * 20)} / 2000 bundel</span>
                      <div className="mt-2 text-xs font-semibold px-2 py-1 bg-slate-800 rounded-md text-emerald-400">
                        {100 - shelf.fill}% Tersisa
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileStack className="h-5 w-5 text-blue-400" />
                Peta Keterisian: Ruang Fisik 1
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-4 flex-1">
              {data.shelves.fisik1.map((shelf) => {
                const color = shelf.fill > 90 ? 'bg-red-500' : shelf.fill > 70 ? 'bg-amber-500' : 'bg-emerald-500';
                return (
                  <div key={`fisik1-${shelf.id}`} className="bg-slate-700 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group border border-slate-600">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg text-slate-200">Rak {shelf.id}</span>
                      <span className="text-sm font-mono text-slate-400">{shelf.fill}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 mt-4 overflow-hidden border border-slate-600">
                      <div className={`h-3 rounded-full ${color}`} style={{ width: `${shelf.fill}%` }}></div>
                    </div>
                    
                    {/* Hover Detail */}
                    <div className="absolute inset-0 bg-slate-900/95 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl p-2 z-10 border border-slate-500">
                      <span className="text-white font-bold text-sm mb-1">Kapasitas</span>
                      <span className="text-slate-300 text-xs text-center">{Math.floor(shelf.fill * 20)} / 2000 bundel</span>
                      <div className="mt-2 text-xs font-semibold px-2 py-1 bg-slate-800 rounded-md text-emerald-400">
                        {100 - shelf.fill}% Tersisa
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
