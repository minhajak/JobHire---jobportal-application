import { useNavigate, type NavigateFunction } from "react-router-dom";

const BackButton = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <button
      type="button"
      aria-label="Go back"
      className="absolute top-4 left-4 flex items-center text-gray-700 hover:text-gray-900"
      onClick={() => navigate(-1)}
    >
      <div className="w-4 h-8 font-semibold text-2xl">
        <svg
          width="12"
          height="24"
          viewBox="0 0 12 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinecap="round"
            d="M1.843 12.711L7.5 18.368L8.914 16.954L3.964 12.004L8.914 7.054L7.5 5.64L1.843 11.297C1.65553 11.4845 1.55022 11.7388 1.55022 12.004C1.55022 12.2692 1.65553 12.5235 1.843 12.711Z"
            fill="black"
          />
        </svg>
      </div>
      <span className="hidden sm:inline text-sm font-medium">Back</span>
    </button>
  );
};

export default BackButton;
