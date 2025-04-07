"use client";

import { Template } from "@/lib/template-storage";
import { Card, CardContent } from "@/components/ui/card";
import { FileJson, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface TemplateCardProps {
  template: Template;
  isSelected?: boolean;
  onClick?: () => void;
}

export function TemplateCard({
  template,
  isSelected = false,
  onClick,
}: TemplateCardProps) {
  // Format the template's updated time
  const updatedTime = formatDistanceToNow(new Date(template.updatedAt), {
    addSuffix: true,
  });

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden",
        isSelected && "border-primary shadow-sm"
      )}
      onClick={onClick}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-0 right-0 p-2 bg-primary text-white rounded-bl-md">
          <CheckSquare className="h-4 w-4" />
        </div>
      )}

      <CardContent className="p-4 pt-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "p-2 rounded-md",
              isSelected
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary"
            )}
          >
            <FileJson className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-medium">{template.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {template.fields.length} fields • Updated {updatedTime}
            </p>
          </div>
        </div>

        {/* Field previews */}
        {template.fields.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <div className="grid grid-cols-2 gap-2">
              {template.fields.slice(0, 4).map((field) => (
                <div
                  key={field.id}
                  className="border bg-gray-50 px-2 py-1 rounded text-xs truncate"
                >
                  {field.name}
                </div>
              ))}
              {template.fields.length > 4 && (
                <div className="border border-dashed px-2 py-1 rounded text-xs text-gray-500 flex items-center justify-center">
                  +{template.fields.length - 4} more
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
