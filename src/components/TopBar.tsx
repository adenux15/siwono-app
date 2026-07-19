"use client"

import { Menu, LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { NotificationCenter } from "./NotificationCenter"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/app/login/actions"

export function TopBar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const router = useRouter()

  const handleLogout = async () => {
    const res = await logoutUser();
    if (res.success) {
      alert("Berhasil keluar dari sistem.");
      router.push("/login");
    } else {
      alert("Gagal keluar dari sistem.");
    }
  }
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 shadow-sm px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={onOpenSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="font-semibold text-lg text-slate-800 hidden sm:block">
          Sistem Informasi Warkah Online
        </h2>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationCenter />
        <div className="h-6 w-px bg-slate-200 mx-1"></div>
        <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">Keluar</span>
        </Button>
      </div>
    </header>
  )
}
