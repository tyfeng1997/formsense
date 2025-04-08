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
        const file = value as File;

        // Log information about this file
        console.log(
          `Received file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`
        );

        // Special handling for WeChat images which might have format issues
        let processedFile = file;
        if (
          file.name.toLowerCase().includes("wechat") ||
          file.name.toLowerCase().includes("微信")
        ) {
          console.log(
            `Warning: Detected WeChat image (${file.name}). These may require special handling.`
          );
        }

        imageEntries.push({
          id: imageId,
          file: processedFile,
          name: file.name,
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

      // Ensure the image is a valid JPEG by checking the header
      if (buffer.length < 2 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
        console.warn(`File ${entry.name} does not have a valid JPEG header`);
      }

      // Log byte check for debugging
      console.log(
        `File ${entry.name} first bytes: ${buffer[0].toString(
          16
        )},${buffer[1].toString(16)},${buffer[2].toString(
          16
        )},${buffer[3].toString(16)}`
      );

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
        console.log(
          `Sending image ${entry.name} (${buffer.length} bytes) to Claude API`
        );

        let extractedFields: Record<string, string> = {};

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
                      media_type: "image/jpeg", // Always use image/jpeg
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
          console.log(
            `Received response for ${entry.name}:`,
            responseText.substring(0, 100) + "..."
          );

          try {
            // Try to parse the JSON response
            const jsonMatch =
              responseText.match(/```json\n([\s\S]*?)\n```/) ||
              responseText.match(/```\n([\s\S]*?)\n```/) ||
              responseText.match(/{[\s\S]*?}/);

            if (jsonMatch) {
              const jsonStr = jsonMatch[0].replace(/```json\n|```\n|```/g, "");
              console.log("Found JSON:", jsonStr.substring(0, 100) + "...");
              extractedFields = JSON.parse(jsonStr);
            } else {
              // If JSON parsing fails, try to extract key-value pairs directly
              console.log("No JSON found, parsing text directly");
              extractedFields = parseFieldsFromText(
                responseText,
                template.fields
              );
            }
          } catch (error) {
            console.error("Failed to parse Claude's response:", error);
            // Fallback to parsing text directly
            extractedFields = parseFieldsFromText(
              responseText,
              template.fields
            );
          }
        } catch (apiError: any) {
          console.error(`API Error with ${entry.name}:`, apiError);

          // Try one more time with a simpler approach if there's a 400 error about image format
          if (
            apiError.status === 400 &&
            apiError.message &&
            apiError.message.includes(
              "Image does not match the provided media type"
            )
          ) {
            console.log("Retrying with a different approach for:", entry.name);

            // Retry by sending just the text prompt without the image
            const fallbackResponse = await anthropic.messages.create({
              model: "claude-3-7-sonnet-20250219",
              max_tokens: 1024,
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text:
                        "I was trying to extract data from an image but had technical difficulties. Please provide a response with empty field values in this format: " +
                        JSON.stringify(
                          template.fields.reduce(
                            (acc: Record<string, string>, field: any) => {
                              acc[field.name] = "";
                              return acc;
                            },
                            {}
                          )
                        ),
                    },
                  ],
                },
              ],
            });

            const fallbackText = fallbackResponse.content[0].text;

            try {
              const jsonMatch =
                fallbackText.match(/```json\n([\s\S]*?)\n```/) ||
                fallbackText.match(/```\n([\s\S]*?)\n```/) ||
                fallbackText.match(/{[\s\S]*?}/);

              if (jsonMatch) {
                extractedFields = JSON.parse(
                  jsonMatch[0].replace(/```json\n|```\n|```/g, "")
                );
              } else {
                extractedFields = template.fields.reduce(
                  (acc: Record<string, string>, field: any) => {
                    acc[field.name] = "Error extracting value";
                    return acc;
                  },
                  {}
                );
              }
            } catch (error) {
              console.error("Failed to parse fallback response:", error);
              extractedFields = template.fields.reduce(
                (acc: Record<string, string>, field: any) => {
                  acc[field.name] = "Error extracting value";
                  return acc;
                },
                {}
              );
            }

            // Add the result with an error note
            results.push({
              imageId: entry.id,
              imageName: entry.name,
              fields: extractedFields,
              metadata: {
                fileSize: entry.file.size,
                fileType: entry.file.type,
              },
              error:
                "Image format error - please check if this is a valid JPEG image",
            });

            continue; // Skip to the next image
          } else {
            // For other errors, just throw
            throw apiError;
          }
        }

        // Add the successful result
        results.push({
          imageId: entry.id,
          imageName: entry.name,
          fields: extractedFields,
          metadata: {
            fileSize: entry.file.size,
            fileType: entry.file.type,
          },
        });

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
        // Add the successful result
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
          error: error instanceof Error ? error.message : "Unknown error",
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
  // Since we're converting all images to JPEG on the client side,
  // we can always return image/jpeg. However, keeping the function
  // in case we need to handle different types in the future.
  return "image/jpeg";
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
