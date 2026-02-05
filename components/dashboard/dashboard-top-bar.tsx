"use client"

import { RoleSwitcher } from "./role-switcher"

export function DashboardTopBar() {
  return (
    <div className="flex items-center justify-end px-4 lg:px-8 py-2 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-muted-foreground hidden sm:inline">DEV MODE</span>
        <RoleSwitcher />
      </div>
    </div>
  )
}
