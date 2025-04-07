// lib/template-storage.ts
import { v4 as uuidv4 } from "uuid";

export type Field = {
  id: string;
  name: string;
  description?: string;
};

export type Template = {
  id: string;
  name: string;
  fields: Field[];
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "formsense_templates";

/**
 * Template Storage Service
 * Currently uses localStorage but designed to be easily swapped with a remote API
 */
export const TemplateStorage = {
  /**
   * Get all templates
   */
  async getAll(): Promise<Template[]> {
    if (typeof window === "undefined") return [];

    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) return [];

      const templates = JSON.parse(storedData) as Template[];
      return templates.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      console.error("Failed to get templates:", error);
      return [];
    }
  },

  /**
   * Get a specific template by ID
   */
  async getById(id: string): Promise<Template | null> {
    try {
      const templates = await this.getAll();
      return templates.find((t) => t.id === id) || null;
    } catch (error) {
      console.error(`Failed to get template with ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Create a new template
   */
  async create(
    data: Omit<Template, "id" | "createdAt" | "updatedAt">
  ): Promise<Template> {
    try {
      const templates = await this.getAll();

      const newTemplate: Template = {
        ...data,
        id: uuidv4(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        // Ensure each field has an ID
        fields: data.fields.map((field) => ({
          ...field,
          id: field.id || uuidv4(),
        })),
      };

      templates.push(newTemplate);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));

      return newTemplate;
    } catch (error) {
      console.error("Failed to create template:", error);
      throw new Error("Failed to create template");
    }
  },

  /**
   * Update an existing template
   */
  async update(
    id: string,
    data: Partial<Omit<Template, "id" | "createdAt" | "updatedAt">>
  ): Promise<Template> {
    try {
      const templates = await this.getAll();
      const templateIndex = templates.findIndex((t) => t.id === id);

      if (templateIndex === -1) {
        throw new Error(`Template with ID ${id} not found`);
      }

      // Process fields to ensure they all have IDs
      const updatedFields = data.fields?.map((field) => ({
        ...field,
        id: field.id || uuidv4(),
      }));

      const updatedTemplate: Template = {
        ...templates[templateIndex],
        ...data,
        fields: updatedFields || templates[templateIndex].fields,
        updatedAt: Date.now(),
      };

      templates[templateIndex] = updatedTemplate;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));

      return updatedTemplate;
    } catch (error) {
      console.error(`Failed to update template with ID ${id}:`, error);
      throw new Error("Failed to update template");
    }
  },

  /**
   * Delete a template
   */
  async delete(id: string): Promise<void> {
    try {
      const templates = await this.getAll();
      const updatedTemplates = templates.filter((t) => t.id !== id);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
    } catch (error) {
      console.error(`Failed to delete template with ID ${id}:`, error);
      throw new Error("Failed to delete template");
    }
  },

  /**
   * Initialize with some default templates if none exist
   */
  async initializeDefaults(): Promise<void> {
    try {
      const templates = await this.getAll();

      if (templates.length === 0) {
        const now = Date.now();

        const defaultTemplates: Template[] = [
          {
            id: uuidv4(),
            name: "Invoice Template",
            createdAt: now,
            updatedAt: now,
            fields: [
              {
                id: uuidv4(),
                name: "Invoice Number",
                description: "Usually top right",
              },
              { id: uuidv4(), name: "Date", description: "Invoice date" },
              {
                id: uuidv4(),
                name: "Total Amount",
                description: "Final total with tax",
              },
              { id: uuidv4(), name: "Vendor", description: "Company name" },
            ],
          },
          {
            id: uuidv4(),
            name: "Receipt Template",
            createdAt: now,
            updatedAt: now,
            fields: [
              {
                id: uuidv4(),
                name: "Store Name",
                description: "Business name",
              },
              {
                id: uuidv4(),
                name: "Purchase Date",
                description: "Date of purchase",
              },
              { id: uuidv4(), name: "Items", description: "List of items" },
              { id: uuidv4(), name: "Total", description: "Total price" },
              {
                id: uuidv4(),
                name: "Payment Method",
                description: "How it was paid",
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Business Card Template",
            createdAt: now,
            updatedAt: now,
            fields: [
              { id: uuidv4(), name: "Name", description: "Person's name" },
              { id: uuidv4(), name: "Title", description: "Job title" },
              { id: uuidv4(), name: "Company", description: "Company name" },
              { id: uuidv4(), name: "Email", description: "Email address" },
              { id: uuidv4(), name: "Phone", description: "Phone number" },
            ],
          },
        ];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTemplates));
      }
    } catch (error) {
      console.error("Failed to initialize default templates:", error);
    }
  },
};

// Initialize the default templates when this module is imported
// but only in browser environment
if (typeof window !== "undefined") {
  TemplateStorage.initializeDefaults();
}
