import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "group peer h-4 w-4 shrink-0 rounded-sm border border-primary/60 ring-offset-background transition-colors hover:[border-color:hsl(var(--primary))] data-[state=checked]:[background-color:hsl(var(--primary))] data-[state=checked]:[border-color:hsl(var(--primary))] data-[state=checked]:text-white data-[state=checked]:hover:[background-color:hsl(var(--primary-dark))] data-[state=indeterminate]:[background-color:hsl(var(--primary))] data-[state=indeterminate]:[border-color:hsl(var(--primary))] data-[state=indeterminate]:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:[--tw-ring-color:hsl(var(--primary))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-100 disabled:border-primary/30 disabled:bg-muted/30",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current relative")}
    >
      <Check className="h-4 w-4 hidden group-data-[state=checked]:block group-data-[state=indeterminate]:hidden" />
      <Minus className="h-4 w-4 hidden group-data-[state=indeterminate]:block group-data-[state=checked]:hidden" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
