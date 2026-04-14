'use server'

import { handleActionError, validationError } from '@/lib/action-utils'
import { prisma } from '@/lib/db'
import { LoginSchema, RoleSchema, type ActionState } from '@/lib/definitions'
import { verifyPassword } from '@/lib/password'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'

type LoginFields = 'email' | 'password'
const INVALID_LOGIN_MESSAGE = 'Nesprávné přihlašovací údaje nebo neaktivní účet.'

export async function login(
    _prevState: ActionState<LoginFields> | undefined,
    formData: FormData,
) {
    const result = LoginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return validationError<LoginFields>(
            result.error.flatten().fieldErrors,
            'Chybná pole. Zkontrolujte prosím své údaje.',
        )
    }

    const { email, password } = result.data

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true }
        })

        if (!user || !user.isActive) {
            return {
                message: INVALID_LOGIN_MESSAGE,
            }
        }

        const passwordsMatch = await verifyPassword(user.passwordHash, password)

        if (!passwordsMatch) {
            return {
                message: INVALID_LOGIN_MESSAGE,
            }
        }

        const parsedRole = RoleSchema.safeParse(user.role.name)

        if (!parsedRole.success) {
            throw new Error(`Unexpected role name on login: ${user.role.name}`)
        }

        await createSession(user.id, parsedRole.data)
    } catch (error) {
        return handleActionError<LoginFields>(
            error,
            'Přihlášení se nezdařilo.',
        )
    }

    redirect('/dashboard')
}

export async function logout() {
    await deleteSession()
    redirect('/login')
}
