import { ReactNode } from "react";

interface LabelProps {
  htmlFor: string;
  children: ReactNode;
  className?: string;
}

export default function Label({ htmlFor, children, className = "" }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
}