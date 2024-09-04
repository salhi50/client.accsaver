"use client";

import { useEffect, useState } from "react";
import type {
  EmailVerificationRequestBody,
  EmailVerificationResponseBody
} from "accsaver-shared";
import Alert from "@/components/Alert";
import Container from "@/components/Container";

function VerificationSuccess() {
  return (
    <Container size="md">
      <Alert color="success" className="mb-4">
        <h1 className="mb-2">Email Verified Successfully!</h1>
        <p>
          Thank you for verifying your email address. Your account is now active
          and ready to use.
        </p>
      </Alert>
      <a href="/login" className="link link-primary">
        Go to Login
      </a>
    </Container>
  );
}

function VerificationFailure() {
  return (
    <Container size="md">
      <Alert color="danger">
        <h1 className="mb-2">Email Verification Failed</h1>
        <p>There was an issue verifying your email address.</p>
      </Alert>
    </Container>
  );
}

export default function EmailVerificationPage() {
  const [verified, setVerified] = useState<null | boolean>(null);

  useEffect(() => {
    let token = new URLSearchParams(window.location.search).get("token");

    if (typeof token === "string") {
      fetch(process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token } as EmailVerificationRequestBody)
      })
        .then(res => {
          if (res.status === 200) return res.json();
          throw new Error();
        })
        .then((data: EmailVerificationResponseBody) =>
          setVerified(data.verified)
        )
        .catch(() => setVerified(false));
    } else setVerified(false);
  }, []);

  if (verified === null) {
    return <Container size="md">Checking...</Container>;
  }

  if (verified) {
    return <VerificationSuccess />;
  }

  return <VerificationFailure />;
}
