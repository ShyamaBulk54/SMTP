"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  PlusCircle,
  Archive,
  RefreshCw,
  List,
  SlidersHorizontal,
  Users,
  Download,
  ChevronLeft,
  Info,
  X,
} from "lucide-react"

// Custom Button component
const Button = ({ children, variant = "default", size = "default", className = "", onClick, disabled, ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
  }

  const sizeClasses = {
    default: "h-8 px-3 py-1 text-sm",
    sm: "h-7 px-2 text-xs",
    lg: "h-10 px-4 text-base",
    icon: "h-8 w-8",
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Custom Input component with tooltip
const InputWithTooltip = ({ label, tooltip, required, className = "", error, ...props }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Info
            className="h-4 w-4 text-gray-400 cursor-help"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50">
              <div className="relative">
                {tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <input
        className={`flex h-10 w-full rounded-md border ${error ? "border-red-500" : "border-gray-300"} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// Custom Textarea with tooltip
const TextareaWithTooltip = ({ label, tooltip, required, className = "", error, ...props }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Info
            className="h-4 w-4 text-gray-400 cursor-help"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50">
              <div className="relative">
                {tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <textarea
        className={`flex min-h-20 w-full rounded-md border ${error ? "border-red-500" : "border-gray-300"} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// Custom Select with tooltip
const SelectWithTooltip = ({ label, tooltip, required, children, className = "", error, ...props }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Info
            className="h-4 w-4 text-gray-400 cursor-help"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50">
              <div className="relative">
                {tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <select
        className={`flex h-10 w-full rounded-md border ${error ? "border-red-500" : "border-gray-300"} bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// Custom Input component (simple)
const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

// Custom Textarea component (simple)
const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

// Custom Checkbox component
const Checkbox = ({ id, checked, onCheckedChange, label, ...props }) => {
  return (
    <div className="flex items-center space-x-2 border-b border-gray-100 py-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        {...props}
      />
      {label && (
        <label htmlFor={id} className="text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  )
}

// Success Toast Component
const SuccessToast = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center gap-2">
      <div className="w-2 h-2 bg-white rounded-full"></div>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
        ×
      </button>
    </div>
  )
}

// Error Toast Component
const ErrorToast = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center gap-2">
      <div className="w-2 h-2 bg-white rounded-full"></div>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
        ×
      </button>
    </div>
  )
}

interface EmailList {
  id: string
  uniqueId: string
  name: string
  displayName: string
  subscribersCount: number
  optIn: string
  optOut: string
  dateAdded: string
  lastUpdated: string
  archived?: boolean // Add this property
}

interface Column {
  id: string
  label: string
  visible: boolean
}

interface CreateListFormData {
  name: string
  displayName: string
  description: string
  optIn: string
  optOut: string
  fromName: string
  fromEmail: string
  replyTo: string
  subject: string
  companyName: string
  companyIndustry: string
  companyCountry: string
  companyZone: string
  companyAddress1: string
  companyAddress2: string
  companyCity: string
  companyZip: string
  companyPhone: string
  companyWebsite: string
}

interface FormErrors {
  [key: string]: string
}

// Local storage helper functions
const saveListsToStorage = (lists: EmailList[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("emailLists", JSON.stringify(lists))
      console.log("Lists saved to storage:", lists.length)
    } catch (error) {
      console.error("Error saving lists to storage:", error)
    }
  }
}

const loadListsFromStorage = (): EmailList[] => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("emailLists")
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log("Lists loaded from storage:", parsed.length)
        return parsed
      }
    } catch (error) {
      console.error("Error parsing stored lists:", error)
    }
  }
  return []
}

export default function EmailListManager() {
  const [lists, setLists] = useState<EmailList[]>([])
  const [filteredLists, setFilteredLists] = useState<EmailList[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [successMessage, setSuccessMessage] = useState("List created successfully!")
  const [errorMessage, setErrorMessage] = useState("")
  const [columns, setColumns] = useState<Column[]>([
    { id: "uniqueId", label: "Unique ID", visible: true },
    { id: "name", label: "Name", visible: true },
    { id: "displayName", label: "Display name", visible: true },
    { id: "subscribersCount", label: "Subscribers count", visible: true },
    { id: "optIn", label: "Opt in", visible: true },
    { id: "optOut", label: "Opt out", visible: true },
    { id: "dateAdded", label: "Date added", visible: true },
    { id: "lastUpdated", label: "Last updated", visible: true },
    { id: "action", label: "Action", visible: true },
  ])
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false)
  const [showActionsDropdown, setShowActionsDropdown] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [formData, setFormData] = useState<CreateListFormData>({
    name: "",
    displayName: "",
    description: "",
    optIn: "double",
    optOut: "single",
    fromName: "",
    fromEmail: "",
    replyTo: "",
    subject: "",
    companyName: "",
    companyIndustry: "",
    companyCountry: "",
    companyZone: "",
    companyAddress1: "",
    companyAddress2: "",
    companyCity: "",
    companyZip: "",
    companyPhone: "",
    companyWebsite: "",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [showAvailableTags, setShowAvailableTags] = useState(false)
  const [subscriberActionTab, setSubscriberActionTab] = useState("subscribe")
  const [selectedLists, setSelectedLists] = useState({
    selectAll: false,
    subscribe: {},
    unsubscribe: {},
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    uniqueId: "",
    name: "",
    displayName: "",
    subscribersCount: "",
    optIn: "",
    optOut: "",
    dateAdded: "",
    lastUpdated: "",
  })

  // Load lists from localStorage on component mount
const [isInitialLoad, setIsInitialLoad] = useState(true)

// Modify the initial load effect:
useEffect(() => {
  const storedLists = loadListsFromStorage()
  const sortedLists = storedLists.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
  setLists(sortedLists)
  setFilteredLists(sortedLists)
  setIsInitialLoad(false) // Mark initial load as complete
}, [])

// Fix the save effect:
useEffect(() => {
  if (!isInitialLoad && typeof window !== "undefined") { // Only save after initial load
    saveListsToStorage(lists)
  }
}, [lists, isInitialLoad])


  // Archive function
  const handleArchiveList = (id: string) => {
    if (window.confirm("Are you sure you want to archive this list?")) {
      const updatedLists = lists.map((list) => {
        if (list.id === id) {
          return { ...list, archived: true, lastUpdated: new Date().toLocaleDateString() }
        }
        return list
      })
      setLists(updatedLists)
      setSuccessMessage("List archived successfully!")
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
    }
  }

  // Filter lists based on search criteria
  useEffect(() => {
    const activeListsOnly = lists.filter((list) => !list.archived)
    const filtered = activeListsOnly.filter((list) => {
      return (
        list.uniqueId.toLowerCase().includes(searchFilters.uniqueId.toLowerCase()) &&
        list.name.toLowerCase().includes(searchFilters.name.toLowerCase()) &&
        list.displayName.toLowerCase().includes(searchFilters.displayName.toLowerCase()) &&
        list.subscribersCount.toString().includes(searchFilters.subscribersCount) &&
        (searchFilters.optIn === "" || list.optIn === searchFilters.optIn) &&
        (searchFilters.optOut === "" || list.optOut === searchFilters.optOut) &&
        list.dateAdded.toLowerCase().includes(searchFilters.dateAdded.toLowerCase()) &&
        list.lastUpdated.toLowerCase().includes(searchFilters.lastUpdated.toLowerCase())
      )
    })
    setFilteredLists(filtered)
  }, [lists, searchFilters])

  // Add window focus event listener to reload data when coming back to the page
  useEffect(() => {
    const handleFocus = () => {
      const storedLists = loadListsFromStorage()
      const sortedLists = storedLists.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      setLists(sortedLists)
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const storedLists = loadListsFromStorage()
        const sortedLists = storedLists.sort(
          (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
        )
        setLists(sortedLists)
      }
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Add click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".columns-dropdown")) {
        setShowColumnsDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Add click outside handler to close action dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".columns-dropdown") &&
        !event.target.closest("[id^='action-dropdown-']") &&
        !event.target.closest("button")
      ) {
        setShowColumnsDropdown(false)
        // Close all action dropdowns
        document.querySelectorAll('[id^="action-dropdown-"]').forEach((dropdown) => {
          dropdown.classList.add("hidden")
        })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const tabs = ["general", "default", "notifications", "subscribers", "company"]
  const tabNames = {
    general: "General Data",
    default: "Defaults",
    notifications: "Notifications",
    subscribers: "Subscriber Actions",
    company: "Company Details",
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Force reload from localStorage to ensure we have the latest data
    const storedLists = loadListsFromStorage()
    const sortedLists = storedLists.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    setLists(sortedLists)
    await new Promise((resolve) => setTimeout(resolve, 200))
    console.log("Lists refreshed from storage!")
    setIsRefreshing(false)
  }

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 12)
  }

  const exportToCSV = () => {
    const headers = visibleColumns.map((col) => col.label).join(",")

    const rows = filteredLists.map((list) => {
      const rowData = visibleColumns
        .map((col) => {
          const value = list[col.id as keyof EmailList]
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value
        })
        .join(",")
      return rowData
    })

    const csvContent = [headers, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `email-lists-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    setSuccessMessage("Lists exported to CSV successfully!")
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  const clearAllFilters = () => {
    setSearchFilters({
      uniqueId: "",
      name: "",
      displayName: "",
      subscribersCount: "",
      optIn: "",
      optOut: "",
      dateAdded: "",
      lastUpdated: "",
    })
  }

  const validateForm = () => {
    const errors: FormErrors = {}

    // General tab validation
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.displayName.trim()) errors.displayName = "Display name is required"
    if (!formData.description.trim()) errors.description = "Description is required"

    // Default tab validation
    if (!formData.fromName.trim()) errors.fromName = "From name is required"
    if (!formData.fromEmail.trim()) errors.fromEmail = "From email is required"
    if (!formData.replyTo.trim()) errors.replyTo = "Reply to is required"

    // Company details validation
    if (!formData.companyName.trim()) errors.companyName = "Company name is required"
    if (!formData.companyCountry.trim()) errors.companyCountry = "Country is required"
    if (!formData.companyAddress1.trim()) errors.companyAddress1 = "Address 1 is required"
    if (!formData.companyCity.trim()) errors.companyCity = "City is required"
    if (!formData.companyZip.trim()) errors.companyZip = "Zip code is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.fromEmail && !emailRegex.test(formData.fromEmail)) {
      errors.fromEmail = "Please enter a valid email address"
    }
    if (formData.replyTo && !emailRegex.test(formData.replyTo)) {
      errors.replyTo = "Please enter a valid email address"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateList = async () => {
    if (isSubmitting) return // Prevent double submission

    if (!validateForm()) {
      setErrorMessage("Please fill in all required fields correctly")
      setShowErrorToast(true)
      setTimeout(() => setShowErrorToast(false), 3000)
      return
    }

    setIsSubmitting(true)

    try {
      if (editingListId) {
        // Update existing list
        const updatedLists = lists.map((list) => {
          if (list.id === editingListId) {
            return {
              ...list,
              name: formData.name,
              displayName: formData.displayName,
              optIn: formData.optIn,
              optOut: formData.optOut,
              lastUpdated: new Date().toLocaleDateString(),
            }
          }
          return list
        })
        const sortedLists = updatedLists.sort(
          (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
        )
        setLists(sortedLists)
        setSuccessMessage("List updated successfully!")
      } else {
        // Create new list
        const newList: EmailList = {
          id: Date.now().toString(),
          uniqueId: generateUniqueId(),
          name: formData.name,
          displayName: formData.displayName,
          subscribersCount: 0,
          optIn: formData.optIn,
          optOut: formData.optOut,
          dateAdded: new Date().toLocaleDateString(),
          lastUpdated: new Date().toLocaleDateString(),
        }

        const updatedLists = [newList, ...lists] // Add new list at the beginning
        setLists(updatedLists)
        setSuccessMessage("List created successfully!")
      }

      setShowCreateForm(false)
      setFormData({
        name: "",
        displayName: "",
        description: "",
        optIn: "double",
        optOut: "single",
        fromName: "",
        fromEmail: "",
        replyTo: "",
        subject: "",
        companyName: "",
        companyIndustry: "",
        companyCountry: "",
        companyZone: "",
        companyAddress1: "",
        companyAddress2: "",
        companyCity: "",
        companyZip: "",
        companyPhone: "",
        companyWebsite: "",
      })
      setFormErrors({})
      setActiveTab("general")
      setEditingListId(null)

      // Show success toast
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
      setSelectedLists({
        selectAll: false,
        subscribe: {},
        unsubscribe: {},
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handleEditList = (list: EmailList) => {
    setFormData({
      name: list.name,
      displayName: list.displayName,
      description: "",
      optIn: list.optIn,
      optOut: list.optOut,
      fromName: "",
      fromEmail: "",
      replyTo: "",
      subject: "",
      companyName: "",
      companyIndustry: "",
      companyCountry: "",
      companyZone: "",
      companyAddress1: "",
      companyAddress2: "",
      companyCity: "",
      companyZip: "",
      companyPhone: "",
      companyWebsite: "",
    })
    setFormErrors({})
    setEditingListId(list.id)
    setShowCreateForm(true)
  }

  const handleDeleteList = (id: string) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      const updatedLists = lists.filter((list) => list.id !== id)
      setLists(updatedLists)
      setSuccessMessage("List deleted successfully!")
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
    }
  }

  const handleCopyList = (list: EmailList) => {
    const newList: EmailList = {
      ...list,
      id: Date.now().toString(),
      uniqueId: generateUniqueId(),
      name: `${list.name} (Copy)`,
      dateAdded: new Date().toLocaleDateString(),
      lastUpdated: new Date().toLocaleDateString(),
    }
    const updatedLists = [newList, ...lists]
    setLists(updatedLists)
    setSuccessMessage("List copied successfully!")
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
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

  const handleSelectAllChange = (checked) => {
    const allListsState = {}
    lists.forEach((list) => {
      allListsState[list.id] = checked
    })

    setSelectedLists({
      selectAll: checked,
      subscribe: subscriberActionTab === "subscribe" ? allListsState : selectedLists.subscribe,
      unsubscribe: subscriberActionTab === "unsubscribe" ? allListsState : selectedLists.unsubscribe,
    })
  }

  const handleListSelection = (listId, checked) => {
    if (subscriberActionTab === "subscribe") {
      setSelectedLists({
        ...selectedLists,
        subscribe: {
          ...selectedLists.subscribe,
          [listId]: checked,
        },
      })
    } else {
      setSelectedLists({
        ...selectedLists,
        unsubscribe: {
          ...selectedLists.unsubscribe,
          [listId]: checked,
        },
      })
    }
  }

  const visibleColumns = columns.filter((col) => col.visible)

  const AvailableTagsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    const tags = [
      { tag: "[COMPANY_NAME]", required: "YES" },
      { tag: "[COMPANY_WEBSITE]", required: "NO" },
      { tag: "[COMPANY_ADDRESS_1]", required: "YES" },
      { tag: "[COMPANY_ADDRESS_2]", required: "NO" },
      { tag: "[COMPANY_CITY]", required: "YES" },
      { tag: "[COMPANY_ZONE]", required: "NO" },
      { tag: "[COMPANY_ZONE_CODE]", required: "NO" },
      { tag: "[COMPANY_ZIP]", required: "NO" },
      { tag: "[COMPANY_COUNTRY]", required: "YES" },
      { tag: "[COMPANY_COUNTRY_CODE]", required: "NO" },
    ]

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-96 max-h-96">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Available tags</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
              ×
            </button>
          </div>

          <div className="p-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-700">Tag</span>
              <span className="font-medium text-gray-700">Required</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {tags.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 text-sm border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-800 font-mono">{item.tag}</span>
                  <span className={`font-medium ${item.required === "YES" ? "text-green-600" : "text-gray-500"}`}>
                    {item.required}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end p-4 border-t border-gray-200">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Create form view
  if (showCreateForm) {
    const isLastTab = activeTab === "company"

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => {
                setShowCreateForm(false)
                setFormErrors({})
                setActiveTab("general")
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft className="h-4 w-4" />
              {editingListId ? "Edit list" : "back to list"}
            </button>
          </div>

          <div className="rounded-md border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              {/* Tab Navigation */}
              <div className="mb-6 border-b">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tabNames[tab]}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-base font-medium text-gray-900">General Data</h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InputWithTooltip
                        label="Name"
                        tooltip="Your mail list verbose name. It will be shown in your customer area sections and used for internal identification."
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Newsletter Subscribers"
                        error={formErrors.name}
                      />
                      <InputWithTooltip
                        label="Display name"
                        tooltip="The public name that subscribers will see when they receive emails from this list."
                        required
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        placeholder="Weekly Newsletter"
                        error={formErrors.displayName}
                      />
                    </div>

                    <TextareaWithTooltip
                      label="Description"
                      tooltip="A brief description of this list that helps subscribers understand what they're signing up for. Keep it clear and concise."
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Weekly updates about our latest products, tips, and industry news."
                      error={formErrors.description}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <SelectWithTooltip
                        label="Option in"
                        tooltip="Double opt-in requires subscribers to confirm their email address, ensuring higher quality lists. Single opt-in allows immediate subscription."
                        required
                        value={formData.optIn}
                        onChange={(e) => setFormData({ ...formData, optIn: e.target.value })}
                      >
                        <option value="double">Double option-in</option>
                        <option value="single">Single option-in</option>
                        <option value="none">None</option>
                      </SelectWithTooltip>
                      <SelectWithTooltip
                        label="Opt out"
                        tooltip="Single opt-out allows immediate unsubscription. Double opt-out requires confirmation before removing subscribers."
                        required
                        value={formData.optOut}
                        onChange={(e) => setFormData({ ...formData, optOut: e.target.value })}
                      >
                        <option value="single">Single option-out</option>
                        <option value="double">Double option-out</option>
                      </SelectWithTooltip>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "default" && (
                <div className="space-y-6">
                  <h2 className="text-base font-medium text-gray-900">Defaults</h2>
                  <div className="space-y-4">
                    <InputWithTooltip
                      label="From name"
                      tooltip="The sender name that appears in subscribers' inboxes. Use your brand name or personal name for better recognition."
                      required
                      value={formData.fromName}
                      onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                      placeholder="John Smith"
                      error={formErrors.fromName}
                    />

                    <InputWithTooltip
                      label="From email"
                      tooltip="The email address that emails will be sent from. Make sure this is a verified domain email for better deliverability."
                      required
                      value={formData.fromEmail}
                      onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                      placeholder="newsletter@yourcompany.com"
                      error={formErrors.fromEmail}
                    />

                    <InputWithTooltip
                      label="Reply to"
                      tooltip="Where replies to your emails will be sent. This can be different from the 'From' email if you want replies to go to a specific address."
                      required
                      value={formData.replyTo}
                      onChange={(e) => setFormData({ ...formData, replyTo: e.target.value })}
                      placeholder="support@yourcompany.com"
                      error={formErrors.replyTo}
                    />

                    <InputWithTooltip
                      label="Subject"
                      tooltip="Default subject line for emails sent to this list. You can override this for individual campaigns."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Weekly Newsletter - [DATE]"
                    />
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-base font-medium text-gray-900">Notifications</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <SelectWithTooltip label="Subscribe" tooltip="Get notified when someone subscribes to this list.">
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </SelectWithTooltip>

                    <SelectWithTooltip
                      label="Unsubscribe"
                      tooltip="Get notified when someone unsubscribes from this list."
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </SelectWithTooltip>

                    <InputWithTooltip
                      label="Subscribe to"
                      tooltip="Email address to receive subscription notifications."
                      placeholder="admin@yourcompany.com"
                    />

                    <InputWithTooltip
                      label="Unsubscribe to"
                      tooltip="Email address to receive unsubscription notifications."
                      placeholder="admin@yourcompany.com"
                    />
                  </div>
                </div>
              )}

              {activeTab === "subscribers" && (
                <div className="space-y-6">
                  <h2 className="text-base font-medium text-gray-900">Subscriber actions</h2>

                  <div className="flex border-b">
                    <button
                      className={`px-4 py-2 border-b-2 ${subscriberActionTab === "subscribe" ? "border-blue-500 font-medium text-blue-600" : "border-transparent text-gray-600"}`}
                      onClick={() => setSubscriberActionTab("subscribe")}
                    >
                      Actions when subscribe
                    </button>
                    <button
                      className={`px-4 py-2 border-b-2 ${subscriberActionTab === "unsubscribe" ? "border-blue-500 font-medium text-blue-600" : "border-transparent text-gray-600"}`}
                      onClick={() => setSubscriberActionTab("unsubscribe")}
                    >
                      Actions when unsubscribe
                    </button>
                  </div>

                  {subscriberActionTab === "subscribe" && (
                    <>
                      <div className="rounded-md bg-blue-50 p-4 text-blue-800">
                        <p className="text-sm">
                          When a subscriber will subscribe to this list, if they exists in any of the lists below,
                          unsubscribe them from those lists as well. Please note that the unsubscribe from the lists
                          below is silent, no email is sent to the subscriber.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Checkbox
                          id="selectAll"
                          checked={selectedLists.selectAll}
                          onCheckedChange={handleSelectAllChange}
                          label="Select all"
                        />
                        {lists.map((list) => (
                          <Checkbox
                            key={list.id}
                            id={`subscribe-${list.id}`}
                            checked={selectedLists.subscribe[list.id] || false}
                            onCheckedChange={(checked) => handleListSelection(list.id, checked)}
                            label={list.name}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {subscriberActionTab === "unsubscribe" && (
                    <>
                      <div className="rounded-md bg-blue-50 p-4 text-blue-800">
                        <p className="text-sm">
                          When a subscriber will unsubscribe from this list, if they exists in any of the lists below,
                          unsubscribe them from those lists as well. Please note that the unsubscribe from the lists
                          below is silent, no email is sent to the subscriber.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Checkbox
                          id="selectAllUnsubscribe"
                          checked={selectedLists.selectAll}
                          onCheckedChange={handleSelectAllChange}
                          label="Select all"
                        />
                        {lists.map((list) => (
                          <Checkbox
                            key={list.id}
                            id={`unsubscribe-${list.id}`}
                            checked={selectedLists.unsubscribe[list.id] || false}
                            onCheckedChange={(checked) => handleListSelection(list.id, checked)}
                            label={list.name}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "company" && (
                <div className="space-y-6">
                  <h2 className="text-base font-medium text-gray-900">
                    Company details <span className="text-sm text-gray-500">(defaults to account company)</span>
                  </h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputWithTooltip
                      label="Name"
                      tooltip="Your company or organization name that will appear in email footers and legal compliance sections."
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Your Company Name"
                      error={formErrors.companyName}
                    />

                    <SelectWithTooltip
                      label="Type/Industry"
                      tooltip="Select your business type or industry for better categorization and compliance."
                      value={formData.companyIndustry}
                      onChange={(e) => setFormData({ ...formData, companyIndustry: e.target.value })}
                    >
                      <option value="">Please select</option>
                      <option value="technology">Technology & Software</option>
                      <option value="finance">Finance & Banking</option>
                      <option value="healthcare">Healthcare & Medical</option>
                      <option value="retail">Retail & E-commerce</option>
                      <option value="education">Education & Training</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="consulting">Consulting & Professional Services</option>
                      <option value="media">Media & Entertainment</option>
                      <option value="nonprofit">Non-profit Organization</option>
                      <option value="government">Government & Public Sector</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="automotive">Automotive</option>
                      <option value="food-beverage">Food & Beverage</option>
                      <option value="travel">Travel & Tourism</option>
                      <option value="other">Other</option>
                    </SelectWithTooltip>

                    <SelectWithTooltip
                      label="Country"
                      tooltip="Your company's primary country of operation for legal compliance and regulations."
                      required
                      value={formData.companyCountry}
                      onChange={(e) => setFormData({ ...formData, companyCountry: e.target.value })}
                      error={formErrors.companyCountry}
                    >
                      <option value="">Please select</option>
                      <option value="us">United States</option>
                      <option value="ca">Canada</option>
                      <option value="uk">United Kingdom</option>
                      <option value="au">Australia</option>
                      <option value="de">Germany</option>
                      <option value="fr">France</option>
                      <option value="it">Italy</option>
                      <option value="es">Spain</option>
                      <option value="nl">Netherlands</option>
                      <option value="se">Sweden</option>
                      <option value="no">Norway</option>
                      <option value="dk">Denmark</option>
                      <option value="fi">Finland</option>
                      <option value="jp">Japan</option>
                      <option value="kr">South Korea</option>
                      <option value="cn">China</option>
                      <option value="in">India</option>
                      <option value="br">Brazil</option>
                      <option value="mx">Mexico</option>
                      <option value="ar">Argentina</option>
                      <option value="za">South Africa</option>
                      <option value="ng">Nigeria</option>
                      <option value="eg">Egypt</option>
                    </SelectWithTooltip>

                    <SelectWithTooltip
                      label="Zone"
                      tooltip="Geographic zone or region within your country."
                      value={formData.companyZone}
                      onChange={(e) => setFormData({ ...formData, companyZone: e.target.value })}
                    >
                      <option value="">Please select</option>
                      <option value="north-america">North America</option>
                      <option value="south-america">South America</option>
                      <option value="europe">Europe</option>
                      <option value="asia-pacific">Asia Pacific</option>
                      <option value="middle-east">Middle East</option>
                      <option value="africa">Africa</option>
                      <option value="oceania">Oceania</option>
                      <option value="eastern-us">Eastern US</option>
                      <option value="western-us">Western US</option>
                      <option value="central-us">Central US</option>
                      <option value="southern-us">Southern US</option>
                      <option value="northern-us">Northern US</option>
                      <option value="eastern-canada">Eastern Canada</option>
                      <option value="western-canada">Western Canada</option>
                      <option value="central-canada">Central Canada</option>
                      <option value="northern-europe">Northern Europe</option>
                      <option value="southern-europe">Southern Europe</option>
                      <option value="eastern-europe">Eastern Europe</option>
                      <option value="western-europe">Western Europe</option>
                      <option value="central-europe">Central Europe</option>
                    </SelectWithTooltip>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputWithTooltip
                      label="Address 1"
                      tooltip="Primary business address line (street address, building number)."
                      required
                      value={formData.companyAddress1}
                      onChange={(e) => setFormData({ ...formData, companyAddress1: e.target.value })}
                      placeholder="123 Business Street"
                      error={formErrors.companyAddress1}
                    />

                    <InputWithTooltip
                      label="Address 2"
                      tooltip="Additional address information (suite, apartment, floor number)."
                      value={formData.companyAddress2}
                      onChange={(e) => setFormData({ ...formData, companyAddress2: e.target.value })}
                      placeholder="Suite 100"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InputWithTooltip
                      label="City"
                      tooltip="City where your business is located."
                      required
                      value={formData.companyCity}
                      onChange={(e) => setFormData({ ...formData, companyCity: e.target.value })}
                      placeholder="New York"
                      error={formErrors.companyCity}
                    />

                    <InputWithTooltip
                      label="Zip code"
                      tooltip="Postal or ZIP code for your business address."
                      required
                      value={formData.companyZip}
                      onChange={(e) => setFormData({ ...formData, companyZip: e.target.value })}
                      placeholder="10001"
                      error={formErrors.companyZip}
                    />

                    <InputWithTooltip
                      label="Phone"
                      tooltip="Business phone number for customer contact."
                      value={formData.companyPhone}
                      onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <InputWithTooltip
                    label="Website"
                    tooltip="Your company website URL."
                    value={formData.companyWebsite}
                    onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                    placeholder="https://yourcompany.com"
                  />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Address format <span className="text-red-500">*</span>
                      </label>
                      <button
                        onClick={() => setShowAvailableTags(true)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium cursor-pointer"
                      >
                        [Available tags]
                      </button>
                    </div>
                    <Textarea
                      className="min-h-[120px] border-gray-300 font-mono"
                      defaultValue={`[COMPANY_NAME]
[COMPANY_ADDRESS_1] [COMPANY_ADDRESS_2]
[COMPANY_CITY] [COMPANY_ZONE] [COMPANY_ZIP]
[COMPANY_COUNTRY]
[COMPANY_WEBSITE]`}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false)
                    setFormErrors({})
                    setActiveTab("general")
                  }}
                >
                  Cancel
                </Button>
                <div className="flex gap-3">
                  {!isLastTab && (
                    <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleNextTab}>
                      Next
                    </Button>
                  )}
                  {isLastTab && (
                    <Button
                      className="bg-green-500 text-white hover:bg-green-600"
                      onClick={handleCreateList}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : editingListId ? "Update" : "Save"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <AvailableTagsModal isOpen={showAvailableTags} onClose={() => setShowAvailableTags(false)} />
      </div>
    )
  }

  // Empty state when no lists exist
  if (lists.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {showSuccessToast && <SuccessToast message={successMessage} onClose={() => setShowSuccessToast(false)} />}
        {showErrorToast && <ErrorToast message={errorMessage} onClose={() => setShowErrorToast(false)} />}
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <List className="h-6 w-6 text-gray-700" />
              <h1 className="text-2xl font-semibold text-gray-900">Lists</h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded-md flex items-center justify-center gap-2 font-medium transition-colors text-sm"
                onClick={() => setShowCreateForm(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Create new
              </button>
              <Link
                href="/lists/archived"
                className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded-md flex items-center justify-center gap-2 font-medium transition-colors text-sm"
              >
                <Archive className="h-4 w-4" />
                Archived lists
              </Link>
              <button
                className={`bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded-md flex items-center justify-center gap-2 font-medium transition-colors text-sm ${isRefreshing ? "opacity-75" : ""}`}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg bg-white p-16 shadow-sm min-h-96">
            <div className="mb-6 rounded-lg bg-gray-100 p-6">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">Create your first email list</h2>
            <p className="max-w-lg text-center text-gray-600 leading-relaxed">
              Start creating your first email list, add subscribers to it, edit it's forms and pages and create custom
              fields that you can later use for segmentation.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // List table view (when lists exist)
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showSuccessToast && <SuccessToast message={successMessage} onClose={() => setShowSuccessToast(false)} />}
      {showErrorToast && <ErrorToast message={errorMessage} onClose={() => setShowErrorToast(false)} />}
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <List className="h-5 w-5 text-gray-700" />
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Lists</h1>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <div className="relative columns-dropdown">
              <button
                className="bg-blue-500 text-white hover:bg-blue-600 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1 font-medium transition-colors"
                onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
              >
                <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Toggle columns</span>
                <span className="sm:hidden">Columns</span>
              </button>
              {showColumnsDropdown && (
                <div className="absolute top-full right-0 mt-1 w-48 sm:w-56 bg-white rounded-md shadow-lg border z-50">
                  <div className="p-3">
                    {columns.map((column) => (
                      <div key={column.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={column.id}
                          checked={column.visible}
                          onCheckedChange={() => toggleColumn(column.id)}
                        />
                        <label htmlFor={column.id} className="text-xs sm:text-sm font-medium text-gray-700">
                          {column.label}
                        </label>
                      </div>
                    ))}
                    <button
                      className="mt-3 w-full bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded text-xs font-medium"
                      onClick={saveColumnChanges}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/subscribers"
              className="bg-blue-500 text-white hover:bg-blue-600 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1 font-medium transition-colors"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">All subscribers</span>
              <span className="sm:hidden">Subscribers</span>
            </Link>
            <button
              className="bg-blue-500 text-white hover:bg-blue-600 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1 font-medium transition-colors"
              onClick={() => setShowCreateForm(true)}
            >
              <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Create new</span>
              <span className="sm:hidden">Create</span>
            </button>
            <Link
              href="/lists/archived"
              className="bg-blue-500 text-white hover:bg-blue-600 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1 font-medium transition-colors"
            >
              <Archive className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Archived lists</span>
              <span className="sm:hidden">Archived</span>
            </Link>
            <button
              className="bg-blue-500 text-white hover:bg-blue-600 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1 font-medium transition-colors"
              onClick={exportToCSV}
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </button>
            <button
              className={`bg-blue-500 text-white hover:bg-blue-600 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1 font-medium transition-colors ${isRefreshing ? "opacity-75" : ""}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Refresh</span>
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Displaying 1-{filteredLists.length} of {lists.length} result{lists.length !== 1 ? "s" : ""}.
            {filteredLists.length !== lists.length && (
              <span className="ml-2 text-blue-600">({filteredLists.length} filtered)</span>
            )}
          </div>
          {Object.values(searchFilters).some((filter) => filter !== "") && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear all filters
            </button>
          )}
        </div>

        <div className="rounded-md border border-gray-200 bg-white shadow-sm">
          {/* Search Filters Row */}
          <div className="border-b border-gray-200 bg-gray-50 p-2">
            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-[600px]">
                {visibleColumns.map((column) => (
                  <div key={column.id} className="flex-1 min-w-[120px]">
                    {column.id === "optIn" || column.id === "optOut" ? (
                      <select
                        className="w-full h-8 px-2 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={searchFilters[column.id]}
                        onChange={(e) => setSearchFilters({ ...searchFilters, [column.id]: e.target.value })}
                      >
                        <option value="">All</option>
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="none">None</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder={`Search ${column.label.toLowerCase()}...`}
                        value={searchFilters[column.id]}
                        onChange={(e) => setSearchFilters({ ...searchFilters, [column.id]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {visibleColumns.map((column) => (
                    <th
                      key={column.id}
                      className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLists.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="px-4 py-8 text-center text-gray-500">
                      {Object.values(searchFilters).some((filter) => filter !== "")
                        ? "No lists match your search criteria"
                        : "No lists found"}
                    </td>
                  </tr>
                ) : (
                  filteredLists.map((list) => (
                    <tr key={list.id} className="border-b border-gray-200 hover:bg-gray-50">
                      {visibleColumns.map((column) => (
                        <td key={column.id} className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700">
                          {column.id === "uniqueId" || column.id === "name" || column.id === "displayName" ? (
                            <Link
                              href={`/lists/${list.id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                            >
                              {list[column.id as keyof EmailList]}
                            </Link>
                          ) : (
                            <span>{list[column.id as keyof EmailList]}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        <div className="relative">
                          <button
                            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Close all other action rows first
                              document.querySelectorAll('[id^="action-row-"]').forEach((row) => {
                                if (row.id !== `action-row-${list.id}`) {
                                  row.classList.add("hidden")
                                }
                              })
                              // Toggle current action row
                              const actionRow = document.getElementById(`action-row-${list.id}`)
                              if (actionRow) {
                                actionRow.classList.toggle("hidden")
                              }
                            }}
                          >
                            <span className="text-sm">⚙️</span>
                          </button>
                          <div
                            id={`action-row-${list.id}`}
                            className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 z-50 hidden"
                          >
                            {/* Horizontal action buttons row */}
                            <div className="flex items-center space-x-1">
                              {/* Horizontal action buttons */}
                              {/* Menu Items */}
                              {/* EDIT BUTTON */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditList(list)
                                  document.getElementById(`action-row-${list.id}`)?.classList.add("hidden")
                                }}
                                className="w-8 h-8 bg-blue-400 hover:bg-blue-500 rounded flex items-center justify-center transition-colors"
                                title="Edit"
                              >
                                <span className="text-white text-xs">✏️</span>
                              </button>

                              {/* COPY BUTTON */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCopyList(list)
                                  document.getElementById(`action-row-${list.id}`)?.classList.add("hidden")
                                }}
                                className="w-8 h-8 bg-blue-400 hover:bg-blue-500 rounded flex items-center justify-center transition-colors"
                                title="Copy"
                              >
                                <span className="text-white text-xs">📋</span>
                              </button>

                              {/* EXPORT BUTTON */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Export logic here...
                                  document.getElementById(`action-row-${list.id}`)?.classList.add("hidden")
                                }}
                                className="w-8 h-8 bg-blue-400 hover:bg-blue-500 rounded flex items-center justify-center transition-colors"
                                title="Export"
                              >
                                <span className="text-white text-xs">📤</span>
                              </button>

                              {/* ARCHIVE BUTTON */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleArchiveList(list.id)
                                  document.getElementById(`action-row-${list.id}`)?.classList.add("hidden")
                                }}
                                className="w-8 h-8 bg-blue-400 hover:bg-blue-500 rounded flex items-center justify-center transition-colors"
                                title="Archive"
                              >
                                <span className="text-white text-xs">📦</span>
                              </button>

                              {/* DELETE BUTTON */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteList(list.id)
                                  document.getElementById(`action-row-${list.id}`)?.classList.add("hidden")
                                }}
                                className="w-8 h-8 bg-red-400 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
                                title="Delete"
                              >
                                <span className="text-white text-xs">🗑️</span>
                              </button>

                              {/* SETTINGS BUTTON */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Settings logic here...
                                  document.getElementById(`action-row-${list.id}`)?.classList.add("hidden")
                                }}
                                className="w-8 h-8 bg-blue-400 hover:bg-blue-500 rounded flex items-center justify-center transition-colors"
                                title="Settings"
                              >
                                <span className="text-white text-xs">⚙️</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AvailableTagsModal isOpen={showAvailableTags} onClose={() => setShowAvailableTags(false)} />
    </div>
  )
}
