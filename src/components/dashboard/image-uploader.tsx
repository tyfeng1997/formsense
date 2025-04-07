// components/dashboard/image-uploader.tsx
"use client";
import { Upload, X, Check, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormImage = {
  id: string;
  name: string;
  url: string;
  selected: boolean;
};

type ImageUploaderProps = {
  images: FormImage[];
  onAddImages: (newImages: FormImage[]) => void;
  onSelectImage: (imageId: string, selected: boolean) => void;
  onRemoveImage: (imageId: string) => void;
};

export function ImageUploader({
  images,
  onAddImages,
  onSelectImage,
  onRemoveImage,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processFiles = (files: File[]) => {
    // 只处理图片文件
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newImages: FormImage[] = imageFiles.map((file) => ({
      id: `image-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      selected: true,
    }));

    onAddImages(newImages);

    // 重置input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium">
            Drag and drop image files or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: JPG, PNG, JPEG, WEBP
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Uploaded Images ({images.length})
            </h3>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => {
                const allSelected = images.every((img) => img.selected);
                images.forEach((img) => onSelectImage(img.id, !allSelected));
              }}
            >
              {images.every((img) => img.selected)
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image) => (
              <div
                key={image.id}
                className={cn(
                  "relative aspect-square rounded-md overflow-hidden border group",
                  image.selected ? "border-primary" : "border-gray-200"
                )}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(image.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <button
                    className="bg-white rounded-full p-2 shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectImage(image.id, !image.selected);
                    }}
                  >
                    {image.selected ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {image.selected && (
                  <div className="absolute top-2 left-2 bg-primary text-white rounded-full p-1 shadow">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
