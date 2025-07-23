import { Search, Bell, ShoppingCart } from "lucide-react"
import Image from "next/image"
import SidebarNav from "@/components/sidebar-nav"
import MetricCard from "@/components/metric-card"
import MobileSidebar from "@/components/mobile-sidebar"

export default function Dashboard() {
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
              <span className="hidden text-sm font-medium text-foreground sm:inline-block">Shyamashree Das</span>
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image src="/face.jpg" alt="SMTP Master" width={120} height={32}
                  className="bg-orange-100"
                />
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon="Campaigns"
              title="Campaigns"
              value={277}
              percentage="7%"
              description="Lorem ipsum"
              trend="up"
            />
            <MetricCard icon="List" title="List" value={335} percentage="11%" description="Lorem ipsum" trend="up" />
            <MetricCard
              icon="Subscribers"
              title="Subscribers"
              value={369}
              percentage="3.5%"
              description="Lorem ipsum"
              trend="down"
            />
            <MetricCard
              icon="Templates"
              title="Templates"
              value={500}
              percentage="25%"
              description="Lorem ipsum"
              trend="up"
            />
          </div>
        </main>
      </div>
    </div>
  )
}
