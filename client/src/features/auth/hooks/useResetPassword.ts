import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyForgotPasswordOTP, resetForgottenPassword, forgotPassword } from "../../../lib/axios/authInstance";

export default function useResetPassword(){
  const { state } = useLocation();
  const navigate = useNavigate();

  // Accept email passed via navigation state from ForgotPasswordForm
  const initialEmail = (state && (state as any).email) || "";

  const [email, setEmail] = useState<string>(initialEmail);
  const [otp, setOtp] = useState<string>("");
  const [encryptedOTP, setEncryptedOTP] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [didReset, setDidReset] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(true);

  // countdown timer for resending OTP
  useEffect(() => {
    let timer: any = null;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
      setCanResend(false);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Verify OTP and capture encryptedOTP returned by server
  const verifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!email) return setError("Email is required to verify OTP");
    if (!otp) return setError("OTP is required");
    try {
      setLoading(true);
      const res = await verifyForgotPasswordOTP(email, otp);
      setEncryptedOTP(res.data.encryptedOTP || null);
      setSuccess("OTP verified. You can reset your password now.");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email || !canResend) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      await forgotPassword(email);
      setSuccess("OTP resent. Check your email.");
      setResendCountdown(60); // 60s cooldown
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Submit new password using encryptedOTP
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!encryptedOTP) return setError("Please verify the OTP first");
    if (!password || password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    try {
      setLoading(true);
      const res = await resetForgottenPassword(email, password, encryptedOTP);
      const message = res.data.message || "Password reset successful";
      setSuccess(message);
      setDidReset(true);
      // keep short delay so inline message is visible before redirect
      setTimeout(() => navigate("/signin"), 1000);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // New: helper props for the Verify OTP button to make alignment easier in the UI
  const verifyButtonProps = {
    type: "button" as const,
    onClick: verifyOtp,
    disabled: loading,
    // default inline spacing that fixes most alignment issues when button sits beside the OTP input.
    // adjust marginLeft / padding here or override with className in the component.
    style: { marginLeft: 8 } as React.CSSProperties,
  };

  return {
    email,
    setEmail,
    otp,
    setOtp,
    encryptedOTP,
    loading,
    error,
    success,
    verifyOtp,
    resendOtp,
    resendCountdown,
    canResend,
    submit,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    // exposed helper for UI alignment
    verifyButtonProps,
    didReset,
  };
}