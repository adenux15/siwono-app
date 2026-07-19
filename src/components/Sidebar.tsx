"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Archive, LayoutDashboard, Search, Layers, X } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { name: "Pencarian", href: "/", icon: Search },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Daftar Arsip", href: "/arsip", icon: Archive },
  { name: "Manajemen Rak", href: "/rak", icon: Layers },
  { name: "Peminjaman", href: "/peminjaman", icon: Archive },
]

export function Sidebar({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden animate-in fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside className={cn(
        "fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header/Logo */}
        <div className="h-16 flex items-center px-6 bg-slate-950/50 justify-between">
          <Link href="/" className="flex items-center gap-2 text-white" onClick={onClose}>
            <Archive className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl tracking-tight">SIWONO</span>
          </Link>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
            Menu Utama
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors group",
                  isActive 
                    ? "bg-blue-600/10 text-blue-500" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300"
                )} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 bg-slate-950/30 text-xs text-slate-500">
          <p>SIWONO v0.1.0</p>
          <p className="mt-1">Kantor Pertanahan Lamongan</p>
        </div>
      </aside>
    </>
  )
}
