export default function AuthSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="relative mx-auto w-14 h-14 mb-5">
          <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-1">
          Authenticating
        </h3>
        <p className="text-sm text-gray-500">Please wait a moment</p>
      </div>
    </div>
  );
}
