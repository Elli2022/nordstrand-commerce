import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99)
});

export const checkoutSessionSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  customerEmail: z.string().email().optional()
});

export const productSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  priceCents: z.number().int().positive(),
  stock: z.number().int().min(0),
  imageUrl: z.string().min(1),
  category: z.string()
});

export const orderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "CANCELLED",
  "FAILED"
]);

export type CartItem = z.infer<typeof cartItemSchema>;
export type CheckoutSessionInput = z.infer<typeof checkoutSessionSchema>;
export type ProductDto = z.infer<typeof productSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export function formatPrice(cents: number, locale = "sv-SE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "SEK"
  }).format(cents / 100);
}
