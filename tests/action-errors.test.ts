import test from 'node:test'
import assert from 'node:assert/strict'
import { Prisma } from '@prisma/client'
import { normalizeActionError } from '@/lib/action-errors'
import { AuthorizationError } from '@/lib/authorization-error'

function prismaError(code: string) {
    return Object.assign(
        Object.create(Prisma.PrismaClientKnownRequestError.prototype),
        { code },
    ) as Prisma.PrismaClientKnownRequestError
}

test('normalizeActionError preserves authorization messages', () => {
    const result = normalizeActionError(
        new AuthorizationError('Nejste přihlášen.'),
        { fallbackMessage: 'Fallback message' },
    )

    assert.deepEqual(result, {
        message: 'Nejste přihlášen.',
    })
})

test('normalizeActionError returns the default unique constraint message', () => {
    const result = normalizeActionError(prismaError('P2002'), {
        fallbackMessage: 'Fallback message',
    })

    assert.deepEqual(result, {
        message: 'Záznam s touto hodnotou už existuje.',
    })
})

test('normalizeActionError returns a not found message when configured', () => {
    const result = normalizeActionError(prismaError('P2025'), {
        fallbackMessage: 'Fallback message',
        notFoundMessage: 'Skladba nenalezena.',
    })

    assert.deepEqual(result, {
        message: 'Skladba nenalezena.',
    })
})

test('normalizeActionError falls back for unknown errors', () => {
    const result = normalizeActionError(new Error('boom'), {
        fallbackMessage: 'Fallback message',
    })

    assert.deepEqual(result, {
        message: 'Fallback message',
    })
})
