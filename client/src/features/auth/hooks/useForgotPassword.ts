import { useState } from "react";
// navigation is handled by the form component; don't auto-navigate here
import { isEmail } from "../../../lib/InputValidator";
import { forgotPassword } from "../../../lib/axios/authInstance";

export default function useForgotPassword(){
    const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const validate = (): boolean => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!isEmail(email)) {
      setError("Please enter a valid email");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const res = await forgotPassword(email);
      setMessage(
        res?.data?.message ?? "Reset link has been sent to your email."
      );

  // keep on the same page; form component will navigate to reset page
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message ?? err?.message ?? "Something went wrong";
      setError(String(serverMsg));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return{loading,handleSubmit,message,error,setEmail,email}
}