// app/dashboard/page.tsx
import { FormImagesProcessor } from "@/components/dashboard/form-images-processor";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Form Images</h1>
        <p className="text-gray-500 mt-1">
          Upload form images and extract data using templates
        </p>
      </div>

      <FormImagesProcessor />
    </div>
  );
}
