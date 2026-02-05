"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2, Server, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

export function OcppSettings() {
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [settings, setSettings] = useState({
    citrineosBaseUrl: "",
    apiKey: "",
    webhookSecret: "",
    mappingRules: "{}",
  })

  // Load existing settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings?category=ocpp')
        if (response.ok) {
          const data = await response.json()
          if (data.ocpp) {
            setSettings({
              citrineosBaseUrl: data.ocpp.citrineosBaseUrl || "",
              apiKey: data.ocpp.apiKey || "",
              webhookSecret: data.ocpp.webhookSecret || "",
              mappingRules: data.ocpp.mappingRules || "{}",
            })
          }
        }
      } catch (error) {
        console.error('Failed to load OCPP settings:', error)
      }
    }

    loadSettings()
  }, [])

  const handleTestConnection = async () => {
    if (!settings.citrineosBaseUrl) {
      toast.error("Please enter CitrineOS base URL first")
      return
    }

    setTesting(true)
    setConnectionStatus('idle')

    try {
      // Test connection to CitrineOS
      const response = await fetch(`${settings.citrineosBaseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
        },
      })

      if (response.ok) {
        setConnectionStatus('success')
        toast.success("CitrineOS connection successful!")
      } else {
        setConnectionStatus('error')
        toast.error("Failed to connect to CitrineOS")
      }
    } catch (error) {
      setConnectionStatus('error')
      toast.error("Failed to connect to CitrineOS")
    } finally {
      setTesting(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'ocpp',
          key: 'ocpp',
          value: settings,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      toast.success("OCPP settings saved successfully")
    } catch (error) {
      console.error('Error saving OCPP settings:', error)
      toast.error("Failed to save OCPP settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            <div>
              <CardTitle>OCPP / CitrineOS Settings</CardTitle>
              <CardDescription>
                Configure connection to CitrineOS CSMS for OCPP 2.0.1 integration
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="citrineos-url">CitrineOS Base URL</Label>
            <Input
              id="citrineos-url"
              type="url"
              placeholder="https://citrineos.example.com"
              value={settings.citrineosBaseUrl}
              onChange={(e) => setSettings({ ...settings, citrineosBaseUrl: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Base URL for your CitrineOS CSMS instance
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="api-key">API Key / Auth Token</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter API key"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Authentication token for CitrineOS API calls
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="webhook-secret">Webhook Secret / Shared Secret</Label>
            <Input
              id="webhook-secret"
              type="password"
              placeholder="Enter webhook secret"
              value={settings.webhookSecret}
              onChange={(e) => setSettings({ ...settings, webhookSecret: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Secret key for verifying webhooks from CitrineOS
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="mapping-rules">Mapping Rules (JSON)</Label>
            <Textarea
              id="mapping-rules"
              placeholder='{"chargerId": "stationId", "evseId": "connectorId"}'
              rows={6}
              value={settings.mappingRules}
              onChange={(e) => setSettings({ ...settings, mappingRules: e.target.value })}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              JSON mapping between CitrineOS charger IDs and WATTSC station/EVSE/connector IDs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={testing || !settings.citrineosBaseUrl}
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Server className="mr-2 h-4 w-4" />
                  Test Connection
                </>
              )}
            </Button>
            {connectionStatus === 'success' && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Connected
              </div>
            )}
            {connectionStatus === 'error' && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <XCircle className="h-4 w-4" />
                Connection failed
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
            <p className="font-medium mb-1">OCPP Integration Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>CitrineOS handles OCPP 2.0.1 protocol and charger connectivity</li>
              <li>WATTSC integrates via REST API and webhooks for business logic</li>
              <li>Mapping rules define how charger IDs correspond to your stations</li>
              <li>Test connection before saving to verify credentials</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
