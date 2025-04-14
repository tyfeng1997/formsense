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
  pri_01jrnh5sqd8kqmfe6jzf0sd6n0: "bg-blue-600",
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
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Usage Statistics
          </h1>
          <p className="text-gray-500 mt-2 ml-8">
            Track and manage your document processing limits
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="w-full md:w-auto border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
        >
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
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </Alert>
      ) : (
        <div className="space-y-8">
          {/* Current plan overview */}
          <Card className="overflow-hidden border border-gray-200 shadow-sm">
            <div
              className={`h-1.5 w-full ${
                subscription
                  ? PLAN_COLORS[subscription.price_id] || "bg-blue-500"
                  : "bg-blue-500"
              }`}
            ></div>
            <CardHeader className="pb-2 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-xl text-gray-800">
                    Current Usage
                  </CardTitle>
                  <CardDescription className="text-gray-500">
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
            <CardContent className="p-6">
              {usage ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          Document Processing Usage This Month
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {usage.usage_count}
                          </span>
                          <span className="text-gray-500">
                            of {limit} documents
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <Card className="bg-gray-50 border border-gray-200 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="rounded-full bg-blue-100 p-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="font-medium text-gray-800">
                            Reset Date
                          </h3>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(usage.reset_date)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {calculateRemainingDays(usage.reset_date)} days until
                          reset
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-50 border border-gray-200 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="rounded-full bg-blue-100 p-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="font-medium text-gray-800">
                            Remaining Documents
                          </h3>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {limit - usage.usage_count > 0
                            ? `${limit - usage.usage_count} documents remaining`
                            : "Monthly limit reached"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
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
                  <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-gray-800">
                    No Usage Records Yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start processing documents to see your usage statistics here
                  </p>
                </div>
              )}
            </CardContent>

            {/* Show only if not on Pro plan */}
            {(!subscription ||
              subscription.price_id !== "pri_01jrnh5sqd8kqmfe6jzf0sd6n0") && (
              <CardFooter className="bg-gray-50 p-6 mt-2 border-t border-gray-200">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-gray-800">
                      Need More Processing Capacity?
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Upgrade your plan to process more documents and access
                    premium features
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {subscription?.price_id !==
                      "pri_01jrnh4z3hmr6zm4e6tf8fxg4x" && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full sm:w-auto border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Link href="/dashboard/pricing">
                          Upgrade to Basic
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button
                      asChild
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                    >
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

          {/* Usage history visualization could go here */}
          <Card className="border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Processing History
              </CardTitle>
              <CardDescription className="text-gray-500">
                Overview of your document processing activity
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2 text-gray-800">
                  Coming Soon
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Detailed processing history and analytics will be available in
                  a future update. Stay tuned for more insights about your
                  document processing!
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
