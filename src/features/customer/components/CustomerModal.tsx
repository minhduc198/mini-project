"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";

import { TextFieldInput } from "@/src/components/TextFieldInput";
import { TextFieldArea } from "@/src/components/TextFieldArea";

import { addCustomerSchema, AddCustomerFormValues } from "../schemas/schemas";

import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
  Customer,
} from "../types/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus, Pencil } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import { format } from "date-fns";
import { SelectField } from "@/src/components/SelectField";
import { GROUP_LABELS } from "../constants";

type AddMode = {
  mode: "add";
  onSubmit: (data: CreateCustomerRequest) => void;
  defaultValues?: undefined;
  customerId?: undefined;
};

type EditMode = {
  mode: "edit";
  onSubmit: (data: UpdateCustomerRequest) => void;
  defaultValues: Partial<Customer>;
  customerId: number;
};

type Props = (AddMode | EditMode) & {
  open: boolean;
  onClose: () => void;
  isSubmitting?: boolean;
};

const EMPTY_VALUES: AddCustomerFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  address: "",
  avatar: "",
  city: "",
  zipcode: "",
  birthday: "",
  groups: undefined,
};

export function CustomerModal(props: Props) {
  const { open, onClose, isSubmitting = false, mode } = props;
  const isEdit = mode === "edit";

  const methods = useForm<AddCustomerFormValues>({
    resolver: zodResolver(addCustomerSchema),
  });

  const { handleSubmit, reset, setValue, watch } = methods;

  const birthday = watch("birthday");

  useEffect(() => {
    if (!open) return;

    if (isEdit && props.defaultValues) {
      const d = props.defaultValues;

      reset({
        first_name: d.first_name ?? "",
        last_name: d.last_name ?? "",
        email: d.email ?? "",
        address: d.address ?? "",
        avatar: d.avatar ?? "",
        city: d.city ?? "",
        zipcode: d.zipcode ?? "",
        birthday: d.birthday ?? "",
        groups: d.groups?.[0] ?? undefined,
      });
    } else {
      reset(EMPTY_VALUES);
    }
  }, [open]);

  const handleClose = () => {
    reset(EMPTY_VALUES);
    onClose();
  };

  const onFormSubmit = (values: AddCustomerFormValues) => {
    const payload = {
      ...values,
      groups: values.groups ? [values.groups] : [],
    };

    if (isEdit) {
      props.onSubmit({
        id: props.customerId,
        data: payload,
      });
    } else {
      props.onSubmit({
        data: payload,
      });
    }

    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="
          w-full max-w-lg p-0 gap-0 border border-white/[0.08] bg-overlay
          rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[90vh]
          [&>button]:text-white/25 [&>button]:hover:text-white/60 [&>button]:hover:bg-white/6
        "
      >
        <DialogHeader className="flex-row items-center gap-3 px-6 pt-5 pb-4 border-b border-white/[0.07] shrink-0 space-y-0">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
            {isEdit ? (
              <Pencil size={15} className="text-violet-400" />
            ) : (
              <UserPlus size={15} className="text-violet-400" />
            )}
          </div>

          <div>
            <DialogTitle className="text-sm font-semibold text-white/90">
              {isEdit ? "Edit Customer" : "Add Customer"}
            </DialogTitle>

            <DialogDescription className="text-[11px] text-white/30 mt-0.5">
              {isEdit
                ? "Update customer information"
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
              <div className="grid grid-cols-2 gap-4">
                <TextFieldInput name="first_name" label="First Name" />
                <TextFieldInput name="last_name" label="Last Name" />

                <div className="col-span-2">
                  <TextFieldInput name="email" label="Email" />
                </div>

                <div className="col-span-2">
                  <TextFieldArea name="address" label="Address" rows={2} />
                </div>

                <TextFieldInput name="city" label="City" />
                <TextFieldInput name="zipcode" label="Zip Code" />

                <div className="col-span-2">
                  <TextFieldInput
                    name="avatar"
                    label="Avatar URL"
                    placeholder="https://..."
                  />
                </div>

                <div className="col-span-2">
                  <SelectField
                    name="groups"
                    label="Group"
                    placeholder="Select group"
                    options={[
                      { label: GROUP_LABELS.regular, value: "regular" },
                      {
                        label: GROUP_LABELS.ordered_once,
                        value: "ordered_once",
                      },
                      { label: GROUP_LABELS.collector, value: "collector" },
                      { label: GROUP_LABELS.reviewer, value: "reviewer" },
                      { label: GROUP_LABELS.compulsive, value: "compulsive" },
                    ]}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                    Birthday
                  </label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start text-xs bg-white/[0.04] border-white/[0.07] text-white/70 hover:bg-white/[0.06]"
                      >
                        {birthday
                          ? format(new Date(birthday), "dd/MM/yyyy")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0 bg-overlay border-white/[0.08]">
                      <Calendar
                        mode="single"
                        selected={birthday ? new Date(birthday) : undefined}
                        onSelect={(date: any) => {
                          if (date) {
                            setValue("birthday", date.toISOString());
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
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
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-xs font-medium shadow-lg shadow-violet-500/20"
              >
                {isSubmitting ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : isEdit ? (
                  <Pencil size={13} />
                ) : (
                  <UserPlus size={13} />
                )}

                {isEdit ? "Save Changes" : "Add Customer"}
              </button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
