import { PrismaClient } from "@prisma/client";

const products = [
  {
    slug: "linnekudde-nord",
    name: "Linnekudde Nord",
    description:
      "Stonewashed linnekudde i naturlig sandton. 50×50 cm, innerkudde ingår.",
    priceCents: 44900,
    stock: 24,
    imageUrl: "/images/products/linnekudde-nord.png",
    category: "Textil"
  },
  {
    slug: "keramikskal-handgjord",
    name: "Keramikskål handgjord",
    description:
      "Mattglaserad skål i stengods, gjord i liten serie i Skåne. Ø 18 cm.",
    priceCents: 29900,
    stock: 15,
    imageUrl: "/images/products/keramikskal-handgjord.png",
    category: "Keramik"
  },
  {
    slug: "ullplaid-gra",
    name: "Ullplaid grå",
    description:
      "Tunn ullplaid vävd i Italien. Mjuk, temperaturreglerande och tidlös.",
    priceCents: 129900,
    stock: 8,
    imageUrl: "/images/products/ullplaid-gra.png",
    category: "Textil"
  },
  {
    slug: "doftljus-en",
    name: "Doftljus En",
    description:
      "Sojaljus med toner av en, ceder och varm björk. Brinntid ca 45 h.",
    priceCents: 34900,
    stock: 40,
    imageUrl: "/images/products/doftljus-en.png",
    category: "Hem"
  },
  {
    slug: "serveringsbricka-ek",
    name: "Serveringsbricka ek",
    description:
      "Oljad ekbricka med upphöjda kanter. Perfekt för frukost eller ostbricka.",
    priceCents: 59900,
    stock: 12,
    imageUrl: "/images/products/serveringsbricka-ek.png",
    category: "Kök"
  }
];

const prisma = new PrismaClient();

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
