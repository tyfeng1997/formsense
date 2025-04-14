// components/subscription/cancel-subscription-dialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface CancelSubscriptionDialogProps {
  subscriptionId: string;
  onCanceled: () => void;
}

export function CancelSubscriptionDialog({
  subscriptionId,
  onCanceled,
}: CancelSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/subscriptions/${subscriptionId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to cancel subscription");
      }

      toast.success("Subscription Cancellation Scheduled", {
        description:
          "Your subscription will remain active until the end of the current billing period.",
      });

      setOpen(false);
      onCanceled();
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to cancel subscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          Cancel Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your subscription? Your service will
            continue until the end of the current billing period, but will not
            renew automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
          <p>
            Your subscription will remain active until the end of the current
            billing period. You will continue to have access to all features
            until then.
          </p>
        </div>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Keep Subscription
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? "Processing..." : "Yes, Cancel Subscription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
