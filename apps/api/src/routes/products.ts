import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { toProductDto } from "../lib/mappers.js";
import { AppError } from "../middleware/error-handler.js";

export const productsRouter = Router();

productsRouter.get("/", async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" }
    });

    res.json({
      data: products.map(toProductDto)
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:slug", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug }
    });

    if (!product) {
      throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    res.json({ data: toProductDto(product) });
  } catch (error) {
    next(error);
  }
});
