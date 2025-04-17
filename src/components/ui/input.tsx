import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`block px-2 w-full py-2 rounded-md border border-gray-900 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-xxl font-semibold ${className}`}
      required
      onInvalid={(e) => {
        e.preventDefault(); // Evita el mensaje de error predeterminado del navegador
        (e.target as HTMLInputElement).setCustomValidity("Campo obligatorio");
      }}
      onInput={(e) => {
        (e.target as HTMLInputElement).setCustomValidity(""); // Limpia el mensaje de error al escribir
      }}
      {...props}
    />
  );
}