"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle2, Clock, AlertTriangle, Search, Filter, Loader2, RefreshCw } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getNotificationHistory, markNotificationAsRead } from "@/app/peminjaman/actions"

export default function RiwayatNotifikasiPage() {
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTriggering, setIsTriggering] = useState(false)

  const fetchNotifs = async () => {
    setIsLoading(true)
    try {
      const res = await getNotificationHistory('usr_1', {
        status: filterStatus !== 'all' ? filterStatus as any : undefined,
        limit: 50
      })
      if (res.success && res.data) {
        setNotifications(res.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifs()
  }, [filterStatus])

  const triggerCron = async () => {
    setIsTriggering(true)
    try {
      await fetch('/api/cron')
      await fetchNotifs()
    } catch (e) {
      console.error(e)
    } finally {
      setIsTriggering(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id)
    fetchNotifs()
  }

  const filteredNotifs = notifications.filter((notif) => {
    const matchesSearch = notif.message.toLowerCase().includes(search.toLowerCase()) || 
                          (notif.archiveNumber && notif.archiveNumber.toLowerCase().includes(search.toLowerCase()))
    const matchesType = true // Can implement type mapping later if needed
    
    return matchesSearch && matchesType
  })

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getBgColor = (type: string, isRead: boolean) => {
    if (isRead) return "bg-white"
    return "bg-amber-50" // Assuming warning for overdue
  }

  return (
    <main className="p-6 max-w-4xl mx-auto w-full font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Riwayat Notifikasi</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={triggerCron} 
          disabled={isTriggering}
          className="gap-2"
        >
          {isTriggering ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Cek Keterlambatan (Cron)
        </Button>
      </div>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari notifikasi..." 
                className="pl-9 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Filter className="h-4 w-4" />
                <span>Filter:</span>
              </div>
              
              <Select value={filterStatus} onValueChange={(val) => val && setFilterStatus(val)}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="unread">Belum Dibaca</SelectItem>
                  <SelectItem value="read">Sudah Dibaca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-slate-100 min-h-[300px]">
            {isLoading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : filteredNotifs.length > 0 ? (
              filteredNotifs.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-5 flex gap-4 transition-colors hover:bg-slate-50 ${getBgColor('warning', notif.isRead)}`}
                  onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                >
                  <div className="pt-1 cursor-pointer">
                    {getIcon('warning')}
                  </div>
                  <div className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                        {notif.archiveNumber ? `Warkah ${notif.archiveNumber}` : 'Notifikasi Sistem'}
                      </h3>
                      <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                        {new Date(notif.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className={`text-sm ${notif.isRead ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                      {notif.message}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-slate-400">{new Date(notif.createdAt).toLocaleTimeString('id-ID')}</span>
                      {!notif.isRead && (
                        <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                          Baru
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500">
                <Bell className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-lg font-medium text-slate-600">Tidak ada notifikasi</p>
                <p className="text-sm">Tidak ada notifikasi yang cocok dengan pencarian atau filter.</p>
              </div>
            )}
          </div>
        </div>
    </main>
  )
}
