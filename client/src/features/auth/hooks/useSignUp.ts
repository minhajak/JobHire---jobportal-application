import { useState, useEffect, useRef } from "react";
import { requestOtp, signUp, verifyOpt } from "../../../lib/axios/authInstance";
import { requestOtpSchema, SignUpSchema } from "../../../lib/auth.validator";
import { useNavigate, type NavigateFunction } from "react-router-dom";

type VerifyType = {
  emailOrPhone: string;
  username?: string;
  otp?: string;
  password?: string;
  newPassword?: string;
  encryptedOTP?: string;
};

export default function useSignUp() {
  const [form, setForm] = useState<VerifyType>({ emailOrPhone: "" });
  const [errors, setErrors] = useState<Partial<VerifyType>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [verified, setVerified] = useState(false);
  const [submitted, SetSubmitted] = useState(false);
  const [encryptedOTP, setEncryptedOTP] = useState<string>("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate: NavigateFunction = useNavigate();

  const countdownRef = useRef<NodeJS.Timer | null>(null);

  // Handle OTP countdown
  useEffect(() => {
    if (resendCountdown <= 0 && countdownRef.current) {
      clearInterval(countdownRef.current as NodeJS.Timeout);
      countdownRef.current = null;
    }
  }, [resendCountdown]);

  const startCountdown = (seconds: number) => {
    setResendCountdown(seconds);
    countdownRef.current = setInterval(() => {
      setResendCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
  };

  const handleRequestOtp = async () => {
    // Allow resend only when countdown finished
    if (requested && resendCountdown > 0) return;
    const result = requestOtpSchema.safeParse(form);

    if (!result.success) {
      setErrors({ emailOrPhone: result.error.issues[0].message });
      return { ok: false };
    }

    try {
      await requestOtp(result.data.emailOrPhone);
      setRequested(true);
      setErrors({});
      setApiError(null);
      startCountdown(60); 
      return { ok: true };
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "An unknown error occurred";
      setApiError(msg);
      return { ok: false, error: msg };
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOpt(form.emailOrPhone, form.otp || "");
      console.log(res.data.encryptedOTP)
      setEncryptedOTP(res.data.encryptedOTP);
      console.log(encryptedOTP)
      setVerified(true);
      return { ok: true };
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "An unknown error occurred";
      setApiError(msg);
      return { ok: false, error: msg };
    }
  };

  const handleSignUp = async () => {
    const result = SignUpSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<VerifyType> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof VerifyType] = issue.message;
      });
      setErrors(fieldErrors);
      return { ok: false };
    }

    try {
      const res=await signUp(
        result.data.emailOrPhone,
        result.data.newPassword,
        encryptedOTP,
      );
      console.log(`${result.data.emailOrPhone} ${result.data.newPassword} ${encryptedOTP}`)
      console.log(res)
      SetSubmitted(true);
      navigate("/signin");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "An unknown error occurred";
      setApiError(msg);
      return { ok: false, error: msg };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setErrors({});
    setLoading(true);

    try {
      if (form.emailOrPhone && form.password && form.newPassword) {
        await handleSignUp();
      } else if (form.emailOrPhone && form.otp) {
        await handleVerifyOtp();
      } else {
        await handleRequestOtp();
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    handleSubmit,
    handleRequestOtp,
    errors,
    apiError,
    loading,
    verified,
    requested,
    encryptedOTP,
    resendCountdown,
    submitted,
    canResend: requested && !verified && resendCountdown === 0,
  };
}
