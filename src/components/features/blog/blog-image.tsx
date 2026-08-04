"use client";

import Image from "next/image";
import { useSiteImages } from "@/hooks/use-site-images";

interface BlogImageProps {
  slot: string;
  defaultSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function BlogImage({
  slot,
  defaultSrc,
  alt,
  width,
  height,
  className,
  sizes,
  priority,
}: BlogImageProps) {
  const overrides = useSiteImages();
  return (
    <Image
      src={overrides[slot] ?? defaultSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
