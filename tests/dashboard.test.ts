import test from 'node:test'
import assert from 'node:assert/strict'
import { getDashboardQuickActions } from '@/lib/dashboard'
import { ROLES } from '@/lib/definitions'

test('dashboard quick actions for singer prioritize events and profile', () => {
    const actions = getDashboardQuickActions(ROLES.SINGER)

    assert.deepEqual(
        actions.map((action) => action.href),
        ['/dashboard/events', '/dashboard/profile'],
    )
})

test('dashboard quick actions for admin include songs, event creation, and user creation', () => {
    const actions = getDashboardQuickActions(ROLES.ADMIN)

    assert.deepEqual(
        actions.map((action) => action.href),
        [
            '/dashboard/songs',
            '/dashboard/events',
            '/dashboard/profile',
            '/dashboard/events/create',
            '/dashboard/users/create',
        ],
    )
})
