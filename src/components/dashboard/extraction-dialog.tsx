"use client";

import { useTemplates } from "@/hooks/useTemplates";
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

interface ExtractionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
  onCreateTemplate: () => void;
  selectedCount: number;
}

export function ExtractionDialog({
  open,
  onClose,
  onSelectTemplate,
  onCreateTemplate,
  selectedCount,
}: ExtractionDialogProps) {
  const router = useRouter();
  const { templates, isLoading, error } = useTemplates({
    autoFetch: true,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Extract Data from Images</DialogTitle>
          <DialogDescription>
            Choose a template to extract data from {selectedCount} selected
            image{selectedCount !== 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <p>Loading templates...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => router.push("/dashboard/templates")}
              >
                Manage Templates
              </Button>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-gray-500 mb-4">No templates found</p>
              <Button onClick={onCreateTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Template
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:border-primary transition-colors hover:bg-primary/5 w-full text-left"
                >
                  <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
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

              <button
                onClick={onCreateTemplate}
                className="flex items-start gap-4 p-4 rounded-lg border border-dashed hover:border-primary transition-colors hover:bg-primary/5 w-full text-left"
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Create New Template</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Define specific fields to extract based on your
                    requirements.
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/templates")}
            className="ml-2"
          >
            Manage All Templates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
