import React from "react";

// small local helper to join class names
const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export interface IconCircleProps {
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * IconCircle
 * - Fixed size 42x42 (px-perfect)
 * - flex-shrink-0 so it won't compress in flex layouts
 */
export default function IconCircle({
  icon,
  onClick,
  disabled = false,
  className,
  ariaLabel,
}: IconCircleProps) {
  // Fixed size - no size change on hover to prevent navbar shifting
  const container = cx(
    "w-[42px] h-[42px] flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out",
    // hover effects without size change
    "bg-white text-black hover:bg-[#26A69A] hover:text-white",
    // active / pressed state (when clicked)
    "active:bg-[#009688] active:text-white active:translate-y-[1px] active:scale-95",
    "shadow-[0_4px_10px_rgba(0,0,0,0.12)]",
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    className
  );

  return (
    <button
      aria-label={ariaLabel ?? "icon-circle"}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={container}
    >
      {icon ? (
        <span className="w-full h-full flex items-center justify-center text-[18px]">
          {icon}
        </span>
      ) : null}
    </button>
  );
}
