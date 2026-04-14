import test from 'node:test'
import assert from 'node:assert/strict'
import {
    EmailSchema,
    EVENT_TYPE,
    EventTypeSchema,
    LoginSchema,
    RoleSchema,
    SheetTypeSchema,
    SIGNUP_STATUS,
    SIGNUP_STATUS_LABELS,
    SignupStatusSchema,
    SessionPayloadSchema,
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
    assert.equal(EventTypeSchema.safeParse(EVENT_TYPE.CONCERT).success, true)
    assert.equal(SignupStatusSchema.safeParse('maybe').success, true)
    assert.equal(SheetTypeSchema.safeParse('SATB').success, true)
    assert.equal(RoleSchema.safeParse('Administrátor').success, true)
})

test('event types have centralized named constants', () => {
    assert.equal(EVENT_TYPE.CONCERT, 'CONCERT')
    assert.equal(EVENT_TYPE.RETREAT, 'RETREAT')
})

test('signup statuses have centralized display labels', () => {
    assert.equal(SIGNUP_STATUS.GOING, 'going')
    assert.equal(SIGNUP_STATUS.MAYBE, 'maybe')
    assert.equal(SIGNUP_STATUS.NOT_GOING, 'not_going')
    assert.equal(SIGNUP_STATUS_LABELS.going, 'Jdu')
    assert.equal(SIGNUP_STATUS_LABELS.maybe, 'Možná')
    assert.equal(SIGNUP_STATUS_LABELS.not_going, 'Nejdu')
})

test('validated value schemas reject arbitrary strings', () => {
    assert.equal(VoiceSchema.safeParse('mezzo').success, false)
    assert.equal(EventTypeSchema.safeParse('Koncert').success, false)
    assert.equal(SignupStatusSchema.safeParse('later').success, false)
    assert.equal(SheetTypeSchema.safeParse('piano-vocal').success, false)
    assert.equal(RoleSchema.safeParse('Super Admin').success, false)
})

test('EmailSchema normalizes whitespace and casing', () => {
    const result = EmailSchema.safeParse('  ADMIN@ATENEO.CZ ')

    assert.equal(result.success, true)
    assert.equal(result.data, 'admin@ateneo.cz')
})

test('SessionPayloadSchema rejects tampered role values', () => {
    const result = SessionPayloadSchema.safeParse({
        userId: 1,
        role: 'Super Admin',
        expiresAt: '2026-03-30T10:00:00.000Z',
    })

    assert.equal(result.success, false)
})

test('SessionPayloadSchema requires a valid expiration timestamp', () => {
    const result = SessionPayloadSchema.safeParse({
        userId: 1,
        role: 'Administrátor',
        expiresAt: 'not-a-date',
    })

    assert.equal(result.success, false)
})
