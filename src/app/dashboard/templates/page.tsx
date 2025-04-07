// app/dashboard/templates/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TemplateManager } from "@/components/template/template-manager-enhanced";
import { TemplateProvider } from "@/components/template/template-context";

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
    <TemplateProvider>
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold">Extraction Templates</h1>
            <p className="text-gray-500 mt-1">
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
    </TemplateProvider>
  );
}
