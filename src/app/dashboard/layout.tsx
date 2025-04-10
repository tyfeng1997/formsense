// app/dashboard/layout.tsx
import { createClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Providers } from "../providers";
import { DashboardGuard } from "@/components/dashboard/dashboard-guard";
import { WelcomeModal } from "@/components/dashboard/welcome-modal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Providers>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar with user info */}
        <Sidebar user={user || undefined} />

        {/* Main content */}
        <div className="flex flex-col flex-1 md:pl-64">
          <main className="flex-1">
            <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
              {/* Check if user is logged in before showing content */}
              <DashboardGuard isLoggedIn={!!user}>{children}</DashboardGuard>
            </div>
          </main>
        </div>
      </div>

      {/* Welcome modal - will only show when welcome=new param is present */}
      <WelcomeModal />
    </Providers>
  );
}
