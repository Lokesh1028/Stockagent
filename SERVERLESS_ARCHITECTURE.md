# Serverless Architecture Implementation Guide

## Option 3: Vercel + Supabase + n8n (Cost-Effective & Auto-Scaling)

This guide will walk you through building a production-ready insider trading alert service using serverless technologies.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                    Next.js on Vercel                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Landing Page │  │   Dashboard   │  │   Settings   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API                               │
│              Vercel Serverless Functions                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   /api/auth  │  │  /api/users  │  │ /api/webhook │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ↓                           ↓
┌──────────────────────────┐  ┌──────────────────────────┐
│       SUPABASE           │  │         n8n              │
│  ┌────────────────────┐  │  │  ┌────────────────────┐ │
│  │ PostgreSQL DB      │  │  │  │ Data Collection    │ │
│  │ - Users            │  │  │  │ Workflow           │ │
│  │ - Preferences      │  │  │  │                    │ │
│  │ - Transactions     │  │  │  │ (Runs hourly)      │ │
│  └────────────────────┘  │  │  └────────────────────┘ │
│  ┌────────────────────┐  │  │  ┌────────────────────┐ │
│  │ Auth (Built-in)    │  │  │  │ Alert Distribution │ │
│  │ - Email/Password   │  │  │  │ Workflow           │ │
│  │ - OAuth            │  │  │  │                    │ │
│  └────────────────────┘  │  │  │ (Triggered by API) │ │
│  ┌────────────────────┐  │  │  └────────────────────┘ │
│  │ Storage (Files)    │  │  └──────────────────────────┘
│  └────────────────────┘  │
└──────────────────────────┘
                │
                ↓
┌──────────────────────────┐
│        STRIPE            │
│  Payment Processing      │
└──────────────────────────┘
```

---

## 💰 Cost Breakdown (Per Month)

### Free Tier (0-100 users):
- **Vercel**: $0 (Hobby tier - 100GB bandwidth)
- **Supabase**: $0 (Free tier - 500MB DB, 2GB bandwidth)
- **n8n**: $0 (Self-hosted on free cloud provider or $20 for n8n cloud)
- **Finnhub**: $0 (Free tier - 60 calls/min)
- **Total: $0-20/month** 🎉

### Growing (100-1000 users):
- **Vercel**: $20 (Pro tier - 1TB bandwidth)
- **Supabase**: $25 (Pro tier - 8GB DB, 250GB bandwidth)
- **n8n**: $50 (Cloud Pro)
- **Finnhub**: $60 (Premium tier)
- **Stripe**: 2.9% + $0.30 per transaction
- **Total: ~$155/month + transaction fees**

### Scale (1000+ users):
- **Vercel**: $20 (Pro tier)
- **Supabase**: $25 (Pro tier with add-ons)
- **n8n**: $50 (Cloud Pro)
- **Finnhub**: $120 (Enterprise)
- **Total: ~$215/month**

---

## 🚀 Tech Stack

| Component | Technology | Why? |
|-----------|-----------|------|
| Frontend | Next.js 14 (App Router) | SSR, SEO-friendly, fast |
| UI Library | shadcn/ui + Tailwind | Beautiful, accessible components |
| Backend | Vercel Edge Functions | Fast, auto-scaling, serverless |
| Database | Supabase (PostgreSQL) | Real-time, auth built-in, free tier |
| Auth | Supabase Auth | Email, OAuth, magic links |
| Payments | Stripe | Industry standard, webhooks |
| Automation | n8n | Workflow automation |
| Email | Resend or SendGrid | Transactional emails |
| Deployment | Vercel | Zero-config, automatic CI/CD |

---

## 📁 Project Structure

```
stockagent/
├── frontend/                  # Next.js application
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── verify-email/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── settings/
│   │   │   ├── alerts/
│   │   │   └── billing/
│   │   ├── api/              # Serverless API routes
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── preferences/
│   │   │   ├── alerts/
│   │   │   └── webhooks/
│   │   ├── page.tsx          # Landing page
│   │   ├── pricing/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/               # shadcn components
│   │   ├── dashboard/
│   │   ├── landing/
│   │   └── shared/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── stripe/
│   │   └── utils/
│   ├── public/
│   ├── styles/
│   └── package.json
│
├── n8n-workflows/            # Updated workflows
│   ├── 1-data-collection.json
│   ├── 2-alert-distribution.json
│   └── 3-user-management.json
│
├── supabase/                 # Database migrations
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_rls_policies.sql
│   │   └── 003_add_indexes.sql
│   └── seed.sql
│
├── docs/                     # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT.md
│
└── README.md
```

---

## 🔑 Key Features to Build

### Phase 1: MVP (Week 1-2)
- [ ] Landing page with signup
- [ ] User authentication (email/password)
- [ ] User dashboard (view alerts)
- [ ] Basic settings (email preferences)
- [ ] Single workflow (fetch & send alerts)
- [ ] Database setup

### Phase 2: Monetization (Week 3)
- [ ] Pricing page
- [ ] Stripe integration
- [ ] Subscription management
- [ ] Free vs Pro features
- [ ] Payment webhooks

### Phase 3: Enhancement (Week 4+)
- [ ] Telegram integration
- [ ] Custom watchlists
- [ ] Alert history
- [ ] Analytics dashboard
- [ ] Mobile responsive design

---

## 🎯 User Flow

### New User Journey:
```
1. User visits landing page
   ↓
2. User clicks "Sign Up"
   ↓
3. User enters email + password
   ↓
4. Supabase creates account
   ↓
5. Verification email sent
   ↓
6. User verifies email
   ↓
7. User redirected to dashboard
   ↓
8. User sets preferences (free tier)
   ↓
9. User starts receiving daily alerts
   ↓
10. User upgrades to Pro (optional)
```

### Existing User Journey:
```
1. User logs in
   ↓
2. Dashboard shows recent alerts
   ↓
3. User clicks alert to see details
   ↓
4. User manages settings
   ↓
5. User upgrades/downgrades subscription
```

---

## 🔐 Authentication Flow

Using **Supabase Auth**:

1. **Sign Up**:
   ```typescript
   const { data, error } = await supabase.auth.signUp({
     email: 'user@example.com',
     password: 'password',
     options: {
       data: {
         full_name: 'John Doe',
       }
     }
   })
   ```

2. **Sign In**:
   ```typescript
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'user@example.com',
     password: 'password',
   })
   ```

3. **OAuth** (Google, GitHub):
   ```typescript
   const { data, error } = await supabase.auth.signInWithOAuth({
     provider: 'google',
   })
   ```

4. **Session Management**:
   - Automatic with Supabase
   - JWT tokens stored in cookies
   - Row-Level Security (RLS) enforced

---

## 💳 Payment Flow (Stripe)

### Subscription Process:

1. User clicks "Upgrade to Pro"
2. Frontend redirects to Stripe Checkout
3. User completes payment
4. Stripe sends webhook to `/api/webhooks/stripe`
5. Webhook updates user's subscription in DB
6. User gets access to Pro features

### Stripe Products:

```javascript
// Pro Monthly
{
  name: "Pro Monthly",
  price: 1900, // $19.00 in cents
  interval: "month",
  features: [
    "Unlimited alerts",
    "Email + Telegram",
    "Top 20 stocks",
    "30-day history"
  ]
}

// Pro Yearly (Save 20%)
{
  name: "Pro Yearly",
  price: 18240, // $182.40 (save $45.60)
  interval: "year",
  features: [...] // Same as monthly
}

// Enterprise
{
  name: "Enterprise",
  price: 9900, // $99.00
  interval: "month",
  features: [
    "Everything in Pro",
    "API access",
    "Custom watchlists",
    "1-year history",
    "Priority support"
  ]
}
```

---

## 🔄 Workflow Architecture

### Workflow 1: Data Collection (Runs Hourly)

```
Trigger: Schedule (every hour)
    ↓
Fetch from Finnhub API
    ↓
Process & Analyze Transactions
    ↓
Store in Supabase (insider_transactions_cache)
    ↓
Store Analysis (stock_analysis table)
    ↓
Trigger Workflow 2 (Alert Distribution)
```

### Workflow 2: Alert Distribution (Triggered by Workflow 1)

```
Trigger: Webhook from Workflow 1
    ↓
Fetch Active Users from Supabase
    ↓
Loop Through Each User:
    ↓
    ├─> Get User Preferences
    ├─> Filter Stocks by Preferences
    ├─> Format Alert Message
    ├─> Check User's Channels
    ├─> Send Email (if enabled)
    ├─> Send Telegram (if enabled)
    └─> Log to alert_history
```

### Workflow 3: User Management (Triggered by API)

```
Trigger: Webhook from Vercel API
    ↓
Event Type?
    ├─> User Created → Send Welcome Email
    ├─> Subscription Updated → Update Access
    ├─> Password Reset → Send Reset Email
    └─> Email Changed → Send Verification
```

---

## 📊 Database Schema (Supabase)

### Core Tables:

1. **auth.users** (Supabase managed)
   - id, email, encrypted_password, etc.

2. **public.user_profiles**
   - User metadata and preferences

3. **public.subscriptions**
   - Stripe subscription data

4. **public.insider_transactions_cache**
   - Cached API data

5. **public.stock_analysis**
   - Daily analysis results

6. **public.alert_history**
   - Record of sent alerts

See [database_schema.sql](./database_schema.sql) for full schema.

---

## 🌐 API Routes

### Public Routes:
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/forgot-password` - Request reset

### Protected Routes (Require Auth):
- `GET /api/user` - Get current user
- `PATCH /api/user/preferences` - Update preferences
- `GET /api/alerts` - Get alert history
- `GET /api/alerts/:id` - Get specific alert
- `POST /api/billing/create-checkout` - Create Stripe session
- `POST /api/billing/portal` - Manage subscription

### Webhook Routes:
- `POST /api/webhooks/stripe` - Stripe events
- `POST /api/webhooks/n8n` - n8n callbacks

---

## 🚀 Deployment Strategy

### 1. Supabase Setup:
```bash
# Create project at supabase.com
# Run migrations
# Get connection string
# Set environment variables
```

### 2. Vercel Setup:
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
cd frontend && vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET

# Deploy
vercel --prod
```

### 3. n8n Setup:
```bash
# Option A: n8n Cloud (recommended)
# - Sign up at n8n.io
# - Import workflows
# - Set credentials

# Option B: Self-hosted (free)
# - Deploy to Railway, Render, or Fly.io
# - See deployment guide below
```

---

## 🔧 Environment Variables

### Frontend (.env.local):
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Supabase (server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# n8n Webhook (for triggering workflows)
N8N_WEBHOOK_URL=https://your-n8n.app.n8n.cloud/webhook/xxx
```

### n8n Environment:
```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx...

# Finnhub
FINNHUB_API_KEY=xxx

# Email (optional)
SENDGRID_API_KEY=SG.xxx

# Telegram
TELEGRAM_BOT_TOKEN=xxx
```

---

## ⏱️ Implementation Timeline

### Week 1: Foundation
- **Day 1-2**: Set up Supabase + database
- **Day 3-4**: Create Next.js project + landing page
- **Day 5-7**: Build auth flow + dashboard

### Week 2: Core Features
- **Day 1-2**: Update n8n workflows for multi-user
- **Day 3-4**: Build user preferences page
- **Day 5-7**: Test end-to-end flow

### Week 3: Monetization
- **Day 1-2**: Integrate Stripe
- **Day 3-4**: Build pricing page
- **Day 5-7**: Test payment flow + webhooks

### Week 4: Polish & Launch
- **Day 1-2**: Add Telegram integration
- **Day 3-4**: Build alert history page
- **Day 5**: Testing & bug fixes
- **Day 6-7**: Deploy to production + launch!

---

## 📈 Success Metrics

Track these KPIs:

1. **User Acquisition**:
   - Daily signups
   - Signup conversion rate (visitors → signups)

2. **Engagement**:
   - Daily active users (DAU)
   - Alert open rate
   - Alert click rate

3. **Revenue**:
   - Monthly recurring revenue (MRR)
   - Conversion rate (free → paid)
   - Churn rate
   - Average revenue per user (ARPU)

4. **Technical**:
   - API response time
   - Alert delivery rate
   - Error rate
   - Uptime

---

## 🎯 Next Steps

Ready to start building? Here's what we'll do:

1. ✅ Create Next.js project structure
2. ✅ Set up Supabase database
3. ✅ Build landing page + auth
4. ✅ Create dashboard components
5. ✅ Update n8n workflows
6. ✅ Integrate Stripe
7. ✅ Deploy to Vercel
8. ✅ Launch!

Let's start with setting up the Next.js project!
