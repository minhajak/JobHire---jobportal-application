import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ErrorAlert,
  SuccessAlert,
  BackButton,
  Button,
  TextInput,
} from "../../../components";
import useForgotPassword from "../hooks/useForgotPassword";

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { loading, handleSubmit, error, message, email, setEmail } =
    useForgotPassword();

  // Store the email that was submitted for OTP
  const submittedEmailRef = useRef<string>("");

  // Capture email when form is submitted
  const handleFormSubmit = (e: React.FormEvent) => {
    submittedEmailRef.current = email;
    handleSubmit(e);
  };

  // Navigate to reset password form after successful OTP sending
  useEffect(() => {
    if (message && !error && !loading && submittedEmailRef.current) {
      console.log("Navigating with email:", submittedEmailRef.current);
      // Navigate after a short delay to show success message
      const timer = setTimeout(() => {
        navigate("/reset-password", {
          state: { email: submittedEmailRef.current }, // Use the captured email
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, error, loading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-forgotpassword-theme">
      <div className="w-screen md:max-w-lg lg:max-w-xl rounded-2xl min-h-[580px] sm:min-h-[340px] flex flex-col overflow-hidden">
        <BackButton />
        <div
          className="flex-grow p-4 pt-10 sm:p-6"
          style={{ background: "rgba(250, 249, 246, 1)" }}
        >
          <div className="flex flex-col h-full">
            <div className="mb-14">
              <h2 className="font-bold font-dmsans text-headline-black text-18">
                Forgot Your Password?
              </h2>
              <p className="text-content-black font-dmsans text-14 pr-content">
                Enter your email address and we'll send you an OTP to reset your
                password
              </p>
            </div>

            <ErrorAlert message={error ?? undefined} />
            <SuccessAlert message={message ?? undefined} />

            <form
              className="flex flex-col gap-3 mt-auto"
              onSubmit={handleFormSubmit}
              noValidate
            >
              <TextInput
                id="email"
                label="Email"
                type="email"
                value={email}
                placeholder=" Enter your email"
                onChange={(v) => setEmail(v)}
                error={null}
              />

              <Button type="submit" disabled={loading} className="mt-5">
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
