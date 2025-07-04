import { Search, ChevronDown, Bell, ShoppingCart } from "lucide-react"
import Image from "next/image"
import SidebarNav from "@/components/sidebar-nav"
import ArchivedListsTable from "@/components/archived-lists-table"

export default function ArchivedListsPage() {
  return (
    <div className="flex h-screen bg-background">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <header className="flex items-center justify-between border-b bg-card px-6 py-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-full rounded-md border border-input bg-background pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <ShoppingCart className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Supriya Ghosh</span>
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="bg-orange-100"
                />
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>
        <main className="p-6">
          <ArchivedListsTable />
        </main>
      </div>
    </div>
  )
}
