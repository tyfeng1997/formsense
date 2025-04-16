"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TemplateManager } from "@/components/template/template-manager";

export default function TemplatesPage() {
  const searchParams = useSearchParams();
  const [shouldCreate, setShouldCreate] = useState(false);

  // Check if we should trigger template creation based on URL parameter
  useEffect(() => {
    const createParam = searchParams.get("create");
    if (createParam === "true") {
      setShouldCreate(true);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6 py-6 px-2">
      <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
        <div>
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
            Extraction Templates
          </h1>
          <p className="text-gray-500 mt-2 ml-8">
            Create and manage your extraction templates
          </p>
        </div>
      </div>

      <TemplateManager />

      {/* This is a hidden button that will be programmatically clicked */}
      {shouldCreate && (
        <button
          id="create-template-trigger"
          className="hidden"
          onClick={() => {
            // Find and click the "New Template" button
            const buttons = document.querySelectorAll("button");
            for (const button of buttons) {
              if (button.textContent?.includes("New Template")) {
                button.click();
                setShouldCreate(false);
                break;
              }
            }
          }}
        />
      )}

      {/* Trigger the create action once the component is mounted */}
      {shouldCreate && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(() => {
                document.getElementById('create-template-trigger')?.click();
              }, 500);
            `,
          }}
        />
      )}
    </div>
  );
}
