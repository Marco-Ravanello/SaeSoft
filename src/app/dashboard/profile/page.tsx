'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Lock, Save, Loader2, ShieldCheck } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, update, status } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name)
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, currentPassword, newPassword })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: data.message })
        await update({ name })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setMessage({ type: 'error', text: data.error })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-slate-400" size={40} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 py-10">
      <header>
        <h1 className="text-3xl font-black italic text-slate-900 tracking-tight uppercase">Mi Perfil</h1>
        <p className="text-slate-500 mt-1">Gestiona tu información personal y seguridad de la cuenta.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 space-y-8">
              {message.text && (
                <div className={`p-5 rounded-2xl text-sm font-bold flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {message.type === 'success' ? <ShieldCheck size={20}/> : <Lock size={20}/>}
                  {message.text}
                </div>
              )}

              <section className="space-y-4">
                <h2 className="text-lg font-black uppercase text-slate-800 flex items-center gap-2 italic">
                  <User className="text-blue-500" size={20} />
                  Información General
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-1 opacity-60">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Usuario</label>
                    <input
                      type="text"
                      value={(session?.user as any)?.username || ''}
                      disabled
                      className="w-full p-4 rounded-2xl bg-slate-100 border-none cursor-not-allowed font-bold"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4 pt-4 border-t border-slate-50">
                <h2 className="text-lg font-black uppercase text-slate-800 flex items-center gap-2 italic">
                  <Lock className="text-amber-500" size={20} />
                  Seguridad
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deja en blanco para no cambiar</p>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña Actual</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Confirmar cambios con contraseña"
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Nueva</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 rounded-[1.5rem] bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-4 shadow-xl">
            <h3 className="font-black text-xl italic uppercase tracking-tight">Tu Rol: {(session?.user as any)?.role}</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Mantén tus datos actualizados para garantizar la trazabilidad de tus acciones en el sistema SAE.
            </p>
            <div className="pt-4 flex items-center gap-3 text-blue-400">
              <ShieldCheck size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Cuenta Verificada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
