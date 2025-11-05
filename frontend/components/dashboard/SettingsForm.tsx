'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ALERT_FREQUENCIES, TIMEZONES, DEFAULT_PREFERENCES } from '@/lib/constants'

interface SettingsFormProps {
  initialPreferences: any
  userId: string
}

export default function SettingsForm({ initialPreferences, userId }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [preferences, setPreferences] = useState({
    threshold_amount: initialPreferences?.threshold_amount || DEFAULT_PREFERENCES.threshold_amount,
    lookback_days: initialPreferences?.lookback_days || DEFAULT_PREFERENCES.lookback_days,
    alert_frequency: initialPreferences?.alert_frequency || DEFAULT_PREFERENCES.alert_frequency,
    max_stocks: initialPreferences?.max_stocks || DEFAULT_PREFERENCES.max_stocks,
    alert_timezone: initialPreferences?.alert_timezone || DEFAULT_PREFERENCES.alert_timezone,
    include_buys: initialPreferences?.include_buys ?? DEFAULT_PREFERENCES.include_buys,
    include_sells: initialPreferences?.include_sells ?? DEFAULT_PREFERENCES.include_sells,
    weekend_alerts: initialPreferences?.weekend_alerts ?? DEFAULT_PREFERENCES.weekend_alerts,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error('Failed to update preferences')
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">Settings updated successfully!</p>
        </div>
      )}

      <div className="rounded-lg border bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Alert Preferences</h3>
        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction Threshold
            </label>
            <div className="mt-1">
              <input
                type="number"
                value={preferences.threshold_amount}
                onChange={(e) =>
                  setPreferences({ ...preferences, threshold_amount: parseInt(e.target.value) })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Minimum transaction value to trigger an alert (in dollars)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lookback Days</label>
            <div className="mt-1">
              <input
                type="number"
                min="1"
                max="365"
                value={preferences.lookback_days}
                onChange={(e) =>
                  setPreferences({ ...preferences, lookback_days: parseInt(e.target.value) })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Number of days to look back for insider transactions
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Alert Frequency</label>
            <div className="mt-1">
              <select
                value={preferences.alert_frequency}
                onChange={(e) => setPreferences({ ...preferences, alert_frequency: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              >
                {ALERT_FREQUENCIES.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label} - {freq.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Timezone</label>
            <div className="mt-1">
              <select
                value={preferences.alert_timezone}
                onChange={(e) => setPreferences({ ...preferences, alert_timezone: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Stocks</label>
            <div className="mt-1">
              <input
                type="number"
                min="1"
                max="50"
                value={preferences.max_stocks}
                onChange={(e) =>
                  setPreferences({ ...preferences, max_stocks: parseInt(e.target.value) })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Maximum number of stocks to include in alerts
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <input
              id="include_buys"
              type="checkbox"
              checked={preferences.include_buys}
              onChange={(e) => setPreferences({ ...preferences, include_buys: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="include_buys" className="ml-3 text-sm text-gray-700">
              Include buy transactions
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="include_sells"
              type="checkbox"
              checked={preferences.include_sells}
              onChange={(e) => setPreferences({ ...preferences, include_sells: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="include_sells" className="ml-3 text-sm text-gray-700">
              Include sell transactions
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="weekend_alerts"
              type="checkbox"
              checked={preferences.weekend_alerts}
              onChange={(e) =>
                setPreferences({ ...preferences, weekend_alerts: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="weekend_alerts" className="ml-3 text-sm text-gray-700">
              Send alerts on weekends
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
