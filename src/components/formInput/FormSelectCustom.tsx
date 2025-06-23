import React from "react";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  error?: string;
}

const FormSelectCustom: React.FC<FormSelectProps> = ({
  label,
  id,
  error,
  options,
  ...selectProps
}) => {
  return (
    <div className="">
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent"
      >
        {label}
      </label>
      <select
        className="w-full rounded-md focus:outline-1 focus:outline-blue-800 px-3 py-1 bg-white shadow-xl border"
        {...selectProps}
      >
        {options && options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FormSelectCustom;
