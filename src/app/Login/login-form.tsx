"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// --- sustituye axios por tu instancia preconfigurada ---
import api from "@/lib/axios";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import axios from "axios";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Datos enviados al backend:", formData);

    try {
      const response = await api.post<{
        user: any;
        tokens: { accessToken: string; refreshToken: string };
        mfaRequired: boolean;
      }>("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Respuesta del backend:", response.data);

      // Verifica y accede al token anidado
      if (
        (response.status === 200 || response.status === 201) &&
        response.data.tokens && // Verifica que 'tokens' exista
        response.data.tokens.accessToken // Accede al token anidado
      ) {
        const accessToken = response.data.tokens.accessToken; // Guarda el token en una variable

        // guardamos token
        localStorage.setItem("token", accessToken);
        console.log("Token guardado:", accessToken);

        // opcional: añadir token al header por defecto de api
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // Aquí podrías querer manejar el caso de mfaRequired si es true
        if (response.data.mfaRequired) {
           console.log("MFA es requerido. Redirigiendo a verificación...");
           // router.push('/auth/verify-mfa'); // O la ruta correspondiente
        } else {
           router.push("/dashboard");
        }

      } else {
        console.warn("No se recibió el token esperado en el backend.");
        setError("No se recibió el token del backend o la estructura de respuesta es incorrecta.");
      }
    } catch (err: unknown) {
      console.error("Error en la solicitud:", err);
      if (axios.isAxiosError?.(err) && err.response) {
        setError(err.response.data?.message || "Invalid email or password");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">¡Bienvenido de vuelta!</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                 Inicia sesión con tu correo electrónico
                </span>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10" // Espacio para el ícono
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                    <a
                      href="/auth/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pl-10 pr-10" // Espacio para los íconos
                      placeholder="********"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Ingresar
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}