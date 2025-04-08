// app/api/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    // Use FormData to get files and other data
    const formData = await request.formData();

    // Get template data
    const templateJson = formData.get("template") as string;
    let template;

    try {
      template = JSON.parse(templateJson);
    } catch (error) {
      console.error("Failed to parse template JSON:", error);
      return NextResponse.json(
        { error: "Invalid template data" },
        { status: 400 }
      );
    }

    // Collect all image files and IDs
    const imageEntries: Array<{ id: string; file: File; name: string }> = [];

    // Collect all image files and ID
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("image_") && value instanceof File) {
        // Extract the image ID from the key (remove 'image_' prefix)
        const imageId = key.substring(6);
        imageEntries.push({
          id: imageId,
          file: value as File,
          name: (value as File).name,
        });
      }
    }

    if (imageEntries.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    // Process each image sequentially to avoid overwhelming the API
    const results = [];

    for (const entry of imageEntries) {
      // Convert the image to base64
      const arrayBuffer = await entry.file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString("base64");

      // Prepare prompt for Claude based on the template
      const fieldPrompts = template.fields
        .map(
          (field: any) =>
            `${field.name}: ${field.description || "Extract this value"}`
        )
        .join("\n");

      // Create the prompt for Claude
      const prompt = `Please extract the following fields from this form/receipt image:
      
${fieldPrompts}

Return ONLY a JSON object with these field names as keys and the extracted values as values. 
If you can't find a value, use an empty string.`;

      // Call Claude API
      try {
        const response = await anthropic.messages.create({
          model: "claude-3-7-sonnet-20250219",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: determineMediaType(entry.file.type),
                    data: base64Image,
                  },
                },
                {
                  type: "text",
                  text: prompt,
                },
              ],
            },
          ],
        });

        // Parse the response from Claude
        const responseText = response.content[0].text;
        let extractedFields: Record<string, string> = {};

        try {
          // Try to parse the JSON response
          const jsonMatch =
            responseText.match(/```json\n([\s\S]*?)\n```/) ||
            responseText.match(/```\n([\s\S]*?)\n```/) ||
            responseText.match(/{[\s\S]*?}/);

          if (jsonMatch) {
            extractedFields = JSON.parse(
              jsonMatch[0].replace(/```json\n|```\n|```/g, "")
            );
          } else {
            // If JSON parsing fails, try to extract key-value pairs directly
            extractedFields = parseFieldsFromText(
              responseText,
              template.fields
            );
          }
        } catch (error) {
          console.error("Failed to parse Claude's response:", error);
          // Fallback to parsing text directly
          extractedFields = parseFieldsFromText(responseText, template.fields);
        }

        // Add the result
        results.push({
          imageId: entry.id,
          imageName: entry.name,
          fields: extractedFields,
          metadata: {
            fileSize: entry.file.size,
            fileType: entry.file.type,
          },
        });
      } catch (error) {
        console.error(`Error processing image ${entry.name}:`, error);
        // Add a failed result
        results.push({
          imageId: entry.id,
          imageName: entry.name,
          fields: template.fields.reduce(
            (acc: Record<string, string>, field: any) => {
              acc[field.name] = `Error: Failed to extract`;
              return acc;
            },
            {}
          ),
          error: "Failed to process image",
          metadata: {
            fileSize: entry.file.size,
            fileType: entry.file.type,
          },
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Extract API error:", error);
    return NextResponse.json(
      { error: "Failed to process extraction request" },
      { status: 500 }
    );
  }
}

// Helper function to determine media type for the API
function determineMediaType(fileType: string): string {
  switch (fileType.toLowerCase()) {
    case "image/jpeg":
    case "image/jpg":
      return "image/jpeg";
    case "image/png":
      return "image/png";
    default:
      return "image/jpeg"; // Default to JPEG
  }
}

// Parse fields from text response if JSON parsing fails
function parseFieldsFromText(
  text: string,
  templateFields: any[]
): Record<string, string> {
  const result: Record<string, string> = {};

  // Initialize with empty values
  templateFields.forEach((field) => {
    result[field.name] = "";
  });

  // Try to extract values for each field
  templateFields.forEach((field) => {
    const fieldName = field.name;
    const regex = new RegExp(`${fieldName}[\\s:]+([^\\n]+)`, "i");
    const match = text.match(regex);

    if (match && match[1]) {
      result[fieldName] = match[1].trim();
    }
  });

  return result;
}

// Increase max request body size (handled by server config)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};
