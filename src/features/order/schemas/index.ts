import { z } from "zod";

export const orderSchema = z.object({
  customer_id: z.coerce.number().min(1, "Customer is required"),

  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Max 200 characters")
    .or(z.literal("")),

  tax_rate: z.coerce.number().min(0, "Min 0%").max(100, "Max 100%").optional(),

  delivery_fees: z.coerce.number().min(0, "Must be greater than 0").optional(),

  basket: z
    .array(
      z.object({
        product_id: z.coerce.number().min(1, "Product is required"),

        quantity: z.coerce.number().int("Must be integer").min(1, "Min 1"),

        price: z.coerce.number().min(0, "Must be greater than 0"),
      }),
    )
    .min(1, "At least one item is required"),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
