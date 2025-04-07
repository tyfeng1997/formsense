"use client";

import { useState } from "react";
import { ImageUploader } from "./image-uploader";
import { TemplateManager } from "./template-manager";
import { ExtractedResults } from "./extracted-results";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

type FormImage = {
  id: string;
  name: string;
  url: string;
  selected: boolean;
};

type Template = {
  id: string;
  name: string;
  fields: { name: string; description?: string }[];
};

type ExtractionResult = {
  imageId: string;
  imageName: string;
  fields: Record<string, string>;
};

export function FormProcessor() {
  const [images, setImages] = useState<FormImage[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  // 计算有多少图片被选中
  const selectedImagesCount = images.filter((img) => img.selected).length;

  // 处理选择图片
  const handleImageSelection = (imageId: string, selected: boolean) => {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, selected } : img))
    );
  };

  // 处理移除图片
  const handleRemoveImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    // 同时移除相关的提取结果
    setResults((prev) => prev.filter((result) => result.imageId !== imageId));
  };

  // 添加新图片
  const handleAddImages = (newImages: FormImage[]) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  // 提取信息
  const handleExtract = async () => {
    if (!selectedTemplate) {
      alert("Please select a template first");
      return;
    }

    const selectedImages = images.filter((img) => img.selected);
    if (selectedImages.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setIsExtracting(true);

    try {
      // Mock API call for now
      // In a real app, this would call the actual extraction API
      setTimeout(() => {
        const mockResults: ExtractionResult[] = selectedImages.map((img) => ({
          imageId: img.id,
          imageName: img.name,
          fields: selectedTemplate.fields.reduce(
            (acc, field) => ({
              ...acc,
              [field.name]: "TEST PASS",
            }),
            {}
          ),
        }));

        setResults(mockResults);
        setIsExtracting(false);
      }, 1500);

      /* 
      // This is the real API call that would be used
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          imageIds: selectedImages.map((img) => img.id),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to extract data");
      }

      const data = await response.json();
      setResults(data.results);
      */
    } catch (error) {
      console.error("Extraction error:", error);
      alert("Failed to extract data from the images");
    } finally {
      //setIsExtracting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Form Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader
              images={images}
              onAddImages={handleAddImages}
              onSelectImage={handleImageSelection}
              onRemoveImage={handleRemoveImage}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extraction Template</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateManager
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              onCreateTemplate={(newTemplate) => {
                setTemplates((prev) => [...prev, newTemplate]);
                setSelectedTemplate(newTemplate);
              }}
              onUpdateTemplate={(updatedTemplate) => {
                setTemplates((prev) =>
                  prev.map((t) =>
                    t.id === updatedTemplate.id ? updatedTemplate : t
                  )
                );
                if (selectedTemplate?.id === updatedTemplate.id) {
                  setSelectedTemplate(updatedTemplate);
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-3">
        <Card className="h-full">
          <CardHeader className="flex-row justify-between items-center space-y-0">
            <CardTitle>Extracted Results</CardTitle>
            <Button
              onClick={handleExtract}
              disabled={
                isExtracting || !selectedTemplate || selectedImagesCount === 0
              }
              className="ml-auto"
            >
              <FileText className="h-4 w-4 mr-2" />
              {isExtracting
                ? "Extracting..."
                : `Extract (${selectedImagesCount})`}
            </Button>
          </CardHeader>
          <CardContent>
            <ExtractedResults results={results} template={selectedTemplate} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
