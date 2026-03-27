'use client'

import { useActionState } from 'react'
import { changePassword } from '@/app/actions/profile'

function ChangePasswordForm() {
    const [state, action, isPending] = useActionState(changePassword, undefined)

    if (state?.success) {
        return (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-800">
                Heslo bylo úspěšně změněno.
            </div>
        )
    }

    return (
        <form action={action} className="max-w-xl space-y-5">
            <div>
                <label className="block text-sm font-medium text-[#5a3b31]">Současné heslo</label>
                <input name="currentPassword" type="password" className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]" required />
                {state?.errors?.currentPassword && <p className="mt-2 text-sm text-red-600">{state.errors.currentPassword}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-[#5a3b31]">Nové heslo</label>
                <input name="newPassword" type="password" className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]" required />
                {state?.errors?.newPassword && <p className="mt-2 text-sm text-red-600">{state.errors.newPassword}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-[#5a3b31]">Potvrzení nového hesla</label>
                <input name="confirmPassword" type="password" className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]" required />
                {state?.errors?.confirmPassword && <p className="mt-2 text-sm text-red-600">{state.errors.confirmPassword}</p>}
            </div>

            {state?.message && !state.success && (
                <p className="text-sm text-red-600">{state.message}</p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full bg-[linear-gradient(135deg,#2f1b16_0%,#51342b_100%)] px-5 py-3 text-sm font-semibold text-[#fff7f0] shadow-[0_16px_35px_rgba(47,27,22,0.18)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-50"
            >
                {isPending ? 'Měním...' : 'Změnit heslo'}
            </button>
        </form>
    )
}

export default function ProfilePage() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b56a44]">
                    Účet
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-[#241612]">Můj profil</h1>
                <p className="max-w-2xl text-sm leading-6 text-[#6c5148]">
                    Správa přístupových údajů pro interní část webu.
                </p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] p-7 shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
                <h2 className="mb-2 text-lg font-semibold text-[#241612]">Změna hesla</h2>
                <p className="mb-6 text-sm text-[#6c5148]">
                    Pro potvrzení změny zadejte nejdříve současné heslo.
                </p>
                <ChangePasswordForm />
            </div>
        </div>
    )
}
