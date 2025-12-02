// src/components/providers/AuthProvider.tsx
"use client";

import { useAuthStore } from "@auth/stores/auth";
import { useEffect, useRef } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      bootstrap();
    }
  }, [bootstrap]);

  return <>{children}</>;
}
