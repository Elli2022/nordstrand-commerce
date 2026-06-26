import Stripe from "stripe";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code
      }
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error.flatten()
      }
    });
  }

  if (error instanceof Stripe.errors.StripeError) {
    return res.status(502).json({
      error: {
        message: "Betalningstjänsten svarade med fel",
        code: "STRIPE_ERROR"
      }
    });
  }

  console.error(error);
  return res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR"
    }
  });
}
