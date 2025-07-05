"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
    ChevronLeft,
    Users,
    PlusCircle,
    RefreshCw,
    Filter,
    SlidersHorizontal,
    ChevronRight,
    X,
    Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import SidebarNav from "@/components/sidebar-nav"
import MobileSidebar from "@/components/mobile-sidebar"

interface ListData {
    id: string
    name: string
    displayName: string
    subscribersCount: number
}

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
    hasOpened?: boolean  // Add this
    hasClicked?: boolean // Add this
}

interface Column {
    id: string
    label: string
    visible: boolean
}

const EmptyState = ({ onCreateNew, onImport }: { onCreateNew: () => void; onImport: () => void }) => {
    return (
        <div className="rounded-md border border-border p-9 sm:p-16">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-gray-200 p-4">
                    <Users className="h-12 w-12 text-gray-500" />
                </div>
                <h2 className="mb-2 text-xl font-semibold"> Create Your List first Subscribers</h2>
                <p className="max-w-md text-muted-foreground">
                    You can Create a New Subcriber or User List for Your subscribers
                </p>
            </div>
            <div className="flex gap-2"></div>
        </div>
    )
}

// Bulk Action Modal Component
const BulkActionModal = ({
    isOpen,
    onClose,
    onSubmit,
}: {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: { type: "file" | "text"; content: string | File; action: string }) => void
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [textContent, setTextContent] = useState("")
    const [selectedAction, setSelectedAction] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleSubmit = () => {
        if (selectedFile && selectedAction) {
            onSubmit({ type: "file", content: selectedFile, action: selectedAction })
        } else if (textContent && selectedAction) {
            onSubmit({ type: "text", content: textContent, action: selectedAction })
        }
        onClose()
    }
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Bulk action from source</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="px-6 py-4 space-y-6">
                    {/* Info Box */}
                    <div className="bg-blue-500 text-white p-4 rounded-lg text-sm leading-relaxed">
                        Match the subscribers added here against the ones existing in the list and make a bulk action against them!
                        <br />
                        <br />
                        Please note: this is not the list import ability, for list import go to your list overview, followed by
                        Tools box followed by the import box.
                    </div>

                    {/* From File Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">From file</label>
                        <input
                            type="file"
                            accept=".csv,.txt"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        <div className="bg-blue-500 text-white p-3 rounded-md text-xs leading-relaxed">
                            Bulk action from CSV file, one email address per row and/or separated by a comma.
                        </div>
                    </div>

                    {/* From Text Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">From text</label>
                        <Textarea
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            placeholder="Enter email addresses..."
                            className="min-h-[120px] resize-none"
                        />
                        <div className="bg-blue-500 text-white p-3 rounded-md text-xs leading-relaxed">
                            Bulk action from text area, one email address per line and/or separated by a comma.
                        </div>
                    </div>
                    {/* Action Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Action</label>
                        <Select value={selectedAction} onValueChange={setSelectedAction}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="subscribe">Subscribe</SelectItem>
                                <SelectItem value="unsubscribe">Unsubscribe</SelectItem>
                                <SelectItem value="unconfirm">Unconfirm</SelectItem>
                                <SelectItem value="delete">Delete</SelectItem>
                                <SelectItem value="blacklist">Blacklist</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="bg-blue-500 text-white p-3 rounded-md text-xs leading-relaxed">
                            For all the subscribers found in the text area take the action!
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="px-6 py-2"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                            disabled={!selectedAction || (!selectedFile && !textContent)}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}


// Filters Panel Component
const FiltersPanel = ({
    isOpen,
    onClose,
    onApplyFilters,
    onResetFilters,
}: {
    isOpen: boolean
    onClose: () => void
    onApplyFilters: (filters: any) => void
    onResetFilters: () => void
}) => {
    const [subscriberFilter, setSubscriberFilter] = useState("")
    const [campaignFilter, setCampaignFilter] = useState("")
    const [timeValue, setTimeValue] = useState("2")
    const [timeUnit, setTimeUnit] = useState("days")

    const handleSetFilters = () => {
        onApplyFilters({
            subscriber: subscriberFilter,
            campaign: campaignFilter,
            timeValue: timeValue,
            timeUnit: timeUnit,
        })
        // Don't close the panel, keep it open to show applied filters
    }

    const handleResetFilters = () => {
        setSubscriberFilter("")
        setCampaignFilter("")
        setTimeValue("2")
        setTimeUnit("days")
        onResetFilters()
        // Don't close the panel, keep it open
    }

    if (!isOpen) return null

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <h3 className="text-sm font-medium text-gray-700">Campaigns filters</h3>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        onClick={handleSetFilters}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm"
                    >
                        Set filters
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleResetFilters}
                        className="px-4 py-2 text-sm"
                    >
                        Reset filters
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="block text-xs text-gray-600 font-medium">Show only subscribers that:</label>
                    <Select value={subscriberFilter} onValueChange={setSubscriberFilter}>
                        <SelectTrigger className="h-9 bg-white">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="opened">Did open</SelectItem>
                            <SelectItem value="clicked">Did click</SelectItem>
                            <SelectItem value="not-opened">Did not open</SelectItem>
                            <SelectItem value="not-clicked">Did not click</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs text-gray-600 font-medium">This campaign:</label>
                    <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                        <SelectTrigger className="h-9 bg-white">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newsletter1">Newsletter #1</SelectItem>
                            <SelectItem value="newsletter2">Newsletter #2</SelectItem>
                            <SelectItem value="promo1">Promo Campaign</SelectItem>
                            <SelectItem value="welcome">Welcome Series</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs text-gray-600 font-medium">In the last:</label>
                    <div className="flex gap-2 items-center">
                        <Input
                            type="number"
                            value={timeValue}
                            onChange={(e) => setTimeValue(e.target.value)}
                            className="h-9 w-20 bg-white"
                            min="1"
                        />
                        <Select value={timeUnit} onValueChange={setTimeUnit}>
                            <SelectTrigger className="h-9 w-24 bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="days">Days</SelectItem>
                                <SelectItem value="months">Months</SelectItem>
                                <SelectItem value="years">Years</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}



// Edit Modal Component
const EditSubscriberModal = ({
    subscriber,
    onSave,
    onCancel,
}: {
    subscriber: Subscriber | null
    onSave: (updatedSubscriber: Subscriber) => void
    onCancel: () => void
}) => {
    const [formData, setFormData] = useState<Subscriber | null>(null)

    useEffect(() => {
        if (subscriber) {
            setFormData({ ...subscriber })
        }
    }, [subscriber])

    if (!subscriber || !formData) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Edit Subscriber</h3>
                    <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <Input
                            value={formData.firstName || ""}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <Input
                            value={formData.lastName || ""}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value as Subscriber["status"] })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
                                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                                <SelectItem value="bounced">Bounced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                            <Check className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Delete Confirmation Modal
const DeleteConfirmationModal = ({
    subscriber,
    onConfirm,
    onCancel,
}: {
    subscriber: Subscriber | null
    onConfirm: () => void
    onCancel: () => void
}) => {
    if (!subscriber) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-red-600">Delete Subscriber</h3>
                    <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-700 mb-2">Are you sure you want to delete this subscriber?</p>
                    <div className="bg-gray-50 p-3 rounded border">
                        <p className="font-medium">{subscriber.email}</p>
                        <p className="text-sm text-gray-600">
                            {subscriber.firstName} {subscriber.lastName}
                        </p>
                    </div>
                    <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white">
                        Delete Subscriber
                    </Button>
                </div>
            </div>
        </div>
    )
}

const SubscribersTable = ({
    subscribers,
    selectedSubscribers,
    onSelectSubscriber,
    onSelectAll,
    onUpdateSubscriber,
    onDeleteSubscriber,
    columns,
    searchFilters,
    onSearchFilterChange,
}: {
    subscribers: Subscriber[]
    selectedSubscribers: string[]
    onSelectSubscriber: (id: string) => void
    onSelectAll: (checked: boolean) => void
    onUpdateSubscriber: (updatedSubscriber: Subscriber) => void
    onDeleteSubscriber: (subscriberId: string) => void
    columns: Column[]
    searchFilters: Record<string, string>
    onSearchFilterChange: (column: string, value: string) => void
}) => {
    const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null)
    const [deletingSubscriber, setDeletingSubscriber] = useState<Subscriber | null>(null)

    const getStatusBadge = (status: Subscriber["status"]) => {
        const variants = {
            confirmed: "bg-green-100 text-green-800",
            unconfirmed: "bg-yellow-100 text-yellow-800",
            unsubscribed: "bg-red-100 text-red-800",
            bounced: "bg-gray-100 text-gray-800",
        }

        return <Badge className={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
    }

    const handleEditSubscriber = (subscriber: Subscriber) => {
        setEditingSubscriber(subscriber)
    }

    const handleSaveEdit = (updatedSubscriber: Subscriber) => {
        onUpdateSubscriber(updatedSubscriber)
        setEditingSubscriber(null)
    }

    const handleDeleteSubscriber = (subscriber: Subscriber) => {
        setDeletingSubscriber(subscriber)
    }

    const handleConfirmDelete = () => {
        if (deletingSubscriber) {
            onDeleteSubscriber(deletingSubscriber.id)
            setDeletingSubscriber(null)
        }
    }

    const handleViewProfile = (subscriber: Subscriber) => {
        alert(
            `Profile Info:\n\nEmail: ${subscriber.email}\nName: ${subscriber.firstName || "N/A"} ${subscriber.lastName || "N/A"}\nStatus: ${subscriber.status}\nDate Added: ${formatDate(subscriber.dateAdded)}\nUnique ID: ${subscriber.uniqueId}`,
        )
    }

    const handleSendEmail = (subscriber: Subscriber) => {
        const subject = encodeURIComponent("Newsletter Update")
        const body = encodeURIComponent(
            `Dear ${subscriber.firstName || "Subscriber"},\n\nThank you for subscribing to our newsletter!\n\nBest regards,\nThe Team`,
        )
        window.location.href = `mailto:${subscriber.email}?subject=${subject}&body=${body}`
    }

    const handleExportSubscriber = (subscriber: Subscriber) => {
        const dataStr = JSON.stringify(subscriber, null, 2)
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
        const exportFileDefaultName = `subscriber_${subscriber.uniqueId}.json`

        const linkElement = document.createElement("a")
        linkElement.setAttribute("href", dataUri)
        linkElement.setAttribute("download", exportFileDefaultName)
        linkElement.click()
    }

    const handleBackSubscriber = (subscriber: Subscriber) => {
        console.log("Restore subscriber:", subscriber)
        alert(`Restore functionality for ${subscriber.email} - Implementation needed`)
    }

    const handleCreateCampaign = (subscriber: Subscriber) => {
        console.log("Create campaign for:", subscriber)
        alert(`Create campaign for ${subscriber.email} - Implementation needed`)
    }

    const handleBlacklistSubscriber = (subscriberId: string) => {
        console.log("Blacklist subscriber:", subscriberId)
        alert(`Blacklist subscriber functionality - Implementation needed`)
    }

    const handleBlacklistIP = (ipAddress: string | undefined) => {
        if (ipAddress) {
            console.log("Blacklist IP:", ipAddress)
            alert(`Blacklist IP ${ipAddress} functionality - Implementation needed`)
        }
    }

    const visibleColumns = columns.filter((col) => col.visible)

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200">
                {/* Search Row Above Headers */}
                <div className="border-b border-gray-200 p-3">
                    <div className="flex gap-3 items-center">
                        {/* Empty space for checkbox column */}
                        <div className="w-12"></div>

                        {visibleColumns.map((column) => (
                            <div key={column.id} className="flex-1 min-w-0">
                                {/* Add search boxes for specific columns only */}
                                {(column.id === "uniqueId" ||
                                    column.id === "status" ||
                                    column.id === "firstName") && (
                                        <div className="w-full">
                                            {column.id === "status" ? (
                                                <Select
                                                    value={searchFilters[column.id] || "all"}
                                                    onValueChange={(value) => onSearchFilterChange(column.id, value === "all" ? "" : value)}
                                                >
                                                    <SelectTrigger className="h-8 text-xs">
                                                        <SelectValue placeholder="All" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All</SelectItem>
                                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                                        <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
                                                        <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                                                        <SelectItem value="bounced">Bounced</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input
                                                    placeholder={`Search ${column.label.toLowerCase()}...`}
                                                    value={searchFilters[column.id] || ""}
                                                    onChange={(e) => onSearchFilterChange(column.id, e.target.value)}
                                                    className="h-8 text-xs"
                                                />
                                            )}
                                        </div>
                                    )}
                                {/* For columns without search, show empty div to maintain alignment */}
                            </div>
                        ))}

                        {/* Empty space for Options column */}
                        <div className="w-20"></div>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                                    onCheckedChange={onSelectAll}
                                />
                            </TableHead>
                            {visibleColumns.map((column) => (
                                <TableHead key={column.id} className="text-left">
                                    {column.label}
                                </TableHead>
                            ))}
                            <TableHead className="w-20 text-left">Options</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {subscribers.map((subscriber) => (
                            <TableRow key={subscriber.id} className="relative">
                                <TableCell>
                                    <Checkbox
                                        checked={selectedSubscribers.includes(subscriber.id)}
                                        onCheckedChange={() => onSelectSubscriber(subscriber.id)}
                                    />
                                </TableCell>
                                {visibleColumns.map((column) => (
                                    <TableCell key={column.id}>
                                        {column.id === "uniqueId" && <span className="font-mono text-sm">{subscriber.uniqueId}</span>}
                                        {column.id === "dateAdded" && formatDate(subscriber.dateAdded)}
                                        {column.id === "ipAddress" && (
                                            <span className="font-mono text-sm">{subscriber.ipAddress || "-"}</span>
                                        )}
                                        {column.id === "status" && getStatusBadge(subscriber.status)}
                                        {column.id === "email" && <span className="font-medium">{subscriber.email}</span>}
                                        {column.id === "firstName" && (subscriber.firstName || "-")}
                                        {column.id === "lastName" && (subscriber.lastName || "-")}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <div className="relative">
                                        <button
                                            onMouseEnter={() => {
                                                document.getElementById(`action-row-${subscriber.id}`)?.classList.remove("hidden")
                                            }}
                                            onMouseLeave={() => {
                                                setTimeout(() => {
                                                    const actionRow = document.getElementById(`action-row-${subscriber.id}`)
                                                    if (actionRow && !actionRow.matches(":hover")) {
                                                        actionRow.classList.add("hidden")
                                                    }
                                                }, 100)
                                            }}
                                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
                                            title="Options"
                                        >
                                            <span className="text-sm">⚙️</span>
                                        </button>

                                        <div
                                            id={`action-row-${subscriber.id}`}
                                            className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 z-50 hidden"
                                            onMouseEnter={() => {
                                                document.getElementById(`action-row-${subscriber.id}`)?.classList.remove("hidden")
                                            }}
                                            onMouseLeave={() => {
                                                document.getElementById(`action-row-${subscriber.id}`)?.classList.add("hidden")
                                            }}
                                        >
                                            <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg p-1 shadow-lg">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleViewProfile(subscriber)
                                                        document.getElementById(`action-row-${subscriber.id}`)?.classList.add("hidden")
                                                    }}
                                                    className="w-7 h-7 bg-gray-500 hover:bg-gray-600 rounded flex items-center justify-center transition-colors"
                                                    title="Profile Info"
                                                >
                                                    <span className="text-white text-xs">👤</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleSendEmail(subscriber)
                                                        document.getElementById(`action-row-${subscriber.id}`)?.classList.add("hidden")
                                                    }}
                                                    className="w-7 h-7 bg-green-500 hover:bg-green-600 rounded flex items-center justify-center transition-colors"
                                                    title="Send Mail"
                                                >
                                                    <span className="text-white text-xs">📧</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleEditSubscriber(subscriber)
                                                        document.getElementById(`action-row-${subscriber.id}`)?.classList.add("hidden")
                                                    }}
                                                    className="w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center transition-colors"
                                                    title="Update"
                                                >
                                                    <span className="text-white text-xs">✏️</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleBackSubscriber(subscriber)
                                                        document.getElementById(`action-row-${subscriber.id}`)?.classList.add("hidden")
                                                    }}
                                                    className="w-7 h-7 bg-orange-500 hover:bg-orange-600 rounded flex items-center justify-center transition-colors"
                                                    title="Back"
                                                >
                                                    <span className="text-white text-xs">↩️</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleExportSubscriber(subscriber)
                                                        document.getElementById(`action-row-${subscriber.id}`)?.classList.add("hidden")
                                                    }}
                                                    className="w-7 h-7 bg-purple-500 hover:bg-purple-600 rounded flex items-center justify-center transition-colors"
                                                    title="Export Info"
                                                >
                                                    <span className="text-white text-xs">📤</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleCreateCampaign(subscriber)
                                                        document.getElementById(`action-row-${subscriber.id}`)?.classList.add("hidden")
                                                    }}
                                                    className="w-7 h-7 bg-teal-500 hover:bg-teal-600 rounded flex items-center justify-center transition-colors"
                                                    title="Create Campaign"
                                                >
                                                    <span className="text-white text-xs">📝</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleBlacklistSubscriber(subscriber.id)
                                                        document.getElementById(`action-row-${subscriber.id}`)?.classList.add("hidden")
                                                    }}
                                                    className="w-7 h-7 bg-yellow-500 hover:bg-yellow-600 rounded flex items-center justify-center transition-colors"
                                                    title="Blacklist Subscriber"
                                                >
                                                    <span className="text-white text-xs">🚫</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleBlacklistIP(subscriber.ipAddress)
                                                        document.getElementById(`action-row-${subscriber.id}`)?.classList.add("hidden")
                                                    }}
                                                    className="w-7 h-7 bg-red-600 hover:bg-red-700 rounded flex items-center justify-center transition-colors"
                                                    title="Blacklist IP"
                                                >
                                                    <span className="text-white text-xs">🔒</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteSubscriber(subscriber)
                                                        document.getElementById(`action-row-${subscriber.id}`)?.classList.add("hidden")
                                                    }}
                                                    className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
                                                    title="Delete"
                                                >
                                                    <span className="text-white text-xs">🗑️</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <EditSubscriberModal
                subscriber={editingSubscriber}
                onSave={handleSaveEdit}
                onCancel={() => setEditingSubscriber(null)}
            />

            <DeleteConfirmationModal
                subscriber={deletingSubscriber}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeletingSubscriber(null)}
            />
        </>
    )
}

export default function ListSubscribersPage() {
    const params = useParams()
    const router = useRouter()
    const listId = params.id as string
    const [listData, setListData] = useState<ListData | null>(null)
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
    const [showColumnsDropdown, setShowColumnsDropdown] = useState(false)
    const [showBulkActionModal, setShowBulkActionModal] = useState(false)
    const [showFiltersPanel, setShowFiltersPanel] = useState(false)
    const [searchFilters, setSearchFilters] = useState<Record<string, string>>({})
    const [appliedFilters, setAppliedFilters] = useState<any>(null)

    // Original table columns - keeping the same names
    const [columns, setColumns] = useState<Column[]>([
        { id: "uniqueId", label: "Unique ID", visible: true },
        { id: "dateAdded", label: "Date added", visible: true },
        { id: "ipAddress", label: "Ip address", visible: true },
        { id: "status", label: "Status", visible: true },
        { id: "email", label: "Email", visible: true },
        { id: "firstName", label: "First name", visible: true },
        { id: "lastName", label: "Last name", visible: true },
    ])

    const loadData = () => {
        try {
            const savedSubscribers = localStorage.getItem(`subscribers_${listId}`)
            const subscribersData = savedSubscribers ? JSON.parse(savedSubscribers) : []

            const mockListData: ListData = {
                id: listId,
                name: "shyamashree",
                displayName: "Shyamashree Newsletter",
                subscribersCount: subscribersData.length,
            }

            setListData(mockListData)
            setSubscribers(subscribersData)
            setLoading(false)
        } catch (error) {
            console.error("Error loading data:", error)
            setLoading(false)
        }
    }

    const saveData = (newSubscribers: Subscriber[]) => {
        try {
            localStorage.setItem(`subscribers_${listId}`, JSON.stringify(newSubscribers))
            setSubscribers(newSubscribers)
            if (listData) {
                setListData({ ...listData, subscribersCount: newSubscribers.length })
            }
        } catch (error) {
            console.error("Error saving data:", error)
        }
    }

    useEffect(() => {
        loadData()
    }, [listId])

    useEffect(() => {
        const handleFocus = () => {
            loadData()
        }

        window.addEventListener("focus", handleFocus)
        return () => window.removeEventListener("focus", handleFocus)
    }, [listId])

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                loadData()
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

    const handleCreateNew = () => {
        router.push(`/lists/${listId}/subscribers/new`)
    }

    const handleRefresh = () => {
        setLoading(true)
        // Force a complete page refresh
        window.location.reload()
    }

    const handleImport = () => {
        router.push(`/lists/${listId}/subscribers/import`)
    }

    const handleSelectSubscriber = (subscriberId: string) => {
        setSelectedSubscribers((prev) =>
            prev.includes(subscriberId) ? prev.filter((id) => id !== subscriberId) : [...prev, subscriberId],
        )
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectedSubscribers(checked ? subscribers.map((s) => s.id) : [])
    }

    const handleUpdateSubscriber = (updatedSubscriber: Subscriber) => {
        const newSubscribers = subscribers.map((sub) => (sub.id === updatedSubscriber.id ? updatedSubscriber : sub))
        saveData(newSubscribers)
    }

    const handleDeleteSubscriber = (subscriberId: string) => {
        const newSubscribers = subscribers.filter((sub) => sub.id !== subscriberId)
        saveData(newSubscribers)
        setSelectedSubscribers((prev) => prev.filter((id) => id !== subscriberId))
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

    const handleSearchFilterChange = (column: string, value: string) => {
        setSearchFilters((prev) => ({
            ...prev,
            [column]: value,
        }))
    }

    const handleBulkAction = (action: string) => {
        if (selectedSubscribers.length === 0) {
            alert("Please select subscribers first")
            return
        }

        switch (action) {
            case "subscribe":
                const subscribedData = subscribers.map((sub) =>
                    selectedSubscribers.includes(sub.id) ? { ...sub, status: "confirmed" as const } : sub,
                )
                saveData(subscribedData)
                setSelectedSubscribers([])
                alert(`${selectedSubscribers.length} subscribers marked as confirmed`)
                break
            case "unsubscribe":
                const unsubscribedData = subscribers.map((sub) =>
                    selectedSubscribers.includes(sub.id) ? { ...sub, status: "unsubscribed" as const } : sub,
                )
                saveData(unsubscribedData)
                setSelectedSubscribers([])
                alert(`${selectedSubscribers.length} subscribers unsubscribed`)
                break
            case "unconfirm":
                const unconfirmedData = subscribers.map((sub) =>
                    selectedSubscribers.includes(sub.id) ? { ...sub, status: "unconfirmed" as const } : sub,
                )
                saveData(unconfirmedData)
                setSelectedSubscribers([])
                alert(`${selectedSubscribers.length} subscribers marked as unconfirmed`)
                break
            case "resend":
                alert(`Resend confirmation email to ${selectedSubscribers.length} subscribers - Implementation needed`)
                break
            case "disable":
                alert(`Disable ${selectedSubscribers.length} subscribers - Implementation needed`)
                break
            case "delete":
                if (confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscribers?`)) {
                    const remainingData = subscribers.filter((sub) => !selectedSubscribers.includes(sub.id))
                    saveData(remainingData)
                    setSelectedSubscribers([])
                    alert(`${selectedSubscribers.length} subscribers deleted`)
                }
                break
            case "blacklist":
                alert(`Blacklist IPs for ${selectedSubscribers.length} subscribers - Implementation needed`)
                break
            default:
                break
        }
    }

    const handleBulkActionSubmit = (data: { type: "file" | "text"; content: string | File; action: string }) => {
        console.log("Bulk action submitted:", data)
        alert(`Bulk action "${data.action}" submitted with ${data.type} - Implementation needed`)
    }

    const handleApplyFilters = (filters: any) => {
        setAppliedFilters(filters)
        console.log("Applied filters:", filters)
    }

    const handleResetFilters = () => {
        setAppliedFilters(null)
        setSearchFilters({})
    }

    const filteredSubscribers = subscribers.filter((subscriber) => {
        // Apply search filters
        for (const [column, filterValue] of Object.entries(searchFilters)) {
            if (!filterValue) continue

            let fieldValue = ""
            switch (column) {
                case "uniqueId":
                    fieldValue = subscriber.uniqueId.toLowerCase()
                    break
                case "ipAddress":
                    fieldValue = (subscriber.ipAddress || "").toLowerCase()
                    break
                case "status":
                    fieldValue = subscriber.status.toLowerCase()
                    break
                case "email":
                    fieldValue = subscriber.email.toLowerCase()
                    break
                case "firstName":
                    fieldValue = (subscriber.firstName || "").toLowerCase()
                    break
                default:
                    continue
            }

            if (column === "status") {
                if (fieldValue !== filterValue.toLowerCase()) {
                    return false
                }
            } else {
                if (!fieldValue.includes(filterValue.toLowerCase())) {
                    return false
                }
            }
        }

        // Apply campaign filters
        // Apply campaign filters
        if (appliedFilters) {
            if (appliedFilters.subscriber) {
                switch (appliedFilters.subscriber) {
                    case "bounced":
                        if (subscriber.status !== "bounced") return false;
                        break;
                    case "unsubscribed":
                        if (subscriber.status !== "unsubscribed") return false;
                        break;
                    case "opened":
                        // Add logic for opened emails (you'll need to add this field to subscriber data)
                        // if (!subscriber.hasOpened) return false;
                        break;
                    case "clicked":
                        // Add logic for clicked emails (you'll need to add this field to subscriber data)
                        // if (!subscriber.hasClicked) return false;
                        break;
                    case "not-opened":
                        // Add logic for not opened emails
                        // if (subscriber.hasOpened) return false;
                        break;
                    case "not-clicked":
                        // Add logic for not clicked emails
                        // if (subscriber.hasClicked) return false;
                        break;
                }
            }
        }


        return true
    })


    if (loading) {
        return (
            <div className="flex h-screen bg-background">
                <SidebarNav />
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
            <div className="hidden lg:block">
                <SidebarNav />
            </div>

            <MobileSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <div className="mx-auto max-w-7xl">
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

                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Users className="h-6 w-6 text-gray-700" />
                                    <h1 className="text-2xl font-semibold text-gray-900">List subscribers</h1>
                                </div>
                                <div className="flex gap-2 relative">
                                    {subscribers.length > 0 && (
                                        <>
                                            <div className="dropdown-container relative">
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-500 hover:bg-blue-600"
                                                    onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
                                                >
                                                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                                                    Toggle columns
                                                </Button>
                                                {/* Toggle Columns Dropdown */}
                                                {showColumnsDropdown && (
                                                    <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
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

                                            <Button
                                                size="sm"
                                                className="bg-blue-500 hover:bg-blue-600"
                                                onClick={() => setShowBulkActionModal(true)}
                                            >
                                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                                Bulk action from source
                                            </Button>
                                        </>
                                    )}
                                    <Button onClick={handleCreateNew} size="sm" className="bg-blue-500 hover:bg-blue-600">
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Create new
                                    </Button>
                                    <Button
                                        onClick={handleRefresh}
                                        size="sm"
                                        className="bg-blue-500 hover:bg-blue-600"
                                        disabled={loading}
                                    >
                                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                        Refresh
                                    </Button>
                                    {subscribers.length > 0 && (
                                        <Button
                                            size="sm"
                                            className="bg-blue-500 hover:bg-blue-600"
                                            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                                        >
                                            <Filter className="h-4 w-4 mr-2" />
                                            {showFiltersPanel ? 'Hide Filters' : 'Filters'}
                                        </Button>
                                    )}

                                </div>
                            </div>

                            {/* Filters Panel */}
                            <FiltersPanel
                                isOpen={showFiltersPanel}
                                onClose={() => setShowFiltersPanel(false)}
                                onApplyFilters={handleApplyFilters}
                                onResetFilters={handleResetFilters}
                            />

                            {subscribers.length === 0 ? (
                                <EmptyState onCreateNew={handleCreateNew} onImport={handleImport} />
                            ) : (
                                <div className="space-y-6">
                                    {/* Show bulk actions dropdown when subscribers are selected */}
                                    {selectedSubscribers.length > 0 && (

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Select onValueChange={handleBulkAction}>
                                                    <SelectTrigger className="w-48 h-8">
                                                        <SelectValue placeholder="With selected:" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="subscribe">Subscribe</SelectItem>
                                                        <SelectItem value="unsubscribe">Unsubscribe</SelectItem>
                                                        <SelectItem value="unconfirm">Unconfirm</SelectItem>
                                                        <SelectItem value="resend">Resend confirmation email</SelectItem>
                                                        <SelectItem value="disable">Disable</SelectItem>
                                                        <SelectItem value="delete">Delete</SelectItem>
                                                        <SelectItem value="blacklist">Blacklist IPs</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    <SubscribersTable
                                        subscribers={filteredSubscribers}
                                        selectedSubscribers={selectedSubscribers}
                                        onSelectSubscriber={handleSelectSubscriber}
                                        onSelectAll={handleSelectAll}
                                        onUpdateSubscriber={handleUpdateSubscriber}
                                        onDeleteSubscriber={handleDeleteSubscriber}
                                        columns={columns}
                                        searchFilters={searchFilters}
                                        onSearchFilterChange={handleSearchFilterChange}
                                    />

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            Showing {filteredSubscribers.length} of {subscribers.length} subscribers
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" disabled>
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <span className="text-sm font-medium">10</span>
                                            <Button variant="outline" size="sm" disabled>
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bulk Action Modal */}
            <BulkActionModal
                isOpen={showBulkActionModal}
                onClose={() => setShowBulkActionModal(false)}
                onSubmit={handleBulkActionSubmit}
            />
        </div>
    )
}
