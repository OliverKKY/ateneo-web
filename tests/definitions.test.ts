import test from 'node:test'
import assert from 'node:assert/strict'
import {
    EmailSchema,
    EventTypeSchema,
    LoginSchema,
    SheetTypeSchema,
    SignupStatusSchema,
    VoiceSchema,
} from '@/lib/definitions'

test('LoginSchema rejects invalid email input', () => {
    const result = LoginSchema.safeParse({
        email: 'not-an-email',
        password: 'secret123',
    })

    assert.equal(result.success, false)
})

test('validated value schemas accept allowed domain values', () => {
    assert.equal(VoiceSchema.safeParse('A').success, true)
    assert.equal(EventTypeSchema.safeParse('CONCERT').success, true)
    assert.equal(SignupStatusSchema.safeParse('maybe').success, true)
    assert.equal(SheetTypeSchema.safeParse('SATB').success, true)
})

test('validated value schemas reject arbitrary strings', () => {
    assert.equal(VoiceSchema.safeParse('mezzo').success, false)
    assert.equal(EventTypeSchema.safeParse('Koncert').success, false)
    assert.equal(SignupStatusSchema.safeParse('later').success, false)
    assert.equal(SheetTypeSchema.safeParse('piano-vocal').success, false)
})

test('EmailSchema normalizes whitespace and casing', () => {
    const result = EmailSchema.safeParse('  ADMIN@ATENEO.CZ ')

    assert.equal(result.success, true)
    assert.equal(result.data, 'admin@ateneo.cz')
})
