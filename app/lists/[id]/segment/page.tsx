"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ChevronLeft,
  Target,
  PlusCircle,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Edit,
  Trash2,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import SidebarNav from "@/components/sidebar-nav"
import MobileSidebar from "@/components/mobile-sidebar"

interface Subscriber {
  id: string
  uniqueId: string
  email: string
  firstName?: string
  lastName?: string
  status: "confirmed" | "unconfirmed" | "unsubscribed" | "bounced"
  dateAdded: string
  lastActivity?: string
  location?: string
  source?: string
  ipAddress?: string
}

interface Segment {
  id: string
  name: string
  email: string
  dateAdded: string
  lastUpdated: string
  subscriberCount: number
}

interface Column {
  id: string
  label: string
  visible: boolean
}

export default function ListSegmentsPage() {
  const params = useParams()
  const router = useRouter()
  const listId = params.id as string
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(true)
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false)

  const [columns, setColumns] = useState<Column[]>([
    { id: "name", label: "Name", visible: true },
    { id: "dateAdded", label: "Date added", visible: true },
    { id: "lastUpdated", label: "Last updated", visible: true },
  ])

  const loadSegmentsFromSubscribers = () => {
    try {
      // Load subscribers from localStorage
      const savedSubscribers = localStorage.getItem(`subscribers_${listId}`)
      const subscribersData: Subscriber[] = savedSubscribers ? JSON.parse(savedSubscribers) : []

      // Convert subscribers to segments format
      const segmentsData: Segment[] = subscribersData.map((subscriber) => ({
        id: subscriber.id,
        name: `${subscriber.email} @ ${new Date(subscriber.dateAdded).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })} )`,
        email: subscriber.email,
        dateAdded: new Date(subscriber.dateAdded).toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        lastUpdated: new Date(subscriber.dateAdded).toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        subscriberCount: 1,
      }))

      setSegments(segmentsData)
      setLoading(false)
    } catch (error) {
      console.error("Error loading segments:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSegmentsFromSubscribers()
  }, [listId])

  // Reload data when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      loadSegmentsFromSubscribers()
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [listId])

  // Reload data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadSegmentsFromSubscribers()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [listId])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".dropdown-container")) {
        setShowColumnsDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    loadSegmentsFromSubscribers()
  }

  const handleCreateNew = () => {
    router.push(`/lists/${listId}/segment/new`)
  }

  const toggleColumn = (id: string) => {
    setColumns(
      columns.map((col) => {
        if (col.id === id) {
          return { ...col, visible: !col.visible }
        }
        return col
      }),
    )
  }

  const saveColumnChanges = () => {
    setShowColumnsDropdown(false)
  }

  const handleSegmentOptions = (segmentId: string) => {
    // Handle segment options (edit, delete, etc.)
    console.log("Segment options for:", segmentId)
    alert("Segment options - Implementation needed")
  }

  const visibleColumns = columns.filter((col) => col.visible)

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="hidden lg:block">
          <SidebarNav />
        </div>
        <MobileSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-7xl">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleEdit = (segment: Segment) => {
    // Navigate to edit segment page or open edit modal
    router.push(`/lists/${listId}/segments/${segment.id}/edit`)
  }

  const handleDelete = (segmentId: string) => {
    if (confirm("Are you sure you want to delete this segment?")) {
      try {
        // Find the segment to delete
        const segmentToDelete = segments.find((s) => s.id === segmentId)
        if (segmentToDelete) {
          // Remove the corresponding subscriber from localStorage
          const savedSubscribers = localStorage.getItem(`subscribers_${listId}`)
          const subscribersData: Subscriber[] = savedSubscribers ? JSON.parse(savedSubscribers) : []

          // Filter out the subscriber that corresponds to this segment
          const updatedSubscribers = subscribersData.filter((sub) => sub.id !== segmentId)

          // Save back to localStorage
          localStorage.setItem(`subscribers_${listId}`, JSON.stringify(updatedSubscribers))

          // Update segments state
          setSegments(segments.filter((s) => s.id !== segmentId))

          alert("Segment deleted successfully!")
        }
      } catch (error) {
        console.error("Error deleting segment:", error)
        alert("Error deleting segment. Please try again.")
      }
    }
  }

  const handleCopy = (segment: Segment) => {
    try {
      // Create a copy of the segment with new ID and updated timestamp
      const newSegment: Segment = {
        ...segment,
        id: Date.now().toString(),
        name: `Copy of ${segment.email} @ ${new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })} )`,
        dateAdded: new Date().toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        lastUpdated: new Date().toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      }

      // Create corresponding subscriber
      const newSubscriber: Subscriber = {
        id: newSegment.id,
        uniqueId: `SUB-${Date.now()}`,
        email: `copy_${segment.email}`,
        firstName: "",
        lastName: "",
        status: "unconfirmed",
        dateAdded: new Date().toISOString(),
        ipAddress: "127.0.0.1",
      }

      // Add to localStorage
      const savedSubscribers = localStorage.getItem(`subscribers_${listId}`)
      const subscribersData: Subscriber[] = savedSubscribers ? JSON.parse(savedSubscribers) : []
      subscribersData.push(newSubscriber)
      localStorage.setItem(`subscribers_${listId}`, JSON.stringify(subscribersData))

      // Update segments state
      setSegments([...segments, newSegment])

      alert("Segment copied successfully!")
    } catch (error) {
      console.error("Error copying segment:", error)
      alert("Error copying segment. Please try again.")
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:block">
        <SidebarNav />
      </div>

      <MobileSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mx-auto max-w-7xl">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/lists/${listId}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Overview
                  </Link>
                </div>
              </div>

              {/* Title and Action Buttons */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-gray-700" />
                  <h1 className="text-xl font-semibold text-gray-900">List segments</h1>
                </div>
                <div className="flex gap-2">
                  <div className="dropdown-container relative">
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Toggle columns
                    </Button>
                    {/* Toggle Columns Dropdown */}
                    {showColumnsDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
                        <div className="p-3">
                          {columns.map((column) => (
                            <div key={column.id} className="flex items-center space-x-2 py-2">
                              <Checkbox
                                id={column.id}
                                checked={column.visible}
                                onCheckedChange={() => toggleColumn(column.id)}
                              />
                              <label htmlFor={column.id} className="text-sm font-medium text-gray-700">
                                {column.label}
                              </label>
                            </div>
                          ))}
                          <Button
                            className="mt-3 w-full bg-blue-500 text-white hover:bg-blue-600"
                            onClick={saveColumnChanges}
                          >
                            Save changes
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button onClick={handleCreateNew} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create new
                  </Button>

                  <Button
                    onClick={handleRefresh}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-4 text-sm text-gray-600">
                Displaying 1-{segments.length} of {segments.length} result{segments.length !== 1 ? "s" : ""}.
              </div>

              {/* Segments Table */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        {visibleColumns.map((column) => (
                          <th key={column.id} className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            {column.label}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {segments.length === 0 ? (
                        <tr>
                          <td colSpan={visibleColumns.length + 1} className="px-4 py-8 text-center text-gray-500">
                            No segments found. Create subscribers first to see segments here.
                          </td>
                        </tr>
                      ) : (
                        segments.map((segment) => (
                          <tr key={segment.id} className="border-b border-gray-200 hover:bg-gray-50">
                            {visibleColumns.map((column) => (
                              <td key={column.id} className="px-4 py-3 text-sm text-gray-700">
                                {column.id === "name" && (
                                  <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                                    {segment.name}
                                  </span>
                                )}
                                {column.id === "dateAdded" && segment.dateAdded}
                                {column.id === "lastUpdated" && segment.lastUpdated}
                              </td>
                            ))}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(segment)}
                                  className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                  title="Update"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCopy(segment)}
                                  className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                  title="Copy"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(segment.id)}
                                  className="h-8 w-8 text-red-600 hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="rounded-md p-1 hover:bg-gray-100" disabled>
                      <ChevronLeft className="h-5 w-5 text-gray-400" />
                    </button>
                    <button className="rounded-md p-1 hover:bg-gray-100" disabled>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  <select className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
