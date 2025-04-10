// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server";
import { FormImagesProcessor } from "@/components/dashboard/form-images-processor";
import { AuthModalWrapper } from "@/components/auth/auth-modal-wrapper";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Form Images</h1>
          <p className="text-gray-500 mt-1">
            Upload form images and extract data using templates
          </p>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Logged in as: {user.email}
              </p>
              <AuthModalWrapper isLoggedIn={true} email={user.email} />
            </div>
          ) : (
            <AuthModalWrapper isLoggedIn={false} />
          )}
        </div>
      </div>

      <DashboardClient isLoggedIn={!!user} />
    </div>
  );
}
