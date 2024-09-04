import clsx from "clsx";

interface Props {
  children: string;
  variant?: "contained" | "outlined";
  color?: "primary" | "danger";
  submit?: boolean;
  small?: boolean;
  fullWidth?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export default function Button({
  children,
  variant = "contained",
  color = "primary",
  submit = false,
  small = false,
  fullWidth = false,
  onClick,
  className
}: Props) {
  return (
    <button
      type={submit ? "submit" : "button"}
      // prettier-ignore
      className={clsx(
        "rounded font-medium border",
        small ? "px-2.5 py-1" : "px-4 py-2",
        fullWidth && "block w-full",
        variant === "contained" && color === "primary" && "bg-primary border-transparent text-white hover:bg-primary-dark",
        variant === "contained" && color === "danger" && "bg-danger border-transparent text-white hover:bg-danger-dark",
        variant === "outlined" && color === "primary" && "bg-transparent border-primary text-primary hover:bg-primary-light",
        variant === "outlined" && color === "danger" && "bg-transparent border-danger text-danger hover:bg-danger-light",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
