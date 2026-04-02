/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  SearchableOption,
  SearchableSelect,
  SearchableSelectField,
} from "@/src/components/SearchableSelectField";
import { TextFieldInput } from "@/src/components/TextFieldInput";
import { TextFieldNumber } from "@/src/components/TextFieldNumber";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Customer } from "@/src/features/customer/types";
import { Product } from "@/src/features/product/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { OrderFormValues, orderSchema } from "../schemas";
import { CreateOrderRequest, Order, UpdateOrderRequest } from "../types";

type AddMode = {
  mode: "add";
  onSubmit: (data: CreateOrderRequest) => void;
  defaultValues?: undefined;
  orderId?: undefined;
};

type EditMode = {
  mode: "edit";
  onSubmit: (data: UpdateOrderRequest) => void;
  defaultValues: Partial<Order>;
  orderId: number;
};

type Props = (AddMode | EditMode) & {
  open: boolean;
  onClose: () => void;
  isSubmitting?: boolean;
  customers: Customer[];
  products: Product[];
};

const EMPTY_ITEM = { product_id: 0, quantity: 1, price: 0 };

const EMPTY_VALUES: OrderFormValues = {
  customer_id: 0,
  address: "",
  tax_rate: 0,
  delivery_fees: 0,
  basket: [EMPTY_ITEM],
};

export function OrderModal(props: Props) {
  const {
    open,
    onClose,
    isSubmitting = false,
    mode,
    customers,
    products,
  } = props;
  const isEdit = mode === "edit";

  const methods = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema) as any,
    defaultValues: EMPTY_VALUES,
  });

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { isDirty },
  } = methods;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "basket",
  });

  useEffect(() => {
    if (!open) return;

    if (isEdit && props.defaultValues) {
      const d = props.defaultValues;

      setValue("customer_id", d.customer_id ?? 0);
      setValue("address", d.address ?? "");
      setValue("tax_rate", d.tax_rate ?? 0);
      setValue("delivery_fees", d.delivery_fees ?? 0);

      const basketItems =
        d.basket?.length && d.basket.some((b: any) => b.product_id)
          ? d.basket.map((b: any) => ({
              product_id: b.product_id ?? 0,
              quantity: b.quantity ?? 1,
              price: b.price ?? 0,
            }))
          : [EMPTY_ITEM];

      replace(basketItems);
    } else {
      reset(EMPTY_VALUES);
      replace([EMPTY_ITEM]);
    }
  }, [open]);

  const handleClose = () => {
    reset(EMPTY_VALUES);
    replace([EMPTY_ITEM]);
    onClose();
  };

  const buildBasket = (basket: any) =>
    basket
      .filter((i: any) => i.product_id && i.product_id !== 0)
      .map((i: any) => ({
        product_id: Number(i.product_id),
        quantity: Number(i.quantity) || 1,
        price: Number(i.price) || 0,
      }));

  const onFormSubmit = (values: OrderFormValues) => {
    const basket = buildBasket(values.basket);

    if (!basket.length) return;

    const payload = {
      customer_id: Number(values.customer_id),
      address: values.address,
      tax_rate: Number(values.tax_rate) || 0,
      delivery_fees: Number(values.delivery_fees) || 0,
      basket,
    };

    if (isEdit) {
      props.onSubmit({ id: props.orderId, data: payload as any });
    } else {
      props.onSubmit(payload as any);
    }

    handleClose();
  };

  const customerOptions: SearchableOption[] = customers.map((c) => ({
    value: c.id,
    label: `${c.first_name} ${c.last_name}`,
    sub: c.email,
    avatar: c.avatar,
  }));

  const productOptions: SearchableOption[] = products.map((p) => ({
    value: p.id,
    label: p.reference,
    sub: p.description ?? "",
    avatar: p.thumbnail,
  }));

  const getProductPrice = (productId: number): number => {
    const product = products.find((p) => p.id === productId);
    return product?.price ?? 0;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="
          w-full max-w-xl p-0 gap-0 border border-white/[0.08] bg-[#0F0F1C]
          rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[90vh]
          [&>button]:text-white/25 [&>button]:hover:text-white/60 [&>button]:hover:bg-white/6 no-scrollbar
        "
      >
        <DialogHeader className="flex-row items-center gap-3 px-6 pt-5 pb-4 border-b border-white/[0.07] space-y-0 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
            {isEdit ? (
              <Pencil size={15} className="text-violet-400" />
            ) : (
              <ShoppingCart size={15} className="text-violet-400" />
            )}
          </div>
          <div>
            <DialogTitle className="text-sm font-semibold tracking-tight text-white/90">
              {isEdit ? "Edit Order" : "Create Order"}
            </DialogTitle>
            <DialogDescription className="text-[11px] text-white/30 mt-0.5">
              {isEdit ? "Update order details" : "Fill in the order details"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="overflow-y-auto px-6 py-5 flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="col-span-2">
                  <SearchableSelectField
                    name="customer_id"
                    label="Customer"
                    options={customerOptions}
                    placeholder="Search customer…"
                  />
                </div>
                <div className="col-span-2">
                  <TextFieldInput
                    name="address"
                    label="Delivery Address"
                    placeholder="123 Main St…"
                  />
                </div>
                <div className="col-span-1">
                  <TextFieldNumber
                    name="delivery_fees"
                    label="Delivery Fees"
                    placeholder="0"
                  />
                </div>
                <div className="col-span-1">
                  <TextFieldNumber
                    name="tax_rate"
                    label="Tax Rate (%)"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
                    Basket Items
                  </span>
                  <Button
                    type="button"
                    onClick={() => append(EMPTY_ITEM)}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/20 transition-colors"
                  >
                    <Plus size={11} /> Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/25 uppercase tracking-wider">
                          Item {index + 1}
                        </span>
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                          Product
                        </label>
                        <Controller
                          name={`basket.${index}.product_id`}
                          control={control}
                          render={({ field: f, fieldState }) => (
                            <div>
                              <SearchableSelect
                                options={productOptions}
                                value={f.value || null}
                                onChange={(v) => {
                                  const pid = Number(v) || 0;
                                  f.onChange(pid);

                                  if (pid) {
                                    setValue(
                                      `basket.${index}.price`,
                                      getProductPrice(pid),
                                    );
                                  }
                                }}
                                placeholder="Search product…"
                              />
                              {fieldState.error && (
                                <p className="mt-1 text-[10px] text-red-400/80">
                                  {fieldState.error.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <TextFieldNumber
                          name={`basket.${index}.quantity`}
                          label="Quantity"
                          placeholder="1"
                        />

                        <TextFieldNumber
                          name={`basket.${index}.price`}
                          label="Price"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  ))}
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
                disabled={!isDirty || isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium shadow-lg shadow-violet-500/20 text-white h-auto"
              >
                {isSubmitting ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : isEdit ? (
                  <Pencil size={13} />
                ) : (
                  <ShoppingCart size={13} />
                )}
                {isEdit ? "Save Changes" : "Create Order"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
