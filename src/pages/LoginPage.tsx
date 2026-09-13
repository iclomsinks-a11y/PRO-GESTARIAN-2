import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../lib/ToastContext'
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  Building2,
  ArrowLeft,
  LogOut
} from 'lucide-react'

export const LoginPage: React.FC = () => {
  const { perfil, loginAsUsuario, isDeviceRegistered, clearDeviceRegistration } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [email, setEmail] = useState('gestion@talleresdmcar.es')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Si el usuario ya está registrado en este dispositivo, redirigir directamente sin pedir claves
  const [autoRedirecting, setAutoRedirecting] = useState(false)

  useEffect(() => {
    if (perfil && perfil.activo && isDeviceRegistered()) {
      setAutoRedirecting(true)
      const timer = setTimeout(() => {
        navigate('/app', { replace: true })
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [perfil, isDeviceRegistered, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email.trim()) {
      setErrorMsg('Por favor introduce tu dirección de correo electrónico.')
      return
    }

    if (!password.trim()) {
      setErrorMsg('Por favor introduce tu contraseña de acceso.')
      return
    }

    setLoading(true)
    try {
      const res = await loginAsUsuario(email, password, rememberDevice)
      if (res.success) {
        addToast(`Bienvenido a ${res.user?.tallerNombre || 'GESTARIAN'}`, 'success')
        navigate('/app', { replace: true })
      } else {
        setErrorMsg(res.error || 'Credenciales incorrectas o usuario no autorizado.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchAccount = () => {
    clearDeviceRegistration()
    setAutoRedirecting(false)
  }

  // Pantalla cuando el dispositivo ya está registrado (Auto-login instantáneo)
  if (autoRedirecting && perfil) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="w-full max-w-md bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 backdrop-blur-md shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Smartphone className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Dispositivo Reconocido
            </div>
            <h2 className="text-xl font-black text-white">{perfil.nombre}</h2>
            <p className="text-xs text-slate-400 mt-1">{perfil.tallerNombre || perfil.email}</p>
          </div>

          <p className="text-xs text-slate-400">
            Iniciando sesión automáticamente sin solicitar claves...
          </p>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => navigate('/app', { replace: true })}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
            >
              <span>Acceder Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleSwitchAccount}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Entrar con otra cuenta o cambiar usuario</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-600/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-600/20 blur-[130px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-slate-900">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              GESTARIAN
            </span>
            <p className="text-[10px] text-slate-500 font-medium">Acceso para Usuarios Registrados</p>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Inicio</span>
        </Link>
      </header>

      {/* Main Login Form */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-slate-900/90 border border-indigo-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-md relative">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white">Acceso de Clientes</h1>
            <p className="text-xs text-slate-400 mt-1">
              Introduce tu correo y contraseña registrados para acceder a tu taller o negocio.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Correo Electrónico Registrado</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ej. gestion@talleresdmcar.es"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Contraseña de Acceso</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce tu contraseña"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 pr-10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox: Recordar este dispositivo */}
            <div className="pt-1 pb-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-300 leading-snug">
                  <strong className="text-slate-200">Recordar este dispositivo:</strong> no volver a solicitar claves en este navegador.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              ¿Aún no tienes cuenta activa?{' '}
              <Link to="/portal" className="text-indigo-400 hover:underline font-medium">
                Solicitar registro de taller
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-slate-600">
        <p>© {new Date().getFullYear()} GESTARIAN. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
