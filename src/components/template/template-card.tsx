"use client";

import { Template } from "@/lib/template-supabase";
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
        "cursor-pointer transition-all hover:shadow-md relative overflow-hidden",
        isSelected
          ? "border-blue-400 shadow-sm ring-1 ring-blue-200"
          : "border-gray-200 hover:border-blue-200"
      )}
      onClick={onClick}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-0 right-0 p-2 bg-blue-600 text-white rounded-bl-md">
          <CheckSquare className="h-4 w-4" />
        </div>
      )}

      <CardContent className="p-4 pt-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "p-2.5 rounded-md",
              isSelected
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-600"
            )}
          >
            <FileJson className="h-5 w-5" />
          </div>

          <div>
            <h3
              className={cn(
                "font-medium",
                isSelected ? "text-blue-700" : "text-gray-800"
              )}
            >
              {template.name}
            </h3>
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
                  className={cn(
                    "border px-2 py-1 rounded text-xs truncate transition-colors",
                    isSelected
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-200"
                  )}
                >
                  {field.name}
                </div>
              ))}
              {template.fields.length > 4 && (
                <div
                  className={cn(
                    "border border-dashed px-2 py-1 rounded text-xs flex items-center justify-center",
                    isSelected
                      ? "border-blue-300 text-blue-600 bg-blue-50/50"
                      : "border-gray-300 text-gray-500 hover:border-blue-200 hover:text-blue-500"
                  )}
                >
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
