// app/dashboard/layout.tsx
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <main className="flex-1">
          <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
