import { Prisma } from '@prisma/client'
import { AuthorizationError } from './authorization-error'

type NormalizeActionErrorOptions = {
    fallbackMessage: string
    uniqueMessage?: string
    notFoundMessage?: string
}

export function normalizeActionError(
    error: unknown,
    {
        fallbackMessage,
        uniqueMessage = 'Záznam s touto hodnotou už existuje.',
        notFoundMessage,
    }: NormalizeActionErrorOptions,
) {
    if (error instanceof AuthorizationError) {
        return { message: error.message }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return { message: uniqueMessage }
        }

        if (error.code === 'P2025' && notFoundMessage) {
            return { message: notFoundMessage }
        }
    }

    console.error(error)
    return { message: fallbackMessage }
}
