"use client";

// components/subscription/success-notification.tsx
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export default function SubscriptionSuccessNotification() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [isVisible, setIsVisible] = useState(Boolean(success));

  useEffect(() => {
    // Hide notification after 5 seconds
    if (success) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md bg-green-50 p-4 rounded-lg shadow-lg border border-green-200 dark:bg-green-900/30 dark:border-green-800">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Subscription successful! Thank you for choosing FormSense.
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 dark:hover:bg-green-800/50"
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
