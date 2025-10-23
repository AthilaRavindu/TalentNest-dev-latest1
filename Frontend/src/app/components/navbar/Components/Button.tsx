import React from "react";

// Helper to join class names (keeps file independent)
const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export interface IconButtonProps {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  dropdown?: boolean;
  className?: string;
}

/**
 * IconButton
 * - Supports `dropdown` variant
 * - Honors `disabled`
 * - Icon is horizontally centered in its slot when not dropdown
 */
export default function IconButton({
  icon,
  label,
  onClick,
  disabled = false,
  dropdown = false,
  className,
}: IconButtonProps) {
  const base =
    "relative flex items-center justify-center w-[114px] h-[37px] px-[15px] py-[5px] gap-[7px] flex-shrink-0 rounded-[50px] transition-all duration-200";

  const active =
    "active:px-[12px] active:py-[4px] active:gap-[8px] active:shadow-[0_3px_4px_0_rgba(0,0,0,0.25)]";

  const defaultStyle =
    "bg-white text-black hover:bg-[#26A69A] hover:text-white";
  const dropdownStyle = "bg-[#009688] text-white hover:bg-[#009688]";
  const disabledStyle =
    "disabled:bg-[#9D9D9D] disabled:shadow-[0_4px_8px_0_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:hover:bg-[#9D9D9D] disabled:hover:text-black disabled:text-black";

  const containerClass = cx(
    base,
    active,
    dropdown ? dropdownStyle : defaultStyle,
    disabledStyle,
    "shadow-[0_4px_20px_0_rgba(0,0,0,0.25)]",
    className
  );

  // Icon wrappers - horizontally centered
  const iconSlotClass = "w-6 flex items-center justify-center";
  const dropdownIconClass =
    "absolute right-[15px] top-1/2 -translate-y-1/2 transform transition-transform duration-150 active:translate-y-[-50%] active:scale-95 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]";

  return (
    <button
      aria-label={label ?? "icon-button"}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={containerClass}
    >
      {dropdown ? (
        <>
          {label ? <span className="font-medium">{label}</span> : null}
          {icon ? <span className={dropdownIconClass}>{icon}</span> : null}
        </>
      ) : (
        <>
          {icon ? <span className={iconSlotClass}>{icon}</span> : null}
          {label ? <span className="font-medium">{label}</span> : null}
        </>
      )}
    </button>
  );
}
