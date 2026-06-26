import type { Product } from "@prisma/client";
import type { ProductDto } from "@nordstrand/shared";

export function toProductDto(product: Product): ProductDto {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    stock: product.stock,
    imageUrl: product.imageUrl,
    category: product.category
  };
}
