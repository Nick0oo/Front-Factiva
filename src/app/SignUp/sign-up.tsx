"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        router.push("/Login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating account");
    }
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 dark:bg-transparent">
      <Card className="m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mt-6">Crea una cuenta</CardTitle>
          <CardDescription>
            Completa los campos para comenzar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mt-6 sz-2 flex justify-center items-center">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                type="button"
                onClick={() => signIn("google")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 262"
                  className="h-5 w-5"
                >
                  <path
                    fill="#4285f4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34a853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#fbbc05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  ></path>
                  <path
                    fill="#eb4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
                Continuar con Google
              </Button>
            </div>

            <hr className="my-4 border-dashed" />

            <div className="space-y-5">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && (
                <p className="text-green-500 text-sm">
                  ¡Cuenta creada exitosamente!
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="block text-sm">
                  Nombre
                </Label>
                <Input
                  type="text"
                  required
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm">
                  Correo Electrónico
                </Label>
                <Input
                  type="email"
                  required
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="block text-sm">
                  Teléfono
                </Label>
                <Input
                  type="tel"
                  required
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="block text-sm">
                  Contraseña
                </Label>
                <Input
                  type="password"
                  required
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" className="w-full">
                Continuar
              </Button>
            </div>
          </form>
        </CardContent>
        <div className="bg-muted rounded-[--radius] border p-3">
          <p className="text-accent-foreground text-center text-sm">
            ¿Ya tienes una cuenta?
            <Button asChild variant="link" className="px-2">
              <Link href="/Login">Inicia sesión</Link>
            </Button>
          </p>
        </div>
      </Card>
    </section>
  );
}
