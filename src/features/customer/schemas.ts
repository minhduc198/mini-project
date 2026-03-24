import { z } from "zod";

export const addCustomerSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "Max 50 characters"),

  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Max 50 characters"),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Max 200 characters"),

  avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  city: z.string().min(1, "City is required").max(100, "Max 100 characters"),

  zipcode: z
    .string()
    .min(1, "Zipcode is required")
    .max(20, "Max 20 characters"),

  birthday: z
    .string()
    .min(1, "Birthday is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
});

export type AddCustomerFormValues = z.infer<typeof addCustomerSchema>;
