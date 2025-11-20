import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSignout from "../hooks/useSignout";
import { Loader2 } from "lucide-react"; // spinning loader icon

const SignoutForm: React.FC = () => {
  const { isLoggingOut, signoutError } = useSignout();
  const navigate = useNavigate();

  // Optional: redirect handled in hook, so this is just a fallback
  useEffect(() => {
    if (!isLoggingOut && !signoutError) {
      const timer = setTimeout(() => navigate("/signin"), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoggingOut, signoutError, navigate]);

  return (
    <div className="flex justify-center min-h-screen bg-white px-4">
      <div className=" p-8 w-full max-w-sm text-center">
        {isLoggingOut ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
            <p className="text-gray-700 font-medium">Signing you out...</p>
          </div>
        ) : signoutError ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-red-500 font-semibold">Sign-out failed</p>
            <p className="text-gray-500 text-sm">{signoutError}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-900 font-semibold">You’ve been signed out</p>
            <p className="text-gray-500 text-sm">Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignoutForm;
