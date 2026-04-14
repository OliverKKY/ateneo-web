import { z } from 'zod'
import { type ActionState } from './definitions'
import { normalizeActionError } from './action-errors'

export function validationError<TField extends string>(
    errors: Partial<Record<TField, string[]>>,
    message = 'Chybná pole.',
): ActionState<TField> {
    return {
        errors,
        message,
    }
}

const PositiveIntegerSchema = z.coerce.number().int().positive()

export function parsePositiveIntegerId(value: unknown): number | null {
    const result = PositiveIntegerSchema.safeParse(value)

    return result.success ? result.data : null
}

export function handleActionError<TField extends string>(
    error: unknown,
    fallbackMessage: string,
    options?: {
        uniqueMessage?: string
        notFoundMessage?: string
    },
): ActionState<TField> {
    return normalizeActionError(error, {
        fallbackMessage,
        ...options,
    })
}
