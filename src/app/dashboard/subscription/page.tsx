"use client";

// app/subscription/page.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  CreditCard,
  CalendarDays,
  RefreshCw,
  FileText,
  ShieldCheck,
  Package,
} from "lucide-react";
import {
  Subscription,
  SubscriptionStatus,
  PRICE_MAP,
} from "@/types/subscription";
import { toast } from "sonner";
import { CancelSubscriptionDialog } from "@/components/subscription/cancel-subscription-dialog";

// Function to get status badge
function getStatusBadge(
  status: SubscriptionStatus,
  scheduledChange: string | null
) {
  if (scheduledChange) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          <Clock className="w-3 h-3 mr-1" /> Cancels at period end
        </Badge>
        <span className="text-xs text-gray-500">
          {formatDate(scheduledChange)}
        </span>
      </div>
    );
  }

  switch (status.toLowerCase()) {
    case "active":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="w-3 h-3 mr-1" /> Active
        </Badge>
      );
    case "trialing":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <Clock className="w-3 h-3 mr-1" /> Trial
        </Badge>
      );
    case "paused":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          <Clock className="w-3 h-3 mr-1" /> Paused
        </Badge>
      );
    case "canceled":
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          <XCircle className="w-3 h-3 mr-1" /> Canceled
        </Badge>
      );
    case "past_due":
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600">
          <AlertCircle className="w-3 h-3 mr-1" /> Past Due
        </Badge>
      );
    case "unpaid":
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          <AlertCircle className="w-3 h-3 mr-1" /> Unpaid
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-500 hover:bg-gray-600">
          <AlertCircle className="w-3 h-3 mr-1" /> {status}
        </Badge>
      );
  }
}

// Function to format date string
function formatDate(dateString: string | null) {
  if (!dateString) return "Not available";

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/subscriptions");

      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }

      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError(
        "Unable to load subscription information. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSubscriptionCanceled = () => {
    // Refresh subscription data
    fetchSubscriptions();
    // Show toast notification handled in the dialog component
  };

  const activeSubscription = subscriptions.find(
    (sub) =>
      sub.subscription_status.toLowerCase() === "active" ||
      sub.subscription_status.toLowerCase() === "trialing"
  );

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <CreditCard className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">My Subscription</h1>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center"
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[260px] w-full rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
            <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : subscriptions.length === 0 ? (
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="flex items-center justify-center flex-col">
              <div className="p-3 bg-blue-100 rounded-full mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-800 mb-2">
                No Subscription Found
              </CardTitle>
              <CardDescription className="text-gray-500 text-center max-w-md">
                You don't have an active subscription yet. Subscribe to one of
                our plans to start processing your documents.
              </CardDescription>
            </div>
          </div>
          <CardFooter className="flex justify-center p-6">
            <Button asChild className="px-8 bg-blue-600 hover:bg-blue-700">
              <Link href="/pricing">View Plans</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          {/* Active subscription card */}
          {activeSubscription && (
            <Card className="mb-8 border-gray-200 shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-blue-600"></div>
              <CardHeader className="pb-3 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800">
                        {PRICE_MAP[activeSubscription.price_id]?.name ||
                          "Subscription"}{" "}
                        Plan
                      </CardTitle>
                      <CardDescription className="text-gray-500">
                        {PRICE_MAP[activeSubscription.price_id]?.price ||
                          "Custom pricing"}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(
                    activeSubscription.subscription_status,
                    activeSubscription.scheduled_change
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      Plan Features
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                      {PRICE_MAP[activeSubscription.price_id]?.features.map(
                        (feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 flex items-start"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        )
                      ) || (
                        <li className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          Custom plan features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Billing Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      Billing Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 text-sm">
                      {activeSubscription.next_billed_at && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                            Next billing date:
                          </p>
                          <p className="font-medium text-gray-800 flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-blue-600" />
                            {formatDate(activeSubscription.next_billed_at)}
                          </p>
                        </div>
                      )}
                      {activeSubscription.billing_frequency &&
                        activeSubscription.billing_interval && (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                              Billing cycle:
                            </p>
                            <p className="font-medium text-gray-800 flex items-center gap-2">
                              <RefreshCw className="h-4 w-4 text-blue-600" />
                              Every {activeSubscription.billing_frequency}{" "}
                              {activeSubscription.billing_interval}
                              {activeSubscription.billing_frequency > 1
                                ? "s"
                                : ""}
                            </p>
                          </div>
                        )}
                      {activeSubscription.current_period_start && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                            Current period start:
                          </p>
                          <p className="font-medium text-gray-800 flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-green-500" />
                            {formatDate(
                              activeSubscription.current_period_start
                            )}
                          </p>
                        </div>
                      )}
                      {activeSubscription.current_period_end && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                            Current period end:
                          </p>
                          <p className="font-medium text-gray-800 flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-orange-500" />
                            {formatDate(activeSubscription.current_period_end)}
                          </p>
                        </div>
                      )}

                      {activeSubscription.scheduled_change && (
                        <div className="md:col-span-2 mt-2 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                          <p className="font-medium flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4" />
                            Cancellation scheduled
                          </p>
                          <p>
                            Your subscription will be canceled on{" "}
                            <span className="font-semibold">
                              {formatDate(activeSubscription.scheduled_change)}
                            </span>
                            . You will continue to have access to all features
                            until that date.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-3">
                      <div>
                        <p className="text-gray-500 mb-1">Subscription ID:</p>
                        <p className="font-mono bg-gray-50 p-2 rounded border border-gray-200 text-gray-700 break-all">
                          {activeSubscription.subscription_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Started on:</p>
                        <p className="flex items-center gap-2 font-medium text-gray-800">
                          <CalendarDays className="h-4 w-4 text-blue-600" />
                          {formatDate(activeSubscription.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
                  >
                    <Link href="/dashboard/pricing">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Change Plan
                    </Link>
                  </Button>

                  {/* Cancel Subscription Button - Disabled if already scheduled for cancellation */}
                  {!activeSubscription.scheduled_change ? (
                    <CancelSubscriptionDialog
                      subscriptionId={activeSubscription.subscription_id}
                      onCanceled={handleSubscriptionCanceled}
                    />
                  ) : (
                    <Button
                      variant="outline"
                      className="text-gray-400 cursor-not-allowed opacity-50 w-full sm:w-auto"
                      disabled
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Cancellation Scheduled
                    </Button>
                  )}
                </div>
                <Button
                  asChild
                  variant="default"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  <a
                    href="https://formsense.paddle.com/account"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Billing
                  </a>
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Subscription history */}
          {subscriptions.length > 1 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 rounded-full bg-gray-100">
                  <FileText className="h-4 w-4 text-gray-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Subscription History
                </h2>
              </div>
              <div className="space-y-4">
                {subscriptions
                  .filter((sub) => sub !== activeSubscription)
                  .map((subscription) => (
                    <Card
                      key={subscription.subscription_id}
                      className="bg-gray-50 border-gray-200 shadow-sm"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base flex items-center gap-2 text-gray-800">
                            <div className="p-1 rounded-full bg-blue-100 text-blue-600">
                              <Package className="h-4 w-4" />
                            </div>
                            {PRICE_MAP[subscription.price_id]?.name ||
                              "Subscription"}{" "}
                            Plan
                          </CardTitle>
                          {getStatusBadge(
                            subscription.subscription_status,
                            subscription.scheduled_change
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-5 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-2">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">
                              Subscription ID:
                            </p>
                            <p className="font-mono text-xs bg-white p-2 rounded border border-gray-200 text-gray-700 break-all">
                              {subscription.subscription_id}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Date:</p>
                            <p className="font-medium text-gray-800 flex items-center gap-2">
                              <CalendarDays className="h-3 w-3 text-blue-600" />
                              {formatDate(subscription.created_at)}
                            </p>
                          </div>
                          {subscription.billing_frequency &&
                            subscription.billing_interval && (
                              <div>
                                <p className="text-gray-500 text-xs mb-1">
                                  Billing cycle:
                                </p>
                                <p className="font-medium text-gray-800 flex items-center gap-2">
                                  <RefreshCw className="h-3 w-3 text-blue-600" />
                                  Every {subscription.billing_frequency}{" "}
                                  {subscription.billing_interval}
                                  {subscription.billing_frequency > 1
                                    ? "s"
                                    : ""}
                                </p>
                              </div>
                            )}
                          {subscription.current_period_end && (
                            <div>
                              <p className="text-gray-500 text-xs mb-1">
                                Period ended:
                              </p>
                              <p className="font-medium text-gray-800 flex items-center gap-2">
                                <CalendarDays className="h-3 w-3 text-red-500" />
                                {formatDate(subscription.current_period_end)}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
