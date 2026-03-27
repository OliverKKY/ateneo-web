'use client'

import { useActionState } from 'react'
import { createUser, updateUser } from '@/app/actions/users'
import { VOICES, VOICE_LABELS, type ActionState } from '@/lib/definitions'

type Role = {
    id: number
    name: string
}

type UserFormData = {
    id?: number
    firstName?: string
    lastName?: string
    email?: string
    roleId?: number
    voice?: (typeof VOICES)[number] | null
    phone?: string | null
    isActive?: boolean
}

export default function CreateUserForm({
    roles,
    user,
}: {
    roles: Role[]
    user?: UserFormData
}) {
    const isEditing = typeof user?.id === 'number'
    const userId = user?.id ?? 0
    const actionWithId = isEditing ? updateUser.bind(null, userId) : createUser
    const [state, action, isPending] = useActionState<ActionState<string> | undefined, FormData>(
        actionWithId,
        undefined,
    )

    return (
        <form action={action} className="space-y-5 rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] p-7 shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Jméno</label>
                    <input
                        name="firstName"
                        defaultValue={user?.firstName ?? ''}
                        className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                        required
                    />
                    {state?.errors?.firstName && <p className="mt-2 text-sm text-red-600">{state.errors.firstName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Příjmení</label>
                    <input
                        name="lastName"
                        defaultValue={user?.lastName ?? ''}
                        className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                        required
                    />
                    {state?.errors?.lastName && <p className="mt-2 text-sm text-red-600">{state.errors.lastName}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#5a3b31]">Email</label>
                <input
                    name="email"
                    type="email"
                    defaultValue={user?.email ?? ''}
                    className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    required
                />
                {state?.errors?.email && <p className="mt-2 text-sm text-red-600">{state.errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-[#5a3b31]">
                    {isEditing ? 'Nové heslo (volitelné)' : 'Heslo'}
                </label>
                <input
                    name="password"
                    type="password"
                    className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    required={!isEditing}
                />
                {state?.errors?.password && <p className="mt-2 text-sm text-red-600">{state.errors.password}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Role</label>
                    <select
                        name="roleId"
                        defaultValue={String(user?.roleId ?? roles[0]?.id ?? '')}
                        className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    >
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    {state?.errors?.roleId && <p className="mt-2 text-sm text-red-600">{state.errors.roleId}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Hlas</label>
                    <select
                        name="voice"
                        defaultValue={user?.voice ?? ''}
                        className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    >
                        <option value="">-</option>
                        {VOICES.map((voice) => (
                            <option key={voice} value={voice}>
                                {VOICE_LABELS[voice]}
                            </option>
                        ))}
                    </select>
                    {state?.errors?.voice && <p className="mt-2 text-sm text-red-600">{state.errors.voice}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#5a3b31]">Telefon</label>
                <input
                    name="phone"
                    defaultValue={user?.phone ?? ''}
                    className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                />
                {state?.errors?.phone && <p className="mt-2 text-sm text-red-600">{state.errors.phone}</p>}
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-[#e6d4ca] bg-[rgba(255,255,255,0.58)] px-4 py-4">
                <input
                    name="isActive"
                    type="checkbox"
                    defaultChecked={user?.isActive ?? true}
                    className="h-4 w-4 rounded border-[#c9a999] text-[#5a3b31]"
                />
                <span className="text-sm text-[#6c5148]">Uživatel má aktivní přístup</span>
            </label>
            {state?.errors?.isActive && <p className="text-sm text-red-600">{state.errors.isActive}</p>}

            {state?.message && (
                <p className="text-sm text-red-600">{state.message}</p>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full justify-center rounded-full bg-[linear-gradient(135deg,#2f1b16_0%,#51342b_100%)] px-5 py-3 text-sm font-semibold text-[#fff7f0] shadow-[0_16px_35px_rgba(47,27,22,0.18)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                >
                    {isPending ? 'Ukládám...' : (isEditing ? 'Uložit změny' : 'Vytvořit uživatele')}
                </button>
            </div>
        </form>
    )
}
