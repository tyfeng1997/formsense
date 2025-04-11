// components/dashboard/welcome-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if the user is redirected from email confirmation
    const isNewUser = searchParams.get("welcome") === "new";
    if (isNewUser) {
      setOpen(true);
    }
  }, [searchParams]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Welcome to FormSense!
          </DialogTitle>
          <DialogDescription className="text-base">
            Thank you for confirming your email. Your account is now fully
            activated.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h3 className="font-semibold text-lg mb-2">
            Your Free Trial Starts Now
          </h3>
          <p className="mb-3">
            You now have access to all premium features of FormSense for the
            next 14 days:
          </p>
          <ul className="space-y-2 ml-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold mt-0.5">✓</span>
              <span>Upload and process unlimited form images</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold mt-0.5">✓</span>
              <span>Create custom extraction templates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold mt-0.5">✓</span>
              <span>Export data to CSV, Excel, or Google Sheets</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold mt-0.5">✓</span>
              <span>Priority support</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Maybe Later
          </Button>
          <Button onClick={() => setOpen(false)}>Start Free Trial</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
