'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { resetPassword } from '@/lib/auth'
import { Eye, EyeOff } from 'lucide-react'
import clsx from 'clsx'


export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams ? searchParams.get('token') : null
  const router = useRouter()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    strength: '',
    match: ''
  })

  useEffect(() => {
    if (!token) setMessage('Token inválido o ausente')
  }, [token])

  const validatePassword = (password: string) => {
    const length = password.length >= 8
    const upper = /[A-Z]/.test(password)
    const lower = /[a-z]/.test(password)
    const number = /[0-9]/.test(password)
    const symbol = /[^A-Za-z0-9]/.test(password)

    if (!length || !upper || !lower || !number || !symbol) {
      return 'Debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.'
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const strengthError = validatePassword(newPassword)
    const matchError = newPassword !== confirmPassword ? 'Las contraseñas no coinciden.' : ''

    setErrors({ strength: strengthError, match: matchError })

    if (strengthError || matchError) return

    setLoading(true)
    setMessage('')

    try {
      await resetPassword({ token: token as string, newPassword })
      setMessage('✅ Contraseña actualizada correctamente. Redirigiendo...')
      setTimeout(() => router.push('/Login'), 2500)
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      
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
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-xl font-semibold mb-6">Restablecer contraseña</h1>
        {!token ? (
          <p className="text-red-500">Token inválido</p>
        ) : (
          <div className="space-y-4">
            {/* Nueva contraseña */}
            <div>
              <Label htmlFor="newPassword" className="mb-1 block">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword1 ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={clsx({ 'border-red-500': errors.strength })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword1(!showPassword1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword1 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.strength && (
                <p className="text-sm text-red-500 mt-1">{errors.strength}</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <Label htmlFor="confirmPassword" className="mb-1 block">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword2 ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={clsx({ 'border-red-500': errors.match })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.match && (
                <p className="text-sm text-red-500 mt-1">{errors.match}</p>
              )}
            </div>

            {/* Botón */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Restablecer'}
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
    </div>
  )
}
