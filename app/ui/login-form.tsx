'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginForm() {
    const [state, action, isPending] = useActionState(login, undefined)
    const emailErrorId = state?.errors?.email ? 'login-email-error' : undefined
    const passwordErrorId = state?.errors?.password ? 'login-password-error' : undefined
    const formErrorId = state?.message ? 'login-form-error' : undefined

    return (
        <form action={action} className="space-y-5" noValidate>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100" htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    aria-invalid={state?.errors?.email ? 'true' : 'false'}
                    aria-describedby={emailErrorId}
                    placeholder="jan.novak@ateneo.cz"
                    className="w-full rounded-2xl border border-white/15 bg-white/12 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-[#f4d8c7] focus:bg-white/15 focus:ring-2 focus:ring-[#f4d8c7]/40"
                />
                {state?.errors?.email && <p id={emailErrorId} className="text-sm text-red-200">{state.errors.email}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100" htmlFor="password">Heslo</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    aria-invalid={state?.errors?.password ? 'true' : 'false'}
                    aria-describedby={passwordErrorId}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/15 bg-white/12 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-[#f4d8c7] focus:bg-white/15 focus:ring-2 focus:ring-[#f4d8c7]/40"
                />
                {state?.errors?.password && <p id={passwordErrorId} className="text-sm text-red-200">{state.errors.password}</p>}
            </div>

            {state?.message && (
                <div id={formErrorId} role="alert" aria-live="polite" className="rounded-2xl border border-red-300/35 bg-red-500/15 p-3 text-center text-sm text-red-100">
                    {state.message}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                aria-describedby={formErrorId}
                className="w-full rounded-2xl bg-[#f3dfd1] px-4 py-3 font-bold text-slate-900 shadow-lg shadow-black/15 hover:bg-[#f8e9df] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-75"
            >
                {isPending ? 'Přihlašování...' : 'Přihlásit se'}
            </button>
        </form>
    )
}
