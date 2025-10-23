import React from "react";

export interface IconButtonProps {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export default function IconButton({ icon, label, onClick }: IconButtonProps) {
  const base =
    "relative flex items-center justify-center w-[114px] h-[37px] px-[15px] py-[5px] gap-[7px] flex-shrink-0 rounded-[50px] transition-all duration-200 bg-white text-black hover:bg-[#26A69A] hover:text-white shadow-[0_4px_20px_0_rgba(0,0,0,0.25)]";
  const active =
    "active:px-[12px] active:py-[4px] active:gap-[8px] active:shadow-[0_3px_4px_0_rgba(0,0,0,0.25)]";
  return (
    <button
      onClick={onClick}
      className={`${base} ${active}`}
      aria-label={label ?? "icon-button"}
    >
      {icon && (
        <span className="w-6 flex items-center justify-center">{icon}</span>
      )}
      {label && <span className="font-medium">{label}</span>}
    </button>
  );
}
