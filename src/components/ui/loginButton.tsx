import { ReactNode } from "react";
import Link from "next/link";

interface ButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function Button({ href, children, className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all font-semibold ${className}`}
    >
      {children}
    </Link>
  );
}