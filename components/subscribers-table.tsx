"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, SlidersHorizontal, ArrowLeft, RefreshCw, Filter, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

interface Column {
  id: string
  label: string
  visible: boolean
}

export default function SubscribersTable() {
  const router = useRouter()
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [columns, setColumns] = useState<Column[]>([
    { id: "list", label: "List", visible: true },
    { id: "uniqueId", label: "Unique ID", visible: true },
    { id: "email", label: "Email", visible: true },
    { id: "source", label: "Source", visible: true },
    { id: "ipAddress", label: "Ip address", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "dateAdded", label: "Date added", visible: true },
    { id: "lastUpdated", label: "Last updated", visible: true },
  ])

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

  const handleRefresh = () => {
    router.refresh()
  }

  const visibleColumns = columns.filter((col) => col.visible)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Subscribers from all your lists</h1>
          </div>
        </div>

        <div className="mb-4 flex justify-end gap-2">
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Toggle columns
          </Button>

          <Button className="bg-blue-500 text-white hover:bg-blue-600" asChild>
            <Link href="/lists">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to lists
            </Link>
          </Button>

          <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {showColumnsDropdown && (
          <div className="absolute right-8 mt-1 w-56 bg-white rounded-md shadow-lg border z-50">
            <div className="p-3">
              {columns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2 py-2">
                  <Checkbox id={column.id} checked={column.visible} onCheckedChange={() => toggleColumn(column.id)} />
                  <label htmlFor={column.id} className="text-sm font-medium text-gray-700">
                    {column.label}
                  </label>
                </div>
              ))}
              <button
                className="mt-3 w-full bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md font-medium"
                onClick={saveColumnChanges}
              >
                Save changes
              </button>
            </div>
          </div>
        )}

        {showFilters && <SubscriberFilters />}

        <div className="rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">List</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unique ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Source</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ip address</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date added</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last updated</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Options</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-8 text-sm text-gray-500 text-center" colSpan={9}>
                    No results found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <button className="rounded-md p-1 hover:bg-gray-100">
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              </button>
              <button className="rounded-md p-1 hover:bg-gray-100">
                <ChevronRight className="h-5 w-5 text-gray-500" />
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
  )
}

function SubscriberFilters() {
  return (
    <div className="mb-6 rounded-md border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 flex items-center text-lg font-medium">
        <Filter className="mr-2 h-5 w-5" /> Filters
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Lists</label>
          <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Select lists</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Statuses</label>
          <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Select statuses</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sources</label>
          <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Select sources</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Unique</label>
          <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Select</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Action</label>
          <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="view">View</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="name@domain.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Unique ID</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="jm338w77e4eea"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ip Address</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="123.123.123.100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date added start</label>
          <input
            type="date"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="Date added start"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date added end</label>
          <input
            type="date"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="Date added end"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Campaigns Action</label>
          <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Choose</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Campaigns</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            placeholder="Campaign name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">In the last</label>
          <div className="flex gap-2">
            <input
              type="number"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              placeholder="30"
              defaultValue="30"
            />
            <select className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md font-medium">Submit</button>
      </div>
    </div>
  )
}
