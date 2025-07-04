"use client"

import { useState, useEffect } from "react"
import {
  Ban,
  Plus,
  Upload,
  RefreshCw,
  X,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Settings,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BlacklistEntry {
  id: string
  email: string
  reason: string
  dateAdded: string
}

const loadBlacklistFromStorage = (): BlacklistEntry[] => {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem("blacklistData")
  return saved ? JSON.parse(saved) : []
}

const saveBlacklistToStorage = (data: BlacklistEntry[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("blacklistData", JSON.stringify(data))
}

export default function EmailBlacklistContent() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [searchEmail, setSearchEmail] = useState("")
  const [searchReason, setSearchReason] = useState("")
  const [searchDate, setSearchDate] = useState("")
  const [editingItem, setEditingItem] = useState<BlacklistEntry | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [visibleColumns, setVisibleColumns] = useState({
    email: true,
    reason: true,
    dateAdded: true,
  })

  // Load persisted data
  const [blacklistData, setBlacklistData] = useState<BlacklistEntry[]>(() => {
    const storedData = loadBlacklistFromStorage()
    return storedData
  })
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Load and sort data on mount
  useEffect(() => {
    const storedData = loadBlacklistFromStorage()
    const sortedData = storedData.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    setBlacklistData(sortedData)
    setIsInitialLoad(false)
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    if (!isInitialLoad && typeof window !== "undefined") {
      saveBlacklistToStorage(blacklistData)
    }
  }, [blacklistData, isInitialLoad])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleToggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }))
  }

  const handleRemoveItem = (id: string) => {
    setBlacklistData((prev) => prev.filter((item) => item.id !== id))
  }

  const handleEditItem = (item: BlacklistEntry) => {
    setEditingItem(item)
    setShowCreateForm(true)
  }

  const handleExportCSV = () => {
    const headers = ["Email", "Reason", "Date Added"]
    const csvContent = [
      headers.join(","),
      ...blacklistData.map((item) => [`"${item.email}"`, `"${item.reason}"`, `"${item.dateAdded}"`].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "email-blacklist.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImportCSV = () => {
    if (!importFile) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        if (!text) return

        const lines = text.split("\n").filter((line) => line.trim())
        if (lines.length < 2) return // Need at least header + 1 data row

        const newEntries: BlacklistEntry[] = []
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",")
          if (values.length >= 1 && values[0]?.trim()) {
            newEntries.push({
              id: Date.now().toString() + i,
              email: values[0].replace(/"/g, "").trim(),
              reason: values[1] ? values[1].replace(/"/g, "").trim() : "Imported",
              dateAdded: new Date().toLocaleString(),
            })
          }
        }

        if (newEntries.length > 0) {
          setBlacklistData((prev) => [...prev, ...newEntries])
          setShowSuccess(true)
        }

        setShowImportModal(false)
        setImportFile(null)
      } catch (error) {
        console.error("Error importing CSV:", error)
        setShowError(true)
        setShowImportModal(false)
        setImportFile(null)
      }
    }

    reader.onerror = () => {
      setShowError(true)
      setShowImportModal(false)
      setImportFile(null)
    }

    reader.readAsText(importFile)
  }

  const filteredData = blacklistData.filter((item) => {
    return (
      item.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      item.reason.toLowerCase().includes(searchReason.toLowerCase()) &&
      item.dateAdded.toLowerCase().includes(searchDate.toLowerCase())
    )
  })

  // Empty state when no data
  if (blacklistData.length === 0 && !showCreateForm) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center text-xl font-semibold">
            <Ban className="mr-2 h-5 w-5" /> Blacklist
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="default"
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create new
            </Button>
            <Button
              variant="default"
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => setShowImportModal(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="default" className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Ban className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Manage your email blacklist</h2>
          <p className="text-gray-500 max-w-md">
            Create your own email blacklist to include subscribers that will never receive emails from you and that will
            never be added to your email lists.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {showSuccess && (
        <Alert className="bg-green-500 text-white border-green-500">
          <AlertDescription className="flex items-center justify-between">
            <span>→ Your form has been successfully saved!</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSuccess(false)}
              className="h-5 w-5 rounded-full p-0 text-white hover:bg-green-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {showError && (
        <Alert variant="destructive" className="bg-red-500 text-white">
          <AlertDescription className="flex items-center justify-between">
            <span>→ Your form has a few errors, please fix them and try again!</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowError(false)}
              className="h-5 w-5 rounded-full p-0 text-white hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Import Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import from CSV file</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-500 text-white p-3 rounded text-sm">
              Please note, the csv file must contain a header with at least the email column. If unsure about how to
              format your file, do an export first and see how the file looks.
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">File</label>
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowImportModal(false)}>
                Close
              </Button>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleImportCSV}
                disabled={!importFile}
              >
                Import file
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showCreateForm ? (
        <CreateEmailBlacklistForm
          editingItem={editingItem}
          onCancel={() => {
            setShowCreateForm(false)
            setEditingItem(null)
          }}
          onSubmit={(success, data) => {
            if (success && data) {
              if (editingItem) {
                // Update existing item
                setBlacklistData((prev) =>
                  prev.map((item) =>
                    item.id === editingItem.id
                      ? { ...item, email: data.email, reason: data.reason || "No reason provided" }
                      : item,
                  ),
                )
              } else {
                // Add new item
                setBlacklistData((prev) => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    email: data.email,
                    reason: data.reason || "No reason provided",
                    dateAdded: new Date().toLocaleString(),
                  },
                ])
              }
              setShowCreateForm(false)
              setEditingItem(null)
              setShowSuccess(true)
            } else {
              setShowError(true)
            }
          }}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="flex items-center text-xl font-semibold">
              <Ban className="mr-2 h-5 w-5" /> Blacklist
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded text-sm flex items-center gap-2 font-medium transition-colors"
                  >
                    <Menu className="h-4 w-4" />
                    Toggle columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-0">
                  <div className="p-3 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email"
                        checked={visibleColumns.email}
                        onCheckedChange={() => handleToggleColumn("email")}
                      />
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reason"
                        checked={visibleColumns.reason}
                        onCheckedChange={() => handleToggleColumn("reason")}
                      />
                      <label
                        htmlFor="reason"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Reason
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dateAdded"
                        checked={visibleColumns.dateAdded}
                        onCheckedChange={() => handleToggleColumn("dateAdded")}
                      />
                      <label
                        htmlFor="dateAdded"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Date added
                      </label>
                    </div>
                  </div>
                  <div className="border-t p-3">
                    <Button
                      size="sm"
                      className="w-full bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => {
                        // Close dropdown and apply changes
                      }}
                    >
                      Save changes
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="default"
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded text-sm flex items-center gap-2 font-medium transition-colors"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4" />
                Create new
              </Button>

              <Button
                variant="default"
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded text-sm flex items-center gap-2 font-medium transition-colors"
                onClick={handleExportCSV}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>

              <Button
                variant="default"
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded text-sm flex items-center gap-2 font-medium transition-colors"
                onClick={() => setShowImportModal(true)}
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>

              <Button
                variant="default"
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded text-sm flex items-center gap-2 font-medium transition-colors"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            Displaying {filteredData.length} of {blacklistData.length} result{blacklistData.length !== 1 ? "s" : ""}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Search Filters Row */}
            <div className="border-b border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {visibleColumns.email && (
                  <div>
                    <Input
                      placeholder="Search email..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="h-8 text-sm border-gray-300 w-32"
                    />
                  </div>
                )}
                {visibleColumns.reason && (
                  <div>
                    <Input
                      placeholder="Search reason..."
                      value={searchReason}
                      onChange={(e) => setSearchReason(e.target.value)}
                      className="h-8 text-sm border-gray-300 w-32"
                    />
                  </div>
                )}
                {visibleColumns.dateAdded && (
                  <div>
                    <Input
                      placeholder="Search date..."
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="h-8 text-sm border-gray-300 w-32"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {visibleColumns.email && <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>}
                    {visibleColumns.reason && <th className="px-4 py-3 text-left font-medium text-gray-700">Reason</th>}
                    {visibleColumns.dateAdded && (
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Date added</th>
                    )}
                    <th className="w-24 px-4 py-3 text-center font-medium text-gray-700">Options</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      {visibleColumns.email && <td className="px-4 py-3 font-medium text-gray-900">{item.email}</td>}
                      {visibleColumns.reason && <td className="px-4 py-3 text-gray-600">{item.reason}</td>}
                      {visibleColumns.dateAdded && <td className="px-4 py-3 text-gray-600">{item.dateAdded}</td>}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => handleEditItem(item)}
                          >
                            <Settings className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 px-2">1</span>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function CreateEmailBlacklistForm({
  editingItem,
  onCancel,
  onSubmit,
}: {
  editingItem?: BlacklistEntry | null
  onCancel: () => void
  onSubmit: (success: boolean, data?: { email: string; reason: string }) => void
}) {
  const [email, setEmail] = useState(editingItem?.email || "")
  const [reason, setReason] = useState(editingItem?.reason || "")

  const handleSubmit = () => {
    if (!email) {
      onSubmit(false)
      return
    }
    onSubmit(true, { email, reason })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center text-xl font-semibold text-gray-900">
          <Ban className="mr-2 h-5 w-5" />
          {editingItem ? "Edit email address in blacklist" : "Add a new email address to blacklist"}
        </h2>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-gray-300"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Reason</label>
          <Textarea
            placeholder="Enter reason for blacklisting (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[120px] w-full border-gray-300"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleSubmit}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}
