// app/dashboard/page.tsx
import { FormProcessor } from "@/components/dashboard/form-processor";

export default function DashboardPage() {
  return (
    <div className="container py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Form Image Extraction</h1>
      <FormProcessor />
    </div>
  );
}
