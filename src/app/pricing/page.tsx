"use client";

// app/pricing/page.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  type Environments,
  initializePaddle,
  type Paddle,
} from "@paddle/paddle-js";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Define plan data
const plans = [
  {
    id: "free",
    name: "Free",
    description: "Try it out",
    price: "$0",
    priceId: "free",
    features: ["Process up to 50 documents/month", "Basic features"],
    popular: false,
  },
  {
    id: "basic",
    name: "Basic",
    description: "For individuals & small teams",
    price: "$9.9",
    priceId: "pri_01jrnh4z3hmr6zm4e6tf8fxg4x",
    features: ["Process up to 500 documents/month", "All features included"],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing businesses",
    price: "$19.9",
    priceId: "pri_01jrnh5sqd8kqmfe6jzf0sd6n0",
    features: [
      "Process up to 1500 documents/month",
      "Priority support & all features",
    ],
    popular: true,
  },
];

export default function PricingPage() {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activePriceId, setActivePriceId] = useState<string | null>(null);

  // Get user information and active subscription
  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();

      // Get user data
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user?.email) {
        setUserEmail(userData.user.email);

        try {
          // Get customer info
          const { data: customer } = await supabase
            .from("customers")
            .select("customer_id")
            .eq("email", userData.user.email)
            .single();

          if (customer) {
            // Get active subscription info
            const { data: subscription } = await supabase
              .from("subscriptions")
              .select("price_id, subscription_status")
              .eq("customer_id", customer.customer_id)
              .eq("subscription_status", "active")
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            if (subscription) {
              setActivePriceId(subscription.price_id);
            } else {
              // If no active subscription, set to free plan
              setActivePriceId("free");
            }
          } else {
            setActivePriceId("free");
          }
        } catch (error) {
          console.error("Error fetching subscription data:", error);
          setActivePriceId("free");
        }
      }
    };

    fetchUserData();
  }, []);

  // Initialize Paddle
  useEffect(() => {
    if (!paddle && typeof window !== "undefined") {
      const initPaddle = async () => {
        if (
          process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
          process.env.NEXT_PUBLIC_PADDLE_ENV
        ) {
          try {
            const paddleInstance = await initializePaddle({
              token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
              environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
              checkout: {
                settings: {
                  displayMode: "overlay",
                  theme: "light",
                  successUrl: "/checkout/success",
                },
              },
            });
            setPaddle(paddleInstance!);
          } catch (error) {
            console.error("Failed to initialize Paddle:", error);
          }
        }
      };

      initPaddle();
    }
  }, [paddle]);

  // Handle subscription click
  const handleSubscribe = async (priceId: string) => {
    if (priceId === "free" || priceId === activePriceId) return;

    setIsLoading(true);

    try {
      if (paddle) {
        await paddle.Checkout.open({
          ...(userEmail && { customer: { email: userEmail } }),
          items: [{ priceId, quantity: 1 }],
        });
      } else {
        console.error("Paddle not initialized");
      }
    } catch (error) {
      console.error("Failed to open checkout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get button text based on plan status
  const getButtonText = (priceId: string) => {
    if (priceId === activePriceId) {
      return "Current Plan";
    }
    if (priceId === "free") {
      return "Free Plan";
    }
    return "Subscribe";
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 flex items-center justify-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Choose the plan that suits your document processing needs. Free trial
          available with no credit card required.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isActive = plan.priceId === activePriceId;

          return (
            <Card
              key={plan.id}
              className={`relative p-8 border rounded-lg transition-all ${
                plan.popular
                  ? "border-blue-300 shadow-md"
                  : "border-gray-200 shadow-sm"
              } ${
                isActive ? "ring-2 ring-blue-400 shadow-md" : ""
              } hover:shadow-md`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-0 left-0 mx-auto w-32 bg-blue-600 text-white text-center py-1 px-3 rounded-full text-sm font-medium">
                  Popular
                </div>
              )}

              {isActive && (
                <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
                  Current
                </Badge>
              )}

              <div className="flex flex-col h-full">
                <div>
                  <h2 className="text-2xl font-bold text-center text-gray-800">
                    {plan.name}
                  </h2>
                  <p className="text-gray-500 text-center mt-1 text-sm">
                    {plan.description}
                  </p>

                  <div className="mt-6 text-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-lg text-gray-500">/month</span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li className="flex items-start" key={index}>
                        <svg
                          className={`h-5 w-5 mr-2 flex-shrink-0 ${
                            plan.popular ? "text-blue-500" : "text-green-500"
                          }`}
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
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8">
                  <Button
                    onClick={() => handleSubscribe(plan.priceId)}
                    disabled={isLoading || isActive || plan.priceId === "free"}
                    className={`w-full h-11 ${
                      plan.id === "free"
                        ? "bg-gray-600 hover:bg-gray-700"
                        : plan.popular
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } ${
                      isActive ? "bg-green-600 hover:bg-green-600" : ""
                    } text-white`}
                    variant={isActive ? "outline" : "default"}
                  >
                    {isLoading ? "Processing..." : getButtonText(plan.priceId)}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* <div className="mt-16 text-center bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-sm max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          Need a custom plan?
        </h3>
        <p className="text-gray-600 mb-6">
          For enterprises or teams with specific needs, we offer tailored
          solutions to fit your requirements.
        </p>
        <Button
          variant="outline"
          className="h-11 px-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
        >
          Contact Us
        </Button>
      </div> */}

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>All plans include automatic monthly billing. Cancel anytime.</p>
        <p className="mt-2">
          Questions? Contact{" "}
          <a
            href="mailto:support@formsense.app"
            className="text-blue-600 hover:underline"
          >
            support@formsense.app
          </a>
        </p>
      </div>
    </div>
  );
}
