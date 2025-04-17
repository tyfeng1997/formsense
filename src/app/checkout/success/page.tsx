"use client";

// app/checkout/success/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function CheckoutSuccessPage() {
  const [planName, setPlanName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user?.email) {
          setIsLoading(false);
          return;
        }

        // Get customer info
        const { data: customer } = await supabase
          .from("customers")
          .select("customer_id")
          .eq("email", userData.user.email)
          .single();

        if (customer) {
          // Get latest subscription
          const { data: subscription } = await supabase
            .from("subscriptions")
            .select("price_id")
            .eq("customer_id", customer.customer_id)
            .eq("subscription_status", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (subscription) {
            // Map price ID to plan name
            if (subscription.price_id === "pri_01jrnh4z3hmr6zm4e6tf8fxg4x") {
              setPlanName("Basic");
            } else if (
              subscription.price_id === "pri_01jrnh5sqd8kqmfe6jzf0sd6n0"
            ) {
              setPlanName("Professional");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionInfo();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-10 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Subscription Successful!
        </h1>

        {isLoading ? (
          <p className="text-lg text-gray-600 mb-8">
            Loading your subscription details...
          </p>
        ) : planName ? (
          <p className="text-lg text-gray-600 mb-8">
            You're now subscribed to the{" "}
            <span className="font-semibold text-blue-600">{planName} Plan</span>
            . Your plan benefits are now active.
          </p>
        ) : (
          <p className="text-lg text-gray-600 mb-8">
            Your subscription has been activated successfully. You can now enjoy
            all the benefits of your new plan.
          </p>
        )}

        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" className="w-full sm:w-auto">
              View Plans
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-600">
        <p>
          If you have any questions about your subscription, please contact our{" "}
          <a
            href="mailto:support@formsense.app"
            className="text-blue-600 hover:underline"
          >
            support team
          </a>
          .
        </p>
      </div>
    </div>
  );
}
