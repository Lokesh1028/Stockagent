import { PricingPlan, SubscriptionTier } from '@/types'

// App Configuration from Environment Variables
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'InsiderAlerts',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Real-time insider trading alerts with AI-powered analysis',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@insideralerts.com',
} as const

// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
} as const

// Stripe Configuration
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  proPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
  proYearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
  enterprisePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
} as const

// Feature Limits by Tier (from environment or defaults)
export const TIER_LIMITS = {
  free: {
    maxAlerts: parseInt(process.env.NEXT_PUBLIC_FREE_MAX_ALERTS || '1'),
    maxStocks: parseInt(process.env.NEXT_PUBLIC_FREE_MAX_STOCKS || '5'),
    channels: (process.env.NEXT_PUBLIC_FREE_CHANNELS || 'email').split(','),
    historyDays: parseInt(process.env.NEXT_PUBLIC_FREE_HISTORY_DAYS || '7'),
  },
  pro: {
    maxAlerts: parseInt(process.env.NEXT_PUBLIC_PRO_MAX_ALERTS || '-1'), // -1 = unlimited
    maxStocks: parseInt(process.env.NEXT_PUBLIC_PRO_MAX_STOCKS || '20'),
    channels: (process.env.NEXT_PUBLIC_PRO_CHANNELS || 'email,telegram,sms').split(','),
    historyDays: parseInt(process.env.NEXT_PUBLIC_PRO_HISTORY_DAYS || '30'),
  },
  enterprise: {
    maxAlerts: parseInt(process.env.NEXT_PUBLIC_ENTERPRISE_MAX_ALERTS || '-1'),
    maxStocks: parseInt(process.env.NEXT_PUBLIC_ENTERPRISE_MAX_STOCKS || '50'),
    channels: (process.env.NEXT_PUBLIC_ENTERPRISE_CHANNELS || 'email,telegram,sms,webhook').split(','),
    historyDays: parseInt(process.env.NEXT_PUBLIC_ENTERPRISE_HISTORY_DAYS || '365'),
  },
} as const

// Pricing Plans (prices from environment or defaults)
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: 'free' as SubscriptionTier,
    price: 0,
    interval: 'month',
    features: [
      `${TIER_LIMITS.free.maxAlerts} alert per day`,
      'Email notifications only',
      `Top ${TIER_LIMITS.free.maxStocks} stocks`,
      `${TIER_LIMITS.free.historyDays}-day history`,
    ],
  },
  {
    id: 'pro-monthly',
    name: 'Pro',
    tier: 'pro' as SubscriptionTier,
    price: parseInt(process.env.NEXT_PUBLIC_PRO_MONTHLY_PRICE || '1900') / 100,
    interval: 'month',
    stripePriceId: STRIPE_CONFIG.proPriceId,
    popular: true,
    features: [
      'Unlimited alerts',
      'Email + Telegram + SMS',
      `Top ${TIER_LIMITS.pro.maxStocks} stocks`,
      `${TIER_LIMITS.pro.historyDays}-day history`,
      'Custom filters',
      'Priority support',
    ],
  },
  {
    id: 'pro-yearly',
    name: 'Pro Yearly',
    tier: 'pro' as SubscriptionTier,
    price: parseInt(process.env.NEXT_PUBLIC_PRO_YEARLY_PRICE || '18240') / 100,
    interval: 'year',
    stripePriceId: STRIPE_CONFIG.proYearlyPriceId,
    features: [
      'Everything in Pro Monthly',
      'Save 20% ($45.60/year)',
      'Annual billing',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tier: 'enterprise' as SubscriptionTier,
    price: parseInt(process.env.NEXT_PUBLIC_ENTERPRISE_PRICE || '9900') / 100,
    interval: 'month',
    stripePriceId: STRIPE_CONFIG.enterprisePriceId,
    features: [
      'Everything in Pro',
      'API access',
      'Custom watchlists',
      `${TIER_LIMITS.enterprise.historyDays}-day history`,
      'Webhook integrations',
      'Dedicated support',
    ],
  },
]

// Alert Frequency Options
export const ALERT_FREQUENCIES = [
  { value: 'realtime', label: 'Real-time', description: 'As they happen' },
  { value: 'hourly', label: 'Hourly', description: 'Once per hour' },
  { value: 'daily', label: 'Daily', description: 'Once per day' },
  { value: 'weekly', label: 'Weekly', description: 'Once per week' },
] as const

// Time Zones (common US timezones, can be extended)
export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'UTC', label: 'UTC' },
] as const

// Default User Preferences
export const DEFAULT_PREFERENCES = {
  threshold_amount: parseInt(process.env.NEXT_PUBLIC_DEFAULT_THRESHOLD || '50000'),
  lookback_days: parseInt(process.env.NEXT_PUBLIC_DEFAULT_LOOKBACK_DAYS || '7'),
  alert_frequency: process.env.NEXT_PUBLIC_DEFAULT_ALERT_FREQUENCY || 'daily',
  max_stocks: parseInt(process.env.NEXT_PUBLIC_DEFAULT_MAX_STOCKS || '5'),
  preferred_channels: JSON.parse(process.env.NEXT_PUBLIC_DEFAULT_CHANNELS || '["email"]'),
  alert_timezone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || 'America/New_York',
  include_buys: true,
  include_sells: true,
  weekend_alerts: false,
  min_transaction_value: 0,
  only_significant_transactions: false,
} as const

// API Routes
export const API_ROUTES = {
  user: '/api/user',
  preferences: '/api/user/preferences',
  alerts: '/api/alerts',
  alertById: (id: string) => `/api/alerts/${id}`,
  stats: '/api/user/stats',
  billing: {
    createCheckout: '/api/billing/create-checkout',
    portal: '/api/billing/portal',
    webhook: '/api/webhooks/stripe',
  },
} as const

// Public Routes (no auth required)
export const PUBLIC_ROUTES = [
  '/',
  '/pricing',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
] as const

// Protected Routes (auth required)
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/settings',
  '/alerts',
  '/billing',
] as const

// Meta Tags Configuration
export const SEO_CONFIG = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
  keywords: [
    'insider trading',
    'stock alerts',
    'investment analysis',
    'insider transactions',
    'stock market alerts',
    'SEC filings',
    'investment signals',
  ],
  ogImage: `${APP_CONFIG.url}/og-image.png`,
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@insideralerts',
} as const
