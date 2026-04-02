"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

import {
  CreateInventoryRequest,
  Inventory,
  UpdateInventoryRequest,
} from "@/src/features/inventory/types";
import { inventorySchema, InventoryFormValues } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layers, Loader2, Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TextFieldInput } from "@/src/components/TextFieldInput";
import { TextFieldNumber } from "@/src/components/TextFieldNumber";
import { ImageUploadField } from "@/src/components/ImageUploadField";

type AddMode = {
  mode: "add";
  onSubmit: (data: CreateInventoryRequest) => void;
  defaultValues?: undefined;
};

type EditMode = {
  mode: "edit";
  onSubmit: (data: UpdateInventoryRequest) => void;
  defaultValues: Partial<Inventory>;
  inventoryId: number;
};

type Props = (AddMode | EditMode) & {
  open: boolean;
  onClose: () => void;
  isSubmitting?: boolean;
};

const EMPTY_VALUES: InventoryFormValues = {
  name: "",
  imageUrl: "",
  imagePath: "",
  stock: undefined,
};

export function InventoryModal(props: Props) {
  const { open, onClose, isSubmitting = false, mode } = props;
  const isEdit = mode === "edit";
  const [isUploading, setIsUploading] = useState(false);

  const methods = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: EMPTY_VALUES,
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (!open) return;
    if (isEdit && props.defaultValues) {
      const d = props.defaultValues;
      reset({
        name: d.name ?? "",
        imageUrl: d.image ?? "",
        imagePath: "",
        stock: d.stock ?? undefined,
      });
    } else {
      reset(EMPTY_VALUES);
    }
  }, [open]);

  const handleClose = () => {
    reset(EMPTY_VALUES);
    onClose();
  };

  const onFormSubmit = (values: InventoryFormValues) => {
    const payload = {
      name: values.name,
      image: values.imageUrl,
      stock: values.stock,
    };

    if (isEdit) {
      props.onSubmit({ id: props.inventoryId, data: payload });
    } else {
      props.onSubmit({ data: payload });
    }
    handleClose();
  };

  const handleUploading = (uploading: boolean) => {
    setIsUploading(uploading);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="
          w-full max-w-md p-0 gap-0 border border-white/[0.08] bg-overlay
          rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[90vh]
          [&>button]:text-white/25 [&>button]:hover:text-white/60 [&>button]:hover:bg-white/6
        "
      >
        <DialogHeader className="flex-row items-center gap-3 px-6 pt-5 pb-4 border-b border-white/[0.07] shrink-0 space-y-0">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
            {isEdit ? (
              <Pencil size={15} className="text-violet-400" />
            ) : (
              <Plus size={15} className="text-violet-400" />
            )}
          </div>
          <div>
            <DialogTitle className="text-sm font-semibold tracking-tight text-white/90">
              {isEdit ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription className="text-[11px] text-white/30 mt-0.5">
              {isEdit ? "Update inventory details" : "Add a new category"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="overflow-y-auto px-6 py-5 flex-1 space-y-4">
              <TextFieldInput name="name" label="Name" placeholder="Select" />

              <ImageUploadField
                name="imageUrl"
                pathName="imagePath"
                label="Image"
                handleUploading={handleUploading}
              />

              <TextFieldNumber name="stock" label="Stock" placeholder="0" />
            </div>

            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-white/[0.07] shrink-0">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-white/40 hover:text-white/70 border border-white/[0.07] hover:border-white/20 hover:bg-white/4 transition-colors h-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="ghost"
                disabled={!isDirty || isUploading || isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium shadow-lg shadow-violet-500/20 text-white h-auto"
              >
                {isSubmitting ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : isEdit ? (
                  <Pencil size={13} />
                ) : (
                  <Layers size={13} />
                )}
                {isEdit ? "Save Changes" : "Add Category"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
