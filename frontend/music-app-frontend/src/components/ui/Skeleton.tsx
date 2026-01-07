import type React from "react";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 ${className || ""}`}
      style={style}
    />
  );
}

export function SkeletonCircle({ size = 48, className }: { size?: number; className?: string }) {
  return <Skeleton className={`rounded-full ${className || ""}`} style={{ width: size, height: size }} />;
}
