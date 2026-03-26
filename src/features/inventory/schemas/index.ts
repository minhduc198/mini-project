import { z } from "zod";

export const inventorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Invalid URL").optional().or(z.literal("")),
  stock: z.number().min(0, "Stock must be >= 0").optional(),
});

export type InventoryFormValues = z.infer<typeof inventorySchema>;
