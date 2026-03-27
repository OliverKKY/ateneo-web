'use client'

import { useActionState } from 'react'
import { changePassword } from '@/app/actions/profile'

function ChangePasswordForm() {
    const [state, action, isPending] = useActionState(changePassword, undefined)

    if (state?.success) {
        return (
            <div className="bg-green-50 p-4 rounded-lg text-green-700 border border-green-200">
                Heslo bylo úspěšně změněno.
            </div>
        )
    }

    return (
        <form action={action} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-gray-700">Současné heslo</label>
                <input name="currentPassword" type="password" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required />
                {state?.errors?.currentPassword && <p className="text-red-500 text-sm">{state.errors.currentPassword}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Nové heslo</label>
                <input name="newPassword" type="password" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required />
                {state?.errors?.newPassword && <p className="text-red-500 text-sm">{state.errors.newPassword}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Potvrzení nového hesla</label>
                <input name="confirmPassword" type="password" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required />
                {state?.errors?.confirmPassword && <p className="text-red-500 text-sm">{state.errors.confirmPassword}</p>}
            </div>

            {state?.message && !state.success && (
                <p className="text-red-500 text-sm">{state.message}</p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
            >
                {isPending ? 'Měním...' : 'Změnit heslo'}
            </button>
        </form>
    )
}

export default function ProfilePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Můj profil</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4">Změna hesla</h2>
                <ChangePasswordForm />
            </div>
        </div>
    )
}
