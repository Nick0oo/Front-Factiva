import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export function VerifyMfaPage() {
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token. Vuelve a iniciar sesión.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/2fa/verify`,
        { code: mfaCode },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token JWT en la cabecera
          },
        }
      );

      // Si el MFA es exitoso
      if (response.status === 200) {
        console.log("MFA verificado exitosamente");

        // Redirigir al dashboard o a la ruta que desees
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      console.error("Error en la verificación de MFA:", err);
      setError("Código MFA inválido.");
    }
  };

  return (
    <div>
      <h1>Verificación MFA</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mfaCode">Código MFA</label>
        <input
          type="text"
          id="mfaCode"
          name="mfaCode"
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value)}
          required
        />
        <button type="submit">Verificar</button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
