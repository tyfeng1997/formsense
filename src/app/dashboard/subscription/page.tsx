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
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
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
        <Badge className="bg-yellow-500">
          <Clock className="w-3 h-3 mr-1" /> Cancels at period end
        </Badge>
        <span className="text-xs text-muted-foreground">
          {formatDate(scheduledChange)}
        </span>
      </div>
    );
  }

  switch (status.toLowerCase()) {
    case "active":
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="w-3 h-3 mr-1" /> Active
        </Badge>
      );
    case "trialing":
      return (
        <Badge className="bg-blue-500">
          <Clock className="w-3 h-3 mr-1" /> Trial
        </Badge>
      );
    case "paused":
      return (
        <Badge className="bg-yellow-500">
          <Clock className="w-3 h-3 mr-1" /> Paused
        </Badge>
      );
    case "canceled":
      return (
        <Badge className="bg-red-500">
          <XCircle className="w-3 h-3 mr-1" /> Canceled
        </Badge>
      );
    case "past_due":
      return (
        <Badge className="bg-orange-500">
          <AlertCircle className="w-3 h-3 mr-1" /> Past Due
        </Badge>
      );
    case "unpaid":
      return (
        <Badge className="bg-red-500">
          <AlertCircle className="w-3 h-3 mr-1" /> Unpaid
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-500">
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Subscription</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full my-2" />
            <Skeleton className="h-4 w-full my-2" />
            <Skeleton className="h-4 w-full my-2" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-28" />
          </CardFooter>
        </Card>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : subscriptions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Subscription Found</CardTitle>
            <CardDescription>
              You don't have an active subscription yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Subscribe to one of our plans to start processing your documents.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/pricing">View Plans</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          {/* Active subscription card */}
          {activeSubscription && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {PRICE_MAP[activeSubscription.price_id]?.name ||
                        "Subscription"}{" "}
                      Plan
                    </CardTitle>
                    <CardDescription>
                      {PRICE_MAP[activeSubscription.price_id]?.price ||
                        "Custom pricing"}
                    </CardDescription>
                  </div>
                  {getStatusBadge(
                    activeSubscription.subscription_status,
                    activeSubscription.scheduled_change
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Plan Features:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {PRICE_MAP[activeSubscription.price_id]?.features.map(
                        (feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground"
                          >
                            {feature}
                          </li>
                        )
                      ) || (
                        <li className="text-sm text-muted-foreground">
                          Custom plan features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Billing Information */}
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-medium mb-2">Billing Information:</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {activeSubscription.next_billed_at && (
                        <div>
                          <p className="text-muted-foreground">
                            Next billing date:
                          </p>
                          <p>{formatDate(activeSubscription.next_billed_at)}</p>
                        </div>
                      )}
                      {activeSubscription.billing_frequency &&
                        activeSubscription.billing_interval && (
                          <div>
                            <p className="text-muted-foreground">
                              Billing cycle:
                            </p>
                            <p>
                              Every {activeSubscription.billing_frequency}{" "}
                              {activeSubscription.billing_interval}
                              {activeSubscription.billing_frequency > 1
                                ? "s"
                                : ""}
                            </p>
                          </div>
                        )}
                      {activeSubscription.current_period_start && (
                        <div>
                          <p className="text-muted-foreground">
                            Current period start:
                          </p>
                          <p>
                            {formatDate(
                              activeSubscription.current_period_start
                            )}
                          </p>
                        </div>
                      )}
                      {activeSubscription.current_period_end && (
                        <div>
                          <p className="text-muted-foreground">
                            Current period end:
                          </p>
                          <p>
                            {formatDate(activeSubscription.current_period_end)}
                          </p>
                        </div>
                      )}

                      {activeSubscription.scheduled_change && (
                        <div className="md:col-span-2 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                          <p className="font-medium">Cancellation scheduled</p>
                          <p className="mt-1">
                            Your subscription will be canceled on{" "}
                            {formatDate(activeSubscription.scheduled_change)}.
                            You will continue to have access to all features
                            until that date.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          Subscription ID:
                        </p>
                        <p className="font-mono">
                          {activeSubscription.subscription_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Started on:</p>
                        <p>{formatDate(activeSubscription.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="space-x-2">
                  <Button asChild variant="outline">
                    <Link href="/pricing">Change Plan</Link>
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
                      className="text-muted-foreground cursor-not-allowed opacity-50"
                      disabled
                    >
                      Cancellation Scheduled
                    </Button>
                  )}
                </div>
                <Button asChild variant="outline">
                  <a
                    href="https://formsense.paddle.com/account"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Manage Billing
                  </a>
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Subscription history */}
          {subscriptions.length > 1 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4">
                Subscription History
              </h2>
              <div className="space-y-4">
                {subscriptions
                  .filter((sub) => sub !== activeSubscription)
                  .map((subscription) => (
                    <Card
                      key={subscription.subscription_id}
                      className="bg-muted/40"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">
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
                      <CardContent className="pb-4 pt-0">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Subscription ID:
                            </p>
                            <p className="font-mono text-xs">
                              {subscription.subscription_id}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Date:</p>
                            <p>{formatDate(subscription.created_at)}</p>
                          </div>
                          {subscription.billing_frequency &&
                            subscription.billing_interval && (
                              <div>
                                <p className="text-muted-foreground">
                                  Billing cycle:
                                </p>
                                <p>
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
                              <p className="text-muted-foreground">
                                Period ended:
                              </p>
                              <p>
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
