import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/redux";
import { useEffect, useState } from "react";
import { logout } from "../../../store/slices/authSlice";
import { signout } from "../../../lib/axios/authInstance";

/**
 * useSignout Hook
 * Handles user logout by calling the backend signout endpoint,
 * clearing Redux state, and redirecting the user to the signin page.
 */
export default function useSignout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [signoutError, setSignoutError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // ✅ Prevent state updates if component unmounts

    const handleSignout = async (): Promise<void> => {
      try {
        setIsLoggingOut(true);
        setSignoutError(null);

        await signout(); // 🧾 Backend request (e.g., clears cookies/session)

        // Clear Redux state (tokens, user info, etc.)
        dispatch(logout());
      } catch (err: any) {
        console.error("❌ Error during logout:", err);
        if (isMounted) {
          setSignoutError(
            err.response?.data?.message || "Failed to sign out. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoggingOut(false);
          // ✅ Use slight delay for smoother UX before navigation
          setTimeout(() => navigate("/signin"), 1000);
        }
      }
    };

    handleSignout();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate]);

  return { isLoggingOut, signoutError };
}
