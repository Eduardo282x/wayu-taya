
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string; // <-- Agregamos la prop error opcional
}

export const FormInputCustoms: React.FC<FormInputProps> = ({ label, id, error, ...inputProps }) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent"
      >
        {label}
      </label>
      <input
        id={id}
        className="w-full rounded focus:outline-1 focus:outline-blue-800 px-3 py-2 bg-white shadow-xl border border-gray-400"
        {...inputProps}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};