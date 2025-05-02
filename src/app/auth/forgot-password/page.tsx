// app/auth/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('📩 Revisa tu correo para restablecer tu contraseña.')
      } else {
        setMessage(data.message || 'Hubo un error al enviar el correo.')
      }
    } catch {
      setMessage('📩 Revisa tu correo para restablecer tu contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-xl font-semibold ">Recuperar contraseña</h1>
        <p className="text-sm text-muted-foreground mb-4">Ingresa tu correo electrónico para recibir un enlace de recuperación.</p>
        <div className="space-y-4">
          <div className="mb-4 space-y-3">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </Button>
          {message && <p className="text-sm text-center mt-2 text-muted-foreground">{message}</p>}
        </div>
      </form>
    </section>
  )
}
