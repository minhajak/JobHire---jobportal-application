import React from "react";

type Props = {
  id?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  onChange?: (v: string) => void;
  error?: string | null;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
};

const TextInput: React.FC<Props> = ({
  id,
  label,
  value,
  placeholder,
  type = "text",
  onChange,
  error,
  autoComplete,
  disabled,
  className,
}) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label htmlFor={id} className="font-dmsans text-label-gary text-12">
        {label}
      </label>
    )}
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={(e) => onChange?.(e.target.value)}
      className={`h-11 pl-2 rounded-lg bg-white ${className}}`}
      disabled={disabled}
      
    />
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

export default TextInput;
