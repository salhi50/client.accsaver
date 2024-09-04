"use client";

import { FormEventHandler, useContext } from "react";
import {
  LoginRequestBody,
  LoginResponseBody,
  ResponseErrorMessage
} from "accsaver-shared";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Container from "@/components/Container";
import InputField from "@/components/InputField";
import useCaptcha from "@/hooks/useCaptcha";
import { AppAlertContext, AuthContext, LoadingContext } from "../contexts";

type LoginSuccessfulResponse = Extract<
  LoginResponseBody,
  { accessToken: string }
>;
type LoginErrorResponse = Extract<LoginResponseBody, { error: true }>;

export default function LoginPage() {
  const setAlertContent = useContext(AppAlertContext);
  const setLoading = useContext(LoadingContext);
  const { auth, setAuth } = useContext(AuthContext);
  const router = useRouter();
  const Captcha = useCaptcha();

  const handleSuccessfulResponse = function (res: LoginSuccessfulResponse) {
    setAlertContent("");
    setLoading(false);
    setAuth({ accessToken: res.accessToken });
    router.replace("/accounts");
  };

  const handleErrorResponse = function (err: Error) {
    Captcha.reset();
    setLoading(false);
    switch (err.message as LoginErrorResponse["message"]) {
      case ResponseErrorMessage.CAPTCHA_ERROR:
        setAlertContent("CAPTCHA verification failed.");
        break;
      case ResponseErrorMessage.INVALID_EMAIL_OR_PASSWORD:
        setAlertContent("Invalid Email or Password.");
        break;
      case ResponseErrorMessage.EMAIL_NOT_VERIFIED:
        setAlertContent(
          "Your email is not verified. check your inbox to verify your email."
        );
        break;
      default:
        setAlertContent("An unexpected error has occurred.");
        break;
    }
  };

  const submitForm = function (body: LoginRequestBody) {
    const req = new Request(process.env.NEXT_PUBLIC_LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    return new Promise<LoginSuccessfulResponse>((resolve, reject) => {
      fetch(req)
        .then(res => {
          if (res.status === 200) return res.json();
          throw new Error();
        })
        .then((data: LoginResponseBody) => {
          if ((data as LoginErrorResponse).error)
            throw new Error((data as LoginErrorResponse).message);
          resolve(data as LoginSuccessfulResponse);
        })
        .catch(reject);
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = function (e) {
    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const captchaResponse = data.get(Captcha.fieldName);

    e.preventDefault();

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof captchaResponse !== "string"
    ) {
      return;
    }

    if (!captchaResponse) {
      alert(Captcha.requiredErrorMessage);
      return;
    }

    setLoading(true);

    submitForm({ email, password, captchaResponse })
      .then(handleSuccessfulResponse)
      .catch(handleErrorResponse);
  };

  if (auth) {
    return <Container size="sm">Redirecting...</Container>;
  }

  return (
    <Container size="sm">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <InputField label="Email address" name="email" required type="email" />
        <InputField label="Password" name="password" required type="password" />
        <a href="/forgot-password" className="block link link-primary">
          Forgot Password
        </a>
        <Captcha.Component />
        <Button submit fullWidth>
          Login
        </Button>
        <p className="text-center mt-4">
          Don&apos;t have an account?&nbsp;
          <a href="/signup" className="link link-primary">
            Create one
          </a>
        </p>
      </form>
    </Container>
  );
}
