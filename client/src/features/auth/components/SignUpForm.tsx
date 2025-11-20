import {
  Button,
  ErrorAlert,
  PasswordInput,
  TextInput,
} from "../../../components";
import useSignUp from "../hooks/useSignUp";
import { passwordSchema } from "../../../lib/auth.validator";

/**
 * Add: password strength helper
 */
function computePasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length; // 0..5
  const percent = Math.round((score / 5) * 100);

  let label = "Very weak";
  let color = "bg-red-500";
  if (score >= 4) {
    label = "Strong";
    color = "bg-green-500";
  } else if (score >= 2) {
    label = "Moderate";
    color = "bg-yellow-400";
  } else {
    label = "Weak";
    color = "bg-red-500";
  }

  return { checks, score, percent, label, color };
}

export default function SignUp() {
  const {
    handleSubmit,
    handleRequestOtp,
    errors,
    apiError,
    form,
    loading,
    setForm,
    verified,
    requested,
    resendCountdown,
    canResend,
  } = useSignUp();

  // Add: derive strength from current password
  const passwordValue = form.password || "";
  const pwdStrength = computePasswordStrength(passwordValue);
  // Add: indicate whether the two password fields mismatch
  const passwordsMismatch =
    Boolean(verified && (form.password || "") && (form.newPassword || "") && (form.password !== form.newPassword));

  return (
    <div>
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h2 className="font-bold text-headline-black text-18 md:text-[14px] font-dmsans">
            Create an account
          </h2>
          <p className="text-content-black text-14 pr-content">
            Build your profile, connect with peers, discover jobs.
          </p>
        </div>

        <ErrorAlert message={apiError ?? undefined} />

        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextInput
            id="emailOrPhone"
            label="Email"
            type="text"
            placeholder="Enter your email"
            value={form.emailOrPhone}
            onChange={(v) => setForm((s: any) => ({ ...s, emailOrPhone: v }))}
            error={errors.emailOrPhone}
            disabled={requested}
          />

          {requested && !verified && (
            <TextInput
              id="otp"
              label="OTP"
              type="text"
              placeholder="Enter OTP"
              value={form.otp ?? ""}
              onChange={(v) => setForm((s: any) => ({ ...s, otp: v }))}
              error={errors.otp}
            />
          )}
          {requested && !verified && (
            <div className="flex items-center justify-between mt-[-6px]">
              <p className="text-12 text-gray-500">
                {resendCountdown > 0
                  ? `You can resend OTP in ${resendCountdown}s`
                  : "Didn't receive the OTP?"}
              </p>
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={!canResend}
                className={`text-12 font-medium ${!canResend ? "text-gray-400 cursor-not-allowed" : "text-button-blue hover:underline"}`}
              >
                Resend OTP
              </button>
            </div>
          )}
          {verified && (
            <div>
              {/* Password hint + strength */}
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <p className="text-12 text-gray-600">
                    Choose a strong password
                  </p>
                  <span className="text-12 font-medium text-gray-700">
                    {pwdStrength.label}
                  </span>
                </div>

                {/* Strength bar */}
                <div className="w-full h-2 bg-gray-200 rounded mt-1 overflow-hidden">
                  <div
                    className={`${pwdStrength.color} h-full`}
                    style={{ width: `${pwdStrength.percent}%` }}
                    aria-hidden
                  />
                </div>
              </div>

              {/* Requirements checklist */}
              <p className="text-12 text-gray-600 mb-3">
                Use minimum 8 characters including uppercase, lowercase, a number, and a special character.
              </p>
 
               <PasswordInput
                 id="password"
                 label="Password"
                 placeholder=" password"
                 value={form.password}
                 onChange={(v) => setForm((s: any) => ({ ...s, password: v }))}
                 error={errors.password}
               />
 
               <PasswordInput
                 id="confirmPassword"
                 label="Confirm Password"
                 placeholder="confirm password"
                 value={form.newPassword}
                 onChange={(v) =>
                   setForm((s: any) => ({ ...s, newPassword: v }))
                 }
                 error={errors.newPassword}
               />

               {passwordsMismatch && (
                 <p
                   className="text-12 text-red-500 mt-1"
                   role="alert"
                   aria-live="polite"
                 >
                   Passwords do not match
                 </p>
               )}
 
               <div className="flex items-center text-label-gary pt-1">
                 <input
                   type="checkbox"
                   id="terms"
                   className="opacity-30"
                   required
                 />
                 <label htmlFor="terms" className="ml-2">
                   <span className="font-medium font-dmsans text-black text-12">
                     I agree to the terms & conditions and Privacy policy
                   </span>
                 </label>
               </div>
             </div>
          )}
 
          <Button
            type="submit"
            className="bg-button-blue hover:bg-button-blue-hover"
            disabled={(() => {
              if (loading) return true;
              if (!verified) return false; // allow Request/Verify stages
              const pwdOk = passwordSchema.safeParse(form.password || "").success;
              const match = (form.password || "") === (form.newPassword || "");
             
              return !(pwdOk && match);
            })()}
          >
            {loading
              ? requested
                ? !verified
                  ? "Verifying..."
                  : "Submitting..."
                : "Requesting..."
              : !requested
              ? "Request OTP"
              : !verified
              ? "Verify OTP"
              : "Submit"}
          </Button>
        </form>
 
      </div>
    </div>
  );
}
            