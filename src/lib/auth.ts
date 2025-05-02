// lib/auth.ts
import api from "@/lib/axios";

export async function resetPassword({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) {
  try {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al restablecer la contraseña.");
  }
}
