# 🚨 Insider Trading Alert Service

An automated system that monitors insider trading activity using the Finnhub API and sends intelligent alerts via email and Telegram.

## 📊 What It Does

This n8n workflow automatically:

1. **Fetches** insider trading data from Finnhub API (hourly)
2. **Processes** transactions to identify significant activity
3. **Analyzes** insider behavior patterns
4. **Generates** buy/sell recommendations
5. **Sends** personalized alerts via Email and Telegram

## 🎯 Key Features

- ✅ **Automated Monitoring**: Runs every hour to catch new insider trades
- ✅ **Smart Filtering**: Identifies top 5 stocks by net insider activity
- ✅ **Detailed Analysis**: Provides context and investment recommendations
- ✅ **Multi-Channel Alerts**: Email (detailed) + Telegram (quick summary)
- ✅ **Sentiment Analysis**: Bullish/bearish signals based on insider activity
- ✅ **Transaction Breakdown**: Shows individual insider purchases/sales

## 📋 Current Workflow Structure

### Nodes Overview

1. **Schedule Trigger** - Runs every hour
2. **Workflow Configuration** - Sets API key, thresholds, date range
3. **Fetch Insider Transactions** - Calls Finnhub API
4. **Process and Filter Transactions** - Groups by symbol, calculates net activity
5. **Enrich Transaction Details** - Adds company metadata
6. **Analyze and Generate Report** - Creates recommendations
7. **Format Telegram Message** - Quick summary format
8. **Format Email Message** - Detailed analysis format
9. **Send Telegram Alert** - Pushes to Telegram
10. **Send Gmail Alert** - Sends detailed email

## 🔧 Setup Instructions

### Prerequisites

- n8n installed (cloud or self-hosted)
- Finnhub API key ([Get free key](https://finnhub.io/register))
- Telegram Bot Token ([Create bot](https://t.me/botfather))
- Gmail OAuth2 credentials

### Step 1: Get API Keys

1. **Finnhub API**:
   - Sign up at https://finnhub.io/register
   - Get your free API key
   - Free tier: 60 calls/minute

2. **Telegram Bot**:
   - Message @BotFather on Telegram
   - Create new bot with `/newbot`
   - Save the bot token
   - Get your chat ID by messaging @userinfobot

3. **Gmail**:
   - Set up OAuth2 in n8n credentials manager
   - Follow n8n's Gmail integration guide

### Step 2: Import Workflow

1. Copy the workflow JSON file
2. In n8n, click **Workflows → Import from File**
3. Paste the JSON content
4. Click **Import**

### Step 3: Configure Credentials

⚠️ **IMPORTANT**: Do NOT use hardcoded API keys in production!

**Current Issues**:
- Line 30: Finnhub API key is hardcoded
- Line 181: Telegram chat ID is hardcoded
- Line 205: Email address is hardcoded

**How to Fix**:

1. **In "Workflow Configuration" node**, change:
   ```javascript
   // FROM:
   "finnhubApiKey": "d42gt9hr01qorlerau8gd42gt9hr01qorlerau90"

   // TO:
   "finnhubApiKey": "={{ $env.FINNHUB_API_KEY }}"
   ```

2. **In "Send Telegram Alert" node**, change:
   ```javascript
   // FROM:
   "chatId": "586357283"

   // TO:
   "chatId": "={{ $env.TELEGRAM_CHAT_ID }}"
   ```

3. **In "Send Gmail Alert" node**, change:
   ```javascript
   // FROM:
   "sendTo": "vaughanfawcett1@gmail.com"

   // TO:
   "sendTo": "={{ $env.USER_EMAIL }}"
   ```

4. **Set environment variables** in n8n:
   - Go to Settings → Environment Variables
   - Add:
     - `FINNHUB_API_KEY=your_key_here`
     - `TELEGRAM_CHAT_ID=your_chat_id`
     - `USER_EMAIL=your@email.com`

### Step 4: Test the Workflow

1. Click **Execute Workflow** button
2. Check each node for successful execution
3. Verify you received Telegram and email alerts

## 🚀 Making It a Multi-User Service

**Current Status**: Single-user workflow

**To Scale to Multiple Users**, see [IMPROVEMENTS.md](./IMPROVEMENTS.md) for:

- ✅ Database schema for user management
- ✅ Multi-tenant architecture
- ✅ Subscription tiers (free, pro, enterprise)
- ✅ Payment integration with Stripe
- ✅ User preference management
- ✅ API rate limiting solutions
- ✅ Implementation roadmap

### Quick Summary of Changes Needed:

1. **Security**: Move all API keys to environment variables
2. **Database**: Set up PostgreSQL (use [database_schema.sql](./database_schema.sql))
3. **User Management**: Store users in database instead of hardcoding
4. **Workflow Split**:
   - Workflow 1: Fetch data once (hourly)
   - Workflow 2: Loop through users and send alerts
5. **Caching**: Store API responses to avoid redundant calls
6. **Error Handling**: Add retry logic and validation
7. **Payment**: Integrate Stripe for subscriptions

## 💰 Business Model

### Suggested Pricing

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 1 alert/day, Email only, Top 5 stocks |
| **Pro** | $19/mo | Unlimited alerts, Email + Telegram, Top 20 stocks, Custom filters |
| **Enterprise** | $99/mo | API access, Custom watchlists, 1-year history, Webhooks |

### Cost Breakdown

**Monthly Operating Costs** (100 users):
- n8n Cloud: $20-50/mo
- Database (Supabase): $25/mo
- Finnhub API: $60/mo
- Email service: $20/mo
- **Total**: ~$125-155/mo

**Break-even**: 7-8 Pro subscribers or 2 Enterprise clients

## 📊 Sample Alert Output

### Telegram Alert (Quick Summary)
```
🔔 INSIDER TRADING ALERT
Jan 15, 2025

📈 #1 TSLA
Elon Musk BOUGHT $5.2M
Signal: 🚀 STRONG BUY

📉 #2 AAPL
Tim Cook SOLD $3.1M
Signal: 👀 MONITOR

📈 #3 NVDA
Jensen Huang BOUGHT $2.8M
Signal: 📈 BUY

📧 Detailed analysis in email
```

### Email Alert (Detailed Analysis)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSIDER TRADE #1: Tesla Inc (TSLA)

SUMMARY
Net Activity: $5.20M (BUY) (NET BUYING)
Total Insiders: 3 (2 buying, 1 selling)
Shares Impact: 52,000 shares
Recommendation: 🚀 STRONG BUY (HIGH confidence)

INSIDER TRANSACTIONS

📈 Elon Musk BOUGHT $5.20M across 2 purchases
   Strong conviction buyer - accumulated $5.20M across 2 buy transactions.
   This is a very bullish signal.

ANALYSIS & INTERPRETATION

This is an exceptionally large insider purchase. When insiders commit over
$5M of their own capital, it typically signals they have access to non-public
information suggesting the stock is significantly undervalued or a major
positive catalyst is approaching.

Market Context: With 2 insiders buying vs 1 selling, there's a buying
consensus suggesting positive sentiment.

INVESTMENT CONSIDERATION

Consider this a potential opportunity. Insider buying at this level often
precedes positive stock performance. Recommended actions:
(1) Research recent company news and earnings
(2) Evaluate current valuation
(3) Consider position sizing
```

## 🔍 How the Analysis Works

### Processing Logic

1. **Data Collection**:
   - Fetches last 7 days of insider transactions
   - Groups by stock symbol
   - Calculates net money flow (buys - sells)

2. **Filtering**:
   - Sorts by absolute value of net activity
   - Returns top 5 stocks

3. **Analysis**:
   - Identifies buying vs selling patterns
   - Analyzes individual insider behavior
   - Generates confidence scores

4. **Recommendations**:
   - 🚀 STRONG BUY: Net buying > $5M
   - 📈 BUY: Net buying > $1M
   - ⚠️ CAUTION: Net selling > $5M
   - 👀 MONITOR: Net selling > $1M
   - 📊 HOLD: Activity < $1M

## ⚠️ Known Issues & Limitations

### Current Limitations:

1. **Single User Only**: Hardcoded email and Telegram ID
2. **No Customization**: Fixed thresholds and date ranges
3. **API Rate Limits**: Finnhub free tier limited to 60 calls/min
4. **No Error Handling**: Fails silently if API is down
5. **No Historical Data**: Each execution is independent
6. **Security Risk**: API keys visible in workflow

### Roadmap:

- [ ] Multi-user support with database
- [ ] User preference management
- [ ] Custom watchlists
- [ ] Real-time alerts (< 1 hour delay)
- [ ] Mobile app
- [ ] Historical data storage
- [ ] Machine learning predictions
- [ ] Portfolio integration

## 🛡️ Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Enable Row-Level Security** (RLS) in database
4. **Implement rate limiting** to prevent abuse
5. **Validate all user inputs**
6. **Use HTTPS** for all API calls
7. **Encrypt sensitive data** at rest
8. **Regular security audits**

## 📚 Resources

- [Finnhub API Documentation](https://finnhub.io/docs/api)
- [n8n Documentation](https://docs.n8n.io/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Integration Guide](https://stripe.com/docs)

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

1. Enhanced error handling
2. Additional data sources (SEC EDGAR, Yahoo Finance)
3. Better sentiment analysis
4. Machine learning for predictions
5. UI/UX improvements for dashboard

## 📄 License

MIT License - feel free to use this for commercial or personal projects.

## 📧 Support

For questions or issues:
- Create an issue in this repository
- Check [IMPROVEMENTS.md](./IMPROVEMENTS.md) for detailed implementation guide

## 🎯 Next Steps

1. **Immediate**: Fix security issues (remove hardcoded keys)
2. **Short-term**: Set up database and multi-user support
3. **Medium-term**: Build landing page and payment integration
4. **Long-term**: Launch full-featured service with mobile app

---

**⚡ Quick Start Command**:

```bash
# 1. Clone this repository
git clone <your-repo>

# 2. Set up database
psql -U your_user -d your_database -f database_schema.sql

# 3. Configure n8n environment variables
export FINNHUB_API_KEY="your_key"
export TELEGRAM_CHAT_ID="your_chat_id"
export USER_EMAIL="your@email.com"

# 4. Import workflow to n8n
# (Upload the JSON file through n8n UI)

# 5. Activate workflow
# (Click "Active" toggle in n8n)
```

---

Built with ❤️ using n8n, Finnhub API, and market data

Last updated: 2025-01-05
