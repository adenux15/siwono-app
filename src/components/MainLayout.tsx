"use client"

import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"
import { usePathname } from "next/navigation"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  if (pathname === '/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 min-w-0">
        <TopBar onOpenSidebar={() => setIsSidebarOpen(true)} />
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-x-hidden relative">
          {children}
        </div>
      </div>
    </div>
  )
}
