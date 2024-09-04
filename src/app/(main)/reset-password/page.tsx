"use client";

import {
  FormEventHandler,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import {
  CredentielsValidation,
  InitPasswordResetRequestBody,
  InitPasswordResetResponseBody,
  ResetPasswordRequestBody,
  ResetPasswordErrorResponseBody,
  ResponseErrorMessage
} from "accsaver-shared";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Container from "@/components/Container";
import InputField from "@/components/InputField";
import useCaptcha from "@/hooks/useCaptcha";
import { AppAlertContext, LoadingContext } from "../contexts";

function Form({ email, token }: { email: string; token: string }) {
  const setAlertContent = useContext(AppAlertContext);
  const setLoading = useContext(LoadingContext);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: ""
  });
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const Captcha = useCaptcha();

  const handleSuccessfulResponse = function () {
    setAlertContent("");
    setLoading(false);
    setPasswordUpdated(true);
  };

  const handleErrorResponse = function (err: Error) {
    Captcha.reset();
    setLoading(false);
    switch (err.message as ResetPasswordErrorResponseBody["message"]) {
      case ResponseErrorMessage.CAPTCHA_ERROR:
        setAlertContent("CAPTCHA verification failed.");
        break;
      case ResponseErrorMessage.INVALID_PASSWORD:
        setAlertContent("The password you provided is invalid.");
        break;
      case ResponseErrorMessage.WEAK_PASSWORD:
        setAlertContent(
          "Weak password detected. Please avoid using common patterns, personal information, or sequences."
        );
        break;
      default:
        setAlertContent("An unexpected error has occurred.");
        break;
    }
  };

  const submit = function (body: ResetPasswordRequestBody) {
    const req = new Request(process.env.NEXT_PUBLIC_RESET_PASSWORD_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    return new Promise((resolve, reject) => {
      fetch(req)
        .then(res => {
          if (res.status === 204) resolve(null);
          else if (res.status === 200) return res.json();
          else throw new Error();
        })
        .then((data: ResetPasswordErrorResponseBody) => {
          if (data.error) throw new Error(data.message);
          throw new Error();
        })
        .catch(reject);
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = function (e) {
    const data = new FormData(e.currentTarget);
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    const captchaResponse = data.get(Captcha.fieldName);
    let passwordError, confirmPasswordError;

    e.preventDefault();

    if (
      typeof password !== "string" ||
      typeof confirmPassword !== "string" ||
      typeof captchaResponse !== "string"
    ) {
      return;
    }

    passwordError = CredentielsValidation.validatePassword(password);
    confirmPasswordError = "";

    if (!passwordError && password !== confirmPassword) {
      confirmPasswordError = "Passwords do not match.";
    }

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError
    });

    if (passwordError || confirmPasswordError) {
      return;
    }

    if (!captchaResponse) {
      alert(Captcha.requiredErrorMessage);
      return;
    }

    setLoading(true);

    submit({ token, captchaResponse, newPassword: password })
      .then(handleSuccessfulResponse)
      .catch(handleErrorResponse);
  };

  if (passwordUpdated) {
    return (
      <Container size="sm">
        <Alert color="success" className="space-y-4 mb-4">
          <h1>Password Reset Successful</h1>
          <p>
            Your password has been successfully reset. You can now log in using
            your new password.
          </p>
        </Alert>
        <a href="/login" className="link link-primary">
          Go to login
        </a>
      </Container>
    );
  }

  return (
    <Container size="sm">
      <form noValidate className="space-y-4" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <p>
          Enter the new password for <strong>{email}</strong>
        </p>
        <InputField
          label="New Password"
          type="password"
          name="password"
          errorMessage={errors.password}
        />
        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          errorMessage={errors.confirmPassword}
        />
        <Captcha.Component />
        <Button submit fullWidth>
          Submit
        </Button>
      </form>
    </Container>
  );
}

export default function ResetPasswordPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const tokenRef = useRef<string>();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (typeof token === "string") {
      tokenRef.current = token;
      fetch(process.env.NEXT_PUBLIC_INIT_PASSWORD_RESET_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token } as InitPasswordResetRequestBody)
      })
        .then(res => {
          if (res.status === 200) return res.json();
          throw new Error();
        })
        .then((data: InitPasswordResetResponseBody) => {
          if (data.email) setEmail(data.email);
          else throw new Error();
        })
        .catch(() => setHasError(true));
    } else setHasError(true);
  }, []);

  if (hasError) {
    return (
      <Container size="sm">
        <Alert>
          <p>
            The reset link you used is invalid, has expired, or something went
            wrong.
          </p>
        </Alert>
      </Container>
    );
  }

  if (email === null) {
    return <Container size="sm">Checking...</Container>;
  }

  return <Form email={email} token={tokenRef.current!} />;
}
