// components/dashboard/form-processor.tsx
"use client";

import { useState } from "react";
import { ImageUploader } from "./image-uploader";
import { TemplateManager } from "./template-manager";
import { ExtractedResults } from "./extracted-results";
import { Button } from "@/components/ui/button";

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
    } catch (error) {
      console.error("Extraction error:", error);
      alert("Failed to extract data from the images");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Upload Form Images</h2>
            <ImageUploader
              images={images}
              onAddImages={handleAddImages}
              onSelectImage={handleImageSelection}
              onRemoveImage={handleRemoveImage}
            />
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Extraction Template</h2>
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
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Extracted Results</h2>
            <Button
              onClick={handleExtract}
              disabled={
                isExtracting || !selectedTemplate || selectedImagesCount === 0
              }
            >
              {isExtracting
                ? "Extracting..."
                : `Extract (${selectedImagesCount})`}
            </Button>
          </div>
          <ExtractedResults results={results} template={selectedTemplate} />
        </div>
      </div>
    </div>
  );
}
