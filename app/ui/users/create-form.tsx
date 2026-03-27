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
        <form action={action} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Jméno</label>
                    <input
                        name="firstName"
                        defaultValue={user?.firstName ?? ''}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                    />
                    {state?.errors?.firstName && <p className="text-red-500 text-sm">{state.errors.firstName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Příjmení</label>
                    <input
                        name="lastName"
                        defaultValue={user?.lastName ?? ''}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                    />
                    {state?.errors?.lastName && <p className="text-red-500 text-sm">{state.errors.lastName}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    name="email"
                    type="email"
                    defaultValue={user?.email ?? ''}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                />
                {state?.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    {isEditing ? 'Nové heslo (volitelné)' : 'Heslo'}
                </label>
                <input
                    name="password"
                    type="password"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required={!isEditing}
                />
                {state?.errors?.password && <p className="text-red-500 text-sm">{state.errors.password}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        name="roleId"
                        defaultValue={String(user?.roleId ?? roles[0]?.id ?? '')}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    {state?.errors?.roleId && <p className="text-red-500 text-sm">{state.errors.roleId}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hlas</label>
                    <select
                        name="voice"
                        defaultValue={user?.voice ?? ''}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                        <option value="">-</option>
                        {VOICES.map((voice) => (
                            <option key={voice} value={voice}>
                                {VOICE_LABELS[voice]}
                            </option>
                        ))}
                    </select>
                    {state?.errors?.voice && <p className="text-red-500 text-sm">{state.errors.voice}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Telefon</label>
                <input
                    name="phone"
                    defaultValue={user?.phone ?? ''}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
                {state?.errors?.phone && <p className="text-red-500 text-sm">{state.errors.phone}</p>}
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <input
                    name="isActive"
                    type="checkbox"
                    defaultChecked={user?.isActive ?? true}
                    className="h-4 w-4 rounded border-gray-300 text-slate-900"
                />
                <span className="text-sm text-gray-700">Uživatel má aktivní přístup</span>
            </label>
            {state?.errors?.isActive && <p className="text-red-500 text-sm">{state.errors.isActive}</p>}

            {state?.message && (
                <p className="text-red-500 text-sm">{state.message}</p>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
                >
                    {isPending ? 'Ukládám...' : (isEditing ? 'Uložit změny' : 'Vytvořit uživatele')}
                </button>
            </div>
        </form>
    )
}
