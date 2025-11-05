export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          telegram_chat_id: string | null
          phone_number: string | null
          subscription_tier: string
          subscription_status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          subscription_ends_at: string | null
          created_at: string
          updated_at: string
          last_login_at: string | null
          is_active: boolean
          email_verified: boolean
          verification_token: string | null
          reset_password_token: string | null
          reset_password_expires: string | null
        }
        Insert: {
          id?: string
          email: string
          telegram_chat_id?: string | null
          phone_number?: string | null
          subscription_tier?: string
          subscription_status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          subscription_ends_at?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          email_verified?: boolean
          verification_token?: string | null
          reset_password_token?: string | null
          reset_password_expires?: string | null
        }
        Update: {
          id?: string
          email?: string
          telegram_chat_id?: string | null
          phone_number?: string | null
          subscription_tier?: string
          subscription_status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          subscription_ends_at?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          email_verified?: boolean
          verification_token?: string | null
          reset_password_token?: string | null
          reset_password_expires?: string | null
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          threshold_amount: number
          lookback_days: number
          alert_frequency: string
          max_stocks: number
          preferred_channels: Json
          watchlist_symbols: string[] | null
          excluded_symbols: string[] | null
          min_transaction_value: number
          include_buys: boolean
          include_sells: boolean
          only_significant_transactions: boolean
          alert_timezone: string
          preferred_alert_time: string | null
          weekend_alerts: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          threshold_amount?: number
          lookback_days?: number
          alert_frequency?: string
          max_stocks?: number
          preferred_channels?: Json
          watchlist_symbols?: string[] | null
          excluded_symbols?: string[] | null
          min_transaction_value?: number
          include_buys?: boolean
          include_sells?: boolean
          only_significant_transactions?: boolean
          alert_timezone?: string
          preferred_alert_time?: string | null
          weekend_alerts?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          threshold_amount?: number
          lookback_days?: number
          alert_frequency?: string
          max_stocks?: number
          preferred_channels?: Json
          watchlist_symbols?: string[] | null
          excluded_symbols?: string[] | null
          min_transaction_value?: number
          include_buys?: boolean
          include_sells?: boolean
          only_significant_transactions?: boolean
          alert_timezone?: string
          preferred_alert_time?: string | null
          weekend_alerts?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      stock_analysis: {
        Row: {
          id: string
          symbol: string
          analysis_date: string
          net_money_flow: number
          net_shares_change: number
          total_insiders: number
          buyers_count: number
          sellers_count: number
          activity_type: string
          recommendation: string
          confidence_level: string
          detailed_analysis: Json
          created_at: string
        }
        Insert: {
          id?: string
          symbol: string
          analysis_date: string
          net_money_flow: number
          net_shares_change: number
          total_insiders: number
          buyers_count: number
          sellers_count: number
          activity_type: string
          recommendation: string
          confidence_level: string
          detailed_analysis: Json
          created_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          analysis_date?: string
          net_money_flow?: number
          net_shares_change?: number
          total_insiders?: number
          buyers_count?: number
          sellers_count?: number
          activity_type?: string
          recommendation?: string
          confidence_level?: string
          detailed_analysis?: Json
          created_at?: string
        }
      }
      alert_history: {
        Row: {
          id: string
          user_id: string
          alert_type: string
          symbol: string | null
          sent_at: string
          channel: string
          delivery_status: string
          error_message: string | null
          alert_title: string | null
          alert_content: string | null
          metadata: Json | null
          opened_at: string | null
          clicked_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          alert_type?: string
          symbol?: string | null
          sent_at?: string
          channel: string
          delivery_status?: string
          error_message?: string | null
          alert_title?: string | null
          alert_content?: string | null
          metadata?: Json | null
          opened_at?: string | null
          clicked_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          alert_type?: string
          symbol?: string | null
          sent_at?: string
          channel?: string
          delivery_status?: string
          error_message?: string | null
          alert_title?: string | null
          alert_content?: string | null
          metadata?: Json | null
          opened_at?: string | null
          clicked_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
