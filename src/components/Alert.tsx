import clsx from "clsx";

interface AlertProps {
  color?: "danger" | "success";
  children: React.ReactNode;
  className?: string;
}

export default function Alert({
  color = "danger",
  children,
  className
}: AlertProps) {
  return (
    <div
      className={clsx(
        "p-4 border w-full",
        color === "danger" && "text-danger border-danger bg-danger-light",
        color === "success" && "text-success border-success bg-success-light",
        className
      )}
    >
      {children}
    </div>
  );
}
