# n8n Workflows for Multi-User Insider Trading Alerts

This directory contains the updated n8n workflows designed for multi-user support with Supabase integration.

---

## Overview

The original single-user workflow has been split into 3 separate workflows:

1. **Data Collection Workflow** (`1-data-collection.json`)
   - Runs every hour
   - Fetches insider trading data from Finnhub
   - Processes and analyzes transactions
   - Stores results in Supabase
   - Triggers Alert Distribution workflow

2. **Alert Distribution Workflow** (`2-alert-distribution.json`)
   - Triggered by Data Collection workflow
   - Fetches all active users from Supabase
   - Loops through each user
   - Applies user-specific filters
   - Sends personalized alerts

3. **User Management Workflow** (`3-user-management.json`)
   - Triggered by webhooks from Next.js app
   - Handles user lifecycle events
   - Sends welcome emails
   - Manages subscription changes

---

## Key Changes from Original Workflow

### Before (Single User):
```
Trigger → Fetch API → Process → Send to 1 user
```

### After (Multi-User):
```
Workflow 1: Trigger → Fetch API → Store in DB → Trigger Workflow 2
Workflow 2: Get Users → Loop → Filter per user → Send alerts
Workflow 3: Handle user events → Send emails
```

---

## Benefits of New Architecture

1. **Scalability**: Fetch data once, serve many users
2. **Efficiency**: Reduces API calls from N (users) to 1
3. **Flexibility**: Users can customize their preferences
4. **Cost-effective**: Stay within API rate limits
5. **Maintainability**: Easier to update and debug

---

## Workflow 1: Data Collection

### Trigger
- **Type**: Schedule
- **Interval**: Every 1 hour
- **Timezone**: UTC

### Nodes

1. **Get Environment Variables**
   - Reads `FINNHUB_API_KEY` from environment
   - Reads `SUPABASE_URL` and `SUPABASE_KEY`

2. **Calculate Date Range**
   - Calculates `fromDate` (7 days ago)
   - Calculates `toDate` (today)

3. **Fetch Insider Transactions**
   - Calls Finnhub API
   - URL: `https://finnhub.io/api/v1/stock/insider-transactions`
   - Parameters: `from`, `to`, `token`

4. **Validate API Response**
   - Checks if data exists
   - Handles empty responses
   - Logs errors

5. **Process Transactions**
   - Groups by symbol
   - Calculates net money flow
   - Identifies top stocks

6. **Store in Supabase**
   - Inserts into `insider_transactions_cache`
   - Inserts into `stock_analysis`
   - Uses upsert to avoid duplicates

7. **Trigger Alert Distribution**
   - Calls Workflow 2 via webhook
   - Passes analysis results

### Error Handling

- Retry failed API calls (max 3 times)
- Log errors to `system_logs` table
- Continue workflow even if some steps fail
- Send admin notification if critical failure

---

## Workflow 2: Alert Distribution

### Trigger
- **Type**: Webhook
- **Called by**: Workflow 1
- **Receives**: Stock analysis data

### Nodes

1. **Get Active Users**
   - Queries Supabase `users` table
   - Filter: `is_active = true`
   - Includes user preferences

2. **Loop Through Users**
   - Uses n8n Loop Node
   - Processes one user at a time

3. **Get User Preferences**
   - Reads from `user_preferences` table
   - Gets threshold, channels, watchlist

4. **Filter Stocks**
   - Applies user-specific filters
   - Respects watchlist
   - Applies threshold

5. **Check Subscription Tier**
   - Free: Max 5 stocks, email only
   - Pro: Max 20 stocks, all channels
   - Enterprise: Unlimited, all features

6. **Format Alert Message**
   - Creates personalized message
   - Different format per channel
   - Includes user's name

7. **Send Alerts**
   - **Email** (if enabled)
   - **Telegram** (if enabled and configured)
   - **SMS** (if Enterprise and configured)

8. **Log Alert**
   - Inserts into `alert_history` table
   - Tracks delivery status
   - Records timestamp

### Error Handling

- Skip user if error (don't stop workflow)
- Log failed alerts
- Retry delivery once
- Send summary to admin

---

## Workflow 3: User Management

### Trigger
- **Type**: Webhook
- **Called by**: Next.js API routes
- **Events**: user.created, user.updated, subscription.updated

### Nodes

1. **Parse Webhook Data**
   - Extracts event type
   - Gets user data

2. **Route by Event Type**
   - Uses Switch node
   - Different path per event

3. **User Created**
   - Send welcome email
   - Create default preferences
   - Send getting started guide

4. **Subscription Updated**
   - Update user tier in Supabase
   - Send confirmation email
   - Update alert frequency

5. **Password Reset**
   - Send reset email with token
   - Log event

6. **Email Changed**
   - Send verification to new email
   - Keep old email active until verified

---

## Setup Instructions

### Prerequisites

1. n8n instance (cloud or self-hosted)
2. Supabase project with schema installed
3. Finnhub API key
4. Email service (SendGrid, Gmail, etc.)
5. Telegram bot (optional)

### Step 1: Import Workflows

1. Open n8n
2. Click "Workflows" → "Import from File"
3. Import each workflow file:
   - `1-data-collection.json`
   - `2-alert-distribution.json`
   - `3-user-management.json`

### Step 2: Configure Credentials

In n8n Credentials settings, add:

```
Supabase:
- URL: https://xxxxx.supabase.co
- Service Role Key: eyJxxx...

HTTP Header Auth (Finnhub):
- Name: X-Finnhub-Token
- Value: your_finnhub_api_key

Gmail OAuth2 or SendGrid:
- Follow n8n's setup guide

Telegram (optional):
- Bot Token: from @BotFather
```

### Step 3: Set Environment Variables

In n8n Settings → Environment Variables:

```
FINNHUB_API_KEY=your_key
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx...
SENDGRID_API_KEY=SG.xxx (if using SendGrid)
```

### Step 4: Update Workflow Variables

In each workflow:

1. Open "Workflow Settings"
2. Update any hardcoded values
3. Verify webhook URLs
4. Test connections

### Step 5: Test Workflows

1. **Test Data Collection**:
   - Open Workflow 1
   - Click "Execute Workflow"
   - Check Supabase for data
   - Verify no errors

2. **Test Alert Distribution**:
   - Add test user to Supabase
   - Trigger Workflow 2 manually
   - Check email/Telegram
   - Verify alert_history table

3. **Test User Management**:
   - Send test webhook
   - Verify email sent
   - Check logs

### Step 6: Activate Workflows

1. Toggle "Active" switch on each workflow
2. Verify schedule is running (Workflow 1)
3. Monitor execution logs

---

## Monitoring

### Metrics to Track

1. **Execution Success Rate**
   - Should be >99%
   - Alert if <95%

2. **API Response Time**
   - Finnhub: <3 seconds
   - Supabase: <1 second

3. **Alert Delivery Rate**
   - Email: >98%
   - Telegram: >95%

4. **Execution Time**
   - Workflow 1: <30 seconds
   - Workflow 2: <10 seconds per user
   - Workflow 3: <5 seconds

### Logging

All workflows log to `system_logs` table:

```sql
SELECT * FROM system_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

---

## Troubleshooting

### Issue: Workflow 1 fails at Finnhub API

**Solution**:
- Check API key is valid
- Verify rate limits not exceeded
- Check API status: https://status.finnhub.io/

### Issue: No alerts being sent

**Solution**:
- Check Workflow 2 is active
- Verify users have `is_active = true`
- Check user preferences allow alerts
- Verify email/Telegram credentials

### Issue: Duplicate alerts

**Solution**:
- Check `alert_history` for duplicates
- Add unique constraint if needed
- Verify workflow 1 isn't running multiple times

### Issue: High execution time

**Solution**:
- Reduce number of users processed per batch
- Optimize Supabase queries (add indexes)
- Cache frequently accessed data

---

## Optimization Tips

1. **Batch User Processing**
   - Process 50 users at a time
   - Add delay between batches
   - Prevents rate limiting

2. **Cache API Responses**
   - Store Finnhub data for 1 hour
   - Reuse for all users
   - Reduces API calls

3. **Async Email Sending**
   - Queue emails instead of sending immediately
   - Process queue separately
   - Improves workflow performance

4. **Database Indexing**
   - Index frequently queried columns
   - See `database_schema.sql` for indexes
   - Monitor slow queries

---

## Scaling Considerations

### 100 Users
- Current setup works fine
- No modifications needed

### 1,000 Users
- Add batch processing
- Increase n8n memory
- Consider Redis for caching

### 10,000+ Users
- Split into multiple distribution workflows
- Use message queue (RabbitMQ)
- Dedicated email service
- CDN for static assets

---

## Cost Breakdown

### n8n Cloud
- Starter ($20/mo): Up to 5,000 executions
- Pro ($50/mo): Up to 50,000 executions

### Finnhub API
- Free: 60 calls/min
- Premium ($60/mo): 300 calls/min

### Email (SendGrid)
- Free: 100 emails/day
- Essentials ($20/mo): 50,000 emails/month

### Estimated Total
- 100 users: ~$90/month
- 1,000 users: ~$140/month
- 10,000 users: ~$400/month

---

## Security Best Practices

1. ✅ Never hardcode API keys
2. ✅ Use environment variables
3. ✅ Restrict Supabase RLS policies
4. ✅ Validate all webhook payloads
5. ✅ Rate limit webhooks
6. ✅ Log all errors
7. ✅ Encrypt sensitive data
8. ✅ Regular security audits

---

## Maintenance Schedule

### Daily
- Check execution logs
- Monitor error rate
- Verify alerts delivered

### Weekly
- Review performance metrics
- Check database growth
- Update watchlists

### Monthly
- Review and optimize queries
- Update dependencies
- Backup database

---

## Version History

- **v1.0** (Original): Single-user workflow
- **v2.0** (Current): Multi-user with Supabase
- **v2.1** (Planned): Redis caching
- **v3.0** (Planned): Real-time WebSocket alerts

---

## Support

For issues:
1. Check execution logs in n8n
2. Check `system_logs` table
3. See IMPLEMENTATION_GUIDE.md
4. Open GitHub issue

---

**Ready to import?** Start with `1-data-collection.json`!
