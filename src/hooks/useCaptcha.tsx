import { useCallback, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function useCaptcha() {
  const ref = useRef<ReCAPTCHA | null>(null);

  const reset = useCallback(() => {
    if (ref.current && typeof ref.current.reset === "function") {
      ref.current.reset();
    }
  }, [ref]);

  const Component = useCallback(
    () => (
      <ReCAPTCHA
        ref={ref}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      />
    ),
    [ref]
  );

  const fieldName = "g-recaptcha-response";
  const requiredErrorMessage = "Please complete the CAPTCHA to proceed.";

  return { reset, Component, fieldName, requiredErrorMessage };
}
