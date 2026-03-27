'use server'

import { LoginSchema, type ActionState } from '@/lib/definitions'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/password'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'

type LoginFields = 'email' | 'password'

export async function login(
    _prevState: ActionState<LoginFields> | undefined,
    formData: FormData,
) {
    const result = LoginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
            message: 'Chybná pole. Zkontrolujte prosím své údaje.',
        }
    }

    const { email, password } = result.data

    const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true }
    })

    if (!user || !user.isActive) {
        return {
            message: 'Nesprávné přihlašovací údaje nebo neaktivní účet.',
        }
    }

    const passwordsMatch = await verifyPassword(user.passwordHash, password)

    if (!passwordsMatch) {
        return {
            message: 'Nesprávné přihlašovací údaje.',
        }
    }

    await createSession(user.id, user.role.name)
    redirect('/dashboard')
}

export async function logout() {
    await deleteSession()
    redirect('/login')
}
