import Image from "next/image";

export function ProductImage({
  src,
  alt,
  priority = false,
  className = "object-cover",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={className}
      sizes={sizes}
    />
  );
}
