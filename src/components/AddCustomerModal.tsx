"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X, UserPlus, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  AddCustomerFormValues,
  addCustomerSchema,
} from "../features/customer/schemas";
import { CreateCustomerRequest } from "../features/customer/types";

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  handleCreateCustomer: (data: CreateCustomerRequest) => void;
}

const FIELDS: {
  name: keyof AddCustomerFormValues;
  label: string;
  placeholder: string;
  type?: string;
  half?: boolean;
}[] = [
  {
    name: "first_name",
    label: "First Name",
    placeholder: "Minh",
    half: true,
  },
  {
    name: "last_name",
    label: "Last Name",
    placeholder: "Duc",
    half: true,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "minhduc@gmail.com",
    type: "email",
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Ha Noi",
  },
  {
    name: "city",
    label: "City",
    placeholder: "Ha Noi",
    half: true,
  },
  {
    name: "zipcode",
    label: "Zip Code",
    placeholder: "10000",
    half: true,
  },
  {
    name: "birthday",
    label: "Birthday",
    placeholder: "",
    type: "date",
    half: true,
  },
  {
    name: "avatar",
    label: "Avatar URL",
    placeholder: "https://…",
    half: true,
  },
];

export function AddCustomerModal({
  open,
  onClose,
  handleCreateCustomer,
}: AddCustomerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCustomerFormValues>({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
      avatar: "",
      city: "",
      zipcode: "",
      birthday: "",
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

  const onSubmit = async (values: AddCustomerFormValues) => {
    await handleCreateCustomer({
      data: values,
    });
    handleClose();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && handleClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0F0F1C] shadow-2xl shadow-black/60 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.07] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <UserPlus size={15} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-white/90">
                Add Customer
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
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="overflow-y-auto px-6 py-5 flex-1">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {FIELDS.map((field) => (
                <div
                  key={field.name}
                  className={field.half ? "col-span-1" : "col-span-2"}
                >
                  <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                    {field.label}
                  </label>
                  <input
                    {...register(field.name)}
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    className={`w-full bg-white/[0.04] border rounded-lg px-3 py-2 text-xs text-white/80 placeholder-white/15
                      focus:outline-none focus:bg-white/[0.06] transition-colors
                      ${
                        errors[field.name]
                          ? "border-red-500/40 focus:border-red-500/60"
                          : "border-white/[0.07] focus:border-violet-500/50"
                      }
                      ${field.type === "date" ? "text-white/50 [color-scheme:dark]" : ""}
                    `}
                  />

                  {errors[field.name] && (
                    <p className="mt-1 text-[10px] text-red-400/80">
                      {errors[field.name]?.message as string}
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
                <UserPlus size={13} />
              )}
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
