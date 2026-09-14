"use client";

import { useState } from "react";

const FALLBACK = "/placeholders/default.svg";

/** <img> с подстановкой плейсхолдера при отсутствии/ошибке картинки. */
export function Thumb({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const url = !src || errored ? FALLBACK : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}
