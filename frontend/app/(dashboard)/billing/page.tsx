import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PRICING_PLANS, TIER_LIMITS } from '@/lib/constants'
import { Check } from 'lucide-react'

export default async function BillingPage() {
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

  const currentTier = profile?.subscription_tier || 'free'
  const subscriptionStatus = profile?.subscription_status || 'active'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your subscription and view available plans.
        </p>
      </div>

      {/* Current Plan */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold capitalize">{currentTier}</p>
            <p className="text-sm text-gray-500">
              Status: <span className="capitalize">{subscriptionStatus}</span>
            </p>
          </div>
          {currentTier !== 'free' && (
            <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Manage Subscription
            </button>
          )}
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Available Plans</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {PRICING_PLANS.filter((plan) => plan.interval === 'month').map((plan) => {
            const isCurrentPlan = plan.tier === currentTier
            const limits = TIER_LIMITS[plan.tier]

            return (
              <div
                key={plan.id}
                className={`relative rounded-lg border ${
                  plan.popular ? 'border-primary shadow-lg' : 'border-gray-200'
                } bg-white p-6`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex rounded-full bg-primary px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="ml-1 text-sm text-gray-500">/month</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="ml-3 text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400"
                    >
                      Current Plan
                    </button>
                  ) : plan.tier === 'free' ? (
                    <button
                      disabled={currentTier === 'free'}
                      className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Downgrade
                    </button>
                  ) : (
                    <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                      {currentTier === 'free' ? 'Upgrade' : 'Switch Plan'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Feature Comparison</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Feature</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Free</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Pro</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">Max Alerts/Day</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {TIER_LIMITS.free.maxAlerts === -1 ? 'Unlimited' : TIER_LIMITS.free.maxAlerts}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {TIER_LIMITS.pro.maxAlerts === -1 ? 'Unlimited' : TIER_LIMITS.pro.maxAlerts}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {TIER_LIMITS.enterprise.maxAlerts === -1
                    ? 'Unlimited'
                    : TIER_LIMITS.enterprise.maxAlerts}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">Max Stocks</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {TIER_LIMITS.free.maxStocks}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {TIER_LIMITS.pro.maxStocks}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {TIER_LIMITS.enterprise.maxStocks}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">History</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {TIER_LIMITS.free.historyDays} days
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {TIER_LIMITS.pro.historyDays} days
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {TIER_LIMITS.enterprise.historyDays} days
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">Channels</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {TIER_LIMITS.free.channels.join(', ')}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {TIER_LIMITS.pro.channels.join(', ')}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  {TIER_LIMITS.enterprise.channels.join(', ')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
