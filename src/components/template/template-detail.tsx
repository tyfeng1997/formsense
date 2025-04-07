"use client";

import { useState } from "react";
import { Template, Field } from "@/lib/template-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileJson,
  Pencil,
  Trash2,
  ChevronDown,
  Save,
  Plus,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTemplates } from "@/components/template/template-context";

interface TemplateDetailProps {
  template: Template;
  onSelectChange?: (templateId: string) => void;
}

export function TemplateDetail({
  template,
  onSelectChange,
}: TemplateDetailProps) {
  const { templates, updateTemplate, deleteTemplate } = useTemplates();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form state
  const [name, setName] = useState(template.name);
  const [fields, setFields] = useState<Field[]>([...template.fields]);

  // Start editing
  const startEditing = () => {
    setName(template.name);
    setFields([...template.fields]);
    setIsEditMode(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditMode(false);
  };

  // Save changes
  const saveChanges = async () => {
    try {
      await updateTemplate(template.id, {
        name,
        fields: fields.filter((field) => field.name.trim() !== ""),
      });
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to update template:", error);
    }
  };

  // Handle deleting the template
  const handleDelete = async () => {
    try {
      await deleteTemplate(template.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  // Add a new field
  const addField = () => {
    setFields([
      ...fields,
      { id: `temp-${Date.now()}`, name: "", description: "" },
    ]);
  };

  // Update a field
  const updateField = (index: number, fieldData: Partial<Field>) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      ...fieldData,
    };
    setFields(updatedFields);
  };

  // Remove a field
  const removeField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  return (
    <div className="space-y-4">
      {/* Template header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            <FileJson className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-medium">{template.name}</h2>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Change Template
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {templates.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => onSelectChange?.(t.id)}
                  className="flex items-center gap-2"
                >
                  {t.id === template.id && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                  <span className={t.id === template.id ? "font-medium" : ""}>
                    {t.name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={startEditing}>
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {template.fields.map((field) => (
          <Card key={field.id} className="overflow-hidden">
            <CardContent className="p-3">
              <h3 className="font-medium">{field.name}</h3>
              {field.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {field.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update template name and fields
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Fields</Label>
                <span className="text-xs text-gray-500">
                  {fields.length} fields
                </span>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    placeholder="Field name"
                    value={field.name}
                    onChange={(e) =>
                      updateField(index, { name: e.target.value })
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={field.description || ""}
                    onChange={(e) =>
                      updateField(index, {
                        description: e.target.value || undefined,
                      })
                    }
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(index)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
            <Button variant="outline" onClick={cancelEditing}>
              Cancel
            </Button>
            <Button
              onClick={saveChanges}
              disabled={!name || fields.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{template.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
