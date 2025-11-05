import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TIER_LIMITS } from '@/lib/constants'
import { TrendingUp, TrendingDown, Bell, BarChart3 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch user stats
  const { count: totalAlerts } = await supabase
    .from('alert_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Fetch alerts this week
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const { count: alertsThisWeek } = await supabase
    .from('alert_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('sent_at', oneWeekAgo.toISOString())

  // Fetch recent alerts
  const { data: recentAlerts } = await supabase
    .from('alert_history')
    .select('*')
    .eq('user_id', user.id)
    .order('sent_at', { ascending: false })
    .limit(5)

  // Get tier limits
  const tier = profile?.subscription_tier || 'free'
  const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's your insider trading activity overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{totalAlerts || 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{alertsThisWeek || 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Plan</p>
              <p className="mt-2 text-xl font-bold capitalize text-gray-900">
                {profile?.subscription_tier || 'free'}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Max Stocks</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{limits.maxStocks}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <TrendingDown className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="rounded-lg border bg-white">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
        </div>
        <div className="divide-y">
          {recentAlerts && recentAlerts.length > 0 ? (
            recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {alert.symbol || 'Insider Trading Alert'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(alert.sent_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      alert.delivery_status === 'sent'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {alert.delivery_status}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {alert.channel}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                You'll see your insider trading alerts here once the system starts sending them.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Configure Alerts</h3>
          <p className="mt-2 text-sm text-gray-600">
            Set your alert preferences, thresholds, and watchlists.
          </p>
          <a
            href="/settings"
            className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Go to Settings →
          </a>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Upgrade Plan</h3>
          <p className="mt-2 text-sm text-gray-600">
            Get unlimited alerts and access to more features with Pro.
          </p>
          <a
            href="/billing"
            className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            View Plans →
          </a>
        </div>
      </div>
    </div>
  )
}
