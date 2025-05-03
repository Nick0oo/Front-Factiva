// app/auth/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ForgotHeader } from '@/app/Home/forgot-header'

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
    <div>
    <ForgotHeader />
    <section className="relative flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black overflow-hidden">

      {/* Fondo decorativo */}
      <div
        aria-hidden
        className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block z-0"
      >
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="relative z-10 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-xl font-semibold">Restablecer contraseña</h1>
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
    </div>
  )
}
