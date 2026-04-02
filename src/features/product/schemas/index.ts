import { z } from "zod";

export const productSchema = z.object({
  reference: z
    .string()
    .min(1, "Reference is required")
    .max(100, "Max 100 characters"),

  inventory_id: z.number().min(1, "Category is required"),
  price: z.number().min(0, "Price must be greater 0").optional(),
  width: z.number().min(0, "Width must be greater 0").optional(),
  height: z.number().min(0, "Height must be greater 0").optional(),
  thumbnailUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  thumbnailPath: z.string().optional(),

  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  imagePath: z.string().optional(),

  description: z.string().max(500, "Max 500 characters").optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
