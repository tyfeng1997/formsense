// app/dashboard/page.tsx
import { FormImagesProcessor } from "@/components/dashboard/form-images-processor";

export default function DashboardPage() {
  return (
    <div className="space-y-6 py-6 px-2">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Form Images
        </h1>
        <p className="text-gray-500 mt-2 ml-8">
          Upload form images and extract data using templates
        </p>
      </div>

      <FormImagesProcessor />
    </div>
  );
}
