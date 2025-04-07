"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { TemplateStorage, Template, Field } from "@/lib/template-storage";

interface TemplateContextType {
  templates: Template[];
  selectedTemplate: Template | null;
  isLoading: boolean;
  error: string | null;
  createTemplate: (
    name: string,
    fields: Omit<Field, "id">[]
  ) => Promise<Template>;
  updateTemplate: (
    id: string,
    data: Partial<Omit<Template, "id" | "createdAt" | "updatedAt">>
  ) => Promise<Template>;
  deleteTemplate: (id: string) => Promise<void>;
  selectTemplate: (id: string | null) => void;
  refreshTemplates: () => Promise<void>;
}

const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined
);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates on mount
  useEffect(() => {
    refreshTemplates();
  }, []);

  // Refresh templates from storage
  const refreshTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTemplates = await TemplateStorage.getAll();
      setTemplates(fetchedTemplates);

      // If there was a selected template, refresh it
      if (selectedTemplate) {
        const refreshedTemplate = fetchedTemplates.find(
          (t) => t.id === selectedTemplate.id
        );
        setSelectedTemplate(refreshedTemplate || null);
      }
    } catch (err) {
      setError("Failed to load templates");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new template
  const createTemplate = async (name: string, fields: Omit<Field, "id">[]) => {
    try {
      setError(null);
      const newTemplate = await TemplateStorage.create({ name, fields });
      await refreshTemplates();
      return newTemplate;
    } catch (err) {
      setError("Failed to create template");
      console.error(err);
      throw err;
    }
  };

  // Update template
  const updateTemplate = async (
    id: string,
    data: Partial<Omit<Template, "id" | "createdAt" | "updatedAt">>
  ) => {
    try {
      setError(null);
      const updatedTemplate = await TemplateStorage.update(id, data);
      await refreshTemplates();
      return updatedTemplate;
    } catch (err) {
      setError("Failed to update template");
      console.error(err);
      throw err;
    }
  };

  // Delete template
  const deleteTemplate = async (id: string) => {
    try {
      setError(null);
      await TemplateStorage.delete(id);

      // If the deleted template was selected, deselect it
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }

      await refreshTemplates();
    } catch (err) {
      setError("Failed to delete template");
      console.error(err);
      throw err;
    }
  };

  // Select a template by ID
  const selectTemplate = async (id: string | null) => {
    if (!id) {
      setSelectedTemplate(null);
      return;
    }

    try {
      const template = await TemplateStorage.getById(id);
      setSelectedTemplate(template);
    } catch (err) {
      console.error(`Failed to select template with ID ${id}:`, err);
    }
  };

  const value = {
    templates,
    selectedTemplate,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    selectTemplate,
    refreshTemplates,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplates() {
  const context = useContext(TemplateContext);

  if (context === undefined) {
    throw new Error("useTemplates must be used within a TemplateProvider");
  }

  return context;
}
