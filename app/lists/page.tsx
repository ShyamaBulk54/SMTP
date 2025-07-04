import { Search, Bell, ShoppingCart } from "lucide-react"
import Image from "next/image"
import SidebarNav from "@/components/sidebar-nav"
import ListsTable from "@/components/lists-table"
import MobileSidebar from "@/components/mobile-sidebar"

export default function ListsPage() {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:block">
        <SidebarNav />
      </div>
      <div className="flex-1 overflow-auto">
        <header className="flex items-center justify-between border-b bg-card px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-4">
            <MobileSidebar />
            <div className="relative w-full max-w-[180px] sm:max-w-[240px]">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-full rounded-md border border-input bg-background pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <ShoppingCart className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-medium text-foreground sm:inline-block">Supriya Ghosh</span>
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="bg-orange-100"
                />
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <ListsTable />
        </main>
      </div>
    </div>
  )
}
