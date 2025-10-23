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
          className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm
                     focus:border-teal-600 focus:ring-2 focus:ring-teal-600 outline-none bg-white
                     hover:border-teal-600 transition-all cursor-pointer flex items-center justify-between"
        >
          <span
            className={
              selectedOption?.value ? "text-gray-900" : "text-gray-500"
            }
          >
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-teal-600 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                          rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`px-3 py-2 cursor-pointer transition-colors duration-150 text-sm
                  ${
                    value === option.value
                      ? "bg-teal-50 text-teal-700 font-medium"
                      : "text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                  }
                  first:rounded-t-lg last:rounded-b-lg
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