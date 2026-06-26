import type { ProductDto } from "@nordstrand/shared";

export const catalogFallback: ProductDto[] = [
  {
    id: "cb495d21-e810-4839-8f81-14a153e85427",
    slug: "linnekudde-nord",
    name: "Linnekudde Nord",
    description:
      "Stonewashed linnekudde i naturlig sandton. 50×50 cm, innerkudde ingår.",
    priceCents: 44900,
    stock: 24,
    imageUrl: "/images/products/linnekudde-nord.webp",
    category: "Textil"
  },
  {
    id: "e8cc9348-5e17-422e-875f-76a0123f1c48",
    slug: "keramikskal-handgjord",
    name: "Keramikskål handgjord",
    description:
      "Mattglaserad skål i stengods, gjord i liten serie i Skåne. Ø 18 cm.",
    priceCents: 29900,
    stock: 15,
    imageUrl: "/images/products/keramikskal-handgjord.webp",
    category: "Keramik"
  },
  {
    id: "d2e89ffe-a4d4-4795-bffe-dd69353d8236",
    slug: "ullplaid-gra",
    name: "Ullplaid grå",
    description:
      "Tunn ullplaid vävd i Italien. Mjuk, temperaturreglerande och tidlös.",
    priceCents: 129900,
    stock: 8,
    imageUrl: "/images/products/ullplaid-gra.webp",
    category: "Textil"
  },
  {
    id: "92b65d67-a571-4cc8-8bdf-fa4da71d3dab",
    slug: "doftljus-en",
    name: "Doftljus En",
    description:
      "Sojaljus med toner av en, ceder och varm björk. Brinntid ca 45 h.",
    priceCents: 34900,
    stock: 40,
    imageUrl: "/images/products/doftljus-en.webp",
    category: "Hem"
  },
  {
    id: "f7b4030c-b586-42f6-a6fd-46b027b98034",
    slug: "serveringsbricka-ek",
    name: "Serveringsbricka ek",
    description:
      "Oljad ekbricka med upphöjda kanter. Perfekt för frukost eller ostbricka.",
    priceCents: 59900,
    stock: 12,
    imageUrl: "/images/products/serveringsbricka-ek.webp",
    category: "Kök"
  }
];
