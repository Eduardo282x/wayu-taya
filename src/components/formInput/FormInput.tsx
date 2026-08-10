import React from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  error,
  placeholder,
  className,
  required = true,
  ...inputProps
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent"
      >
        {label}
        {required ? (
          <span className="text-red-500 ml-1">*</span>
        ) : (
          <span className="text-gray-500 font-normal"> (Opcional)</span>
        )}
      </label>

      <input
        id={id}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-md focus:outline-1 focus:outline-blue-800 px-3 py-1 bg-white shadow-xl border",
          className
        )}
        {...inputProps}
      />

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};
