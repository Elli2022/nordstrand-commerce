"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

export function CartLink() {
  const { count } = useCart();

  return (
        <Link href="/cart">Varukorg{count > 0 ? ` (${count})` : ""}</Link>
  );
}
