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
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SuppressionEntry {
  id: string
  listName: string
  displayName: string
  subscribersCount: number
  optIn: number
  optOut: number
  dateAdded: string
  lastUpdated: string
}

const loadSuppressionFromStorage = (): SuppressionEntry[] => {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem("suppressionData")
  return saved ? JSON.parse(saved) : []
}

const saveSuppressionToStorage = (data: SuppressionEntry[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("suppressionData", JSON.stringify(data))
}

export default function SuppressionListsContent() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [searchList, setSearchList] = useState("")
  const [searchDisplay, setSearchDisplay] = useState("")
  const [searchDate, setSearchDate] = useState("")
  const [editingItem, setEditingItem] = useState<SuppressionEntry | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [visibleColumns, setVisibleColumns] = useState({
    listName: true,
    displayName: true,
    subscribersCount: true,
    optIn: true,
    optOut: true,
    dateAdded: true,
    lastUpdated: true,
  })

  const [suppressionData, setSuppressionData] = useState<SuppressionEntry[]>(() => {
    const storedData = loadSuppressionFromStorage()
    return storedData
  })
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    const storedData = loadSuppressionFromStorage()
    const sortedData = storedData.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    setSuppressionData(sortedData)
    setIsInitialLoad(false)
  }, [])

  useEffect(() => {
    if (!isInitialLoad && typeof window !== "undefined") {
      saveSuppressionToStorage(suppressionData)
    }
  }, [suppressionData, isInitialLoad])

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
    setSuppressionData((prev) => prev.filter((item) => item.id !== id))
  }

  const handleEditItem = (item: SuppressionEntry) => {
    setEditingItem(item)
    setShowCreateForm(true)
  }

  const handleExportCSV = () => {
    const headers = [
      "List Name",
      "Display Name",
      "Subscribers Count",
      "Opt In",
      "Opt Out",
      "Date Added",
      "Last Updated",
    ]
    const csvContent = [
      headers.join(","),
      ...suppressionData.map((item) =>
        [
          `"${item.listName}"`,
          `"${item.displayName}"`,
          item.subscribersCount,
          item.optIn,
          item.optOut,
          `"${item.dateAdded}"`,
          `"${item.lastUpdated}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "suppression-lists.csv")
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
        if (lines.length < 2) return

        const newEntries: SuppressionEntry[] = []
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",")
          if (values.length >= 1 && values[0]?.trim()) {
            newEntries.push({
              id: Date.now().toString() + i,
              listName: values[0].replace(/"/g, "").trim(),
              displayName: values[1] ? values[1].replace(/"/g, "").trim() : "Imported List",
              subscribersCount: values[2] ? Number.parseInt(values[2]) || 0 : 0,
              optIn: values[3] ? Number.parseInt(values[3]) || 0 : 0,
              optOut: values[4] ? Number.parseInt(values[4]) || 0 : 0,
              dateAdded: new Date().toLocaleString(),
              lastUpdated: new Date().toLocaleString(),
            })
          }
        }

        if (newEntries.length > 0) {
          setSuppressionData((prev) => [...prev, ...newEntries])
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

  const filteredData = suppressionData.filter((item) => {
    return (
      item.listName.toLowerCase().includes(searchList.toLowerCase()) &&
      item.displayName.toLowerCase().includes(searchDisplay.toLowerCase()) &&
      item.dateAdded.toLowerCase().includes(searchDate.toLowerCase())
    )
  })

  if (suppressionData.length === 0 && !showCreateForm) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center text-xl font-semibold">
            <Ban className="mr-2 h-5 w-5" /> Suppression Lists
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
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Manage your suppression lists</h2>
          <p className="text-gray-500 max-w-md">
            Create and manage suppression lists to control which subscribers receive your campaigns.
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

      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import from CSV file</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-500 text-white p-3 rounded text-sm">
              Please note, the csv file must contain a header with at least the list name column. If unsure about how to
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
        <CreateSuppressionForm
          editingItem={editingItem}
          onCancel={() => {
            setShowCreateForm(false)
            setEditingItem(null)
          }}
          onSubmit={(success, data) => {
            if (success && data) {
              if (editingItem) {
                setSuppressionData((prev) =>
                  prev.map((item) =>
                    item.id === editingItem.id
                      ? {
                          ...item,
                          listName: data.listName,
                          displayName: data.displayName,
                          lastUpdated: new Date().toLocaleString(),
                        }
                      : item,
                  ),
                )
              } else {
                setSuppressionData((prev) => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    listName: data.listName,
                    displayName: data.displayName,
                    subscribersCount: 0,
                    optIn: 0,
                    optOut: 0,
                    dateAdded: new Date().toLocaleString(),
                    lastUpdated: new Date().toLocaleString(),
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
              <Ban className="mr-2 h-5 w-5" /> Suppression Lists
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded text-sm flex items-center gap-2 font-medium transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    Toggle columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.listName}
                    onCheckedChange={() => handleToggleColumn("listName")}
                  >
                    List name
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.displayName}
                    onCheckedChange={() => handleToggleColumn("displayName")}
                  >
                    Display name
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.subscribersCount}
                    onCheckedChange={() => handleToggleColumn("subscribersCount")}
                  >
                    Subscribers count
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.optIn}
                    onCheckedChange={() => handleToggleColumn("optIn")}
                  >
                    Opt in
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.optOut}
                    onCheckedChange={() => handleToggleColumn("optOut")}
                  >
                    Opt out
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.dateAdded}
                    onCheckedChange={() => handleToggleColumn("dateAdded")}
                  >
                    Date added
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.lastUpdated}
                    onCheckedChange={() => handleToggleColumn("lastUpdated")}
                  >
                    Last updated
                  </DropdownMenuCheckboxItem>
                  <div className="px-2 py-1.5 border-t">
                    <Button size="sm" className="w-full bg-blue-500 text-white hover:bg-blue-600">
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
            Displaying {filteredData.length} of {suppressionData.length} result{suppressionData.length !== 1 ? "s" : ""}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {visibleColumns.listName && (
                  <div>
                    <Input
                      placeholder="Search list..."
                      value={searchList}
                      onChange={(e) => setSearchList(e.target.value)}
                      className="h-8 text-sm border-gray-300 w-32"
                    />
                  </div>
                )}
                {visibleColumns.displayName && (
                  <div>
                    <Input
                      placeholder="Search display..."
                      value={searchDisplay}
                      onChange={(e) => setSearchDisplay(e.target.value)}
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

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {visibleColumns.listName && (
                      <th className="px-4 py-3 text-left font-medium text-gray-700">List name</th>
                    )}
                    {visibleColumns.displayName && (
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Display name</th>
                    )}
                    {visibleColumns.subscribersCount && (
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Subscribers count</th>
                    )}
                    {visibleColumns.optIn && <th className="px-4 py-3 text-left font-medium text-gray-700">Opt in</th>}
                    {visibleColumns.optOut && (
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Opt out</th>
                    )}
                    {visibleColumns.dateAdded && (
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Date added</th>
                    )}
                    {visibleColumns.lastUpdated && (
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Last updated</th>
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
                      {visibleColumns.listName && (
                        <td className="px-4 py-3 font-medium text-gray-900">{item.listName}</td>
                      )}
                      {visibleColumns.displayName && <td className="px-4 py-3 text-gray-600">{item.displayName}</td>}
                      {visibleColumns.subscribersCount && (
                        <td className="px-4 py-3 text-gray-600">{item.subscribersCount}</td>
                      )}
                      {visibleColumns.optIn && <td className="px-4 py-3 text-gray-600">{item.optIn}</td>}
                      {visibleColumns.optOut && <td className="px-4 py-3 text-gray-600">{item.optOut}</td>}
                      {visibleColumns.dateAdded && <td className="px-4 py-3 text-gray-600">{item.dateAdded}</td>}
                      {visibleColumns.lastUpdated && <td className="px-4 py-3 text-gray-600">{item.lastUpdated}</td>}
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

function CreateSuppressionForm({
  editingItem,
  onCancel,
  onSubmit,
}: {
  editingItem?: SuppressionEntry | null
  onCancel: () => void
  onSubmit: (success: boolean, data?: { listName: string; displayName: string }) => void
}) {
  const [listName, setListName] = useState(editingItem?.listName || "")
  const [displayName, setDisplayName] = useState(editingItem?.displayName || "")

  const handleSubmit = () => {
    if (!listName) {
      onSubmit(false)
      return
    }
    onSubmit(true, { listName, displayName })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center text-xl font-semibold text-gray-900">
          <Ban className="mr-2 h-5 w-5" />
          {editingItem ? "Edit suppression list" : "Create a new suppression list"}
        </h2>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            List Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="Enter list name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="w-full border-gray-300"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Display Name</label>
          <Input
            type="text"
            placeholder="Enter display name (optional)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border-gray-300"
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
