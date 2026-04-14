import test from 'node:test'
import assert from 'node:assert/strict'
import { getAccessDecision } from '@/lib/navigation'

test('unauthenticated user is redirected from protected dashboard routes', () => {
    const result = getAccessDecision('/dashboard/events', false)

    assert.deepEqual(result, {
        action: 'redirect',
        destination: '/login',
    })
})

test('authenticated user is redirected away from login page', () => {
    const result = getAccessDecision('/login', true)

    assert.deepEqual(result, {
        action: 'redirect',
        destination: '/dashboard',
    })
})

test('public homepage remains accessible without a session', () => {
    const result = getAccessDecision('/', false)

    assert.deepEqual(result, {
        action: 'next',
    })
})

test('non-protected public content remains accessible with a session', () => {
    const result = getAccessDecision('/events', true)

    assert.deepEqual(result, {
        action: 'next',
    })
})

test('unauthenticated user is redirected from intranet-prefixed routes', () => {
    const result = getAccessDecision('/intranet/tools', false)

    assert.deepEqual(result, {
        action: 'redirect',
        destination: '/login',
    })
})

test('authenticated user can still access protected dashboard routes', () => {
    const result = getAccessDecision('/dashboard/songs', true)

    assert.deepEqual(result, {
        action: 'next',
    })
})

test('prefix collisions do not mark unrelated routes as protected', () => {
    const result = getAccessDecision('/dashboarding', false)

    assert.deepEqual(result, {
        action: 'next',
    })
})

test('prefix collisions do not mark unrelated routes as public', () => {
    const result = getAccessDecision('/publications', false)

    assert.deepEqual(result, {
        action: 'next',
    })
})
