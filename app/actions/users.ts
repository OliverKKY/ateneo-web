'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import {
    handleActionError,
    parsePositiveIntegerId,
    validationError,
} from '@/lib/action-utils'
import {
    validateDeleteUserSafety,
    validateSelfUpdateSafety,
} from '@/lib/user-management'
import {
    ADMIN_ONLY_ROLES,
    EmailSchema,
    VoiceSchema,
    type ActionState,
    type SessionPayload,
} from '@/lib/definitions'
import { hashPassword } from '@/lib/password'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const OptionalVoiceSchema = z.preprocess(
    (value) => value === '' ? undefined : value,
    VoiceSchema.optional(),
)

const UserSchema = z.object({
    firstName: z.string().min(1, 'Jméno je povinné'),
    lastName: z.string().min(1, 'Příjmení je povinné'),
    email: EmailSchema,
    password: z.string().min(6, 'Heslo musí mít alespoň 6 znaků'),
    roleId: z.coerce.number().min(1, 'Role je povinná'),
    voice: OptionalVoiceSchema,
    phone: z.preprocess(
        (value) => value === '' ? undefined : value,
        z.string().trim().optional(),
    ),
})

const UserUpdateSchema = z.object({
    firstName: z.string().min(1, 'Jméno je povinné'),
    lastName: z.string().min(1, 'Příjmení je povinné'),
    email: EmailSchema,
    password: z.preprocess(
        (value) => value === '' ? undefined : value,
        z.string().min(6, 'Heslo musí mít alespoň 6 znaků').optional(),
    ),
    roleId: z.coerce.number().min(1, 'Role je povinná'),
    voice: OptionalVoiceSchema,
    phone: z.preprocess(
        (value) => value === '' ? undefined : value,
        z.string().trim().optional(),
    ),
    isActive: z.preprocess(
        (value) => value === 'on' || value === true,
        z.boolean(),
    ),
})

type UserFields =
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'password'
    | 'roleId'
    | 'voice'
    | 'phone'
    | 'isActive'

async function ensureAdminRole(): Promise<
    | { success: true; session: SessionPayload }
    | { success: false; state: ActionState<UserFields> }
> {
    try {
        const session = await requireRole(ADMIN_ONLY_ROLES)
        return { success: true, session }
    } catch (error) {
        return {
            success: false,
            state: handleActionError<UserFields>(
                error,
                'Chyba při ukládání uživatele.',
            ),
        }
    }
}

export async function createUser(
    _prevState: ActionState<UserFields> | undefined,
    formData: FormData,
) {
    const authResult = await ensureAdminRole()
    if (!authResult.success) {
        return authResult.state
    }

    const result = UserSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return validationError<UserFields>(result.error.flatten().fieldErrors)
    }

    const { firstName, lastName, email, password, roleId, voice, phone } = result.data

    try {
        const role = await prisma.role.findUnique({
            where: { id: roleId },
        })

        if (!role) {
            return validationError<UserFields>(
                { roleId: ['Vybraná role neexistuje.'] },
            )
        }

        const passwordHash = await hashPassword(password)
        await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash,
                roleId,
                voice,
                phone,
                isActive: true
            }
        })
    } catch (error) {
        return handleActionError<UserFields>(
            error,
            'Chyba při vytváření uživatele. Email již možná existuje.',
        )
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/users')
    redirect('/dashboard/users')
}

export async function updateUser(
    userId: number,
    _prevState: ActionState<UserFields> | undefined,
    formData: FormData,
) {
    const parsedUserId = parsePositiveIntegerId(userId)

    if (parsedUserId === null) {
        return { message: 'Neplatný uživatel.' }
    }

    const authResult = await ensureAdminRole()
    if (!authResult.success) {
        return authResult.state
    }

    const result = UserUpdateSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return validationError<UserFields>(result.error.flatten().fieldErrors)
    }

    const { firstName, lastName, email, password, roleId, voice, phone, isActive } = result.data

    try {
        const role = await prisma.role.findUnique({
            where: { id: roleId },
        })

        if (!role) {
            return validationError<UserFields>(
                { roleId: ['Vybraná role neexistuje.'] },
            )
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: parsedUserId },
            include: { role: true },
        })

        if (!currentUser) {
            return { message: 'Uživatel nenalezen.' }
        }

        const selfUpdateError = validateSelfUpdateSafety({
            actorUserId: Number(authResult.session.userId),
            targetUserId: parsedUserId,
            nextIsActive: isActive,
            currentRoleName: currentUser.role.name,
            nextRoleName: role.name,
        })

        if (selfUpdateError) {
            return { message: selfUpdateError }
        }

        const data: {
            firstName: string
            lastName: string
            email: string
            roleId: number
            voice?: z.infer<typeof OptionalVoiceSchema>
            phone?: string
            isActive: boolean
            passwordHash?: string
        } = {
            firstName,
            lastName,
            email,
            roleId,
            voice,
            phone,
            isActive,
        }

        if (password) {
            data.passwordHash = await hashPassword(password)
        }

        await prisma.user.update({
            where: { id: parsedUserId },
            data,
        })
    } catch (error) {
        return handleActionError<UserFields>(
            error,
            'Chyba při aktualizaci uživatele.',
            { notFoundMessage: 'Uživatel nenalezen.' },
        )
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/users')
    redirect('/dashboard/users')
}

export async function deleteUser(userId: number) {
    const parsedUserId = parsePositiveIntegerId(userId)

    if (parsedUserId === null) {
        return { message: 'Neplatný uživatel.' }
    }

    let session: SessionPayload

    try {
        session = await requireRole(ADMIN_ONLY_ROLES)

        const deleteSafetyError = validateDeleteUserSafety(
            Number(session.userId),
            parsedUserId,
        )

        if (deleteSafetyError) {
            return { message: deleteSafetyError }
        }

        await prisma.user.delete({ where: { id: parsedUserId } })
        revalidatePath('/dashboard')
        revalidatePath('/dashboard/users')
        return { success: true }
    } catch (error) {
        return handleActionError(error, 'Nelze smazat uživatele.', {
            notFoundMessage: 'Uživatel nenalezen.',
        })
    }
}
