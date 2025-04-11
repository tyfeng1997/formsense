// app/api/templates/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// GET /api/templates/[id] - Get a template by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Create supabase server client
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the template
    const { data: template, error: templateError } = await supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single();

    if (templateError) {
      if (templateError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }

      console.error(`Failed to get template with ID ${id}:`, templateError);
      return NextResponse.json(
        { error: "Failed to get template" },
        { status: 500 }
      );
    }

    // Get fields for this template
    const { data: fields, error: fieldsError } = await supabase
      .from("fields")
      .select("*")
      .eq("template_id", id);

    if (fieldsError) {
      console.error(`Failed to get fields for template ID ${id}:`, fieldsError);
      return NextResponse.json(
        { error: "Failed to get template fields" },
        { status: 500 }
      );
    }

    // Format response
    const formattedTemplate = {
      id: template.id,
      name: template.name,
      fields: fields.map((field: any) => ({
        id: field.id,
        name: field.name,
        description: field.description || undefined,
      })),
      createdAt: new Date(template.created_at).getTime(),
      updatedAt: new Date(template.updated_at).getTime(),
    };

    return NextResponse.json(formattedTemplate);
  } catch (error) {
    console.error(`Error in GET /api/templates/[id]:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/templates/[id] - Update a template
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Create supabase server client
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Check if template exists and belongs to user
    const { data: existingTemplate, error: checkError } = await supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }

      console.error(`Failed to check template with ID ${id}:`, checkError);
      return NextResponse.json(
        { error: "Failed to update template" },
        { status: 500 }
      );
    }

    // Update template name if provided
    if (body.name) {
      const { error: updateError } = await supabase
        .from("templates")
        .update({ name: body.name })
        .eq("id", id);

      if (updateError) {
        console.error(`Failed to update template with ID ${id}:`, updateError);
        return NextResponse.json(
          { error: "Failed to update template" },
          { status: 500 }
        );
      }
    }

    // Update fields if provided
    if (Array.isArray(body.fields)) {
      // Delete existing fields
      const { error: deleteError } = await supabase
        .from("fields")
        .delete()
        .eq("template_id", id);

      if (deleteError) {
        console.error(
          `Failed to delete fields for template ${id}:`,
          deleteError
        );
        return NextResponse.json(
          { error: "Failed to update template fields" },
          { status: 500 }
        );
      }

      // Insert new fields
      const fieldsToInsert = body.fields.map((field: any) => ({
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
            `Failed to insert fields for template ${id}:`,
            insertError
          );
          return NextResponse.json(
            { error: "Failed to update template fields" },
            { status: 500 }
          );
        }
      }
    }

    // Get the updated template
    const { data: updatedTemplate, error: getError } = await supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single();

    if (getError) {
      console.error(`Failed to get updated template ${id}:`, getError);
      return NextResponse.json(
        {
          error: "Template was updated but failed to retrieve the updated data",
        },
        { status: 500 }
      );
    }

    // Get updated fields
    const { data: updatedFields, error: getFieldsError } = await supabase
      .from("fields")
      .select("*")
      .eq("template_id", id);

    if (getFieldsError) {
      console.error(
        `Failed to get updated fields for template ${id}:`,
        getFieldsError
      );
      return NextResponse.json(
        { error: "Template was updated but failed to retrieve fields" },
        { status: 500 }
      );
    }

    // Format response
    const formattedTemplate = {
      id: updatedTemplate.id,
      name: updatedTemplate.name,
      fields: updatedFields.map((field: any) => ({
        id: field.id,
        name: field.name,
        description: field.description || undefined,
      })),
      createdAt: new Date(updatedTemplate.created_at).getTime(),
      updatedAt: new Date(updatedTemplate.updated_at).getTime(),
    };

    return NextResponse.json(formattedTemplate);
  } catch (error) {
    console.error(`Error in PATCH /api/templates/[id]:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/templates/[id] - Delete a template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Create supabase server client
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if template exists and belongs to user
    const { data: existingTemplate, error: checkError } = await supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }

      console.error(`Failed to check template with ID ${id}:`, checkError);
      return NextResponse.json(
        { error: "Failed to delete template" },
        { status: 500 }
      );
    }

    // Delete the template (fields will be deleted via cascade)
    const { error: deleteError } = await supabase
      .from("templates")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(`Failed to delete template with ID ${id}:`, deleteError);
      return NextResponse.json(
        { error: "Failed to delete template" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/templates/[id]:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
