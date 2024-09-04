"use client";

import { FormEventHandler, useContext, useRef, useState } from "react";
import {
  CredentielsValidation,
  ForgotPasswordRequestBody,
  ForgotPasswordErrorResponseBody,
  ResponseErrorMessage
} from "accsaver-shared";
import Button from "@/components/Button";
import Container from "@/components/Container";
import InputField from "@/components/InputField";
import useCaptcha from "@/hooks/useCaptcha";
import { AppAlertContext, LoadingContext } from "../contexts";

export default function ForgotPasswordPage() {
  const setAlertContent = useContext(AppAlertContext);
  const setLoading = useContext(LoadingContext);
  const [formErrors, setFormErrors] = useState({
    email: ""
  });
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const Captcha = useCaptcha();
  const emailRef = useRef<string>();

  const handleSuccessfulResponse = function () {
    setAlertContent("");
    setLoading(false);
    setResetLinkSent(true);
  };

  const handleErrorResponse = function (err: Error) {
    Captcha.reset();
    setLoading(false);
    switch (err.message as ForgotPasswordErrorResponseBody["message"]) {
      case ResponseErrorMessage.CAPTCHA_ERROR:
        setAlertContent("CAPTCHA verification failed.");
        break;
      case ResponseErrorMessage.INVALID_EMAIL:
        setAlertContent("The email address you provided is invalid.");
        break;
      case ResponseErrorMessage.ACCOUNT_NOT_FOUND:
        setAlertContent(
          "The account associated with this email address could not be found."
        );
        break;
      default:
        setAlertContent("An unexpected error has occurred.");
        break;
    }
  };

  const submitForm = function (body: ForgotPasswordRequestBody) {
    const req = new Request(process.env.NEXT_PUBLIC_FORGOT_PASSWORD_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    emailRef.current = body.email;
    return new Promise((resolve, reject) => {
      fetch(req)
        .then(res => {
          if (res.status === 204) resolve(null);
          else if (res.status === 200) return res.json();
          else throw new Error();
        })
        .then((data: ForgotPasswordErrorResponseBody) => {
          if (data.error) throw new Error(data.message);
          throw new Error();
        })
        .catch(reject);
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = function (e) {
    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    const captchaResponse = data.get(Captcha.fieldName);
    let emailError = "";

    e.preventDefault();

    if (typeof email !== "string" || typeof captchaResponse !== "string") {
      return;
    }

    emailError = CredentielsValidation.validateEmail(email);
    setFormErrors({
      email: emailError
    });

    if (emailError) return;

    if (!captchaResponse) return alert(Captcha.requiredErrorMessage);

    setLoading(true);

    submitForm({ email, captchaResponse })
      .then(handleSuccessfulResponse)
      .catch(handleErrorResponse);
  };

  if (resetLinkSent) {
    return (
      <Container size="sm" className="space-y-4">
        <img src="/envelope-64x64.png" alt="email" width={64} height={64} />
        <p>
          We&apos;ve sent a link to reset your password to the following email
          address&nbsp;
          <strong>{emailRef.current}</strong>. Check your inbox and click the
          link in the email to reset your password.
        </p>
      </Container>
    );
  }

  return (
    <Container size="sm">
      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <h1>Forgot Password?</h1>
        <p>
          Enter the email address associated with your account, and we’ll send
          you a link to reset your password.
        </p>
        <InputField
          label="Email Address"
          type="email"
          name="email"
          errorMessage={formErrors.email}
        />
        <Captcha.Component />
        <Button submit fullWidth>
          Send Reset Link
        </Button>
        <a href="/login" className="block link link-primary">
          Back to login
        </a>
      </form>
    </Container>
  );
}
