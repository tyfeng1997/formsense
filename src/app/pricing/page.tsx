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

// Define plan data
const plans = [
  {
    id: "basic",
    name: "Basic",
    description: "For individuals and small businesses",
    price: "$9.9",
    priceId: "pri_01jrnh4z3hmr6zm4e6tf8fxg4x",
    features: [
      "Process up to 500 documents/month",
      "All core features included",
      "Template creation",
      "Export to CSV/Excel",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing teams",
    price: "$19.9",
    priceId: "pri_01jrnh5sqd8kqmfe6jzf0sd6n0",
    features: [
      "Process up to 1500 documents/month",
      "All core features included",
      "Advanced template management",
      "Priority customer support",
    ],
    popular: true,
  },
];

export default function PricingPage() {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get user information
  useEffect(() => {
    const fetchUserEmail = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        setUserEmail(data.user.email);
      }
    };

    fetchUserEmail();
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
                  successUrl: "/dashboard?success=true",
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

  return (
    <div className="container max-w-6xl mx-auto px-4 py-16">
      <div className="flex justify-end mb-6">
        <Button asChild variant="outline" className="gap-2">
          <a href="/dashboard">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.21863 7.33312L8.79467 3.75712L7.85201 2.81445L2.66667 7.99979L7.85201 13.1851L8.79467 12.2425L5.21863 8.66645H13.3333V7.33312H5.21863Z"
                fill="currentColor"
              />
            </svg>
            Back to Dashboard
          </a>
        </Button>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Flexible plans to meet your document processing needs. Early adopters
          will receive special pricing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative p-8 border rounded-lg shadow-sm ${
              plan.popular ? "border-blue-500 shadow-lg" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 right-0 left-0 mx-auto w-36 bg-blue-600 text-white text-center py-1 px-4 rounded-full">
                Most Popular
              </div>
            )}

            <div className="flex flex-col h-full">
              <div>
                <h2 className="text-3xl font-bold text-center">{plan.name}</h2>
                <p className="text-muted-foreground text-center mt-2">
                  {plan.description}
                </p>

                <div className="mt-8 text-center">
                  <span className="text-6xl font-bold">{plan.price}</span>
                  <span className="text-xl text-muted-foreground">/month</span>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li className="flex items-start" key={index}>
                      <svg
                        className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
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
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-8">
                <Button
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={isLoading}
                  className={`w-full h-12 ${
                    plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""
                  } text-white`}
                >
                  {isLoading ? "Processing..." : "Subscribe Now"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold mb-4">Need a custom plan?</h3>
        <p className="text-muted-foreground mb-6">
          For enterprises or teams with specific requirements, we offer custom
          solutions.
        </p>
        <Button variant="outline" className="h-12 px-8">
          Contact Us
        </Button>
      </div>
    </div>
  );
}
