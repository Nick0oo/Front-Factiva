"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import axios from "axios";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("Login payload:", formData);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login response status:", response.status);
      console.log("Login response data:", response.data);

      // Soportar both formats: { tokens: {...} } o { accessToken, refreshToken }
      const tokens = response.data.tokens ?? {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
      const mfaRequired = response.data.mfaRequired ?? false;

      if (tokens.accessToken) {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        router.push(mfaRequired ? "/Login/MFA" : "/dashboard");
      } else {
        console.warn("No accessToken en respuesta:", response.data);
        setError("No se recibió el token del servidor");
      }
    } catch (err: any) {
      console.error("Error en login:", err);
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Error inesperado";
      setError(message || "Error inesperado");
    }
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-card m-auto w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="p-8 pb-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold">Login to Your Account</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Please login below.
            </p>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="block text-sm">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-[var(--radius)] border-t p-3 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/SignUp" className="underline underline-offset-4 text-primary">
            Sign up
          </Link>
        </div>
      </form>
    </section>
  );
}