// app/dashboard/templates/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TemplateManager } from "@/components/dashboard/template-manager";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type Template = {
  id: string;
  name: string;
  fields: { name: string; description?: string }[];
};

export default function TemplatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [showCreate, setShowCreate] = useState(false);

  // Check if we should open template creation dialog based on URL parameter
  useEffect(() => {
    const createParam = searchParams.get("create");
    if (createParam === "true") {
      // Trigger template creation dialog
      setTimeout(() => {
        document.getElementById("create-template-trigger")?.click();
      }, 100);

      // Remove the parameter from URL to avoid reopening on refresh
      // In a real app, use router.replace to update URL without reloading
    }
  }, [searchParams]);

  return (
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

        <Button
          onClick={() =>
            document.getElementById("create-template-trigger")?.click()
          }
          className="hidden sm:flex ml-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateManager
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            onCreateTemplate={(newTemplate) => {
              setTemplates((prev) => [...prev, newTemplate]);
              setSelectedTemplate(newTemplate);
            }}
            onUpdateTemplate={(updatedTemplate) => {
              setTemplates((prev) =>
                prev.map((t) =>
                  t.id === updatedTemplate.id ? updatedTemplate : t
                )
              );
              if (selectedTemplate?.id === updatedTemplate.id) {
                setSelectedTemplate(updatedTemplate);
              }
            }}
          />

          {/* Hidden button to trigger template creation dialog */}
          <button id="create-template-trigger" className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
}
