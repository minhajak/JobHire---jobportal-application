import React from "react";
import {
  ErrorAlert,
  Loading,
  PasswordInput,
  TextInput,
  Button,
} from "../../../components";
import useLogin from "../hooks/ueLogin";

const LoginForm: React.FC = () => {
  const { form, setForm, errors, apiError, loading, onSubmit } = useLogin();

  <Loading loading={loading} />;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="font-bold text-18 text-headline-black font-dmsans">
          Welcome Back!
        </h2>
        <p className="text-14 text-content-black pr-content">
          Log in to your account to connect with professionals and explore
          opportunities
        </p>
      </div>

      <ErrorAlert message={apiError ?? undefined} />

      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <TextInput
          id="emailOrPhone"
          label="emailOrPhone"
          value={form.emailOrPhone}
          onChange={(v) => setForm((s) => ({ ...s, emailOrPhone: v }))}
          error={errors.emailOrPhone}
          placeholder=" email / Phone Number"
        />
        <PasswordInput
          id="password"
          label="Password"
          value={form.password}
          onChange={(v) => setForm((s) => ({ ...s, password: v }))}
          error={errors.password}
          placeholder=" password"
        />

        <div className="text-right -mt-3">
          <a
            href="/forgot-password"
            className="underline text-button-blue text-12 font-semibold"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="bg-button-blue hover:bg-button-blue-hover"
          disabled={loading}
        >
          {loading ? "Logging..." : "Login"}
        </Button>
      </form>

    </div>
  );
};

export default LoginForm;
