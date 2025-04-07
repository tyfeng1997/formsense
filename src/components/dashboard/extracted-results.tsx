// components/dashboard/extracted-results.tsx
"use client";

import { useState } from "react";
import { Copy, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

type ExtractedResultsProps = {
  results: ExtractionResult[];
  template: Template | null;
};

export function ExtractedResults({ results, template }: ExtractedResultsProps) {
  const [activeTab, setActiveTab] = useState("table");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopyField = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExportCSV = () => {
    if (!results.length || !template) return;

    const fields = template.fields.map((f) => f.name);
    const headers = ["Image Name", ...fields];

    const csvContent = [
      headers.join(","),
      ...results.map((result) => {
        const values = fields.map((field) => {
          // Escape commas and quotes
          const value = result.fields[field] || "N/A";
          return `"${value.replace(/"/g, '""')}"`;
        });
        return [result.imageName, ...values].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${template.name}_extraction_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed rounded-md">
        <p className="text-gray-500">
          Extracted data will appear here after processing
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-[200px]"
        >
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="table" className="mt-0">
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Image</TableHead>
                  {template?.fields.map((field) => (
                    <TableHead key={field.name}>{field.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.imageId}>
                    <TableCell className="font-medium">
                      {result.imageName}
                    </TableCell>
                    {template?.fields.map((field) => (
                      <TableCell key={field.name} className="relative">
                        <div className="flex items-center space-x-1">
                          <span>{result.fields[field.name] || "N/A"}</span>
                          <button
                            className="p-1 rounded-full hover:bg-gray-100"
                            onClick={() =>
                              handleCopyField(
                                result.fields[field.name] || "",
                                `${result.imageId}-${field.name}`
                              )
                            }
                          >
                            {copiedField ===
                            `${result.imageId}-${field.name}` ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="json" className="mt-0">
          <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px]">
            <pre className="text-xs">{JSON.stringify(results, null, 2)}</pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
