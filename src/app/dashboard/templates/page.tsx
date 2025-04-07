// app/dashboard/templates/page.tsx
"use client";

import { useState } from "react";
import { TemplateManager } from "@/components/dashboard/template-manager";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Template = {
  id: string;
  name: string;
  fields: { name: string; description?: string }[];
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
          className="hidden sm:flex"
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
