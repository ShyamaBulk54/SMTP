"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import SidebarNav from "@/components/sidebar-nav"

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar when screen size becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <>
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(true)} aria-label="Open menu">
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-4/5 max-w-xs bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  <span className="text-foreground">SMTP</span>
                  <span className="text-orange-500">MASTER</span>
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
              <SidebarNav isMobile />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
