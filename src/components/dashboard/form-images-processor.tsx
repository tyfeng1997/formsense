"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  FileImage,
  Check,
  X,
  AlertCircle,
  FileText,
  Plus,
  Save,
  Scan,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ExtractedResults } from "./extracted-results";
import { useTemplates } from "@/hooks/useTemplates";
import { Template } from "@/lib/template-supabase";
import { TemplateSelectionDialog } from "./template-selection-dialog";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

type FormImage = {
  id: string;
  name: string;
  url: string;
  file: File; // Store original file object
  selected: boolean;
};

type ExtractionResult = {
  imageId: string;
  imageName: string;
  fields: Record<string, string>;
  metadata?: {
    fileSize: number;
    fileType: string;
  };
  error?: string;
  isAllFieldsExtraction?: boolean;
};

export function FormImagesProcessor() {
  const router = useRouter();

  // Use our hook instead of context
  const {
    templates,
    selectedTemplate,
    selectTemplate,
    isLoading: isLoadingTemplates,
    refreshTemplates,
  } = useTemplates({
    autoFetch: true,
  });

  const [images, setImages] = useState<FormImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showExtractionDialog, setShowExtractionDialog] = useState(false);
  const [showTemplateSelectionDialog, setShowTemplateSelectionDialog] =
    useState(false);
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAllFieldsExtraction, setIsAllFieldsExtraction] = useState(false);

  // Progress tracking for batch processing
  const [processedCount, setProcessedCount] = useState(0);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [extractionProgress, setExtractionProgress] = useState(0);

  // Calculate selected images count
  const selectedImagesCount = images.filter((img) => img.selected).length;

  // Reset results when selected template changes
  useEffect(() => {
    if (results.length > 0) {
      setResults([]);
    }
  }, [selectedTemplate]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (files: File[]) => {
    // Only process image files
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      toast.error("No valid image files found", {
        description: "Please upload image files.",
      });
      return;
    }

    // Show loading toast for conversion
    const conversionToastId = toast.loading(
      `Converting ${imageFiles.length} image${
        imageFiles.length > 1 ? "s" : ""
      } to JPEG format...`
    );

    try {
      // Import the conversion functions dynamically
      const { batchConvertToJpeg } = await import("@/lib/image-utils");

      // Check for WeChat images
      const hasWeChatImages = imageFiles.some(
        (file) =>
          file.name.toLowerCase().includes("wechat") ||
          file.name.toLowerCase().includes("微信")
      );

      if (hasWeChatImages) {
        toast.info("WeChat images detected", {
          description:
            "WeChat images will be specially processed for compatibility.",
        });
      }

      // Convert all images to JPEG
      const convertedFiles = await batchConvertToJpeg(imageFiles, 0.92);

      const newImages: FormImage[] = convertedFiles.map((file, index) => {
        const id = `image-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;
        return {
          id,
          name: file.name, // This will have .jpg extension now
          url: URL.createObjectURL(file),
          file, // Save the converted file object
          selected: false,
        };
      });

      setImages((prev) => [...prev, ...newImages]);

      toast.success(
        `${imageFiles.length} image${
          imageFiles.length > 1 ? "s" : ""
        } uploaded`,
        {
          id: conversionToastId,
          description:
            "All images converted to JPEG format. Select images and a template to extract data.",
        }
      );
    } catch (error) {
      console.error("Image conversion error:", error);
      toast.error("Failed to convert images", {
        id: conversionToastId,
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleRemoveImage = (imageId: string) => {
    // Release URL object
    const imageToRemove = images.find((img) => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    setImages((prev) => prev.filter((img) => img.id !== imageId));
    // Also remove any extraction results for this image
    setResults((prev) => prev.filter((result) => result.imageId !== imageId));
  };

  const handleSelectImage = (imageId: string, selected: boolean) => {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, selected } : img))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setImages((prev) => prev.map((img) => ({ ...img, selected: select })));
  };

  const handleExtractClick = () => {
    // Open extraction dialog if no template is selected
    if (!selectedTemplate) {
      setShowExtractionDialog(true);
    } else {
      // Use the already selected template
      handleExtractWithTemplate(selectedTemplate);
    }
  };

  const handleExtractAllFields = async () => {
    // Get selected images
    const selectedImages = images.filter((img) => img.selected);

    if (selectedImages.length === 0) {
      toast.error("No images selected", {
        description: "Please select at least one image to extract data from.",
      });
      return;
    }

    setIsExtracting(true);
    setShowExtractionDialog(false);
    setIsAllFieldsExtraction(true); // Set this flag to true

    // Reset progress tracking
    setProcessedCount(0);
    setTotalToProcess(selectedImages.length);
    setExtractionProgress(0);
    setResults([]);

    // Show loading toast
    const toastId = toast.loading(
      `Extracting all fields from ${selectedImages.length} image${
        selectedImages.length > 1 ? "s" : ""
      }...`
    );

    try {
      // Process images one by one to show progress
      const newResults: ExtractionResult[] = [];

      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];

        // Create FormData for this single image
        const formData = new FormData();
        formData.append("template", "all_fields"); // Special value to indicate all fields extraction
        formData.append(`image_${image.id}`, image.file);

        try {
          // Send extraction request for this single image
          const response = await fetch("/api/extract", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(
              `API request failed with status: ${response.status}`
            );
          }

          const data = await response.json();

          if (data.error) {
            throw new Error(data.error);
          }

          // Add the result to our collection
          if (data.results && data.results.length > 0) {
            newResults.push({
              ...data.results[0],
              isAllFieldsExtraction: true,
            });
          }
        } catch (error) {
          console.error(`Error processing image ${image.name}:`, error);

          // Add a failed result
          newResults.push({
            imageId: image.id,
            imageName: image.name,
            fields: { Error: "Failed to extract fields" },
            error: error instanceof Error ? error.message : "Unknown error",
            isAllFieldsExtraction: true,
          });
        }

        // Update progress
        setProcessedCount(i + 1);
        setExtractionProgress(
          Math.round(((i + 1) / selectedImages.length) * 100)
        );

        // Update results as they come in
        setResults([...newResults]);
      }

      // Success toast
      toast.success(
        `Successfully extracted all fields from ${selectedImages.length} image${
          selectedImages.length > 1 ? "s" : ""
        }.`,
        {
          id: toastId,
          description: "You can now view and edit the results.",
        }
      );
    } catch (error) {
      console.error("Extraction error:", error);

      // Update loading status to failed
      toast.error("Failed to extract data", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleExtractWithTemplate = async (template: Template) => {
    if (!template) {
      toast.error("No template selected", {
        description: "Please select a template before extracting data.",
      });
      return;
    }

    // Get selected images
    const selectedImages = images.filter((img) => img.selected);

    if (selectedImages.length === 0) {
      toast.error("No images selected", {
        description: "Please select at least one image to extract data from.",
      });
      return;
    }

    setIsExtracting(true);
    setShowExtractionDialog(false);
    setIsAllFieldsExtraction(false); // Reset all fields mode

    // Reset progress tracking
    setProcessedCount(0);
    setTotalToProcess(selectedImages.length);
    setExtractionProgress(0);
    setResults([]);

    // Show loading toast
    const toastId = toast.loading(
      `Extracting data from ${selectedImages.length} image${
        selectedImages.length > 1 ? "s" : ""
      }...`
    );

    try {
      // Set the selected template if not already set
      if (!selectedTemplate || selectedTemplate.id !== template.id) {
        selectTemplate(template.id);
      }

      // Process images one by one to show progress
      const newResults: ExtractionResult[] = [];

      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];

        // Create FormData for this single image
        const formData = new FormData();
        formData.append("template", JSON.stringify(template));
        formData.append(`image_${image.id}`, image.file);

        try {
          // Send extraction request for this single image
          const response = await fetch("/api/extract", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(
              `API request failed with status: ${response.status}`
            );
          }

          const data = await response.json();

          if (data.error) {
            throw new Error(data.error);
          }

          // Add the result to our collection
          if (data.results && data.results.length > 0) {
            newResults.push(data.results[0]);
          }
        } catch (error) {
          console.error(`Error processing image ${image.name}:`, error);

          // Add a failed result
          newResults.push({
            imageId: image.id,
            imageName: image.name,
            fields: template.fields.reduce(
              (acc: Record<string, string>, field: any) => {
                acc[field.name] = `Error: Failed to extract`;
                return acc;
              },
              {}
            ),
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }

        // Update progress
        setProcessedCount(i + 1);
        setExtractionProgress(
          Math.round(((i + 1) / selectedImages.length) * 100)
        );

        // Update results as they come in
        setResults([...newResults]);
      }

      // Success toast
      toast.success(
        `Successfully extracted data from ${selectedImages.length} image${
          selectedImages.length > 1 ? "s" : ""
        }.`,
        {
          id: toastId,
          description: "You can now view and edit the results.",
        }
      );
    } catch (error) {
      console.error("Extraction error:", error);

      // Update loading status to failed
      toast.error("Failed to extract data", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCreateTemplate = () => {
    // Navigate to templates page with a query parameter to trigger template creation
    router.push("/dashboard/templates?create=true");
  };

  // Handle updating results after editing
  const handleUpdateResults = (updatedResults: ExtractionResult[]) => {
    setResults(updatedResults);

    toast.success("Results updated", {
      description: "Your changes to the extracted data have been saved.",
    });
  };

  // The loading state when templates are being fetched
  if (isLoadingTemplates) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin mr-2">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-gray-600">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200 pb-4">
          <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
            <FileImage className="h-5 w-5 text-blue-600" />
            Upload Form Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Upload area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="rounded-full bg-blue-100 p-3 mb-2">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-base font-medium text-gray-800">
                Drag and drop image files or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: PNG, JPG, JPEG, WEBP, etc. (all will be
                converted to JPEG)
              </p>
            </div>
          </div>

          {/* Image gallery */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  Uploaded Images ({images.length})
                </h3>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    onClick={() =>
                      handleSelectAll(!images.some((img) => img.selected))
                    }
                  >
                    {images.every((img) => img.selected)
                      ? "Deselect All"
                      : "Select All"}
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleExtractClick}
                    disabled={selectedImagesCount === 0 || isExtracting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Extract ({selectedImagesCount})
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className={cn(
                      "relative group aspect-square rounded-md overflow-hidden border shadow-sm transition-all",
                      image.selected
                        ? "border-blue-400 ring-1 ring-blue-400"
                        : "border-gray-200 hover:border-blue-200"
                    )}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(image.id);
                        }}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </button>
                    </div>

                    {/* Checkbox for selection */}
                    <div
                      className="absolute bottom-2 right-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectImage(image.id, !image.selected);
                      }}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded flex items-center justify-center shadow-sm",
                          image.selected
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 hover:border-blue-400"
                        )}
                      >
                        {image.selected && <Check className="h-3 w-3" />}
                      </div>
                    </div>

                    {/* Image name tooltip on hover */}
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Template Section */}
      {images.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200 pb-3">
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Extraction Template
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isAllFieldsExtraction ? (
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-md border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-green-100 text-green-600">
                    <Scan className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">
                      Extract All Fields (Auto-detect)
                    </h3>
                    <p className="text-sm text-green-700">
                      Automatically detecting and extracting all fields from
                      your forms
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplateSelectionDialog(true)}
                  className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                >
                  Change Template
                </Button>
              </div>
            ) : selectedTemplate ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium text-gray-800">
                      {selectedTemplate.name}
                    </h3>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTemplateSelectionDialog(true)}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                  >
                    Change Template
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedTemplate.fields.map((field) => (
                    <div
                      key={field.id}
                      className="border border-gray-200 bg-gray-50 p-3 rounded-md shadow-sm hover:border-blue-200 transition-colors"
                    >
                      <p className="font-medium text-sm text-gray-800">
                        {field.name}
                      </p>
                      {field.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {field.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-600">No template selected</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplateSelectionDialog(true)}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                >
                  Select Template
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gray-50 border-b border-gray-200 pb-4">
          <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Extracted Results
          </CardTitle>
          {results.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success("Changes saved", {
                  description:
                    "Your changes to the extracted data have been saved.",
                });
              }}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {isExtracting ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full p-3 bg-blue-100">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Extracting data from selected images...
                </p>
              </div>

              {/* Progress tracking */}
              <div className="w-full max-w-md space-y-2">
                <Progress
                  value={extractionProgress}
                  className="h-2 bg-gray-100"
                />
                <p className="text-xs text-center text-gray-500">
                  Processing image {processedCount} of {totalToProcess}
                  {processedCount > 0 &&
                    results.length > 0 &&
                    " (Results updated as they arrive)"}
                </p>
              </div>

              {/* Display partial results while processing */}
              {results.length > 0 && (
                <div className="w-full mt-4">
                  <p className="text-sm font-medium mb-2 text-gray-700">
                    Partial Results
                  </p>
                  <ExtractedResults
                    results={results}
                    template={selectedTemplate}
                    isAllFieldsExtraction={isAllFieldsExtraction}
                    onUpdateResults={handleUpdateResults}
                  />
                </div>
              )}
            </div>
          ) : results.length > 0 ? (
            <ExtractedResults
              results={results}
              template={selectedTemplate}
              isAllFieldsExtraction={isAllFieldsExtraction}
              onUpdateResults={handleUpdateResults}
            />
          ) : (
            <div className="text-center py-12 border border-dashed rounded-md bg-gray-50 border-gray-200">
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-blue-100 p-3">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-gray-700 font-medium">
                  No extracted data yet
                </p>
                <p className="text-sm text-gray-500">
                  Select images and click extract to process them
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extraction Dialog for template selection */}
      <TemplateSelectionDialog
        open={showExtractionDialog}
        onClose={() => setShowExtractionDialog(false)}
        onSelectTemplate={handleExtractWithTemplate}
        onExtractAllFields={handleExtractAllFields}
        onCreateTemplate={handleCreateTemplate}
        currentTemplateId={selectedTemplate?.id}
      />

      {/* Template Change Dialog */}
      <TemplateSelectionDialog
        open={showTemplateSelectionDialog}
        onClose={() => setShowTemplateSelectionDialog(false)}
        onSelectTemplate={(template) => {
          selectTemplate(template.id);
          setIsAllFieldsExtraction(false);
          toast.info(`Template selected: ${template.name}`, {
            description: `${template.fields.length} fields will be used for extraction.`,
          });
        }}
        onExtractAllFields={handleExtractAllFields}
        onCreateTemplate={handleCreateTemplate}
        currentTemplateId={selectedTemplate?.id}
      />
    </div>
  );
}
