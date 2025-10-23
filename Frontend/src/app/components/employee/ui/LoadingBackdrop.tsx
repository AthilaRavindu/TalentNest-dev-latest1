"use client";

import React from "react";

interface LoadingBackdropProps {
  open: boolean;
}

const LoadingBackdrop: React.FC<LoadingBackdropProps> = ({ open }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Circular Loader */}
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingBackdrop;
