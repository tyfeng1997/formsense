"use client";

import { useState } from "react";
import { Copy, CheckCircle2, Download, Save, Edit, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  onUpdateResults?: (results: ExtractionResult[]) => void;
};

export function ExtractedResults({
  results,
  template,
  onUpdateResults,
}: ExtractedResultsProps) {
  const [activeTab, setActiveTab] = useState("table");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{
    resultId: string;
    fieldName: string;
  } | null>(null);
  const [editingValue, setEditingValue] = useState("");

  // Handler for copying field content
  const handleCopyField = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handler for exporting to CSV
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

  // Start editing a cell
  const startEditing = (resultId: string, fieldName: string, value: string) => {
    setEditingCell({ resultId, fieldName });
    setEditingValue(value);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCell(null);
    setEditingValue("");
  };

  // Save edited cell value
  const saveEditing = () => {
    if (!editingCell || !onUpdateResults) return;

    const updatedResults = results.map((result) => {
      if (result.imageId === editingCell.resultId) {
        return {
          ...result,
          fields: {
            ...result.fields,
            [editingCell.fieldName]: editingValue,
          },
        };
      }
      return result;
    });

    onUpdateResults(updatedResults);
    setEditingCell(null);
  };

  // Handle key presses in the edit input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveEditing();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed rounded-md bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-blue-100 p-3">
            <Download className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-gray-700 font-medium">No data extracted yet</p>
          <p className="text-gray-500 text-sm">
            Extracted data will appear here after processing
          </p>
        </div>
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
          <TabsList className="bg-gray-100 border">
            <TabsTrigger
              value="table"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              value="json"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              JSON
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="table" className="mt-0">
          <div className="border rounded-md overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="w-[200px] font-medium text-gray-700">
                    Image
                  </TableHead>
                  {template?.fields.map((field) => (
                    <TableHead
                      key={field.name}
                      className="font-medium text-gray-700"
                    >
                      {field.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow
                    key={result.imageId}
                    className="hover:bg-blue-50/30"
                  >
                    <TableCell className="font-medium text-gray-800">
                      {result.imageName}
                    </TableCell>
                    {template?.fields.map((field) => (
                      <TableCell key={field.name} className="relative">
                        {editingCell?.resultId === result.imageId &&
                        editingCell?.fieldName === field.name ? (
                          <div className="flex items-center">
                            <Input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyDown={handleKeyDown}
                              autoFocus
                              className="h-8 w-full border-blue-300 focus:ring-blue-300 focus:border-blue-300"
                            />
                            <div className="flex items-center ml-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-green-600 hover:bg-green-50"
                                onClick={saveEditing}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-600 hover:bg-red-50"
                                onClick={cancelEditing}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group">
                            <span className="text-gray-700">
                              {result.fields[field.name] || "N/A"}
                            </span>
                            <div className="flex items-center invisible group-hover:visible">
                              <button
                                className={cn(
                                  "p-1 rounded-full hover:bg-blue-100 hover:text-blue-600",
                                  "mr-1"
                                )}
                                onClick={() =>
                                  startEditing(
                                    result.imageId,
                                    field.name,
                                    result.fields[field.name] || ""
                                  )
                                }
                              >
                                <Edit className="h-3 w-3 text-gray-500" />
                              </button>
                              <button
                                className="p-1 rounded-full hover:bg-blue-100 hover:text-blue-600"
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
                                  <Copy className="h-3 w-3 text-gray-500" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="json" className="mt-0">
          <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px] border shadow-inner">
            <pre className="text-xs text-gray-800">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
