import { Prisma } from '@prisma/client'
import { AuthorizationError } from './auth'
import { type ActionState } from './definitions'

export function validationError<TField extends string>(
    errors: Partial<Record<TField, string[]>>,
    message = 'Chybná pole.',
): ActionState<TField> {
    return {
        errors,
        message,
    }
}

export function handleActionError<TField extends string>(
    error: unknown,
    fallbackMessage: string,
): ActionState<TField> {
    if (error instanceof AuthorizationError) {
        return { message: error.message }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return { message: 'Záznam s touto hodnotou už existuje.' }
        }
    }

    console.error(error)
    return { message: fallbackMessage }
}
