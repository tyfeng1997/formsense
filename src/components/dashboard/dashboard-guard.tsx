// components/dashboard/dashboard-guard.tsx
"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";

interface DashboardGuardProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
}

export function DashboardGuard({ children, isLoggedIn }: DashboardGuardProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

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
            Please log in or sign up to access the dashboard features.
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

  return <>{children}</>;
}
