"use client";

import { useState } from "react";

type ExternalImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ExternalImage({
  src,
  alt,
  className = "",
}: ExternalImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}