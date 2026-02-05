"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  DollarSign,
  Bell,
  Plug2,
  Server,
  Webhook,
  Database,
} from "lucide-react"
import { GeneralSettings } from "@/components/settings/general-settings"
import { PricingSettings } from "@/components/settings/pricing-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { PaymentSettings } from "@/components/settings/payment-settings"
import { OcppSettings } from "@/components/settings/ocpp-settings"
import { WebhooksSettings } from "@/components/settings/webhooks-settings"
import { DatabaseSettings } from "@/components/settings/database-settings"

const tabs = [
  { value: "general", label: "General", icon: Building2 },
  { value: "pricing", label: "Pricing", icon: DollarSign },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "integrations", label: "Integrations", icon: Plug2 },
  { value: "ocpp", label: "OCPP/CitrineOS", icon: Server },
  { value: "webhooks", label: "Webhooks", icon: Webhook },
  { value: "database", label: "Database", icon: Database },
]

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "general"
  const [activeTab, setActiveTab] = useState(initialTab)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your platform configuration and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
        <TabsList className="h-auto w-full justify-start gap-1 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-2 rounded-lg border border-transparent px-4 py-2 data-[state=active]:border-border data-[state=active]:bg-card"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general" className="mt-0">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="pricing" className="mt-0">
          <PricingSettings />
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="integrations" className="mt-0">
          <PaymentSettings />
        </TabsContent>

        <TabsContent value="ocpp" className="mt-0">
          <OcppSettings />
        </TabsContent>

        <TabsContent value="webhooks" className="mt-0">
          <WebhooksSettings />
        </TabsContent>

        <TabsContent value="database" className="mt-0">
          <DatabaseSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
