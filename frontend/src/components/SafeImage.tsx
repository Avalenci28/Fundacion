"use client";

import Image, { type ImageProps } from "next/image";
import { useMemo, useState } from "react";

export type SafeImageProps = Omit<ImageProps, "src" | "alt" | "onError"> & {
  src?: string | null;
  alt: string;
  placeholderSrc?: string;
};



export default function SafeImage({
  src,
  alt,
  placeholderSrc = "/placeholder.jpg",
  ...props
}: SafeImageProps) {
  const initialSrc = useMemo(() => src || placeholderSrc, [src, placeholderSrc]);
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);


  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(placeholderSrc)}
    />
  );
}

