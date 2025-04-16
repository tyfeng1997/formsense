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
    let isAllFieldsExtraction = false;

    // Check if this is an "extract all fields" request
    if (templateJson === "all_fields") {
      isAllFieldsExtraction = true;
      // Create a dummy template object
      template = {
        id: "all_fields",
        name: "Auto-detect All Fields",
        fields: [],
      };
    } else {
      try {
        template = JSON.parse(templateJson);
      } catch (error) {
        console.error("Failed to parse template JSON:", error);
        return NextResponse.json(
          { error: "Invalid template data" },
          { status: 400 }
        );
      }
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
        const processedFile = file;
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

      // Create the prompt for Claude
      let prompt;

      if (isAllFieldsExtraction) {
        // Prompt for extracting all fields
        prompt = `Please analyze this form/receipt image and extract ALL key-value pairs you can find:

1. Identify any text that appears to be a form field, label, or key information
2. Find the corresponding value for each identified field
3. Extract all key-value pairs, organized in a clean format
4. Return the data as a JSON object with field names as keys and values as values

Important:
- Preserve the original field/label names exactly as they appear in the image
- Group related information logically
- If multiple values exist for the same field, include them all
- Do not omit any fields or data present in the image
- If you can't determine a value, use an empty string
- Return ONLY the JSON object without any other explanation or text

Example format:
{
  "Invoice Number": "INV-12345",
  "Date": "2024-04-15",
  "Customer Name": "ABC Company",
  ...
}`;
      } else {
        // Prompt for template-based extraction
        const fieldPrompts = template.fields
          .map(
            (field: any) =>
              `${field.name}: ${field.description || "Extract this value"}`
          )
          .join("\n");

        prompt = `Please extract the following fields from this form/receipt image:
        
${fieldPrompts}

Return ONLY a JSON object with these field names as keys and the extracted values as values. 
If you can't find a value, use an empty string.`;
      }

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
          const responseText =
            "text" in response.content[0] ? response.content[0].text : "";
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
              if (isAllFieldsExtraction) {
                // For all fields extraction, try line-by-line parsing
                extractedFields = parseKeyValuePairsFromText(responseText);
              } else {
                // For template-based extraction
                extractedFields = parseFieldsFromText(
                  responseText,
                  template.fields
                );
              }
            }
          } catch (error) {
            console.error("Failed to parse Claude's response:", error);
            // Fallback to parsing text directly
            if (isAllFieldsExtraction) {
              extractedFields = parseKeyValuePairsFromText(responseText);
            } else {
              extractedFields = parseFieldsFromText(
                responseText,
                template.fields
              );
            }
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
                        (isAllFieldsExtraction
                          ? '{"Error": "Unable to process image"}'
                          : JSON.stringify(
                              template.fields.reduce(
                                (acc: Record<string, string>, field: any) => {
                                  acc[field.name] = "";
                                  return acc;
                                },
                                {}
                              )
                            )),
                    },
                  ],
                },
              ],
            });

            const fallbackText =
              "text" in fallbackResponse.content[0]
                ? fallbackResponse.content[0].text
                : "";
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
                if (isAllFieldsExtraction) {
                  extractedFields = { Error: "Unable to process image" };
                } else {
                  extractedFields = template.fields.reduce(
                    (acc: Record<string, string>, field: any) => {
                      acc[field.name] = "Error extracting value";
                      return acc;
                    },
                    {}
                  );
                }
              }
            } catch (error) {
              console.error("Failed to parse fallback response:", error);
              if (isAllFieldsExtraction) {
                extractedFields = { Error: "Unable to process image" };
              } else {
                extractedFields = template.fields.reduce(
                  (acc: Record<string, string>, field: any) => {
                    acc[field.name] = "Error extracting value";
                    return acc;
                  },
                  {}
                );
              }
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
              isAllFieldsExtraction: isAllFieldsExtraction,
            });

            continue; // Skip to the next image
          } else {
            // For other errors, just throw
            throw apiError;
          }
        }

        // Add the successful result (only add once)
        results.push({
          imageId: entry.id,
          imageName: entry.name,
          fields: extractedFields,
          metadata: {
            fileSize: entry.file.size,
            fileType: entry.file.type,
          },
          isAllFieldsExtraction: isAllFieldsExtraction,
        });
      } catch (error) {
        console.error(`Error processing image ${entry.name}:`, error);
        // Add a failed result
        if (isAllFieldsExtraction) {
          results.push({
            imageId: entry.id,
            imageName: entry.name,
            fields: { Error: "Failed to extract fields" },
            error: error instanceof Error ? error.message : "Unknown error",
            metadata: {
              fileSize: entry.file.size,
              fileType: entry.file.type,
            },
            isAllFieldsExtraction: true,
          });
        } else {
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

// Parse key-value pairs from text for "extract all fields" mode
function parseKeyValuePairsFromText(text: string): Record<string, string> {
  const result: Record<string, string> = {};

  // Clean up the text - remove markdown formatting if present
  const cleanText = text.replace(/```json|```/g, "").trim();

  // Try to find lines with key-value patterns
  const lines = cleanText.split("\n");

  for (const line of lines) {
    // Look for patterns like "Key: Value" or "Key - Value"
    const keyValueMatch = line.match(/^(.*?)(?:\s*[:|-]\s*)(.*)$/);

    if (keyValueMatch && keyValueMatch[1] && keyValueMatch[2]) {
      const key = keyValueMatch[1].trim();
      const value = keyValueMatch[2].trim();

      // Skip if the key is empty or just punctuation
      if (key && !/^[.,;:!?-]+$/.test(key)) {
        result[key] = value;
      }
    }
  }

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
