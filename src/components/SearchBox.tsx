"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchBoxProps {
  onSearch: (query: string) => void
}

export function SearchBox({ onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    onSearch(query.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="relative flex items-center w-full shadow-sm rounded-full bg-white overflow-hidden border focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
      <div className="pl-4 text-slate-400">
        <Search className="h-5 w-5" />
      </div>
      <Input 
        type="text" 
        placeholder="Ketik Nomor Warkah..." 
        className="border-0 shadow-none focus-visible:ring-0 text-base md:text-lg h-14 w-full bg-transparent px-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button 
        onClick={handleSearch}
        className="h-full rounded-none px-6 md:px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
      >
        Cari
      </Button>
    </div>
  )
}
