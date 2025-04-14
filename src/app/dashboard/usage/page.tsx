"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Calendar,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Zap,
  Package,
} from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define plan limits - same as in usage-limiter.ts
const PLAN_LIMITS: { [key: string]: number } = {
  pri_01jrnh4z3hmr6zm4e6tf8fxg4x: 500, // Basic plan, 500 requests
  pri_01jrnh5sqd8kqmfe6jzf0sd6n0: 1500, // Pro plan, 1500 requests
  default: 50, // Default limit
};

// Plan name mapping
const PLAN_NAMES: { [key: string]: string } = {
  pri_01jrnh4z3hmr6zm4e6tf8fxg4x: "Basic",
  pri_01jrnh5sqd8kqmfe6jzf0sd6n0: "Pro",
  default: "Free Plan",
};

// Plan color mapping
const PLAN_COLORS: { [key: string]: string } = {
  pri_01jrnh4z3hmr6zm4e6tf8fxg4x: "bg-blue-500",
  pri_01jrnh5sqd8kqmfe6jzf0sd6n0: "bg-purple-500",
  default: "bg-gray-500",
};

// Usage data interface
interface UsageData {
  id: string;
  user_id: string;
  customer_id: string;
  usage_count: number;
  reset_date: string;
  created_at: string;
  updated_at: string;
}

// Subscription interface
interface SubscriptionData {
  price_id: string;
  subscription_status: string;
}

export default function UsagePage() {
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(PLAN_LIMITS.default);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Get current user information
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error("Failed to retrieve user information");
        }

        // Get user's customer_id
        const { data: customer, error: customerError } = await supabase
          .from("customers")
          .select("customer_id")
          .eq("email", user.email)
          .single();

        if (customerError || !customer) {
          throw new Error("Failed to retrieve customer information");
        }

        // Get subscription information
        const { data: subscriptionData, error: subscriptionError } =
          await supabase
            .from("subscriptions")
            .select("price_id, subscription_status")
            .eq("customer_id", customer.customer_id)
            .eq("subscription_status", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        // Get usage information
        const { data: usageData, error: usageError } = await supabase
          .from("usage_tracking")
          .select("*")
          .eq("user_id", user.id)
          .eq("customer_id", customer.customer_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // Set states
        if (subscriptionData) {
          setSubscription(subscriptionData);
          setLimit(
            PLAN_LIMITS[subscriptionData.price_id] || PLAN_LIMITS.default
          );
        } else {
          setLimit(PLAN_LIMITS.default);
        }

        if (usageData) {
          setUsage(usageData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error retrieving usage data:", err);
        setError(
          err instanceof Error ? err.message : "Error retrieving usage data"
        );
        setLoading(false);
      }
    };

    fetchUsageData();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Calculate remaining days
  const calculateRemainingDays = (resetDate: string) => {
    const now = new Date();
    const reset = new Date(resetDate);
    const diffTime = reset.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate usage percentage
  const calculateUsagePercentage = (usageCount: number, limit: number) => {
    return Math.min(Math.round((usageCount / limit) * 100), 100);
  };

  // Get progress color based on usage percentage
  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const usagePercentage = usage
    ? calculateUsagePercentage(usage.usage_count, limit)
    : 0;

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Usage Statistics</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your API usage and limits
          </p>
        </div>
        <Button asChild variant="outline" className="w-full md:w-auto">
          <Link href="/dashboard/pricing">
            <Package className="mr-2 h-4 w-4" />
            View Pricing Plans
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-[250px] w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[180px] w-full rounded-lg" />
            <Skeleton className="h-[180px] w-full rounded-lg" />
          </div>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <div className="mt-4">
            <Button asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </Alert>
      ) : (
        <div className="space-y-8">
          {/* Current plan overview */}
          <Card className="overflow-hidden border-t-4 border-primary shadow-md">
            <div
              className={`h-1.5 w-full ${
                subscription
                  ? PLAN_COLORS[subscription.price_id] || "bg-blue-500"
                  : "bg-blue-500"
              }`}
            ></div>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl">Your Current Plan</CardTitle>
                  <CardDescription>
                    {subscription
                      ? `You're on the ${
                          PLAN_NAMES[subscription.price_id] || "Standard"
                        } plan`
                      : "You're on the Free plan"}
                  </CardDescription>
                </div>
                <Badge
                  className="w-fit text-md px-3 py-1.5"
                  variant={
                    subscription
                      ? subscription.price_id ===
                        "pri_01jrnh5sqd8kqmfe6jzf0sd6n0"
                        ? "default"
                        : "secondary"
                      : "outline"
                  }
                >
                  {subscription
                    ? PLAN_NAMES[subscription.price_id] || "Standard Plan"
                    : "Free Plan"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-0">
              {usage ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          API Usage This Month
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">
                            {usage.usage_count}
                          </span>
                          <span className="text-muted-foreground">
                            of {limit} requests
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-lg font-semibold ${
                            usagePercentage > 80
                              ? "text-red-500"
                              : usagePercentage > 50
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {usagePercentage}%
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={usagePercentage}
                      className={`h-2.5 ${getProgressColor(usagePercentage)}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
                    <Card className="bg-muted/30 border shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-medium">Reset Date</h3>
                        </div>
                        <p className="text-lg font-semibold">
                          {formatDate(usage.reset_date)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {calculateRemainingDays(usage.reset_date)} days until
                          reset
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30 border shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-medium">Remaining Requests</h3>
                        </div>
                        <p className="text-lg font-semibold">
                          {limit - usage.usage_count > 0
                            ? `${limit - usage.usage_count} requests remaining`
                            : "Monthly limit reached"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {limit - usage.usage_count > 0
                            ? `You've used ${usagePercentage}% of your limit`
                            : "Consider upgrading your plan"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 px-4">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    No Usage Records Yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start using the API to see your usage statistics here
                  </p>
                </div>
              )}
            </CardContent>

            {/* Show only if not on Pro plan */}
            {(!subscription ||
              subscription.price_id !== "pri_01jrnh5sqd8kqmfe6jzf0sd6n0") && (
              <CardFooter className="bg-muted/30 p-6 mt-6">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Need More Requests?</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upgrade your plan to get additional API requests and premium
                    features
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {subscription?.price_id !==
                      "pri_01jrnh4z3hmr6zm4e6tf8fxg4x" && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <Link href="/dashboard/pricing">
                          Upgrade to Basic
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button asChild className="w-full sm:w-auto">
                      <Link href="/dashboard/pricing">
                        Upgrade to Pro
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>

          {/* Plan comparison */}
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-muted/40">
              <CardTitle>Plan Comparison</CardTitle>
              <CardDescription>
                Compare usage limits across different plans
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Free Plan */}
                <div className="rounded-lg border p-4 flex flex-col h-full">
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-2">
                      Free
                    </Badge>
                    <h3 className="text-lg font-semibold">Free Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      Basic functionality
                    </p>
                  </div>
                  <div className="flex items-baseline mt-3 mb-4">
                    <span className="text-3xl font-bold">50</span>
                    <span className="text-muted-foreground ml-1">
                      requests/month
                    </span>
                  </div>
                  <Progress
                    value={
                      subscription?.price_id
                        ? 0
                        : usage
                        ? (usage.usage_count / 50) * 100
                        : 0
                    }
                    className="h-2 mb-4"
                  />
                  <ul className="text-sm space-y-2 flex-grow">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Basic document processing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Limited template use</span>
                    </li>
                  </ul>
                  {!subscription && (
                    <Badge variant="secondary" className="mt-4 w-fit">
                      Current Plan
                    </Badge>
                  )}
                </div>

                {/* Basic Plan */}
                <div
                  className={`rounded-lg border p-4 flex flex-col h-full ${
                    subscription?.price_id === "pri_01jrnh4z3hmr6zm4e6tf8fxg4x"
                      ? "border-blue-500 shadow-md"
                      : ""
                  }`}
                >
                  <div className="mb-2">
                    <Badge variant="secondary" className="mb-2">
                      Basic
                    </Badge>
                    <h3 className="text-lg font-semibold">Basic Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      For individuals & small teams
                    </p>
                  </div>
                  <div className="flex items-baseline mt-3 mb-4">
                    <span className="text-3xl font-bold">500</span>
                    <span className="text-muted-foreground ml-1">
                      requests/month
                    </span>
                  </div>
                  <Progress
                    value={
                      subscription?.price_id ===
                        "pri_01jrnh4z3hmr6zm4e6tf8fxg4x" && usage
                        ? (usage.usage_count / 500) * 100
                        : 0
                    }
                    className="h-2 mb-4"
                  />
                  <ul className="text-sm space-y-2 flex-grow">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>All core features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Template creation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Export to CSV/Excel</span>
                    </li>
                  </ul>
                  {subscription?.price_id ===
                    "pri_01jrnh4z3hmr6zm4e6tf8fxg4x" && (
                    <Badge variant="secondary" className="mt-4 w-fit">
                      Current Plan
                    </Badge>
                  )}
                </div>

                {/* Pro Plan */}
                <div
                  className={`rounded-lg border p-4 flex flex-col h-full ${
                    subscription?.price_id === "pri_01jrnh5sqd8kqmfe6jzf0sd6n0"
                      ? "border-purple-500 shadow-md"
                      : ""
                  }`}
                >
                  <div className="mb-2">
                    <Badge className="mb-2">Pro</Badge>
                    <h3 className="text-lg font-semibold">Pro Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      For growing businesses
                    </p>
                  </div>
                  <div className="flex items-baseline mt-3 mb-4">
                    <span className="text-3xl font-bold">1,500</span>
                    <span className="text-muted-foreground ml-1">
                      requests/month
                    </span>
                  </div>
                  <Progress
                    value={
                      subscription?.price_id ===
                        "pri_01jrnh5sqd8kqmfe6jzf0sd6n0" && usage
                        ? (usage.usage_count / 1500) * 100
                        : 0
                    }
                    className="h-2 mb-4"
                  />
                  <ul className="text-sm space-y-2 flex-grow">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>All Basic features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Advanced template management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  {subscription?.price_id ===
                    "pri_01jrnh5sqd8kqmfe6jzf0sd6n0" && (
                    <Badge variant="default" className="mt-4 w-fit">
                      Current Plan
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
