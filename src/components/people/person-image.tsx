"use client";

import { useState } from "react";

type PersonImageProps = {
  name: string;
  src?: string | null;
  className?: string;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PersonImage({
  name,
  src,
  className = "",
}: PersonImageProps) {
  const [imageError, setImageError] = useState(false);

  const showImage = Boolean(src) && !imageError;

  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-muted ${className}`}
    >
      {showImage ? (
        <img
          src={src!}
          alt={name}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl font-semibold text-primary">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}