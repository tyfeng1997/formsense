"use client";

import { useState } from "react";
import { PlusCircle, FileJson, Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Template = {
  id: string;
  name: string;
  fields: { name: string; description?: string }[];
};

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
  onAddTemplate: (template: Template) => void;
}

export function TemplateSelector({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onAddTemplate,
}: TemplateSelectorProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateFields, setNewTemplateFields] = useState<
    { name: string; description?: string }[]
  >([{ name: "" }]);

  // Add a new empty field
  const addField = () => {
    setNewTemplateFields([...newTemplateFields, { name: "" }]);
  };

  // Update a field
  const updateField = (index: number, name: string, description?: string) => {
    const updatedFields = [...newTemplateFields];
    updatedFields[index] = { name, description };
    setNewTemplateFields(updatedFields);
  };

  // Remove a field
  const removeField = (index: number) => {
    if (newTemplateFields.length > 1) {
      const updatedFields = [...newTemplateFields];
      updatedFields.splice(index, 1);
      setNewTemplateFields(updatedFields);
    }
  };

  // Create new template
  const createTemplate = () => {
    if (!newTemplateName || newTemplateFields.some((field) => !field.name)) {
      alert("Please provide a template name and ensure all fields have names");
      return;
    }

    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: newTemplateName,
      fields: newTemplateFields.filter((field) => field.name.trim() !== ""),
    };

    onAddTemplate(newTemplate);
    setShowCreateDialog(false);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setNewTemplateName("");
    setNewTemplateFields([{ name: "" }]);
  };

  return (
    <div>
      {selectedTemplate ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileJson className="h-5 w-5 text-primary" />
              <span className="font-medium">{selectedTemplate.name}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Change Template
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {templates.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="flex items-center gap-2"
                  >
                    {template.id === selectedTemplate.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                    <span
                      className={
                        template.id === selectedTemplate.id ? "ml-0" : "ml-6"
                      }
                    >
                      {template.name}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={() => setShowCreateDialog(true)}
                  className="border-t mt-1 pt-1"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {selectedTemplate.fields.map((field, index) => (
              <div key={index} className="border rounded-md p-2 bg-gray-50">
                <p className="font-medium text-sm">{field.name}</p>
                {field.description && (
                  <p className="text-xs text-gray-500">{field.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-gray-500">No template selected</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Define fields to extract from your form images
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="e.g. Invoice Template"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Fields to Extract</Label>

              {newTemplateFields.map((field, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Field name"
                    value={field.name}
                    onChange={(e) =>
                      updateField(index, e.target.value, field.description)
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={field.description || ""}
                    onChange={(e) =>
                      updateField(index, field.name, e.target.value)
                    }
                    className="flex-1"
                  />
                  {newTemplateFields.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(index)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={addField}
                className="w-full"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={createTemplate}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
