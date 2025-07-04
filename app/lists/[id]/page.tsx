"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ChevronLeft,
  Users,
  Target,
  Settings,
  FileText,
  Layout,
  Wrench,
  TrendingUp,
  Mail,
  MousePointer,
  UserMinus,
  AlertTriangle,
  SparkleIcon as Bounce,
} from "lucide-react"
import SidebarNav from "@/components/sidebar-nav"
import MobileSidebar from "@/components/mobile-sidebar"

interface ListData {
  id: string
  uniqueId: string
  name: string
  displayName: string
  subscribersCount: number
  optIn: string
  optOut: string
  dateAdded: string
  lastUpdated: string
}

interface MetricCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  subtitle?: string
  color?: string
}

const MetricCard = ({ icon, value, label, subtitle, color = "text-blue-500" }: MetricCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-gray-50 ${color}`}>{icon}</div>
      </div>
      <div className="space-y-1">
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
    </div>
  )
}

const ChartPlaceholder = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Last 7 days subscribers activity
      </h3>
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Chart will be displayed here</p>
          <p className="text-sm text-gray-400">Subscriber activity over time</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">Unconfirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Unsubscribed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span className="text-gray-600">Blacklisted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded"></div>
            <span className="text-gray-600">Bounces</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ListDetailPage() {
  const params = useParams()
  const router = useRouter()
  const listId = params.id as string
  const [listData, setListData] = useState<ListData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListData = async () => {
      try {
        // Mock data - replace with actual API call
        const mockData: ListData = {
          id: listId,
          uniqueId: "shyamashree",
          name: "shyamashree",
          displayName: "Shyamashree Newsletter",
          subscribersCount: 0,
          optIn: "double",
          optOut: "single",
          dateAdded: "2024-01-15",
          lastUpdated: "2024-01-15",
        }

        setListData(mockData)
      } catch (error) {
        console.error("Error fetching list data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchListData()
  }, [listId])

  const handleCreateNew = () => {
    router.push("/lists/new")
  }

  const handleUpdate = () => {
    router.push(`/lists/new?edit=${listId}`)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-7xl">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!listData) {
    return (
      <div className="flex h-screen bg-background">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-7xl">
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">List not found</h2>
                <p className="text-gray-600 mb-4">The list you're looking for doesn't exist.</p>
                <Link href="/lists" className="text-blue-600 hover:text-blue-800 font-medium">
                  ← Back to Lists
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarNav />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mx-auto max-w-7xl">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/lists" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Lists
                  </Link>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateNew}
                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Create new
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                    📊 Overview
                  </button>
                </nav>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                <MetricCard
                  icon={<Users className="h-6 w-6" />}
                  value={listData.subscribersCount}
                  label="Subscribers"
                  color="text-blue-500"
                />
                <MetricCard icon={<Target className="h-6 w-6" />} value={0} label="Segments" color="text-blue-500" />
                <MetricCard
                  icon={<Settings className="h-6 w-6" />}
                  value={3}
                  label="Custom fields"
                  color="text-blue-500"
                />
                <MetricCard icon={<FileText className="h-6 w-6" />} value={11} label="Pages" color="text-blue-500" />
                <MetricCard icon={<Layout className="h-6 w-6" />} value="Forms" label="Tools" color="text-blue-500" />
                <MetricCard
                  icon={<Wrench className="h-6 w-6" />}
                  value="Tools"
                  label="List tools"
                  color="text-blue-500"
                />
              </div>

              {/* Chart Section */}
              <div className="mb-8">
                <ChartPlaceholder />
              </div>

              {/* Tracking Stats */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                  📊 Tracking stats averages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <Mail className="h-4 w-4" />
                      Opens
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <MousePointer className="h-4 w-4" />
                      Clicks
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <UserMinus className="h-4 w-4" />
                      Unsubscribes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Complaints
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <Bounce className="h-4 w-4" />
                      Bounces
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
