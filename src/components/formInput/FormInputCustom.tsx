import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const FormInputCustom: React.FC<FormInputProps> = ({
  label,
  id,
  error,
  ...inputProps
}) => {
  return (
    <div className="">
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent"
      >
        {label}
      </label>
      <input
        id={id}
        className="w-full rounded-md focus:outline-1 focus:outline-blue-800 px-3 py-1 bg-white shadow-xl border"
        {...inputProps}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FormInputCustom;
