"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

    console.log("Datos enviados al backend:", formData); // Log para depurar

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

      console.log("Respuesta del backend:", response); // Log para depurar

      if (response.status === 201) {
        setSuccess(true);
        router.push("/Login");
      }
    } catch (err: any) {
      console.error("Error en la solicitud:", err); // Log para depurar
      setError(err.response?.data?.message || "Error creating account");
    }
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              <h1 className="text-title mb-1 mt-4 text-xl font-semibold">Create an Account</h1>
            </Link>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <div className="mt-6 sz-2 flex justify-center items-center">
            <Button
              type="button"
              variant="outline"
              className="flex justify-center items-center"
              onClick={() => signIn("google")}
            >
              <span>Sign Up with Google</span>
            </Button>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="space-y-5">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">Account created successfully!</p>}

            <div className="space-y-2">
              <Label htmlFor="name" className="block text-sm">
                Name
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
                Email
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
                Phone
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
                Password
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
              Continue
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Have an account?
            <Button asChild variant="link" className="px-2">
              <Link href="/Login">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
