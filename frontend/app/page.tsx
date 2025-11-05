import Link from "next/link";
import { ArrowRight, TrendingUp, Bell, Shield, Zap, BarChart3, Mail } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">InsiderAlerts</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline">
              How It Works
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:underline"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
              <Zap className="mr-2 h-4 w-4 text-yellow-500" />
              <span>Track insider trades in real-time</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Stay Ahead with{" "}
              <span className="text-primary">Insider Trading</span> Alerts
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Get instant notifications when corporate insiders buy or sell stocks.
              Make informed investment decisions with AI-powered analysis and actionable recommendations.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground"
              >
                See How It Works
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold">500K+</div>
                <div className="text-sm text-muted-foreground">Alerts Sent</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold">4.9/5</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t bg-muted/50 py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to track insider trades
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful features to help you make better investment decisions
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-4 rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Real-Time Alerts</h3>
                <p className="text-muted-foreground">
                  Get instant notifications via email and Telegram when insiders make significant trades.
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms analyze trading patterns and generate actionable buy/sell recommendations.
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">SEC-Verified Data</h3>
                <p className="text-muted-foreground">
                  All data sourced from official SEC filings and trusted financial data providers.
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Custom Watchlists</h3>
                <p className="text-muted-foreground">
                  Track specific stocks or sectors that matter to you. Get alerts only for what you care about.
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Multi-Channel Delivery</h3>
                <p className="text-muted-foreground">
                  Receive alerts via email, Telegram, SMS, or webhook. Choose what works best for you.
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Historical Data</h3>
                <p className="text-muted-foreground">
                  Access up to 1 year of historical insider trading data and analyze trends over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get started in 3 simple steps
              </p>
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-3">
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-6 text-xl font-semibold">Sign Up Free</h3>
                <p className="mt-4 text-muted-foreground">
                  Create your account in seconds. No credit card required for free tier.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-6 text-xl font-semibold">Set Preferences</h3>
                <p className="mt-4 text-muted-foreground">
                  Choose your alert frequency, stock watchlists, and notification channels.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mt-6 text-xl font-semibold">Get Alerts</h3>
                <p className="mt-4 text-muted-foreground">
                  Receive instant notifications with detailed analysis and recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="border-t bg-muted/50 py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that's right for you
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {/* Free Tier */}
              <div className="flex flex-col rounded-lg border bg-card p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="ml-2 text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Perfect for getting started
                  </p>
                </div>

                <ul className="mb-8 space-y-4 flex-1">
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    1 alert per day
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    Email notifications only
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    Top 5 stocks
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    7-day history
                  </li>
                </ul>

                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Get Started
                </Link>
              </div>

              {/* Pro Tier */}
              <div className="relative flex flex-col rounded-lg border-2 border-primary bg-card p-8 shadow-lg">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-bold">$19</span>
                    <span className="ml-2 text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    For serious investors
                  </p>
                </div>

                <ul className="mb-8 space-y-4 flex-1">
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    Unlimited alerts
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    Email + Telegram + SMS
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    Top 20 stocks
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    30-day history
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    Custom filters
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    Priority support
                  </li>
                </ul>

                <Link
                  href="/signup?plan=pro"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Start Free Trial
                </Link>
              </div>

              {/* Enterprise Tier */}
              <div className="flex flex-col rounded-lg border bg-card p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-bold">$99</span>
                    <span className="ml-2 text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    For professional traders
                  </p>
                </div>

                <ul className="mb-8 space-y-4 flex-1">
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    Everything in Pro
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    API access
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    Custom watchlists
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    1-year history
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    Webhook integrations
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    Dedicated support
                  </li>
                </ul>

                <Link
                  href="/signup?plan=enterprise"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to stay ahead of the market?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of investors who trust InsiderAlerts for their trading decisions.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Watch Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">InsiderAlerts</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time insider trading alerts with AI-powered analysis.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#features" className="text-muted-foreground hover:underline">Features</Link></li>
                <li><Link href="#pricing" className="text-muted-foreground hover:underline">Pricing</Link></li>
                <li><Link href="/demo" className="text-muted-foreground hover:underline">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:underline">About</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:underline">Blog</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:underline">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="text-muted-foreground hover:underline">Privacy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:underline">Terms</Link></li>
                <li><Link href="/disclaimer" className="text-muted-foreground hover:underline">Disclaimer</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 InsiderAlerts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
