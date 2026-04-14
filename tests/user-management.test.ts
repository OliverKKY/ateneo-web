import test from 'node:test'
import assert from 'node:assert/strict'
import { ROLES } from '@/lib/definitions'
import {
    validateDeleteUserSafety,
    validateSelfUpdateSafety,
} from '@/lib/user-management'

test('self update rejects deactivating the current account', () => {
    const result = validateSelfUpdateSafety({
        actorUserId: 1,
        targetUserId: 1,
        nextIsActive: false,
        currentRoleName: ROLES.ADMIN,
        nextRoleName: ROLES.ADMIN,
    })

    assert.equal(result, 'Nemůžete deaktivovat právě přihlášený účet.')
})

test('self update rejects removing own admin role', () => {
    const result = validateSelfUpdateSafety({
        actorUserId: 1,
        targetUserId: 1,
        nextIsActive: true,
        currentRoleName: ROLES.ADMIN,
        nextRoleName: ROLES.SINGER,
    })

    assert.equal(result, 'Nemůžete odebrat administrátorskou roli právě přihlášenému účtu.')
})

test('editing another account remains allowed', () => {
    const result = validateSelfUpdateSafety({
        actorUserId: 1,
        targetUserId: 2,
        nextIsActive: false,
        currentRoleName: ROLES.ADMIN,
        nextRoleName: ROLES.SINGER,
    })

    assert.equal(result, null)
})

test('deleting the current account is blocked', () => {
    const result = validateDeleteUserSafety(4, 4)

    assert.equal(result, 'Nemůžete smazat právě přihlášený účet.')
})

test('deleting a different account remains allowed', () => {
    const result = validateDeleteUserSafety(4, 7)

    assert.equal(result, null)
})
