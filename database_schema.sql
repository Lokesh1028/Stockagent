-- Database Schema for Insider Trading Alert Service
-- This schema supports multi-tenant architecture for scaling to multiple users

-- Enable UUID extension (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    telegram_chat_id VARCHAR(50) UNIQUE,
    phone_number VARCHAR(20),
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'trial')),
    stripe_customer_id VARCHAR(100) UNIQUE,
    stripe_subscription_id VARCHAR(100) UNIQUE,
    trial_ends_at TIMESTAMP,
    subscription_ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(100),
    reset_password_token VARCHAR(100),
    reset_password_expires TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_telegram_chat_id ON users(telegram_chat_id);

-- =====================================================
-- USER PREFERENCES TABLE
-- =====================================================
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Alert preferences
    threshold_amount INTEGER DEFAULT 50000,
    lookback_days INTEGER DEFAULT 7 CHECK (lookback_days BETWEEN 1 AND 365),
    alert_frequency VARCHAR(20) DEFAULT 'daily' CHECK (alert_frequency IN ('realtime', 'hourly', 'daily', 'weekly')),
    max_stocks INTEGER DEFAULT 5 CHECK (max_stocks BETWEEN 1 AND 50),
    preferred_channels JSONB DEFAULT '["email"]',

    -- Stock filtering
    watchlist_symbols TEXT[], -- Array of stock symbols to watch
    excluded_symbols TEXT[], -- Array of stock symbols to exclude
    min_transaction_value DECIMAL(15, 2) DEFAULT 0,

    -- Alert customization
    include_buys BOOLEAN DEFAULT true,
    include_sells BOOLEAN DEFAULT true,
    only_significant_transactions BOOLEAN DEFAULT false,

    -- Timing preferences
    alert_timezone VARCHAR(50) DEFAULT 'UTC',
    preferred_alert_time TIME, -- e.g., '09:00:00' for 9 AM
    weekend_alerts BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id)
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- =====================================================
-- INSIDER TRANSACTIONS CACHE TABLE
-- =====================================================
-- Stores processed insider transaction data to avoid redundant API calls
CREATE TABLE insider_transactions_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(10) NOT NULL,
    transaction_date DATE NOT NULL,
    filing_date DATE,
    insider_name VARCHAR(255),
    insider_position VARCHAR(100),
    transaction_type VARCHAR(10) CHECK (transaction_type IN ('BUY', 'SELL', 'OPTION', 'OTHER')),
    shares DECIMAL(15, 2),
    price DECIMAL(15, 4),
    value DECIMAL(18, 2),
    net_change DECIMAL(15, 2),

    -- Metadata
    raw_data JSONB, -- Store full API response
    fetched_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(symbol, transaction_date, insider_name, shares, price)
);

CREATE INDEX idx_transactions_symbol ON insider_transactions_cache(symbol);
CREATE INDEX idx_transactions_date ON insider_transactions_cache(transaction_date);
CREATE INDEX idx_transactions_value ON insider_transactions_cache(value);
CREATE INDEX idx_transactions_fetched_at ON insider_transactions_cache(fetched_at);

-- =====================================================
-- STOCK ANALYSIS TABLE
-- =====================================================
-- Stores daily aggregated analysis for each stock
CREATE TABLE stock_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(10) NOT NULL,
    analysis_date DATE NOT NULL,

    -- Aggregated metrics
    net_money_flow DECIMAL(18, 2),
    net_shares_change DECIMAL(15, 2),
    total_insiders INTEGER,
    buyers_count INTEGER,
    sellers_count INTEGER,

    -- Analysis results
    activity_type VARCHAR(20) CHECK (activity_type IN ('NET BUYING', 'NET SELLING', 'NO NET ACTIVITY')),
    recommendation VARCHAR(50),
    confidence_level VARCHAR(20) CHECK (confidence_level IN ('LOW', 'MEDIUM', 'HIGH')),

    -- Full analysis data
    detailed_analysis JSONB,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(symbol, analysis_date)
);

CREATE INDEX idx_stock_analysis_symbol ON stock_analysis(symbol);
CREATE INDEX idx_stock_analysis_date ON stock_analysis(analysis_date);
CREATE INDEX idx_stock_analysis_activity_type ON stock_analysis(activity_type);

-- =====================================================
-- ALERT HISTORY TABLE
-- =====================================================
CREATE TABLE alert_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Alert details
    alert_type VARCHAR(20) DEFAULT 'insider_trade' CHECK (alert_type IN ('insider_trade', 'threshold_breach', 'custom')),
    symbol VARCHAR(10),
    sent_at TIMESTAMP DEFAULT NOW(),

    -- Delivery info
    channel VARCHAR(20) CHECK (channel IN ('email', 'telegram', 'sms', 'webhook')),
    delivery_status VARCHAR(20) DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'failed', 'pending')),
    error_message TEXT,

    -- Content
    alert_title TEXT,
    alert_content TEXT,
    metadata JSONB,

    -- Engagement tracking
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP
);

CREATE INDEX idx_alert_history_user_id ON alert_history(user_id);
CREATE INDEX idx_alert_history_sent_at ON alert_history(sent_at);
CREATE INDEX idx_alert_history_symbol ON alert_history(symbol);
CREATE INDEX idx_alert_history_channel ON alert_history(channel);

-- =====================================================
-- API USAGE TRACKING TABLE
-- =====================================================
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    endpoint VARCHAR(100),
    method VARCHAR(10),
    request_count INTEGER DEFAULT 1,
    timestamp TIMESTAMP DEFAULT NOW(),

    -- Rate limiting
    daily_count INTEGER DEFAULT 1,
    monthly_count INTEGER DEFAULT 1
);

CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_usage_timestamp ON api_usage(timestamp);

-- =====================================================
-- PAYMENT HISTORY TABLE
-- =====================================================
CREATE TABLE payment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    stripe_payment_intent_id VARCHAR(100) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),

    subscription_tier VARCHAR(20),
    billing_period_start DATE,
    billing_period_end DATE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX idx_payment_history_status ON payment_history(status);

-- =====================================================
-- SYSTEM LOGS TABLE
-- =====================================================
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_level VARCHAR(20) CHECK (log_level IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    workflow_name VARCHAR(100),
    node_name VARCHAR(100),
    message TEXT,
    stack_trace TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_system_logs_level ON system_logs(log_level);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- Active users summary
CREATE VIEW active_users_summary AS
SELECT
    subscription_tier,
    COUNT(*) as user_count,
    COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_count,
    COUNT(CASE WHEN last_login_at > NOW() - INTERVAL '7 days' THEN 1 END) as active_last_7_days,
    COUNT(CASE WHEN last_login_at > NOW() - INTERVAL '30 days' THEN 1 END) as active_last_30_days
FROM users
WHERE is_active = true
GROUP BY subscription_tier;

-- Daily alert stats
CREATE VIEW daily_alert_stats AS
SELECT
    DATE(sent_at) as date,
    channel,
    COUNT(*) as total_sent,
    COUNT(CASE WHEN delivery_status = 'sent' THEN 1 END) as successful,
    COUNT(CASE WHEN delivery_status = 'failed' THEN 1 END) as failed,
    COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as opened
FROM alert_history
GROUP BY DATE(sent_at), channel
ORDER BY date DESC;

-- Top stocks by alert frequency
CREATE VIEW top_alerted_stocks AS
SELECT
    symbol,
    COUNT(*) as alert_count,
    COUNT(DISTINCT user_id) as unique_users,
    MAX(sent_at) as last_alert
FROM alert_history
WHERE symbol IS NOT NULL
GROUP BY symbol
ORDER BY alert_count DESC
LIMIT 50;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_history_updated_at BEFORE UPDATE ON payment_history
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (FOR TESTING)
-- =====================================================

-- Insert a test user
INSERT INTO users (email, telegram_chat_id, subscription_tier, email_verified)
VALUES
    ('test@example.com', '123456789', 'pro', true),
    ('free@example.com', NULL, 'free', true);

-- Insert preferences for test user
INSERT INTO user_preferences (user_id, threshold_amount, lookback_days, alert_frequency, preferred_channels)
SELECT
    id,
    100000,
    14,
    'daily',
    '["email", "telegram"]'::jsonb
FROM users WHERE email = 'test@example.com';

-- =====================================================
-- PERMISSIONS (Optional - for RLS in Supabase)
-- =====================================================

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_own_data ON users
    FOR ALL
    USING (auth.uid() = id);

CREATE POLICY user_preferences_own_data ON user_preferences
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY alert_history_own_data ON alert_history
    FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- USEFUL QUERIES
-- =====================================================

-- Get user with preferences
-- SELECT u.*, up.*
-- FROM users u
-- LEFT JOIN user_preferences up ON u.id = up.user_id
-- WHERE u.email = 'test@example.com';

-- Get all active pro users for alerts
-- SELECT u.email, u.telegram_chat_id, up.threshold_amount, up.preferred_channels
-- FROM users u
-- LEFT JOIN user_preferences up ON u.id = up.user_id
-- WHERE u.is_active = true
--   AND u.subscription_status = 'active'
--   AND u.subscription_tier IN ('pro', 'enterprise');

-- Get recent insider transactions for a symbol
-- SELECT * FROM insider_transactions_cache
-- WHERE symbol = 'AAPL'
--   AND transaction_date >= CURRENT_DATE - INTERVAL '7 days'
-- ORDER BY transaction_date DESC;
