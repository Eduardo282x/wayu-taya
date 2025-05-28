
interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const StyledInput: React.FC<StyledInputProps> = ({ label, id, ...inputProps }) => {
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
    </div>
  );
};

export default StyledInput;