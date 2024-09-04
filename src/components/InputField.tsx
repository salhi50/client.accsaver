import { useId } from "react";

interface InputFieldProps {
  label: string;
  type?: "email" | "text" | "password";
  defaultValue?: string;
  multiline?: boolean;
  name?: string;
  required?: boolean;
  errorMessage?: string;
}

export default function InputField({
  label,
  name,
  type = "text",
  defaultValue,
  multiline = false,
  required,
  errorMessage
}: InputFieldProps) {
  const id = useId();

  const props: Partial<InputFieldProps> & { className: string; id: string } = {
    id,
    name,
    className: "input-field",
    defaultValue,
    required
  };
  let Tag: "input" | "textarea";

  if (multiline) {
    Tag = "textarea";
    props.className += " min-h-24 resize-y";
  } else {
    Tag = "input";
    props.type = type;
  }

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-body-small font-medium block">
        {label}
      </label>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Tag {...props} />
      {errorMessage && (
        <p className="text-body-small text-danger">{errorMessage}</p>
      )}
    </div>
  );
}
