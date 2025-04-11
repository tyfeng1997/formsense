// app/api/templates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// GET /api/templates - Get all templates
export async function GET(req: NextRequest) {
  try {
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

    // Get all templates for the user
    const { data: templates, error: templatesError } = await supabase
      .from("templates")
      .select("*")
      .order("updated_at", { ascending: false });

    if (templatesError) {
      console.error("Failed to get templates:", templatesError);
      return NextResponse.json(
        { error: "Failed to get templates" },
        { status: 500 }
      );
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
      return NextResponse.json(
        { error: "Failed to get template fields" },
        { status: 500 }
      );
    }

    // Format the response
    const formattedTemplates = templates.map((template) => {
      const templateFields =
        fields?.filter((f) => f.template_id === template.id) || [];
      return {
        id: template.id,
        name: template.name,
        fields: templateFields.map((field) => ({
          id: field.id,
          name: field.name,
          description: field.description || undefined,
        })),
        createdAt: new Date(template.created_at).getTime(),
        updatedAt: new Date(template.updated_at).getTime(),
      };
    });

    return NextResponse.json(formattedTemplates);
  } catch (error) {
    console.error("Error in GET /api/templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create a new template
export async function POST(req: NextRequest) {
  try {
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
    const body = await req.json();

    // Validate request
    if (!body.name) {
      return NextResponse.json(
        { error: "Template name is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.fields)) {
      return NextResponse.json(
        { error: "Fields must be an array" },
        { status: 400 }
      );
    }

    // Insert template
    const { data: template, error: templateError } = await supabase
      .from("templates")
      .insert({
        name: body.name,
        user_id: user.id,
      })
      .select()
      .single();

    if (templateError) {
      console.error("Failed to create template:", templateError);
      return NextResponse.json(
        { error: "Failed to create template" },
        { status: 500 }
      );
    }

    // Prepare fields for insertion
    const fieldsToInsert = body.fields.map((field: any) => ({
      template_id: template.id,
      name: field.name,
      description: field.description || null,
    }));

    // Insert fields
    let fields = [];
    if (fieldsToInsert.length > 0) {
      const { data: fieldData, error: fieldsError } = await supabase
        .from("fields")
        .insert(fieldsToInsert)
        .select();

      if (fieldsError) {
        console.error("Failed to create fields:", fieldsError);
        // Delete template if field creation fails
        await supabase.from("templates").delete().eq("id", template.id);

        return NextResponse.json(
          { error: "Failed to create template fields" },
          { status: 500 }
        );
      }

      fields = fieldData;
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

    return NextResponse.json(formattedTemplate, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
