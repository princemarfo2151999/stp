"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MapPin,
  Activity,
  Users,
  Settings,
  LogOut,
  Zap,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Stations", href: "/dashboard/stations", icon: MapPin },
  { name: "Sessions", href: "/dashboard/sessions", icon: Activity },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className={cn(
            "flex items-center gap-3 px-4 py-6 border-b border-sidebar-border",
            collapsed && "justify-center px-2"
          )}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">WATTSC</h1>
                <p className="text-xs text-muted-foreground">EV Charging Platform</p>
              </div>
            )}
          </div>

          {/* User card */}
          <div className={cn(
            "px-4 py-4 border-b border-sidebar-border",
            collapsed && "px-2"
          )}>
            <div className={cn(
              "flex items-center gap-3",
              collapsed && "justify-center"
            )}>
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">WA</span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    WATTSC Admin
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    admin@wattsc.ma
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Sign out */}
          <div className="px-2 py-4 border-t border-sidebar-border">
            <button
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 w-full transition-colors",
                collapsed && "justify-center px-2"
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </button>
          </div>

          {/* Collapse button - desktop only */}
          <div className="hidden lg:block px-2 py-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "w-full justify-center",
                !collapsed && "justify-start"
              )}
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )} />
              {!collapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
