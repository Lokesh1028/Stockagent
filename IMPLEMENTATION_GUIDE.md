# Step-by-Step Implementation Guide
## Serverless Architecture (Vercel + Supabase + n8n)

This guide will walk you through building your insider trading alert service from scratch.

---

## 📋 Prerequisites

Before starting, make sure you have:

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] GitHub account
- [ ] Vercel account (free tier is fine)
- [ ] Supabase account (free tier is fine)
- [ ] Stripe account (use test mode initially)
- [ ] Finnhub API key
- [ ] Telegram Bot Token (optional, for later)

---

## Phase 1: Database Setup (30 minutes)

### Step 1.1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project:
   - **Name**: `insider-trading-alerts`
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to your users
5. Wait for project to be provisioned (~2 minutes)

### Step 1.2: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `database_schema.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Ctrl/Cmd + Enter)
6. Verify success - you should see "Success. No rows returned"

### Step 1.3: Set up Row Level Security (RLS)

The migration already includes RLS policies, but verify:

1. Go to **Authentication** → **Policies**
2. You should see policies for:
   - `users`
   - `user_preferences`
   - `alert_history`
3. If missing, run the RLS section from `database_schema.sql` again

### Step 1.4: Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize "Confirm signup" and "Reset password" templates

### Step 1.5: Get Your Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: `eyJhbGc...`
   - **service_role** key: `eyJhbGc...` (⚠️ Keep this secret!)

---

## Phase 2: Frontend Setup (45 minutes)

### Step 2.1: Clone Repository

```bash
git clone <your-repo-url>
cd Stockagent/frontend
```

### Step 2.2: Install Dependencies

```bash
npm install
```

This will install all dependencies from `package.json` including:
- Next.js 14
- Supabase client
- Stripe
- Tailwind CSS
- shadcn/ui components

### Step 2.3: Configure Environment Variables

```bash
# Copy example file
cp .env.local.example .env.local

# Edit .env.local with your actual values
nano .env.local
```

Fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Leave these for now (we'll add later)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2.4: Test Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the landing page! 🎉

### Step 2.5: Create Auth Pages

We need to create login and signup pages. I'll provide these in the next section.

---

## Phase 3: Authentication Pages (30 minutes)

### Step 3.1: Create Login Page

Create `frontend/app/(auth)/login/page.tsx`:

```typescript
// See the code in the files I'll create below
```

### Step 3.2: Create Signup Page

Create `frontend/app/(auth)/signup/page.tsx`:

```typescript
// See the code in the files I'll create below
```

### Step 3.3: Test Authentication

1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/signup
3. Create a test account
4. Check your email for verification link
5. Click verification link
6. Try logging in at http://localhost:3000/login

If successful, you should be redirected to `/dashboard` (we'll create this next).

---

## Phase 4: Dashboard (1 hour)

### Step 4.1: Create Dashboard Layout

Create `frontend/app/(dashboard)/layout.tsx`

### Step 4.2: Create Dashboard Page

Create `frontend/app/(dashboard)/dashboard/page.tsx`

### Step 4.3: Create Settings Page

Create `frontend/app/(dashboard)/settings/page.tsx`

### Step 4.4: Create Alerts History Page

Create `frontend/app/(dashboard)/alerts/page.tsx`

---

## Phase 5: API Routes (1 hour)

### Step 5.1: User Preferences API

Create `frontend/app/api/user/preferences/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      ...body,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
```

### Step 5.2: Alerts History API

Create `frontend/app/api/alerts/route.ts`

### Step 5.3: Test APIs

Use curl or Postman:

```bash
# Get preferences (requires auth cookie)
curl http://localhost:3000/api/user/preferences

# Update preferences
curl -X PATCH http://localhost:3000/api/user/preferences \
  -H "Content-Type: application/json" \
  -d '{"threshold_amount": 100000}'
```

---

## Phase 6: Stripe Integration (1 hour)

### Step 6.1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Complete verification (optional for test mode)
4. Get API keys from **Developers** → **API keys**

### Step 6.2: Create Stripe Products

In Stripe dashboard:

1. Go to **Products** → **Add Product**
2. Create 3 products:
   - **Pro Monthly**: $19/month
   - **Pro Yearly**: $182.40/year
   - **Enterprise**: $99/month
3. Copy the Price IDs (e.g., `price_xxxxx`)

### Step 6.3: Configure Stripe in Next.js

Update `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### Step 6.4: Create Checkout API

Create `frontend/app/api/billing/create-checkout/route.ts`

### Step 6.5: Create Webhook Handler

Create `frontend/app/api/webhooks/stripe/route.ts`

### Step 6.6: Test Payment Flow

1. Go to http://localhost:3000/pricing
2. Click "Start Free Trial" on Pro plan
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify subscription in Supabase `subscriptions` table

---

## Phase 7: n8n Workflows (2 hours)

### Step 7.1: Set Up n8n

**Option A: n8n Cloud (Recommended)**

1. Go to [n8n.io](https://n8n.io)
2. Sign up for account
3. Create workspace
4. Start with Starter plan ($20/mo) or free trial

**Option B: Self-Hosted (Free)**

Deploy to Railway:

```bash
# Railway will auto-deploy from GitHub
# Just connect your repo and add environment variables
```

### Step 7.2: Configure n8n Credentials

In n8n, go to **Credentials** and add:

1. **Supabase**:
   - URL: Your Supabase URL
   - Service Role Key: Your service role key

2. **Finnhub**:
   - API Key: Your Finnhub key

3. **Email (optional)**:
   - SendGrid API key or Gmail OAuth

4. **Telegram (optional)**:
   - Bot token from @BotFather

### Step 7.3: Import Updated Workflows

I'll create 3 new workflows:

1. **Data Collection Workflow** (runs hourly)
2. **Alert Distribution Workflow** (triggered by #1)
3. **User Management Workflow** (triggered by webhooks)

Import files from `n8n-workflows/` directory.

### Step 7.4: Test Workflows

1. Open "Data Collection" workflow
2. Click "Execute Workflow"
3. Check execution log
4. Verify data appears in Supabase `insider_transactions_cache` table

---

## Phase 8: Deploy to Production (30 minutes)

### Step 8.1: Push to GitHub

```bash
git add .
git commit -m "Initial implementation"
git push origin main
```

### Step 8.2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
5. Add environment variables (copy from `.env.local`)
6. Click "Deploy"

Wait ~2 minutes for deployment to complete.

### Step 8.3: Configure Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Add your domain (e.g., `insideralerts.com`)
3. Update DNS records as instructed
4. Wait for SSL certificate (~5 minutes)

### Step 8.4: Set Up Stripe Webhooks

1. In Stripe dashboard, go to **Developers** → **Webhooks**
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Events: Select all `customer.subscription.*` events
5. Copy webhook secret and add to Vercel environment variables:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

### Step 8.5: Update n8n Webhooks

In n8n workflows, update webhook URLs to your production domain.

---

## Phase 9: Testing & QA (1 hour)

### Test Checklist:

- [ ] Landing page loads
- [ ] Signup works
- [ ] Email verification works
- [ ] Login works
- [ ] Dashboard displays correctly
- [ ] Settings can be updated
- [ ] Stripe checkout works
- [ ] Webhook updates subscription
- [ ] n8n workflows execute
- [ ] Alerts are delivered

---

## Phase 10: Launch! 🚀

### Pre-Launch Checklist:

- [ ] All tests passing
- [ ] Error monitoring set up (Sentry)
- [ ] Analytics set up (Google Analytics / Plausible)
- [ ] Terms of Service page created
- [ ] Privacy Policy page created
- [ ] About page created
- [ ] Contact page created
- [ ] SEO optimized (meta tags, sitemap)
- [ ] Social media accounts created
- [ ] Support email configured

### Launch Day:

1. Post on Twitter/X
2. Post on Reddit (r/stocks, r/investing)
3. Post on HackerNews (Show HN)
4. Submit to ProductHunt
5. Email your network
6. Post in relevant Discord/Slack communities

---

## Monitoring & Maintenance

### Daily:
- Check error logs in Vercel
- Check n8n execution logs
- Monitor Stripe dashboard for new subscriptions

### Weekly:
- Review user feedback
- Check analytics (signups, conversions)
- Update alert logic if needed

### Monthly:
- Review costs (Vercel, Supabase, n8n, Finnhub)
- Analyze churn rate
- Plan new features

---

## Cost Summary

### Month 1 (0-100 users):
- **Vercel**: $0 (hobby tier)
- **Supabase**: $0 (free tier)
- **n8n**: $20 (starter tier)
- **Finnhub**: $0 (free tier)
- **Domain**: $12/year = $1/month
- **Total**: ~$21/month

### Revenue Goal:
- 10 Pro users × $19 = $190/month
- **Profit**: $169/month 🎉

---

## Troubleshooting

### Issue: Supabase connection fails

**Solution**:
- Check environment variables are correct
- Verify RLS policies are set up
- Check network connectivity

### Issue: Stripe webhook not receiving events

**Solution**:
- Verify webhook URL is correct
- Check webhook secret matches
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Issue: n8n workflow fails

**Solution**:
- Check credentials are configured
- Verify Supabase connection
- Check execution logs for errors
- Test each node individually

---

## Next Steps

Once your MVP is live:

1. **Week 1-2**: Gather user feedback
2. **Week 3-4**: Implement most-requested features
3. **Month 2**: Add Telegram integration
4. **Month 3**: Build mobile app
5. **Month 4**: Add API access for Enterprise users

---

## Need Help?

- Check the README.md for general info
- See QUICK_FIXES.md for common issues
- See SERVERLESS_ARCHITECTURE.md for architecture details
- Open an issue on GitHub

---

**Estimated Total Time**: 8-10 hours spread over 2-3 days

**Skill Level Required**: Intermediate (JavaScript/TypeScript, basic DevOps)

**Budget Required**: $0-50/month initially

Let's build this! 🚀
