"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Template, Field } from "@/lib/template-supabase";

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

  // Refresh templates from API
  const refreshTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch templates from API
      const response = await fetch("/api/templates");

      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status}`);
      }

      const fetchedTemplates = await response.json();
      setTemplates(fetchedTemplates);

      // If there was a selected template, refresh it
      if (selectedTemplate) {
        const refreshedTemplate = fetchedTemplates.find(
          (t: Template) => t.id === selectedTemplate.id
        );
        setSelectedTemplate(refreshedTemplate || null);
      }
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError("Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };

  // Create new template
  const createTemplate = async (name: string, fields: Omit<Field, "id">[]) => {
    try {
      setError(null);

      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, fields }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create template");
      }

      const newTemplate = await response.json();
      await refreshTemplates();
      return newTemplate;
    } catch (err: any) {
      setError(err.message || "Failed to create template");
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

      const response = await fetch(`/api/templates/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to update template with ID ${id}`
        );
      }

      const updatedTemplate = await response.json();
      await refreshTemplates();
      return updatedTemplate;
    } catch (err: any) {
      setError(err.message || "Failed to update template");
      console.error(err);
      throw err;
    }
  };

  // Delete template
  const deleteTemplate = async (id: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to delete template with ID ${id}`
        );
      }

      // If the deleted template was selected, deselect it
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }

      await refreshTemplates();
    } catch (err: any) {
      setError(err.message || "Failed to delete template");
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
      // First check if we already have the template in state
      const existingTemplate = templates.find((t) => t.id === id);
      if (existingTemplate) {
        setSelectedTemplate(existingTemplate);
        return;
      }

      // If not, fetch it from the API
      const response = await fetch(`/api/templates/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch template with ID ${id}`);
      }

      const template = await response.json();
      setSelectedTemplate(template);
    } catch (err) {
      console.error(`Failed to select template with ID ${id}:`, err);
      setError(`Failed to select template with ID ${id}`);
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
