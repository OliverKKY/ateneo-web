import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePositiveIntegerId, validationError } from '@/lib/action-utils'

test('parsePositiveIntegerId accepts positive integer-like input', () => {
    assert.equal(parsePositiveIntegerId('42'), 42)
    assert.equal(parsePositiveIntegerId(7), 7)
})

test('parsePositiveIntegerId rejects empty, fractional, and non-positive values', () => {
    assert.equal(parsePositiveIntegerId(''), null)
    assert.equal(parsePositiveIntegerId('3.5'), null)
    assert.equal(parsePositiveIntegerId(0), null)
    assert.equal(parsePositiveIntegerId(-1), null)
})

test('validationError keeps field errors and custom message', () => {
    const result = validationError(
        { email: ['Neplatný email.'] },
        'Chybná pole. Zkontrolujte prosím formulář.',
    )

    assert.deepEqual(result, {
        errors: {
            email: ['Neplatný email.'],
        },
        message: 'Chybná pole. Zkontrolujte prosím formulář.',
    })
})
