// components/dashboard/template-manager.tsx
"use client";

import { useState } from "react";
import { Plus, Edit, Trash, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Template = {
  id: string;
  name: string;
  fields: { name: string; description?: string }[];
};

type TemplateManagerProps = {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template | null) => void;
  onCreateTemplate: (template: Template) => void;
  onUpdateTemplate: (template: Template) => void;
};

export function TemplateManager({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onCreateTemplate,
  onUpdateTemplate,
}: TemplateManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [fields, setFields] = useState<
    { name: string; description?: string }[]
  >([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldDescription, setNewFieldDescription] = useState("");

  const resetForm = () => {
    setTemplateName("");
    setFields([]);
    setNewFieldName("");
    setNewFieldDescription("");
  };

  const handleCreateTemplate = () => {
    if (!templateName || fields.length === 0) {
      alert("Please add template name and at least one field");
      return;
    }

    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: templateName,
      fields: [...fields],
    };

    onCreateTemplate(newTemplate);
    resetForm();
    setIsCreating(false);
  };

  const handleEditTemplate = () => {
    if (!selectedTemplate) return;

    if (!templateName || fields.length === 0) {
      alert("Please add template name and at least one field");
      return;
    }

    const updatedTemplate: Template = {
      ...selectedTemplate,
      name: templateName,
      fields: [...fields],
    };

    onUpdateTemplate(updatedTemplate);
    resetForm();
    setIsEditing(false);
  };

  const handleAddField = () => {
    if (!newFieldName) return;

    setFields((prev) => [
      ...prev,
      {
        name: newFieldName,
        description: newFieldDescription || undefined,
      },
    ]);
    setNewFieldName("");
    setNewFieldDescription("");
  };

  const handleRemoveField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditInit = (template: Template) => {
    setTemplateName(template.name);
    setFields([...template.fields]);
    setIsEditing(true);
  };

  return (
    <div className="space-y-4">
      {templates.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Select
              value={selectedTemplate?.id}
              onValueChange={(value) => {
                const template = templates.find((t) => t.id === value);
                onSelectTemplate(template || null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.fields.length} fields)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTemplate && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEditInit(selectedTemplate)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>

          {selectedTemplate && (
            <div className="bg-gray-50 p-3 rounded-md border text-sm">
              <div className="font-medium">Fields to extract:</div>
              <ul className="mt-1 space-y-1">
                {selectedTemplate.fields.map((field, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="font-medium">{field.name}</span>
                    {field.description && (
                      <span className="text-gray-500 text-xs">
                        ({field.description})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="mb-2 text-gray-600">No templates yet</p>
          <Button onClick={() => setIsCreating(true)}>
            Create your first template
          </Button>
        </div>
      )}

      {templates.length > 0 && (
        <Button variant="outline" onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      )}

      {/* Create Template Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Extraction Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Invoice Template, Receipt Template, etc."
              />
            </div>

            <div className="space-y-2">
              <Label>Fields to Extract</Label>
              <div className="space-y-3">
                {fields.length > 0 ? (
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <div>
                          <span className="font-medium">{field.name}</span>
                          {field.description && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({field.description})
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveField(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 border border-dashed rounded-md">
                    <p className="text-sm text-gray-500">No fields added yet</p>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="field-name" className="text-xs">
                        Field Name
                      </Label>
                      <Input
                        id="field-name"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        placeholder="Invoice Number"
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="field-description" className="text-xs">
                        Description (Optional)
                      </Label>
                      <Input
                        id="field-description"
                        value={newFieldDescription}
                        onChange={(e) => setNewFieldDescription(e.target.value)}
                        placeholder="Usually top right"
                        className="h-8"
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddField}
                    disabled={!newFieldName}
                    className="w-full"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Field
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsCreating(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTemplate}
                disabled={!templateName || fields.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Extraction Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Same content as Create Dialog */}
            <div className="space-y-2">
              <Label htmlFor="template-name-edit">Template Name</Label>
              <Input
                id="template-name-edit"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Fields to Extract</Label>
              <div className="space-y-3">
                {fields.length > 0 ? (
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <div>
                          <span className="font-medium">{field.name}</span>
                          {field.description && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({field.description})
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveField(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 border border-dashed rounded-md">
                    <p className="text-sm text-gray-500">No fields added yet</p>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="field-name-edit" className="text-xs">
                        Field Name
                      </Label>
                      <Input
                        id="field-name-edit"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        placeholder="Invoice Number"
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="field-description-edit"
                        className="text-xs"
                      >
                        Description (Optional)
                      </Label>
                      <Input
                        id="field-description-edit"
                        value={newFieldDescription}
                        onChange={(e) => setNewFieldDescription(e.target.value)}
                        placeholder="Usually top right"
                        className="h-8"
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddField}
                    disabled={!newFieldName}
                    className="w-full"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Field
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditTemplate}
                disabled={!templateName || fields.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
