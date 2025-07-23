"use client"
import Link from "next/link"
import { ChevronLeft, ChevronRight, FileArchive, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ArchivedListsTable() {
  const router = useRouter()

  const columns = [
    { id: "uniqueId", label: "Unique ID" },
    { id: "name", label: "Name" },
    { id: "displayName", label: "Display name" },
    { id: "subscribersCount", label: "Subscribers count" },
    { id: "optIn", label: "Opt in" },
    { id: "optOut", label: "Opt out" },
    { id: "dateAdded", label: "Date added" },
    { id: "lastUpdated", label: "Last updated" },
    { id: "options", label: "Options" },
  ]

  const handleRefresh = () => {
    // This will refresh the current page without navigating away
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h1 className="flex items-center text-xl font-semibold">
          <FileArchive className="mr-2 h-5 w-5" /> Archived lists
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="default" className="bg-blue-500 text-white hover:bg-blue-600" asChild>
          <Link href="/lists">All lists</Link>
        </Button>

        <Button variant="default" className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="rounded-md border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((column) => (
                  <th key={column.id} className="px-4 py-3 text-left text-sm font-medium text-foreground">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-sm" colSpan={columns.length}>
                  <div className="flex items-center justify-center py-8 text-muted-foreground">No results found.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="rounded-md p-1 hover:bg-muted">
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="rounded-md p-1 hover:bg-muted">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <select className="rounded-md border border-input bg-background px-2 py-1 text-sm">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </div>
  )
}
