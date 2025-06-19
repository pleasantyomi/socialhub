"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
}
