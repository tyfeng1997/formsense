"use client";

import { useState, useEffect, useCallback } from "react";
import { Template, Field } from "@/lib/template-supabase";

interface UseTemplatesOptions {
  initialSelectedId?: string | null;
  autoFetch?: boolean;
}

export function useTemplates(options: UseTemplatesOptions = {}) {
  const { initialSelectedId = null, autoFetch = true } = options;

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/templates");

      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status}`);
      }

      const fetchedTemplates = await response.json();
      setTemplates(fetchedTemplates);
      return fetchedTemplates;
    } catch (err: any) {
      console.error("Error fetching templates:", err);
      setError("Failed to load templates");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize templates on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchTemplates().then((fetchedTemplates) => {
        // Set selected template if initialSelectedId is provided
        if (initialSelectedId) {
          const template = fetchedTemplates.find(
            (t: any) => t.id === initialSelectedId
          );
          if (template) {
            setSelectedTemplate(template);
          } else {
            // If the template with the provided ID wasn't found, attempt to fetch it directly
            fetchTemplateById(initialSelectedId).catch(console.error);
          }
        }
      });
    }
  }, [autoFetch, fetchTemplates, initialSelectedId]);

  // Fetch a single template by ID
  const fetchTemplateById = async (id: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/templates/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch template with ID ${id}`);
      }

      const template = await response.json();
      return template;
    } catch (err: any) {
      console.error(`Failed to fetch template with ID ${id}:`, err);
      setError(`Failed to fetch template with ID ${id}`);
      throw err;
    }
  };

  // Create a new template
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

      // Update the local state with the new template
      await fetchTemplates();
      return newTemplate;
    } catch (err: any) {
      setError(err.message || "Failed to create template");
      console.error(err);
      throw err;
    }
  };

  // Update an existing template
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

      // Update local state
      await fetchTemplates();

      // If this was the selected template, update it
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(updatedTemplate);
      }

      return updatedTemplate;
    } catch (err: any) {
      setError(err.message || "Failed to update template");
      console.error(err);
      throw err;
    }
  };

  // Delete a template
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

      // Update local state
      await fetchTemplates();
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
      const template = await fetchTemplateById(id);
      setSelectedTemplate(template);
    } catch (err) {
      console.error(`Failed to select template with ID ${id}:`, err);
      setError(`Failed to select template with ID ${id}`);
    }
  };

  return {
    templates,
    selectedTemplate,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    selectTemplate,
    refreshTemplates: fetchTemplates,
  };
}
