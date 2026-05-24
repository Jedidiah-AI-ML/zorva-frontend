"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Check, Crown, Zap, Calendar, AlertTriangle } from "lucide-react"
import { useApiClient } from "@/lib/api"

type PlanType = "free" | "premium_monthly" | "premium_yearly"
type SubscriptionStatus = "active" | "cancelled"

interface Subscription {
  plan: PlanType
  status: SubscriptionStatus
  cancelledAt?: string
  accessUntil?: string
}

export default function BillingPage() {
  const api = useApiClient()
  const [subscription, setSubscription] = useState<Subscription>({
    plan: "free",
    status: "active",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    api.getSubscriptionStatus()
      .then(status => {
        setSubscription({
          plan: status.plan === "premium"
            ? (status.plan_type === "yearly" ? "premium_yearly" : "premium_monthly")
            : "free",
          status: status.cancelled_at ? "cancelled" : "active",
          cancelledAt: status.cancelled_at,
          accessUntil: status.current_period_end,
        })
      })
      .catch(console.error)
  }, [])

  const handleUpgrade = async (plan: "premium_monthly" | "premium_yearly") => {
    setIsProcessing(true)
    try {
      const planType = plan === "premium_monthly" ? "monthly" : "yearly"
      const result = await api.initializePayment(planType)
      window.location.href = result.authorization_url
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = async () => {
    try {
      const result = await api.cancelSubscription()
      alert(result.message)
      const status = await api.getSubscriptionStatus()
      setSubscription({
        plan: status.plan === "premium"
          ? (status.plan_type === "yearly" ? "premium_yearly" : "premium_monthly")
          : "free",
        status: status.cancelled_at ? "cancelled" : "active",
        cancelledAt: status.cancelled_at,
        accessUntil: status.current_period_end,
      })
    } catch (err: any) {
      alert(err.message)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isPremium = subscription.plan !== "free"
  const isCancelled = subscription.status === "cancelled"

  const plans = [
    {
      id: "premium_monthly" as const,
      name: "Monthly",
      price: "₦5,000",
      period: "/month",
      description: "Billed monthly",
      features: [
        "Unlimited courses",
        "Unlimited document uploads",
        "Unlimited question generations",
        "Advanced AI predictions",
        "Detailed solution steps",
        "Priority support",
      ],
    },
    {
      id: "premium_yearly" as const,
      name: "Yearly",
      price: "₦30,000",
      period: "/year",
      description: "Billed annually",
      badge: "Save 50%",
      features: [
        "Everything in Monthly",
        "6 months free",
        "Early access to new features",
        "Exclusive study resources",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Subscription & Billing</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription plan and billing details
          </p>
        </div>

        {/* Current Plan Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {isPremium ? (
                    <>
                      <Crown className="h-5 w-5 text-primary" />
                      Premium Plan
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      Free Plan
                    </>
                  )}
                </CardTitle>
                <CardDescription className="mt-1">
                  {isPremium
                    ? subscription.plan === "premium_monthly"
                      ? "₦5,000/month"
                      : "₦30,000/year"
                    : "Basic features with limited usage"}
                </CardDescription>
              </div>
              <Badge variant={isPremium ? "default" : "secondary"}>
                {isCancelled ? "Cancelled" : isPremium ? "Active" : "Free"}
              </Badge>
            </div>
          </CardHeader>
          {isCancelled && subscription.accessUntil && (
            <CardContent>
              <div className="flex items-center gap-3 rounded-lg bg-warning/10 p-4 text-warning-foreground">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium">Subscription Cancelled</p>
                  <p className="text-sm">
                    You will have access to Premium features until{" "}
                    <strong>{formatDate(subscription.accessUntil)}</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          )}
          {isPremium && !isCancelled && (
            <CardFooter className="border-t pt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-destructive hover:text-destructive">
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel your Premium subscription? You will
                      continue to have access until the end of your current billing period.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          )}
        </Card>

        {/* Pricing Cards */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {isPremium ? "Change Plan" : "Upgrade to Premium"}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const isCurrentPlan = subscription.plan === plan.id
            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col ${
                  isCurrentPlan
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border"
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 right-4">{plan.badge}</Badge>
                )}
                {isCurrentPlan && (
                  <Badge variant="outline" className="absolute -top-3 left-4 border-primary text-primary">
                    Current Plan
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-accent shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan || isProcessing}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : isCurrentPlan ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Current Plan
                      </>
                    ) : (
                      <>
                        <Crown className="mr-2 h-4 w-4" />
                        {isPremium ? "Switch Plan" : "Upgrade"}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Free Plan Details */}
        {!isPremium && (
          <Card className="mt-8 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Free Plan Includes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">2 courses max</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">5 document uploads per course</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">10 question generations per month</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Basic pattern analysis</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing History */}
        {isPremium && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">
                      Premium {subscription.plan === "premium_monthly" ? "Monthly" : "Yearly"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {subscription.accessUntil
                        ? formatDate(subscription.accessUntil)
                        : "Active"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {subscription.plan === "premium_monthly" ? "₦5,000" : "₦30,000"}
                    </p>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}