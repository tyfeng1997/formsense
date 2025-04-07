"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Settings, Wand2 } from "lucide-react";

interface ExtractionDialogProps {
  open: boolean;
  onClose: () => void;
  onAutomaticExtract: () => void;
  onCreateTemplate: () => void;
  selectedCount: number;
}

export function ExtractionDialog({
  open,
  onClose,
  onAutomaticExtract,
  onCreateTemplate,
  selectedCount,
}: ExtractionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Extract Data from Images</DialogTitle>
          <DialogDescription>
            Choose how to extract data from {selectedCount} selected image
            {selectedCount !== 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <button
            onClick={onAutomaticExtract}
            className="flex items-start gap-4 p-4 rounded-lg border hover:border-primary transition-colors hover:bg-primary/5"
          >
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Wand2 className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Automatic Extraction</h3>
              <p className="text-sm text-gray-500 mt-1">
                Automatically extract all detectable fields from the selected
                images.
              </p>
            </div>
          </button>

          <button
            onClick={onCreateTemplate}
            className="flex items-start gap-4 p-4 rounded-lg border hover:border-primary transition-colors hover:bg-primary/5"
          >
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Settings className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Create Extraction Template</h3>
              <p className="text-sm text-gray-500 mt-1">
                Define specific fields to extract based on your requirements.
              </p>
            </div>
          </button>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
