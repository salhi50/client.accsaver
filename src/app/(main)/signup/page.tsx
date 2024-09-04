"use client";

import {
  CredentielsValidation,
  SignupRequestBody,
  SignupErrorResponseBody,
  ResponseErrorMessage
} from "accsaver-shared";
import { FormEventHandler, useContext, useRef, useState } from "react";
import Button from "@/components/Button";
import Container from "@/components/Container";
import InputField from "@/components/InputField";
import useCaptcha from "@/hooks/useCaptcha";
import { AppAlertContext, LoadingContext } from "../contexts";

export default function SignupPage() {
  const setAlertContent = useContext(AppAlertContext);
  const setLoading = useContext(LoadingContext);
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [emailVerSent, setEmailVerSent] = useState(false);
  const emailRef = useRef<string>();
  const Captcha = useCaptcha();

  const handleSuccessfulResponse = function () {
    setAlertContent("");
    setLoading(false);
    setEmailVerSent(true);
  };

  const handleErrorResponse = function (err: Error) {
    Captcha.reset();
    setLoading(false);

    switch (err.message as SignupErrorResponseBody["message"]) {
      case ResponseErrorMessage.CAPTCHA_ERROR:
        setAlertContent("CAPTCHA verification failed.");
        break;
      case ResponseErrorMessage.INVALID_EMAIL_OR_PASSWORD:
        setAlertContent(
          "The email address or password you provided is invalid."
        );
        break;
      case ResponseErrorMessage.WEAK_PASSWORD:
        setAlertContent(
          "Weak password detected. Please avoid using common patterns, personal information, or sequences."
        );
        break;
      case ResponseErrorMessage.EMAIL_EXIST:
        setAlertContent(
          `The email address provided ${emailRef.current || ""} is already registered. Please use a different email or log in.`
        );
        break;
      default:
        setAlertContent("An unexpected error has occurred.");
        break;
    }
  };

  const submitForm = function (body: SignupRequestBody) {
    const req = new Request(process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT, {
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
        .then((data: SignupErrorResponseBody) => {
          if (data.error) throw new Error(data.message);
          throw new Error();
        })
        .catch(reject);
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = function (e) {
    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    const captchaResponse = data.get(Captcha.fieldName);

    let emailError, passwordError, confirmPasswordError;
    e.preventDefault();

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string" ||
      typeof captchaResponse !== "string"
    ) {
      return;
    }

    emailError = CredentielsValidation.validateEmail(email);
    passwordError = CredentielsValidation.validatePassword(password);
    confirmPasswordError = "";

    if (!passwordError && password !== confirmPassword) {
      confirmPasswordError = "Passwords do not match.";
    }

    setFormErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });

    if (emailError || passwordError || confirmPasswordError) {
      return;
    }

    if (!captchaResponse) return alert(Captcha.requiredErrorMessage);

    setLoading(true);

    submitForm({ email, password, captchaResponse })
      .then(handleSuccessfulResponse)
      .catch(handleErrorResponse);
  };

  if (emailVerSent) {
    return (
      <Container size="sm" className="space-y-4">
        <img src="/envelope-64x64.png" alt="email" width={64} height={64} />
        <h1>Thanks for Registering!</h1>
        <p>
          We’ve just sent a verification email to&nbsp;
          <strong>{emailRef.current}</strong> Check your inbox or spam/junk
          folder and click the link to verify your email and complete your
          registration.
        </p>
      </Container>
    );
  }

  return (
    <Container size="sm">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <h1>Create an account</h1>
        <InputField
          type="email"
          label="Email address"
          name="email"
          errorMessage={formErrors.email}
        />
        <InputField
          type="password"
          label="Password"
          name="password"
          errorMessage={formErrors.password}
        />
        <InputField
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          errorMessage={formErrors.confirmPassword}
        />
        <Captcha.Component />
        <Button submit fullWidth>
          Create
        </Button>
        <p className="text-center mt-4">
          Already have an account?&nbsp;
          <a href="/login" className="link link-primary">
            Login here
          </a>
        </p>
      </form>
    </Container>
  );
}
