"use client";

import { Inventory } from "@/src/features/inventory/types/types";
import { CreateProductRequest } from "@/src/features/product/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PackagePlus, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ProductFormValues, productSchema } from "../schemas/schemas";
import { Input } from "@/src/components/ui/input";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductRequest) => void;
  inventories: Inventory[];
  isSubmitting?: boolean;
}

const TEXT_FIELDS: {
  name: keyof ProductFormValues;
  label: string;
  placeholder: string;
  type?: string;
  half?: boolean;
}[] = [
  {
    name: "reference",
    label: "Reference",
    placeholder: "SKU-001",
    half: false,
  },
  {
    name: "price",
    label: "Price",
    placeholder: "0.00",
    type: "number",
    half: false,
  },

  {
    name: "width",
    label: "Width (cm)",
    placeholder: "0",
    type: "number",
    half: true,
  },
  {
    name: "height",
    label: "Height (cm)",
    placeholder: "0",
    type: "number",
    half: true,
  },
  {
    name: "thumbnail",
    label: "Thumbnail URL",
    placeholder: "https://…",
    half: false,
  },
  { name: "image", label: "Image URL", placeholder: "https://…", half: false },
  {
    name: "description",
    label: "Description",
    placeholder: "Product description…",
    half: false,
  },
];

export function AddProductModal({
  open,
  onClose,
  onSubmit,
  inventories,
  isSubmitting = false,
}: AddProductModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      reference: "",
      inventory_id: undefined,
      price: undefined,
      width: undefined,
      height: undefined,
      thumbnail: "",
      image: "",
      description: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (open) window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const onFormSubmit = (values: ProductFormValues) => {
    console.log(values);
    onSubmit({ data: values });
    handleClose();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && handleClose()}
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0F0F1C] shadow-2xl shadow-black/60 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.07] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <PackagePlus size={15} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-white/90">
                Add Product
              </h2>
              <p className="text-[11px] text-white/30 mt-0.5">
                Fill in the details below
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/6 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="overflow-y-auto px-6 py-5 flex-1">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div className="col-span-6">
                <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                  Category
                </label>
                <select
                  {...register("inventory_id", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  className={`w-full bg-white/[0.04] border rounded-lg px-3 py-2 text-xs text-white/80 scheme-dark
                    focus:outline-none focus:bg-white/[0.06] transition-colors appearance-none
                    ${
                      errors.inventory_id
                        ? "border-red-500/40 focus:border-red-500/60"
                        : "border-white/[0.07] focus:border-violet-500/50"
                    }`}
                >
                  <option value="">Select a category…</option>
                  {inventories.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name ?? `Category #${inv.id}`}
                    </option>
                  ))}
                </select>
                {errors.inventory_id && (
                  <p className="mt-1 text-[10px] text-red-400/80">
                    {errors.inventory_id.message}
                  </p>
                )}
              </div>

              {TEXT_FIELDS.map((filed) => (
                <div
                  key={filed.name}
                  className={filed.half ? "col-span-3" : "col-span-6"}
                >
                  <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                    {filed.label}
                  </label>
                  {filed.name === "description" ? (
                    <textarea
                      {...register(filed.name)}
                      placeholder={filed.placeholder}
                      rows={3}
                      className={`w-full bg-white/[0.04] border rounded-lg px-3 py-2 text-xs text-white/80 placeholder-white/15
                        focus:outline-none focus:bg-white/[0.06] transition-colors resize-none
                        ${
                          errors[filed.name]
                            ? "border-red-500/40 focus:border-red-500/60"
                            : "border-white/[0.07] focus:border-violet-500/50"
                        }`}
                    />
                  ) : (
                    <Input
                      {...register(filed.name, {
                        setValueAs: (v) =>
                          filed.type === "number"
                            ? v === ""
                              ? undefined
                              : Number(v)
                            : v,
                      })}
                      type={filed.type}
                      placeholder={filed.placeholder}
                      className={`w-full bg-white/[0.04] border rounded-lg px-3 py-2 text-xs text-white/80 placeholder-white/15
                        focus:outline-none focus:bg-white/[0.06] transition-colors
                        ${
                          errors[filed.name]
                            ? "border-red-500/40 focus:border-red-500/60"
                            : "border-white/[0.07] focus:border-violet-500/50"
                        }`}
                    />
                  )}
                  {errors[filed.name] && (
                    <p className="mt-1 text-[10px] text-red-400/80">
                      {errors[filed.name]?.message as string}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-white/[0.07] shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white/40 hover:text-white/70 border border-white/[0.07] hover:border-white/20 hover:bg-white/4 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium shadow-lg shadow-violet-500/20"
            >
              {isSubmitting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <PackagePlus size={13} />
              )}
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
