import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Container({
  children = "",
  size = "lg",
  className
}: Props) {
  return (
    <div
      className={clsx(
        "mx-auto px-6",
        size === "lg" && "max-w-7xl",
        size === "md" && "max-w-4xl",
        size === "sm" && "max-w-md",
        className
      )}
    >
      {children}
    </div>
  );
}
