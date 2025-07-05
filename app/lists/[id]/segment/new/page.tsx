"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Settings, Plus, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import SidebarNav from "@/components/sidebar-nav"
import MobileSidebar from "@/components/mobile-sidebar"

interface CustomFieldCondition {
  id: string
  field: string
  operator: string
  value: string
}

interface CampaignCondition {
  id: string
  campaignAction: string
  campaign: string
  comparison: string
  timeValue: string
  timeUnit: string
}

export default function CreateSegmentPage() {
  const params = useParams()
  const router = useRouter()
  const listId = params.id as string

  const [segmentName, setSegmentName] = useState("")
  const [operatorMatch, setOperatorMatch] = useState("any")
  const [customFieldConditions, setCustomFieldConditions] = useState<CustomFieldCondition[]>([])
  const [campaignConditions, setCampaignConditions] = useState<CampaignCondition[]>([])
  const [loading, setLoading] = useState(false)
  const [showValueTagsModal, setShowValueTagsModal] = useState(false)

  const handleCancel = () => {
    router.push(`/lists/${listId}/segment`)
  }

  const addCustomFieldCondition = () => {
    const newCondition: CustomFieldCondition = {
      id: Date.now().toString(),
      field: "",
      operator: "",
      value: "",
    }
    setCustomFieldConditions([...customFieldConditions, newCondition])
  }

  const addCampaignCondition = () => {
    const newCondition: CampaignCondition = {
      id: Date.now().toString(),
      campaignAction: "",
      campaign: "",
      comparison: "",
      timeValue: "",
      timeUnit: "",
    }
    setCampaignConditions([...campaignConditions, newCondition])
  }

  const removeCustomFieldCondition = (id: string) => {
    setCustomFieldConditions(customFieldConditions.filter((condition) => condition.id !== id))
  }

  const removeCampaignCondition = (id: string) => {
    setCampaignConditions(campaignConditions.filter((condition) => condition.id !== id))
  }

  const updateCustomFieldCondition = (id: string, field: keyof CustomFieldCondition, value: string) => {
    setCustomFieldConditions(
      customFieldConditions.map((condition) => (condition.id === id ? { ...condition, [field]: value } : condition)),
    )
  }

  const updateCampaignCondition = (id: string, field: keyof CampaignCondition, value: string) => {
    setCampaignConditions(
      campaignConditions.map((condition) => (condition.id === id ? { ...condition, [field]: value } : condition)),
    )
  }

  const handleSaveChanges = async () => {
    if (!segmentName.trim()) {
      alert("Please enter a segment name")
      return
    }

    setLoading(true)

    try {
      // Create new segment
      const newSegment = {
        id: Date.now().toString(),
        name: segmentName,
        operatorMatch,
        customFieldConditions,
        campaignConditions,
        dateCreated: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      }

      // Save to localStorage (you can replace this with API call)
      const savedSegments = localStorage.getItem(`segment
        _${listId}`)
      const segments = savedSegments ? JSON.parse(savedSegments) : []
      segments.push(newSegment)
      localStorage.setItem(`segments_${listId}`, JSON.stringify(segments))

      alert("Segment created successfully!")
      router.push(`/lists/${listId}/segment`)
    } catch (error) {
      console.error("Error creating segment:", error)
      alert("Error creating segment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const valueTags = [
    {
      tag: "[EMPTY]",
      description: "It will be transformed into an empty value",
    },
    {
      tag: "[DATETIME]",
      description:
        "It will be transformed into the current date time in the format of Y-m-d H:i:s (i.e. 2025-07-05 09:28:12)",
    },
    {
      tag: "[DATE]",
      description: "It will be transformed into the current date in the format of Y-m-d (i.e. 2025-07-05)",
    },
    {
      tag: "[PAST_DAYS_X]",
      description: "It will rewind the current date by X days and use that as a comparison date",
    },
    {
      tag: "[FUTURE_DAYS_X]",
      description: "It will forward the current date by X days and use that as a comparison date",
    },
    {
      tag: "[BIRTHDAY]",
      description:
        "It requires the birthday custom field value to be in the format of Y-m-d (i.e. 2025-07-05) in order to work properly",
    },
    {
      tag: "[BIRTHDAY_FUTURE_DAYS_X]",
      description:
        "It will forward the birthday by X days relative to the current date and use that as a comparison date.",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:block">
        <SidebarNav />
      </div>

      <MobileSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mx-auto max-w-4xl">
              {/* Header */}
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-gray-700" />
                  <h1 className="text-xl font-semibold text-gray-900">Create a new list segment</h1>
                </div>
                <Button onClick={handleCancel} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Cancel
                </Button>
              </div>

              {/* Form */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="space-y-8">
                  {/* Name Field */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Name"
                        value={segmentName}
                        onChange={(e) => setSegmentName(e.target.value)}
                        className="bg-gray-50 border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="operator" className="text-sm font-medium text-gray-700">
                        Operator match <span className="text-red-500">*</span>
                      </Label>
                      <Select value={operatorMatch} onValueChange={setOperatorMatch}>
                        <SelectTrigger className="bg-gray-50 border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">any</SelectItem>
                          <SelectItem value="all">all</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Custom Fields Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700">Conditions that apply to your list custom fields:</span>
                      <Button
                        onClick={addCustomFieldCondition}
                        size="icon"
                        className="h-6 w-6 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Dialog open={showValueTagsModal} onOpenChange={setShowValueTagsModal}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-blue-500 hover:bg-blue-50">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Available value tags</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-blue-500 text-white p-3 rounded-lg text-sm">
                              Following tags can be used as dynamic values. They will be replaced as shown below.
                            </div>
                            <div className="space-y-3">
                              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
                                <div>Tag</div>
                                <div className="col-span-2">Description</div>
                              </div>
                              {valueTags.map((item, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-100"
                                >
                                  <div className="font-mono text-blue-600">{item.tag}</div>
                                  <div className="col-span-2 text-gray-600">{item.description}</div>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-end pt-4">
                              <Button onClick={() => setShowValueTagsModal(false)} variant="outline">
                                Close
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Custom Field Conditions List */}
                    {customFieldConditions.map((condition) => (
                      <div key={condition.id} className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg items-end">
                        <div className="col-span-3">
                          <Label className="text-sm font-medium text-gray-700">
                            Field <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={condition.field}
                            onValueChange={(value) => updateCustomFieldCondition(condition.id, "field", value)}
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Email">Email</SelectItem>
                              <SelectItem value="First name">First name</SelectItem>
                              <SelectItem value="Last name">Last name</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-3">
                          <Label className="text-sm font-medium text-gray-700">
                            Operator <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={condition.operator}
                            onValueChange={(value) => updateCustomFieldCondition(condition.id, "operator", value)}
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="is">is</SelectItem>
                              <SelectItem value="is not">is not</SelectItem>
                              <SelectItem value="contains">contains</SelectItem>
                              <SelectItem value="not contains">not contains</SelectItem>
                              <SelectItem value="starts with">starts with</SelectItem>
                              <SelectItem value="ends with">ends with</SelectItem>
                              <SelectItem value="is greater than">is greater than</SelectItem>
                              <SelectItem value="is less than">is less than</SelectItem>
                              <SelectItem value="not starts with">not starts with</SelectItem>
                              <SelectItem value="not ends with">not ends with</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-5">
                          <Label className="text-sm font-medium text-gray-700">
                            Value <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="Value"
                            value={condition.value}
                            onChange={(e) => updateCustomFieldCondition(condition.id, "value", e.target.value)}
                            className="bg-white"
                          />
                        </div>

                        <div className="col-span-1">
                          <Label className="text-sm font-medium text-gray-700">Action</Label>
                          <Button
                            onClick={() => removeCustomFieldCondition(condition.id)}
                            size="icon"
                            className="w-full h-10 bg-red-500 hover:bg-red-600 text-white"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Campaign Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700">
                        Conditions that apply to the campaigns sent to the list this segment belongs to:
                      </span>
                      <Button
                        onClick={addCampaignCondition}
                        size="icon"
                        className="h-6 w-6 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Campaign Conditions List */}
                    {campaignConditions.map((condition) => (
                      <div key={condition.id} className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg items-end">
                        <div className="col-span-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Campaign action <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={condition.campaignAction}
                            onValueChange={(value) => updateCampaignCondition(condition.id, "campaignAction", value)}
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Open">Open</SelectItem>
                              <SelectItem value="Click">Click</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-2">
                          <Label className="text-sm font-medium text-gray-700">Campaign</Label>
                          <Select
                            value={condition.campaign}
                            onValueChange={(value) => updateCampaignCondition(condition.id, "campaign", value)}
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select campaign" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Any list campaign">Any list campaign</SelectItem>
                              <SelectItem value="Newsletter #1">Newsletter #1</SelectItem>
                              <SelectItem value="Promo Campaign">Promo Campaign</SelectItem>
                              <SelectItem value="Welcome Series">Welcome Series</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Comparison <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={condition.comparison}
                            onValueChange={(value) => updateCampaignCondition(condition.id, "comparison", value)}
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select comparison" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Less then or equal">Less then or equal</SelectItem>
                              <SelectItem value="Less then">Less then</SelectItem>
                              <SelectItem value="Greater then or equal">Greater then or equal</SelectItem>
                              <SelectItem value="Greater then">Greater then</SelectItem>
                              <SelectItem value="Equal">Equal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Time value <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="80"
                            value={condition.timeValue}
                            onChange={(e) => updateCampaignCondition(condition.id, "timeValue", e.target.value)}
                            className="bg-white"
                          />
                        </div>

                        <div className="col-span-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Time unit <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={condition.timeUnit}
                            onValueChange={(value) => updateCampaignCondition(condition.id, "timeUnit", value)}
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Day(s)">Day(s)</SelectItem>
                              <SelectItem value="Month(s)">Month(s)</SelectItem>
                              <SelectItem value="Year(s)">Year(s)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-2">
                          <Label className="text-sm font-medium text-gray-700">Action</Label>
                          <Button
                            onClick={() => removeCampaignCondition(condition.id)}
                            size="icon"
                            className="w-full h-10 bg-red-500 hover:bg-red-600 text-white"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6">
                    <Button
                      onClick={handleSaveChanges}
                      disabled={loading}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {loading ? "Saving..." : "Save changes"}
                    </Button>
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
