import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export default function Input({ label, helperText, error, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        {...props}
        className={`h-[52px] w-full rounded-xl border px-4 text-base shadow-sm 
                   outline-none bg-white text-gray-900 transition-all
                   placeholder:text-gray-500
                   ${error 
                     ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20' 
                     : 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 hover:border-teal-500'
                   }`}
      />
      {(helperText || error) && (
        <span className={`text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
}