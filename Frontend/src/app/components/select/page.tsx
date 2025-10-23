"use client";


import * as React from "react";

import { useState, useRef, useEffect, ReactNode, ReactElement } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectOptionElementProps {
  value: string;
  children: ReactNode;
}

interface CustomSelectProps {
  label?: string;
  helperText?: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  children: ReactNode; // ✅ allows fragments, arrays, or single elements
  placeholder?: string;
}

// ---- Option subcomponent ----
export function Option({ value, children }: SelectOptionElementProps) {
  return <div data-value={value}>{children}</div>; // placeholder element for typing
}

export default function Select({
  label,
  helperText,
  children,
  value,
  onChange,
  placeholder = "Select an option",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract options from children
  useEffect(() => {
    const extractedOptions: SelectOption[] = [];

    const processChild = (child: ReactNode) => {
      if (!React.isValidElement<SelectOptionElementProps>(child)) return;

      const element = child as ReactElement<SelectOptionElementProps>;
      if (element.props.value !== undefined) {
        extractedOptions.push({
          value: element.props.value,
          label: element.props.children?.toString() || element.props.value,
        });
      }
    };

    // Convert children to array (supports fragments, arrays, single element)
    const childrenArray = React.Children.toArray(children);
    childrenArray.forEach(processChild);

    setOptions(extractedOptions);
  }, [children]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  const handleOptionClick = (optionValue: string) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 w-full" ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="h-[52px] w-full rounded-xl border border-gray-300 px-4 text-base
                     shadow-sm focus:border-teal-500 outline-none bg-white
                     hover:border-teal-500 hover:ring-2 hover:ring-teal-500/20 
                     transition-all cursor-pointer flex items-center justify-between"
        >
          <span
            className={
              selectedOption?.value ? "text-gray-900" : "text-gray-500"
            }
          >
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                          rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150
                  ${
                    value === option.value
                      ? "bg-teal-500 text-white font-medium"
                      : "text-gray-900 hover:bg-teal-500 hover:text-white"
                  }
                  first:rounded-t-xl last:rounded-b-xl
                  `}
              >
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {helperText && (
        <span className="text-xs text-gray-500">{helperText}</span>
      )}
    </div>
  );
}
