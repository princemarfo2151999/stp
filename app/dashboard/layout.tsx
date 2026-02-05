import React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 transition-all duration-300">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
