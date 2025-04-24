"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/auth"; // Asegurate de que el path sea correcto

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get("token") : null;
  console.log("Token enviado:", token);

  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Token inválido o ausente");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await resetPassword({ token: token as string, newPassword });
      setMessage("✅ Contraseña actualizada correctamente. Redirigiendo...");
      setTimeout(() => router.push("/Login"), 2500);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-xl font-semibold mb-4">Restablecer contraseña</h1>
        {!token ? (
          <p className="text-red-500">Token inválido</p>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Restablecer"}
            </Button>
            {message && (
              <p className="text-sm text-center mt-2 text-muted-foreground">
                {message}
              </p>
            )}
          </div>
        )}
      </form>
    </section>
  );
}
