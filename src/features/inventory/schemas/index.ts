import { z } from "zod";

export const inventorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  imagePath: z.string().optional(),
  stock: z.number().min(0, "Stock must be greater than 0").optional(),
});

export type InventoryFormValues = z.infer<typeof inventorySchema>;
