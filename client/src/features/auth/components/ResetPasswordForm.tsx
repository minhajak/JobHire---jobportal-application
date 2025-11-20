import React from "react";
import { ErrorAlert, SuccessAlert, Loading, Button, PasswordInput, TextInput } from "../../../components";
import useResetPassword from "../hooks/useResetPassword";

const ResetPasswordForm: React.FC = () => {
  const {
    email,
    setEmail,
    otp,
    setOtp,
    encryptedOTP,
    loading,
    error,
    success,
  didReset,
    verifyOtp,
    resendOtp,
    resendCountdown,
    canResend,
    submit,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
  } = useResetPassword();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen min-w-screen bg-forgotpassword-theme">
        <Loading loading={true} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-forgotpassword-theme">
      <div className="w-screen md:max-w-lg lg:max-w-xl rounded-2xl min-h-[580px] sm:min-h-[340px] flex flex-col overflow-hidden">
        <div
          className="flex-grow p-4 pt-10 sm:p-6"
          style={{ background: "rgba(250, 249, 246, 1)" }}
        >
          <div className="flex flex-col h-full">
            <div className="mb-14">
              <h2 className="font-bold font-dmsans text-headline-black text-18">
                Reset Your Password?
              </h2>
              <p className="text-content-black font-dmsans text-14 pr-content">
                Enter your new password and confirm the password.
              </p>
            </div>

            <ErrorAlert message={error ?? undefined} />
            {/* Show a prominent inline success banner when password was just reset */}
            {didReset ? (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800">
                <div className="font-semibold">Password reset successful</div>
                <div className="text-12">Redirecting to sign in...</div>
              </div>
            ) : (
              <SuccessAlert message={success ?? undefined} />
            )}

            {/* Email + OTP verification section */}
            <div className="mt-2">
              <TextInput
                id="reset-email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(v) => setEmail(v)}
                error={null}
                disabled={Boolean(encryptedOTP)}
              />

              {/* Hide OTP input and Verify button after OTP is verified */}
              {!encryptedOTP && (
                <div className="flex gap-2 items-end mt-2">
                  <TextInput
                    id="reset-otp"
                    label="OTP"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(v) => setOtp(v)}
                    error={null}
                    className="flex-1"
                  />
                  <Button
                    onClick={verifyOtp}
                    type="button"
                    disabled={loading || !email || !otp}
                    className="h-10"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              )}

              {!encryptedOTP && (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-12 text-gray-500">Didn't get the OTP?</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={!canResend || loading}
                      className={`text-12 font-medium ${!canResend ? "text-gray-400 cursor-not-allowed" : "text-button-blue hover:underline"}`}
                    >
                      {canResend ? "Resend OTP" : `Resend in ${resendCountdown}s`}
                    </button>
                  </div>
                </div>
              )}

              {/* Password fields only after OTP verified */}
              {encryptedOTP && (
                <form onSubmit={submit} className="flex flex-col gap-3 mt-4">
                  <PasswordInput
                    value={password}
                    onChange={setPassword}
                    label="New Password"
                    placeholder="password"
                  />
                  <PasswordInput
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    label="Confirm Password"
                    placeholder="confirm password"
                  />
                  <Button type="submit" disabled={loading} className="mt-4">
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
