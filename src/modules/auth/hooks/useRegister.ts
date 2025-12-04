import { useState } from "react";
import { message } from "antd";
import { useRouter } from "next/navigation";

export function useRegister() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          roleIds: "1197f313-476d-4645-8b29-1b0de6c50d1c",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      message.success("Registration successful! Please login.");
      router.push("/en/auth/login");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return { onSubmit, submitting };
}
