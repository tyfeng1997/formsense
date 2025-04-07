"use client";

import { useState, useEffect } from "react";
import { Template, Field } from "@/lib/template-storage";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Loader2, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { TemplateCard } from "@/components/template/template-card";
import { TemplateDetail } from "@/components/template/template-detail";
import { useTemplates } from "@/components/template/template-context";

interface TemplateManagerProps {
  onSelectTemplate?: (template: Template | null) => void;
  selectedTemplateId?: string | null;
}

export function TemplateManager({
  onSelectTemplate,
  selectedTemplateId = null,
}: TemplateManagerProps) {
  const {
    templates,
    selectedTemplate: contextSelectedTemplate,
    selectTemplate: contextSelectTemplate,
    createTemplate,
    isLoading,
    error,
  } = useTemplates();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateFields, setNewTemplateFields] = useState<
    Omit<Field, "id">[]
  >([{ name: "", description: "" }]);

  // Determine which selected template to use - props or context
  const selectedTemplate =
    selectedTemplateId !== null
      ? templates.find((t) => t.id === selectedTemplateId) || null
      : contextSelectedTemplate;

  // Handle selecting a template
  const handleSelectTemplate = (template: Template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    } else {
      contextSelectTemplate(template.id);
    }
  };

  // Filter templates based on search query
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sync selected template ID to context when it changes
  useEffect(() => {
    if (selectedTemplateId) {
      contextSelectTemplate(selectedTemplateId);
    }
  }, [selectedTemplateId, contextSelectTemplate]);

  // Add a new field
  const addField = () => {
    setNewTemplateFields([...newTemplateFields, { name: "", description: "" }]);
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

  // Handle creating a new template
  const handleCreateTemplate = async () => {
    if (!newTemplateName || newTemplateFields.some((field) => !field.name)) {
      alert("Please provide a template name and ensure all fields have names");
      return;
    }

    try {
      // Filter out empty fields
      const validFields = newTemplateFields.filter(
        (field) => field.name.trim() !== ""
      );

      const newTemplate = await createTemplate(newTemplateName, validFields);
      handleSelectTemplate(newTemplate);

      // Reset form
      setNewTemplateName("");
      setNewTemplateFields([{ name: "", description: "" }]);
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading templates...</span>
        </div>
      ) : (
        <>
          {/* Selected Template Details */}
          {selectedTemplate ? (
            <TemplateDetail
              template={selectedTemplate}
              onSelectChange={(templateId) => {
                const template = templates.find((t) => t.id === templateId);
                if (template) {
                  handleSelectTemplate(template);
                }
              }}
            />
          ) : (
            <div className="flex flex-col space-y-4">
              {/* Templates Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Templates</h2>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Template Cards Grid */}
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={template.id === selectedTemplateId}
                      onClick={() => handleSelectTemplate(template)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="text-gray-500 mb-4">
                      {templates.length > 0
                        ? "No templates match your search"
                        : "No templates found"}
                    </p>
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </CardContent>
                </Card>
              )}
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
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    setNewTemplateName("");
                    setNewTemplateFields([{ name: "", description: "" }]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTemplate}
                  disabled={
                    !newTemplateName ||
                    newTemplateFields.some((field) => !field.name.trim())
                  }
                >
                  Create Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>
      )}
    </div>
  );
}
