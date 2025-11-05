"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Bell, Settings, LogOut, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const [user] = useState({ email: "user@example.com", plan: "Free" });

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">InsiderAlerts</span>
          </Link>
          <nav className="flex items-center gap-4">
            <button className="text-sm font-medium hover:underline">
              Dashboard
            </button>
            <Link href="/settings" className="text-sm font-medium hover:underline">
              Settings
            </Link>
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:underline">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="mt-2 text-muted-foreground">
              Here's your insider trading activity overview
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                  <h3 className="mt-2 text-3xl font-bold">24</h3>
                </div>
                <Bell className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stocks Tracked</p>
                  <h3 className="mt-2 text-3xl font-bold">12</h3>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
                  <h3 className="mt-2 text-3xl font-bold">{user.plan}</h3>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="rounded-lg border bg-card">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">Recent Alerts</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b pb-4">
                  <div>
                    <h3 className="font-semibold">TSLA - Strong Buy Signal</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Elon Musk purchased $5.2M worth of shares
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    BULLISH
                  </span>
                </div>

                <div className="flex items-start justify-between border-b pb-4">
                  <div>
                    <h3 className="font-semibold">NVDA - Buy Signal</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Jensen Huang purchased $2.8M worth of shares
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    BULLISH
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">AAPL - Monitor Signal</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tim Cook sold $3.1M worth of shares
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">1 day ago</p>
                  </div>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                    NEUTRAL
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button className="text-sm font-medium text-primary hover:underline">
                  View All Alerts
                </button>
              </div>
            </div>
          </div>

          {/* Upgrade Banner (for Free users) */}
          {user.plan === "Free" && (
            <div className="mt-8 rounded-lg border-2 border-primary bg-primary/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Upgrade to Pro</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get unlimited alerts, Telegram notifications, and custom filters
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
