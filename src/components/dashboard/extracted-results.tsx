"use client";

import { useState } from "react";
import {
  Copy,
  CheckCircle2,
  Download,
  Save,
  Edit,
  X,
  FileSpreadsheet,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Template = {
  id: string;
  name: string;
  fields: { name: string; description?: string }[];
};

type ExtractionResult = {
  imageId: string;
  imageName: string;
  fields: Record<string, string>;
  error?: string;
  isAllFieldsExtraction?: boolean; // Flag for all fields extraction
};

type ExtractedResultsProps = {
  results: ExtractionResult[];
  template: Template | null;
  isAllFieldsExtraction?: boolean; // Flag indicating if this is all fields extraction
  onUpdateResults?: (results: ExtractionResult[]) => void;
};

export function ExtractedResults({
  results,
  template,
  isAllFieldsExtraction = false,
  onUpdateResults,
}: ExtractedResultsProps) {
  const [activeTab, setActiveTab] = useState("table");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{
    resultId: string;
    fieldName: string;
  } | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Get field names from results if using all fields extraction
  // Otherwise, use the template fields
  const getFieldNames = (): string[] => {
    if (isAllFieldsExtraction && results.length > 0) {
      // Collect all unique field names from all results
      const fieldNames = new Set<string>();
      results.forEach((result) => {
        Object.keys(result.fields).forEach((field) => fieldNames.add(field));
      });
      return Array.from(fieldNames);
    } else if (template?.fields) {
      return template.fields.map((f) => f.name);
    }
    return [];
  };

  const fieldNames = getFieldNames();

  // Handler for copying field content
  const handleCopyField = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handler for exporting to CSV
  const handleExportCSV = () => {
    if (!results.length) return;

    const fields = fieldNames;
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
      `extraction_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler for exporting to Excel
  const handleExportExcel = async () => {
    if (!results.length) return;

    setIsExporting(true);

    try {
      // Dynamic import of xlsx library
      const XLSX = await import("xlsx");

      const fields = fieldNames;
      const headers = ["Image Name", ...fields];

      // Prepare data for Excel
      const excelData = [
        headers,
        ...results.map((result) => {
          return [
            result.imageName,
            ...fields.map((field) => result.fields[field] || "N/A"),
          ];
        }),
      ];

      // Create a worksheet
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Style the header row (bold)
      for (let i = 0; i < headers.length; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
        if (!ws[cellRef]) ws[cellRef] = {};
        ws[cellRef].s = { font: { bold: true } };
      }

      // Set column widths (auto-size based on content)
      const colWidths = headers.map((h, i) => {
        // Start with header width
        let maxWidth = h.length;

        // Check all rows for this column
        results.forEach((result) => {
          const content =
            i === 0 ? result.imageName : result.fields[fields[i - 1]] || "N/A";
          if (content.length > maxWidth) maxWidth = content.length;
        });

        // Add some padding and convert to Excel width
        return { wch: maxWidth + 2 };
      });

      ws["!cols"] = colWidths;

      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Extraction Results");

      // Generate file name
      const fileName = isAllFieldsExtraction
        ? `all_fields_extraction_${new Date().toISOString().split("T")[0]}.xlsx`
        : `${template?.name || "extraction"}_${
            new Date().toISOString().split("T")[0]
          }.xlsx`;

      // Write the file and trigger download
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Excel export error:", error);
    } finally {
      setIsExporting(false);
    }
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              <span>CSV Format (.csv)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              <span>Excel Format (.xlsx)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isAllFieldsExtraction && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-700 text-sm">
          <p>
            All fields detected automatically. The AI has identified{" "}
            {fieldNames.length} fields from your forms.
          </p>
        </div>
      )}

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="table" className="mt-0">
          <div className="border rounded-md overflow-auto shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="w-[200px] font-medium text-gray-700">
                    Image
                  </TableHead>
                  {fieldNames.map((fieldName) => (
                    <TableHead
                      key={fieldName}
                      className="font-medium text-gray-700"
                    >
                      {fieldName}
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
                    {fieldNames.map((fieldName) => (
                      <TableCell key={fieldName} className="relative">
                        {editingCell?.resultId === result.imageId &&
                        editingCell?.fieldName === fieldName ? (
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
                              {result.fields[fieldName] || "N/A"}
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
                                    fieldName,
                                    result.fields[fieldName] || ""
                                  )
                                }
                              >
                                <Edit className="h-3 w-3 text-gray-500" />
                              </button>
                              <button
                                className="p-1 rounded-full hover:bg-blue-100 hover:text-blue-600"
                                onClick={() =>
                                  handleCopyField(
                                    result.fields[fieldName] || "",
                                    `${result.imageId}-${fieldName}`
                                  )
                                }
                              >
                                {copiedField ===
                                `${result.imageId}-${fieldName}` ? (
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
