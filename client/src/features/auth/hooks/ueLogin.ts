import { useNavigate } from "react-router-dom";
import { login, refresh } from "../../../lib/axios/authInstance";
import { isEmail } from "../../../lib/InputValidator";
import { setCredentials } from "../../../store/slices/authSlice";
import { useAppDispatch } from "../../../hooks/redux";
import { useEffect, useState } from "react";

export default function useLogin() {
  const [form, setForm] = useState({ emailOrPhone: "", password: "" });
  const [errors, setErrors] = useState<{
    emailOrPhone?: string;
    password?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // helper: password rule checks (returns null if valid, otherwise error message)
  function validatePassword(value: string): string | null {
    const v = (value ?? "").trim();
    if (!v) return "Password is required";
    if (v.length < 8) return "Password must be at least 8 characters";

    const hasUpper = /[A-Z]/.test(v);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(v);

    if (!hasUpper)
      return "Password must contain at least one uppercase letter (A–Z)";
    if (!hasSpecial)
      return "Password must contain at least one special character (e.g. !@#$%)";
    return null;
  }

  // main validate (fixes form.emailemailOrPhone typo -> form.emailOrPhone)
  const validate = (): boolean => {
    const temp: Partial<typeof errors> = {};

    const emailOrPhone = (form.emailOrPhone ?? "").trim();
    const password = (form.password ?? "").trim();

    // email or phone validation
    if (!emailOrPhone) {
      temp.emailOrPhone = "Email or phone is required";
    } else {
      const isEmailOk =
        typeof isEmail === "function"
          ? isEmail(emailOrPhone)
          : /\S+@\S+\.\S+/.test(emailOrPhone);
      const isPhoneOk = /^\+?[0-9]{7,15}$/.test(emailOrPhone); // simple international-ish phone check
      if (!isEmailOk && !isPhoneOk)
        temp.emailOrPhone = "Please enter a valid email or phone number";
    }

    // password validation with detailed messages
    const pwErr = validatePassword(password);
    if (pwErr) temp.password = pwErr;

    // commit errors (cast to the full shape if your state expects that)
    setErrors(temp as typeof errors);

    return Object.keys(temp).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    try {
      const res = await login(form.emailOrPhone, form.password);
      const { accessToken } = res.data;
      dispatch(setCredentials({ accessToken: accessToken }));
      navigate("/dashboard");
    } catch (err: any) {
      // Prefer a user-friendly message returned by the API, fall back safely
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.statusText ||
        err?.message;

      if (err?.response?.data?.code === "ValidationError") {
        setApiError("Invalid email or password. Please try again.");
      } else {
        setApiError(apiMessage ?? "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  const checkCred = async () => {
    try {
      const { data } = await refresh();
      dispatch(setCredentials({ accessToken: data.accessToken }));
      navigate("/");
    } catch (error) {
    }
  };

  useEffect(() => {
    checkCred();
  }, []);
  return {
    form,
    setForm,
    errors,
    apiError,
    loading,
    onSubmit,
  };
}
