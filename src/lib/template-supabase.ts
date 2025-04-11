// lib/template-supabase.ts
import { createClient } from "@/utils/supabase/server";
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
  createdAt: number; // Unix timestamp in milliseconds
  updatedAt: number; // Unix timestamp in milliseconds
};

// Type for database format
type DbTemplate = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
};

type DbField = {
  id: string;
  template_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Convert from database format to application format
 */
function convertFromDb(template: DbTemplate, fields: DbField[]): Template {
  return {
    id: template.id,
    name: template.name,
    fields: fields.map((field) => ({
      id: field.id,
      name: field.name,
      description: field.description || undefined,
    })),
    createdAt: new Date(template.created_at).getTime(),
    updatedAt: new Date(template.updated_at).getTime(),
  };
}

/**
 * Template Storage Service for Supabase
 */
export const TemplateSupabaseStorage = {
  /**
   * Get all templates for the current user
   */
  async getAll(): Promise<Template[]> {
    const supabase = await createClient();

    // Get all templates for the current user
    const { data: templates, error: templatesError } = await supabase
      .from("templates")
      .select("*")
      .order("updated_at", { ascending: false });

    if (templatesError) {
      console.error("Failed to get templates:", templatesError);
      return [];
    }

    if (!templates || templates.length === 0) {
      return [];
    }

    // Get all fields for these templates
    const { data: fields, error: fieldsError } = await supabase
      .from("fields")
      .select("*")
      .in(
        "template_id",
        templates.map((t) => t.id)
      );

    if (fieldsError) {
      console.error("Failed to get fields:", fieldsError);
      return [];
    }

    // Map templates with their fields
    return templates.map((template) => {
      const templateFields =
        fields?.filter((f) => f.template_id === template.id) || [];
      return convertFromDb(template as DbTemplate, templateFields as DbField[]);
    });
  },

  /**
   * Get a specific template by ID
   */
  async getById(id: string): Promise<Template | null> {
    const supabase = await createClient();

    // Get the template
    const { data: template, error: templateError } = await supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single();

    if (templateError) {
      console.error(`Failed to get template with ID ${id}:`, templateError);
      return null;
    }

    if (!template) {
      return null;
    }

    // Get fields for this template
    const { data: fields, error: fieldsError } = await supabase
      .from("fields")
      .select("*")
      .eq("template_id", id);

    if (fieldsError) {
      console.error(`Failed to get fields for template ID ${id}:`, fieldsError);
      return null;
    }

    return convertFromDb(template as DbTemplate, fields as DbField[]);
  },

  /**
   * Create a new template
   */
  async create(
    data: Omit<Template, "id" | "createdAt" | "updatedAt">
  ): Promise<Template> {
    const supabase = await createClient();

    // Start a transaction by creating the template first
    const { data: template, error: templateError } = await supabase
      .from("templates")
      .insert({
        name: data.name,
      })
      .select()
      .single();

    if (templateError) {
      console.error("Failed to create template:", templateError);
      throw new Error("Failed to create template");
    }

    if (!template) {
      throw new Error("Failed to create template: No data returned");
    }

    // Prepare fields with generated IDs if needed
    const fieldsToInsert = data.fields.map((field) => ({
      template_id: template.id,
      name: field.name,
      description: field.description || null,
    }));

    // Insert fields if there are any
    if (fieldsToInsert.length > 0) {
      const { data: fields, error: fieldsError } = await supabase
        .from("fields")
        .insert(fieldsToInsert)
        .select();

      if (fieldsError) {
        console.error("Failed to create fields:", fieldsError);
        // Clean up the template if field creation fails
        await supabase.from("templates").delete().eq("id", template.id);
        throw new Error("Failed to create template fields");
      }

      return convertFromDb(template as DbTemplate, fields as DbField[]);
    }

    // If no fields, return template with empty fields array
    return {
      id: template.id,
      name: template.name,
      fields: [],
      createdAt: new Date(template.created_at).getTime(),
      updatedAt: new Date(template.updated_at).getTime(),
    };
  },

  /**
   * Update an existing template
   */
  async update(
    id: string,
    data: Partial<Omit<Template, "id" | "createdAt" | "updatedAt">>
  ): Promise<Template> {
    const supabase = await createClient();

    // First check if the template exists and belongs to the user
    const { data: existingTemplate, error: templateCheckError } = await supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single();

    if (templateCheckError || !existingTemplate) {
      console.error(`Template with ID ${id} not found:`, templateCheckError);
      throw new Error(`Template with ID ${id} not found`);
    }

    // Update template name if provided
    if (data.name) {
      const { error: updateError } = await supabase
        .from("templates")
        .update({ name: data.name })
        .eq("id", id);

      if (updateError) {
        console.error(`Failed to update template with ID ${id}:`, updateError);
        throw new Error("Failed to update template");
      }
    }

    // Update fields if provided
    if (data.fields) {
      // Get existing fields
      const { data: existingFields, error: existingFieldsError } =
        await supabase.from("fields").select("*").eq("template_id", id);

      if (existingFieldsError) {
        console.error(
          `Failed to get existing fields for template ${id}:`,
          existingFieldsError
        );
        throw new Error("Failed to update template fields");
      }

      // First, delete all existing fields
      const { error: deleteError } = await supabase
        .from("fields")
        .delete()
        .eq("template_id", id);

      if (deleteError) {
        console.error(
          `Failed to delete existing fields for template ${id}:`,
          deleteError
        );
        throw new Error("Failed to update template fields");
      }

      // Then insert the new fields
      const fieldsToInsert = data.fields.map((field) => ({
        template_id: id,
        name: field.name,
        description: field.description || null,
      }));

      if (fieldsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("fields")
          .insert(fieldsToInsert);

        if (insertError) {
          console.error(
            `Failed to insert new fields for template ${id}:`,
            insertError
          );
          throw new Error("Failed to update template fields");
        }
      }
    }

    // Get the updated template with its fields
    return this.getById(id) as Promise<Template>;
  },

  /**
   * Delete a template
   */
  async delete(id: string): Promise<void> {
    const supabase = await createClient();

    // With cascading deletes set up in the database, we only need to delete the template
    const { error } = await supabase.from("templates").delete().eq("id", id);

    if (error) {
      console.error(`Failed to delete template with ID ${id}:`, error);
      throw new Error("Failed to delete template");
    }
  },
};
