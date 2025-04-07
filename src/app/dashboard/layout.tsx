// app/dashboard/layout.tsx
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <header className="border-b bg-white">
          <div className="flex h-16 items-center px-4 md:px-6">
            <h1 className="text-lg font-semibold">FormSense Dashboard</h1>
          </div>
        </header>

        <main className="flex-1 bg-gray-50">
          <div className="container py-6 px-4 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
