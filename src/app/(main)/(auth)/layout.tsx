"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts";

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (!auth) {
      window.location.href = "/";
    }
  }, []);

  if (!auth) return null;

  return children;
}
