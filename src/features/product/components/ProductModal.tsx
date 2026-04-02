"use client";

import { SelectField } from "@/src/components/SelectField";
import { TextFieldArea } from "@/src/components/TextFieldArea";
import { TextFieldInput } from "@/src/components/TextFieldInput";
import { TextFieldNumber } from "@/src/components/TextFieldNumber";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

import { Inventory } from "@/src/features/inventory/types";
import {
  productSchema,
  ProductFormValues,
} from "@/src/features/product/schemas";
import {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from "@/src/features/product/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PackagePlus, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ImageUploadField } from "@/src/components/ImageUploadField";

type AddMode = {
  mode: "add";
  onSubmit: (data: CreateProductRequest) => void;
  defaultValues?: undefined;
  productId?: undefined;
};

type EditMode = {
  mode: "edit";
  onSubmit: (data: UpdateProductRequest) => void;
  defaultValues: Partial<Product>;
  productId: number;
};

type Props = (AddMode | EditMode) & {
  open: boolean;
  onClose: () => void;
  inventories: Inventory[];
  isSubmitting?: boolean;
};

const EMPTY_VALUES: ProductFormValues = {
  reference: "",
  inventory_id: 0,
  price: undefined,
  width: undefined,
  height: undefined,
  thumbnailUrl: "",
  thumbnailPath: "",
  imageUrl: "",
  imagePath: "",
  description: "",
};

export function ProductModal(props: Props) {
  const { open, onClose, inventories, isSubmitting = false, mode } = props;
  const isEdit = mode === "edit";
  const [isUploading, setIsUploading] = useState(false);

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
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
        reference: d.reference ?? "",
        inventory_id: d.inventory_id ?? undefined,
        price: d.price ?? 0,
        width: d.width ?? undefined,
        height: d.height ?? undefined,
        thumbnailUrl: d.thumbnail ?? "",
        thumbnailPath: "",
        imageUrl: d.image ?? "",
        imagePath: "",
        description: d.description ?? "",
      });
    } else {
      reset(EMPTY_VALUES);
    }
  }, [open]);

  const handleClose = () => {
    reset(EMPTY_VALUES);
    onClose();
  };

  const handleUploading = (uploading: boolean) => {
    setIsUploading(uploading);
  };

  const onFormSubmit = (values: ProductFormValues) => {
    const payload = {
      reference: values.reference,
      inventory_id: values.inventory_id,
      price: values.price,
      width: values.width,
      height: values.height,
      thumbnail: values.thumbnailUrl,
      image: values.imageUrl,
      description: values.description,
    };

    if (isEdit) {
      props.onSubmit({ id: props.productId, data: payload });
    } else {
      props.onSubmit({ data: payload });
    }
    handleClose();
  };

  const inventoryOptions = inventories.map((inv) => ({
    label: inv.name ?? `Category #${inv.id}`,
    value: inv.id,
  }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="
          w-full max-w-lg p-0 gap-0 border border-white/[0.08] bg-overlay
          rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[90vh]
          [&>button]:text-white/25 [&>button]:hover:text-white/60 [&>button]:hover:bg-white/6 no-scrollbar
        "
      >
        <DialogHeader className="flex-row items-center gap-3 px-6 pt-5 pb-4 border-b border-white/[0.07] shrink-0 space-y-0">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
            {isEdit ? (
              <Pencil size={15} className="text-violet-400" />
            ) : (
              <PackagePlus size={15} className="text-violet-400" />
            )}
          </div>
          <div>
            <DialogTitle className="text-sm font-semibold tracking-tight text-white/90">
              {isEdit ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogDescription className="text-[11px] text-white/30 mt-0.5">
              {isEdit
                ? "Update the product details"
                : "Fill in the details below"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="overflow-y-auto px-6 py-5 flex-1">
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="col-span-2">
                  <SelectField
                    name="inventory_id"
                    label="Category"
                    options={inventoryOptions}
                    valueType="number"
                  />
                </div>

                <div className="col-span-2">
                  <TextFieldInput
                    name="reference"
                    label="Reference"
                    placeholder="SKU-001"
                  />
                </div>

                <div className="col-span-2">
                  <TextFieldNumber
                    name="price"
                    label="Price"
                    placeholder="0.00"
                  />
                </div>

                <div className="col-span-1">
                  <TextFieldNumber
                    name="width"
                    label="Width (cm)"
                    placeholder="0"
                  />
                </div>
                <div className="col-span-1">
                  <TextFieldNumber
                    name="height"
                    label="Height (cm)"
                    placeholder="0"
                  />
                </div>

                <div className="col-span-2">
                  <ImageUploadField
                    name="thumbnailUrl"
                    pathName="thumbnailPath"
                    label="Thumbnail"
                    handleUploading={handleUploading}
                  />
                </div>

                <div className="col-span-2">
                  <ImageUploadField
                    name="imageUrl"
                    pathName="imagePath"
                    label="Image"
                    handleUploading={handleUploading}
                  />
                </div>

                <div className="col-span-2">
                  <TextFieldArea
                    name="description"
                    label="Description"
                    placeholder="Product description…"
                    rows={3}
                  />
                </div>
              </div>
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
                  <PackagePlus size={13} />
                )}
                {isEdit ? "Save Changes" : "Add Product"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
