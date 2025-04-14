"use client";

import { Template } from "@/lib/template-supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTemplates } from "@/hooks/useTemplates";

interface TemplateSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
  onCreateTemplate?: () => void;
  currentTemplateId?: string | null;
}

export function TemplateSelectionDialog({
  open,
  onClose,
  onSelectTemplate,
  onCreateTemplate,
  currentTemplateId = null,
}: TemplateSelectionDialogProps) {
  const router = useRouter();
  const { templates, isLoading, error } = useTemplates({
    autoFetch: true,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Select Template</DialogTitle>
          <DialogDescription className="text-gray-500">
            Choose a template to use for extraction
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
              <p className="text-gray-600">Loading templates...</p>
            </div>
          ) : error ? (
            <div className="text-center p-4">
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                <p>{error}</p>
              </div>
              <Button
                variant="outline"
                className="mt-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                onClick={() => router.push("/dashboard/templates")}
              >
                Manage Templates
              </Button>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg border">
              <div className="bg-blue-100 rounded-full p-3 inline-flex mb-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-gray-700 mb-4">No templates found</p>
              {onCreateTemplate && (
                <Button
                  onClick={() => {
                    onClose();
                    onCreateTemplate();
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Template
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md w-full text-left ${
                    template.id === currentTemplateId
                      ? "border-blue-300 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      template.id === currentTemplateId
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-600"
                    } shrink-0`}
                  >
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3
                      className={`font-medium ${
                        template.id === currentTemplateId
                          ? "text-blue-700"
                          : "text-gray-800"
                      }`}
                    >
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {template.fields.length} fields including:{" "}
                      {template.fields
                        .slice(0, 2)
                        .map((f) => f.name)
                        .join(", ")}
                      {template.fields.length > 2 ? "..." : ""}
                    </p>
                  </div>
                </button>
              ))}

              {onCreateTemplate && (
                <button
                  onClick={() => {
                    onClose();
                    onCreateTemplate();
                  }}
                  className="flex items-start gap-4 p-4 rounded-lg border border-dashed border-gray-300 hover:border-blue-300 transition-colors hover:bg-blue-50/30 w-full text-left"
                >
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 shrink-0">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Create New Template
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Define specific fields to extract based on your
                      requirements.
                    </p>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-start border-t pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/templates")}
            className="ml-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
          >
            Manage All Templates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
