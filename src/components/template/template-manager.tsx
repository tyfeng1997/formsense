"use client";

import { useState, useEffect } from "react";
import { Template, Field } from "@/lib/template-supabase";
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
import { useTemplates } from "@/hooks/useTemplates";

interface TemplateManagerProps {
  onSelectTemplate?: (template: Template | null) => void;
  selectedTemplateId?: string | null;
}

export function TemplateManager({
  onSelectTemplate,
  selectedTemplateId = null,
}: TemplateManagerProps) {
  // Use our custom hook instead of context
  const {
    templates,
    selectedTemplate: hookSelectedTemplate,
    selectTemplate,
    createTemplate,
    isLoading,
    error,
  } = useTemplates({
    initialSelectedId: selectedTemplateId,
  });

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateFields, setNewTemplateFields] = useState<
    Omit<Field, "id">[]
  >([{ name: "", description: "" }]);

  // Determine which selected template to use - props or hook
  const selectedTemplate =
    selectedTemplateId !== null
      ? templates.find((t) => t.id === selectedTemplateId) ||
        hookSelectedTemplate
      : hookSelectedTemplate;

  // Handle selecting a template
  const handleSelectTemplate = (template: Template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    } else {
      selectTemplate(template.id);
    }
  };

  // Filter templates based on search query
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sync selected template ID when it changes from props
  useEffect(() => {
    if (selectedTemplateId) {
      selectTemplate(selectedTemplateId);
    }
  }, [selectedTemplateId, selectTemplate]);

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
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center p-10 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-gray-600 mt-2">Loading templates...</span>
          </div>
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
            <div className="flex flex-col space-y-6">
              {/* Templates Header */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
                  <span className="p-1.5 rounded-md bg-blue-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
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
                  </span>
                  Templates
                </h2>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200 py-5"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-gray-100"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3.5 w-3.5 text-gray-500" />
                  </Button>
                )}
              </div>

              {/* Template Cards Grid */}
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center p-10">
                    <div className="bg-blue-100 rounded-full p-3 mb-4">
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
                    </div>
                    <p className="text-gray-700 font-medium mb-2">
                      {templates.length > 0
                        ? "No templates match your search"
                        : "No templates found"}
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                      {templates.length > 0
                        ? "Try a different search term or create a new template"
                        : "Get started by creating your first template"}
                    </p>
                    <Button
                      onClick={() => setShowCreateDialog(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
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
                <DialogTitle className="text-gray-900">
                  Create New Template
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Define fields to extract from your form images
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name" className="text-gray-700">
                    Template Name
                  </Label>
                  <Input
                    id="template-name"
                    placeholder="e.g. Invoice Template"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="border-gray-300 focus:border-blue-300 focus:ring-blue-200"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700">Fields to Extract</Label>

                  {newTemplateFields.map((field, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Field name"
                        value={field.name}
                        onChange={(e) =>
                          updateField(index, e.target.value, field.description)
                        }
                        className="flex-1 border-gray-300 focus:border-blue-300 focus:ring-blue-200"
                      />
                      <Input
                        placeholder="Description (optional)"
                        value={field.description || ""}
                        onChange={(e) =>
                          updateField(index, field.name, e.target.value)
                        }
                        className="flex-1 border-gray-300 focus:border-blue-300 focus:ring-blue-200"
                      />
                      {newTemplateFields.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeField(index)}
                          className="shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
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
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              </div>

              <DialogFooter className="border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    setNewTemplateName("");
                    setNewTemplateFields([{ name: "", description: "" }]);
                  }}
                  className="border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTemplate}
                  disabled={
                    !newTemplateName ||
                    newTemplateFields.some((field) => !field.name.trim())
                  }
                  className="bg-blue-600 hover:bg-blue-700 ml-2"
                >
                  Create Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-100 shadow-sm">
          <p className="font-medium mb-1">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
