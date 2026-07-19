"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, Archive, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

const INITIAL_MOCK_NOTIFICATIONS = [
  {
    id: "1",
    nomorWarkah: "5678/2025",
    pemilik: "PT. Maju Bersama",
    peminjam: "Siti Aminah",
    jatuhTempo: "2026-07-20",
    keterlambatan: 3,
    isRead: false,
  },
  {
    id: "2",
    nomorWarkah: "1122/2023",
    pemilik: "Rina Kusuma",
    peminjam: "Agus",
    jatuhTempo: "2026-07-21",
    keterlambatan: 2,
    isRead: false,
  },
  {
    id: "3",
    nomorWarkah: "3456/2024",
    pemilik: "Sinta Maharani",
    peminjam: "Budi",
    jatuhTempo: "2026-07-22",
    keterlambatan: 1,
    isRead: true,
  }
]

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_MOCK_NOTIFICATIONS)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }
  
  const markAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault()
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-slate-100 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b flex justify-between items-center bg-slate-50 rounded-t-lg">
            <h3 className="font-semibold text-slate-800">Notifikasi</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                {unreadCount} Baru
              </span>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-1 flex items-center gap-1"
                >
                  <Check className="h-3 w-3" /> Semua
                </button>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3 border-b hover:bg-slate-50 transition-colors last:border-b-0 ${notif.isRead ? 'opacity-60' : 'bg-blue-50/30'}`}
                >
                  <Link href={`/notifikasi`} onClick={() => setIsOpen(false)} className="block">
                    <div className="flex gap-3 relative group">
                      <div className="bg-red-50 p-2 rounded-full h-fit text-red-600 shrink-0">
                        <Archive className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${notif.isRead ? 'text-slate-700' : 'text-slate-800 font-medium'}`}>
                          Pinjaman Terlambat: {notif.nomorWarkah}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          Dipinjam oleh: {notif.peminjam}
                        </p>
                        <p className="text-xs text-red-600 font-medium mt-1">
                          Terlambat {notif.keterlambatan} hari
                        </p>
                      </div>
                      {!notif.isRead && (
                        <button 
                          onClick={(e) => markAsRead(notif.id, e)}
                          className="opacity-0 group-hover:opacity-100 absolute top-0 right-0 p-1 bg-white border rounded-full shadow-sm text-slate-400 hover:text-blue-600 transition-all"
                          title="Tandai sudah dibaca"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-500 text-sm">
                Belum ada notifikasi
              </div>
            )}
          </div>
          <div className="p-2 border-t text-center bg-slate-50 rounded-b-lg">
            <Link 
              href="/notifikasi" 
              onClick={() => setIsOpen(false)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Lihat semua riwayat notifikasi
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
