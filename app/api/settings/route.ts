import { NextRequest, NextResponse } from 'next/server'
import {
    getSetting,
    getSettingsByCategory,
    getAllSettings,
    updateSetting,
    deleteSetting,
    getPaymentSettings,
    updatePaymentSetting,
} from '@/lib/api/settings'

// GET /api/settings
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const key = searchParams.get('key')
        const category = searchParams.get('category')

        // Get single setting
        if (key) {
            const setting = await getSetting(key)
            if (!setting) {
                return NextResponse.json({ error: 'Setting not found' }, { status: 404 })
            }
            return NextResponse.json(setting)
        }

        // Get payment settings
        if (category === 'payment') {
            const settings = await getPaymentSettings()
            return NextResponse.json(settings)
        }

        // Get settings by category
        if (category) {
            const settings = await getSettingsByCategory(category)
            return NextResponse.json(settings)
        }

        // Get all settings
        const settings = await getAllSettings()
        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        )
    }
}

// PUT /api/settings
export async function PUT(request: NextRequest) {
    try {
        // TODO: Add authentication check
        // const session = await getSession()
        // if (!session || session.user.role !== 'admin') {
        //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        const body = await request.json()
        const { key, value, category, updatedBy } = body

        if (!key || value === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: key, value' },
                { status: 400 }
            )
        }

        // Handle payment settings specifically
        if (key === 'youcan_pay' || key === 'cmi') {
            const success = await updatePaymentSetting(key, value, updatedBy)
            if (!success) {
                return NextResponse.json(
                    { error: 'Failed to update payment setting' },
                    { status: 500 }
                )
            }
        } else {
            const success = await updateSetting(key, value, category, updatedBy)
            if (!success) {
                return NextResponse.json(
                    { error: 'Failed to update setting' },
                    { status: 500 }
                )
            }
        }

        const setting = await getSetting(key)
        return NextResponse.json(setting)
    } catch (error) {
        console.error('Error updating setting:', error)
        return NextResponse.json(
            { error: 'Failed to update setting' },
            { status: 500 }
        )
    }
}

// DELETE /api/settings
export async function DELETE(request: NextRequest) {
    try {
        // TODO: Add authentication check
        // const session = await getSession()
        // if (!session || session.user.role !== 'admin') {
        //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        const { searchParams } = new URL(request.url)
        const key = searchParams.get('key')

        if (!key) {
            return NextResponse.json(
                { error: 'Missing setting key' },
                { status: 400 }
            )
        }

        const success = await deleteSetting(key)
        if (!success) {
            return NextResponse.json(
                { error: 'Setting not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting setting:', error)
        return NextResponse.json(
            { error: 'Failed to delete setting' },
            { status: 500 }
        )
    }
}
