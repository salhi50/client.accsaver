"use client";

import { ReactNode, useContext, useState } from "react";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import Alert from "@/components/Alert";
import Container from "@/components/Container";
import Logo from "@/components/Logo";
import {
  AppAlertContext,
  AuthContext,
  AuthValue,
  LoadingContext
} from "./contexts";

function TopNavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <header className="bg-primary-dark py-2">
      <Container>{children}</Container>
    </header>
  );
}

function TopNavStatic() {
  return (
    <TopNavWrapper>
      <div className="flex items-center justify-center">
        <a href="/" aria-label="Homepage">
          <Logo />
        </a>
      </div>
    </TopNavWrapper>
  );
}

function TopNav() {
  const { auth } = useContext(AuthContext);

  if (!auth) {
    return <TopNavStatic />;
  }

  const handleLogout = function () {
    if (confirm("Are you sure you want to log out?")) {
      window.location.href = "/";
    }
  };

  return (
    <TopNavWrapper>
      <div className="flex justify-between items-center">
        <Link href="/accounts" aria-label="All Accounts" prefetch={false}>
          <Logo />
        </Link>
        <button
          type="button"
          aria-label="Logout"
          className="link link-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </TopNavWrapper>
  );
}

function AppAlert({ children }: { children: string }) {
  const setAlertContent = useContext(AppAlertContext);
  return (
    <Alert className="px-0">
      <Container className="flex items-center">
        <p className="grow mr-2">{children}</p>
        <button
          type="button"
          className="shrink-0"
          onClick={() => setAlertContent("")}
          aria-label="Close"
        >
          <IoMdClose size={24} />
        </button>
      </Container>
    </Alert>
  );
}

function LoadingOverlay() {
  return (
    <div className="fixed z-10 inset-0 bg-black bg-opacity-75 w-full h-full">
      <div className="h-full flex items-center justify-center text-white font-semibold text-center">
        Processing...
      </div>
    </div>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  const [alertContent, setAlertContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState<AuthValue>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <AppAlertContext.Provider value={setAlertContent}>
        <LoadingContext.Provider value={setLoading}>
          <TopNav />
          {alertContent && <AppAlert>{alertContent}</AppAlert>}
          <div className="py-8">{children}</div>
          {loading && <LoadingOverlay />}
        </LoadingContext.Provider>
      </AppAlertContext.Provider>
    </AuthContext.Provider>
  );
}
