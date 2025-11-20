import React, { useState } from "react";

type Props = {
  id?: string;
  value?: string;
  onChange?: (v: string) => void;
  error?: string | null;
  label?: string;
  placeholder?:string;
};

const PasswordInput: React.FC<Props> = ({
  id,
  value,
  onChange,
  error,
  label,
  placeholder,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2 relative">
      {label && (
        <label htmlFor={id} className="font-dmsans text-label-gary text-12">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-white pl-2 pr-10 h-11 rounded-lg w-full"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center"
        >
          {/* simple icon */}
          {show ? (
            // Eye (visible)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#555"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12c2.25-4.5 6.75-7.5 9.75-7.5s7.5 3 9.75 7.5c-2.25 4.5-6.75 7.5-9.75 7.5s-7.5-3-9.75-7.5z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            // Eye-off
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2L22 22"
                stroke="#989898"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.94 10.94C10.64 11.74 9.9 12.3 9 12.3C7.79 12.3 6.83 11.34 6.83 10.13C6.83 9.23 7.39 8.49 8.2 8.19"
                stroke="#989898"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.39 13.77C20.23 15.68 17.63 18 12 18C8.08 18 4.9 15.95 3 13.77"
                stroke="#989898"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default PasswordInput;
