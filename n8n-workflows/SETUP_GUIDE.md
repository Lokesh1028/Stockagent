# n8n Multi-User Workflows - Complete Setup Guide

This guide will help you import and configure the 3 n8n workflows for multi-user insider trading alerts.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ n8n instance (cloud or self-hosted)
- ✅ Supabase project with database schema installed
- ✅ Finnhub API key
- ✅ Gmail OAuth2 credentials (or SendGrid)
- ✅ Telegram Bot Token (optional)
- ✅ Next.js app deployed (for webhooks)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Import Workflows

1. Open your n8n instance
2. Go to **Workflows** → **Add workflow** → **Import from File**
3. Import in this order:
   - `1-data-collection.json`
   - `2-alert-distribution.json`
   - `3-user-management.json`

### Step 2: Configure Credentials

Go to **Settings** → **Credentials** and add:

1. **Gmail OAuth2** (or SendGrid)
2. **Telegram Bot** (optional)
3. **HTTP Header Auth** for Finnhub (optional, using env vars)

### Step 3: Set Environment Variables

In n8n Settings → **Environment Variables**, add:

```bash
FINNHUB_API_KEY=your_finnhub_key
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
```

### Step 4: Get Webhook URLs

1. Open **Workflow 2** (Alert Distribution)
2. Click on "Webhook Trigger" node
3. Copy the **Production URL** (looks like: `https://n8n.app.n8n.cloud/webhook/workflow-2-alert-distribution`)
4. Update `N8N_WEBHOOK_URL` environment variable

### Step 5: Activate Workflows

1. Open each workflow
2. Click the **Active** toggle in the top right
3. Verify they're running (check execution logs)

---

## 📖 Detailed Setup

### Workflow 1: Data Collection

**Purpose**: Fetches insider trading data hourly and stores in Supabase

#### Nodes Overview:

1. **Schedule Trigger** - Runs every hour
2. **Get Environment Variables** - Reads from n8n env vars
3. **Fetch Insider Transactions** - Calls Finnhub API
4. **Validate API Response** - Checks data is valid
5. **Check Has Data** - Branches if data exists
6. **Process and Analyze Transactions** - Groups by symbol, calculates metrics
7. **Store Analysis in Supabase** - Saves to `stock_analysis` table
8. **Trigger Alert Distribution** - Calls Workflow 2
9. **Log Workflow Completion** - Logs to `system_logs`

#### Configuration:

No configuration needed! Uses environment variables.

#### Testing:

1. Open workflow
2. Click **"Execute Workflow"** button
3. Check execution log (should be green)
4. Verify data in Supabase:
   ```sql
   SELECT * FROM stock_analysis
   WHERE analysis_date = CURRENT_DATE
   ORDER BY created_at DESC;
   ```

#### Troubleshooting:

**Issue**: "Finnhub API key not found"
- Solution: Check `FINNHUB_API_KEY` is set in environment variables

**Issue**: "Supabase connection failed"
- Solution: Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct

**Issue**: "No data returned"
- Solution: Normal if no insider trades today. Check different date range.

---

### Workflow 2: Alert Distribution

**Purpose**: Sends personalized alerts to all active users

#### Nodes Overview:

1. **Webhook Trigger** - Triggered by Workflow 1
2. **Get Environment Variables** - Reads config
3. **Get Today's Stock Analysis** - Reads from Supabase
4. **Get Active Users** - Reads active users from database
5. **Loop Through Users** - Processes one user at a time
6. **Get User Preferences** - Gets user settings
7. **Filter Stocks by Preferences** - Applies user filters
8. **Should Send Alert?** - Checks if user has matching stocks
9. **Format Email Alert** - Creates HTML email
10. **Format Telegram Alert** - Creates Telegram message
11. **Send Email Alert** - Sends via Gmail
12. **Send Telegram Alert** - Sends via Telegram
13. **Log Alert to History** - Saves to `alert_history`
14. **Send Webhook Response** - Returns success to Workflow 1

#### Configuration:

1. **Gmail Credentials**:
   - Go to **Credentials** → **Add Credential** → **Gmail OAuth2**
   - Follow n8n's setup wizard
   - Authorize your Gmail account

2. **Telegram Credentials** (optional):
   - Go to **Credentials** → **Add Credential** → **Telegram**
   - Add your bot token from @BotFather

3. **Webhook URL**:
   - Click "Webhook Trigger" node
   - Copy **Production URL**
   - Add to Workflow 1's "Trigger Alert Distribution" node

#### Testing:

1. Create a test user in Supabase:
   ```sql
   INSERT INTO users (email, subscription_tier, is_active, email_verified)
   VALUES ('test@example.com', 'pro', true, true);

   INSERT INTO user_preferences (user_id, threshold_amount, preferred_channels)
   SELECT id, 10000, '["email"]'::jsonb
   FROM users WHERE email = 'test@example.com';
   ```

2. Execute Workflow 1 (to generate data)
3. Check if test user received email
4. Verify `alert_history` table:
   ```sql
   SELECT * FROM alert_history
   WHERE user_id = (SELECT id FROM users WHERE email = 'test@example.com')
   ORDER BY sent_at DESC
   LIMIT 5;
   ```

#### Troubleshooting:

**Issue**: "No users found"
- Solution: Check `users` table has active users with `is_active = true`

**Issue**: "Email not sending"
- Solution: Verify Gmail credentials are set up correctly

**Issue**: "Loop not working"
- Solution: Check "Loop Through Users" node is properly connected

---

### Workflow 3: User Management

**Purpose**: Handles user lifecycle events (signup, subscription changes, etc.)

#### Nodes Overview:

1. **User Events Webhook** - Receives events from Next.js app
2. **Parse Event Data** - Validates webhook payload
3. **Route by Event Type** - Sends to correct handler
4. **Send Welcome Email** - New user signup
5. **Send Verification Confirmation** - Email verified
6. **Send Subscription Welcome** - New Pro subscription
7. **Send Subscription Update** - Plan changed
8. **Send Cancellation Email** - Subscription cancelled
9. **Send Password Reset Email** - Password reset requested
10. **Log Event** - Logs to `system_logs`
11. **Send Success Response** - Returns to Next.js app

#### Configuration:

1. **Gmail Credentials**: Same as Workflow 2

2. **Webhook URL**:
   - Click "User Events Webhook" node
   - Copy **Production URL**
   - Add to your Next.js `.env`:
     ```bash
     N8N_USER_EVENTS_WEBHOOK=https://n8n.app.n8n.cloud/webhook/user-events
     ```

#### Testing:

Send a test webhook:

```bash
curl -X POST https://your-n8n-instance.com/webhook/user-events \
  -H "Content-Type: application/json" \
  -d '{
    "event": "user.created",
    "user": {
      "id": "test-user-id",
      "email": "test@example.com"
    },
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'
```

Check if welcome email was sent to test@example.com

#### Supported Events:

- `user.created` - New user signup
- `user.verified` - Email verification confirmed
- `subscription.created` - New paid subscription
- `subscription.updated` - Plan or payment method changed
- `subscription.cancelled` - Subscription cancelled
- `password.reset` - Password reset requested

#### Calling from Next.js:

```typescript
// In your Next.js API route
async function sendUserEvent(event: string, user: User, metadata?: any) {
  await fetch(process.env.N8N_USER_EVENTS_WEBHOOK!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      user: {
        id: user.id,
        email: user.email,
      },
      metadata,
      timestamp: new Date().toISOString(),
    }),
  });
}

// Usage examples:
await sendUserEvent('user.created', newUser);
await sendUserEvent('subscription.created', user, { plan: 'pro' });
await sendUserEvent('password.reset', user, { resetToken: token });
```

---

## 🔄 Workflow Flow

Here's how the workflows work together:

```
┌─────────────────────────────────────────────────────────┐
│                    WORKFLOW 1                           │
│               (Data Collection)                         │
│                                                         │
│  Schedule (Hourly) → Fetch API → Process → Store DB    │
│                                      ↓                  │
│                               Trigger Workflow 2        │
└─────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────┐
│                    WORKFLOW 2                           │
│              (Alert Distribution)                       │
│                                                         │
│  Get Users → Loop → Filter → Format → Send → Log       │
│              Each User Gets Personalized Alerts         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    WORKFLOW 3                           │
│              (User Management)                          │
│                                                         │
│  Next.js App → Webhook → Route by Event → Send Email   │
│  (Signup, subscription changes, password resets, etc.)  │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Monitoring

### Check Workflow Executions

1. Go to **Executions** in n8n sidebar
2. Filter by workflow
3. Check success/failure rate

### Check System Logs

```sql
-- View recent workflow logs
SELECT
  log_level,
  workflow_name,
  message,
  created_at
FROM system_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Check for errors
SELECT * FROM system_logs
WHERE log_level = 'ERROR'
ORDER BY created_at DESC
LIMIT 10;
```

### Check Alert Delivery

```sql
-- Alert delivery rate (last 7 days)
SELECT
  DATE(sent_at) as date,
  channel,
  COUNT(*) as total_sent,
  SUM(CASE WHEN delivery_status = 'sent' THEN 1 ELSE 0 END) as successful,
  ROUND(100.0 * SUM(CASE WHEN delivery_status = 'sent' THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM alert_history
WHERE sent_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(sent_at), channel
ORDER BY date DESC, channel;
```

---

## ⚠️ Common Issues

### 1. Workflow 1 Not Running

**Symptoms**: No new data in `stock_analysis` table

**Solutions**:
- Check if workflow is Active (toggle in top right)
- Verify schedule trigger is enabled
- Check execution logs for errors
- Verify Finnhub API key is valid

### 2. No Alerts Being Sent

**Symptoms**: Users not receiving emails/Telegram messages

**Solutions**:
- Check Workflow 2 is Active
- Verify Workflow 1 successfully triggered Workflow 2
- Check users have `is_active = true` and `email_verified = true`
- Verify Gmail credentials are working
- Check user preferences allow alerts

### 3. Duplicate Alerts

**Symptoms**: Users receiving the same alert multiple times

**Solutions**:
- Check Workflow 1 isn't running multiple times per hour
- Verify unique constraint on `stock_analysis.symbol + analysis_date`
- Check `alert_history` for duplicate entries
- Ensure Workflow 2 is only triggered once per execution

### 4. Slow Performance

**Symptoms**: Workflows taking >5 minutes to complete

**Solutions**:
- Reduce batch size in Loop node (process 10 users at a time)
- Add indexes to Supabase tables (see `database_schema.sql`)
- Optimize user filtering logic
- Consider splitting into multiple distribution workflows

---

## 🚀 Performance Optimization

### For 100 Users
Current setup works perfectly. No changes needed.

### For 1,000 Users
- Add batch processing (50 users per batch)
- Increase n8n execution timeout
- Add Redis caching for stock data

### For 10,000+ Users
- Split into multiple distribution workflows
- Use message queue (RabbitMQ, AWS SQS)
- Dedicated email service (SendGrid, AWS SES)
- Load balance n8n instances

---

## 🔐 Security Best Practices

✅ **DO**:
- Use environment variables for all secrets
- Enable webhook authentication
- Rotate API keys regularly
- Monitor for unusual activity
- Keep n8n updated

❌ **DON'T**:
- Hardcode API keys in workflows
- Expose webhook URLs publicly
- Skip error handling
- Ignore failed executions
- Store sensitive data in logs

---

## 📈 Scaling Checklist

When you reach these milestones:

**100 users**:
- ✅ All workflows working
- ✅ Monitor execution logs
- ✅ Set up alerts for failures

**500 users**:
- ✅ Add batch processing
- ✅ Implement caching
- ✅ Upgrade n8n plan if needed

**1,000 users**:
- ✅ Split alert distribution
- ✅ Add dedicated email service
- ✅ Set up monitoring dashboard

**5,000+ users**:
- ✅ Message queue architecture
- ✅ Multiple n8n instances
- ✅ CDN for static assets
- ✅ Database read replicas

---

## 🆘 Getting Help

**Documentation**:
- n8n Docs: https://docs.n8n.io
- Supabase Docs: https://supabase.com/docs
- Finnhub API: https://finnhub.io/docs/api

**Community**:
- n8n Community: https://community.n8n.io
- Discord: (Your community link)

**Support**:
- Check `system_logs` table first
- Review n8n execution logs
- Test with sample data
- Open GitHub issue with logs

---

## ✅ Post-Setup Checklist

Before going live:

- [ ] All 3 workflows imported
- [ ] Environment variables set
- [ ] Credentials configured (Gmail, Telegram)
- [ ] Webhook URLs updated
- [ ] Test execution successful
- [ ] Test user received alert
- [ ] Alert logged to `alert_history`
- [ ] System logs working
- [ ] Error handling tested
- [ ] Monitoring set up
- [ ] Documentation reviewed
- [ ] Team trained on troubleshooting

---

## 🎉 You're All Set!

Your multi-user insider trading alert system is now ready to serve thousands of users!

**Next steps**:
1. Activate all workflows
2. Monitor first 24 hours closely
3. Review execution logs daily
4. Optimize based on performance metrics

Good luck! 🚀
