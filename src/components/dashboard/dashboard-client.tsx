// components/dashboard/dashboard-client.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FormImagesProcessor } from "@/components/dashboard/form-images-processor";
import { AuthModal } from "@/components/auth/auth-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DashboardClientProps {
  isLoggedIn: boolean;
}

export function DashboardClient({ isLoggedIn }: DashboardClientProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const searchParams = useSearchParams();

  // Automatically show the auth modal when the component mounts if the user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      // Short delay to ensure the modal transition works correctly
      const timer = setTimeout(() => setShowAuthModal(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in or sign up to access the form processing features.
          </AlertDescription>
        </Alert>

        {/* Hidden auth modal trigger that will be automatically opened */}
        <div className="hidden">
          <AuthModal
            open={showAuthModal}
            onOpenChange={setShowAuthModal}
            showAuthPrompt={true}
          />
        </div>
      </div>
    );
  }

  return <FormImagesProcessor />;
}
