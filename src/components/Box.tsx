interface Props {
  children: React.ReactNode;
}

export default function Box({ children }: Props) {
  return <div className="border p-4 shadow">{children}</div>;
}
