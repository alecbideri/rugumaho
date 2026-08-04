"use client";

import { useState, useEffect, useRef } from "react";

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  placeholderClassName?: string;
}

export default function ImageWithPlaceholder({
  src,
  alt,
  className = "",
  containerClassName = "",
  placeholderClassName = ""
}: ImageWithPlaceholderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already cached/loaded when mounting or changing src
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Animated Pulsing Skeleton Placeholder */}
      {!isLoaded && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200/80 dark:from-slate-800 dark:to-slate-900/80 animate-pulse z-10 ${placeholderClassName}`}
        />
      )}
      
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`${className} transition-opacity duration-700 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
