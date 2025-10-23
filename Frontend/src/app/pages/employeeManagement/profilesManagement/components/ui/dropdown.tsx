"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export type DropdownItem = { label: string; value: string };

export interface DropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export function Dropdown({
  items,
  placeholder,
  value,
  onChange,
  disabled,
  className,
  triggerClassName,
}: DropdownProps) {
  return (
    <div className={cn(className)}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          disabled={disabled}
          className={cn("min-w-40", triggerClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((it) => (
            <SelectItem key={it.value} value={it.value}>
              {it.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
