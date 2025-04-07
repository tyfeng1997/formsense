// app/dashboard/page.tsx
import { FormProcessor } from "@/components/dashboard/form-processor";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Form Images</h1>
          <p className="text-gray-500 mt-1">
            Upload form images and extract data using templates
          </p>
        </div>
      </div>

      <FormProcessor />
    </div>
  );
}
