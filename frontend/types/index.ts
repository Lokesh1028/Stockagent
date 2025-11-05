import { Database } from './supabase'

export type User = Database['public']['Tables']['users']['Row']
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type StockAnalysis = Database['public']['Tables']['stock_analysis']['Row']
export type AlertHistory = Database['public']['Tables']['alert_history']['Row']

export type SubscriptionTier = 'free' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'trial'
export type AlertChannel = 'email' | 'telegram' | 'sms' | 'webhook'
export type ActivityType = 'NET BUYING' | 'NET SELLING' | 'NO NET ACTIVITY'

export interface PricingPlan {
  id: string
  name: string
  tier: SubscriptionTier
  price: number
  interval: 'month' | 'year'
  features: string[]
  popular?: boolean
  stripePriceId?: string
}

export interface StockAlert {
  symbol: string
  netMoneyFlow: number
  netMoneyFlowFormatted: string
  netSharesChange: number
  activityType: ActivityType
  totalInsiders: number
  buyersCount: number
  sellersCount: number
  recommendation: string
  confidence: string
  topInsiders: InsiderActivity[]
  analysisDate: string
}

export interface InsiderActivity {
  name: string
  netValue: number
  netValueFormatted: string
  activity: 'BUYING' | 'SELLING' | 'NEUTRAL'
  buyCount: number
  sellCount: number
}

export interface UserProfile extends User {
  preferences?: UserPreferences
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface DashboardStats {
  totalAlerts: number
  alertsThisWeek: number
  alertsThisMonth: number
  topStocks: Array<{
    symbol: string
    alertCount: number
  }>
}
