"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function InventoryDeleteModal({
  open,
  onClose,
  onConfirm,
  title = "Delete item",
  description = "This action cannot be undone.",
  isLoading = false,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="
          w-full max-w-sm p-0 gap-0 border border-white/[0.08] bg-overlay
          rounded-2xl shadow-2xl shadow-black/60
          [&>button]:text-white/25 [&>button]:hover:text-white/60
        "
      >
        <DialogHeader className="flex-row items-center gap-3 px-6 pt-5 pb-4 border-b border-white/[0.07] space-y-0">
          <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center">
            <Trash2 size={15} className="text-rose-400" />
          </div>
          <div>
            <DialogTitle className="text-sm font-semibold text-white/90">
              {title}
            </DialogTitle>
            <DialogDescription className="text-[11px] text-white/30 mt-0.5">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-white/40 hover:text-white/70 border border-white/[0.07] hover:border-white/20 hover:bg-white/4 transition h-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-xs font-medium shadow-lg shadow-rose-500/20 disabled:opacity-50 text-white h-auto"
          >
            {isLoading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
