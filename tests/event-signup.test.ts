import test from 'node:test'
import assert from 'node:assert/strict'
import { getSignupAvailability } from '@/lib/event-signup'

test('signup is closed before the signup window opens', () => {
    const now = new Date('2026-03-27T10:00:00.000Z')
    const availability = getSignupAvailability({
        signupOpenDate: new Date('2026-03-28T10:00:00.000Z'),
        signupCloseDate: new Date('2026-03-30T10:00:00.000Z'),
        startDateTime: new Date('2026-04-01T10:00:00.000Z'),
    }, now)

    assert.equal(availability.canSignup, false)
    assert.equal(availability.state, 'not_open_yet')
})

test('signup is closed after the window ends', () => {
    const now = new Date('2026-03-31T10:00:00.000Z')
    const availability = getSignupAvailability({
        signupOpenDate: new Date('2026-03-28T10:00:00.000Z'),
        signupCloseDate: new Date('2026-03-30T10:00:00.000Z'),
        startDateTime: new Date('2026-04-01T10:00:00.000Z'),
    }, now)

    assert.equal(availability.canSignup, false)
    assert.equal(availability.state, 'closed')
})

test('signup is open inside the configured window', () => {
    const now = new Date('2026-03-29T10:00:00.000Z')
    const availability = getSignupAvailability({
        signupOpenDate: new Date('2026-03-28T10:00:00.000Z'),
        signupCloseDate: new Date('2026-03-30T10:00:00.000Z'),
        startDateTime: new Date('2026-04-01T10:00:00.000Z'),
    }, now)

    assert.equal(availability.canSignup, true)
    assert.equal(availability.state, 'open')
})

test('signup is closed once the event has started', () => {
    const now = new Date('2026-04-01T10:00:00.000Z')
    const availability = getSignupAvailability({
        signupOpenDate: new Date('2026-03-28T10:00:00.000Z'),
        signupCloseDate: undefined,
        startDateTime: new Date('2026-04-01T09:30:00.000Z'),
    }, now)

    assert.equal(availability.canSignup, false)
    assert.equal(availability.state, 'started')
    assert.equal(availability.reason, 'Událost už začala.')
})
