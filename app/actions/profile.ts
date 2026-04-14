'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireSession } from '@/lib/auth'
import { handleActionError, validationError } from '@/lib/action-utils'
import { type ActionState, type SessionPayload } from '@/lib/definitions'
import { verifyPassword, hashPassword } from '@/lib/password'

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Současné heslo je povinné'),
    newPassword: z.string().min(6, 'Nové heslo musí mít alespoň 6 znaků'),
    confirmPassword: z.string().min(6, 'Heslo musí mít alespoň 6 znaků'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hesla se neshodují",
    path: ["confirmPassword"],
})

type ChangePasswordFields =
    | 'currentPassword'
    | 'newPassword'
    | 'confirmPassword'

export async function changePassword(
    _prevState: ActionState<ChangePasswordFields> | undefined,
    formData: FormData,
) {
    let session: SessionPayload

    try {
        session = await requireSession()
    } catch (error) {
        return handleActionError<ChangePasswordFields>(
            error,
            'Heslo se nepodařilo změnit.',
        )
    }

    const result = ChangePasswordSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return validationError<ChangePasswordFields>(
            result.error.flatten().fieldErrors,
        )
    }

    const { currentPassword, newPassword } = result.data

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(session.userId) },
        })

        if (!user) {
            return { message: 'Uživatel nenalezen.' }
        }

        const isMatch = await verifyPassword(user.passwordHash, currentPassword)

        if (!isMatch) {
            return validationError<ChangePasswordFields>(
                { currentPassword: ['Nesprávné současné heslo'] },
                'Nesprávné současné heslo.',
            )
        }

        const newHash = await hashPassword(newPassword)
        await prisma.user.update({
            where: { id: Number(session.userId) },
            data: { passwordHash: newHash }
        })
    } catch (error) {
        return handleActionError<ChangePasswordFields>(
            error,
            'Heslo se nepodařilo změnit.',
        )
    }

    return { message: 'Heslo úspěšně změněno.', success: true }
}
