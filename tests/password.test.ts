import test from 'node:test'
import assert from 'node:assert/strict'
import { hashPassword, verifyPassword } from '@/lib/password'

test('password hashing produces a verifiable hash', async () => {
    const password = 'choral-secret-123'
    const hash = await hashPassword(password)

    assert.notEqual(hash, password)
    assert.equal(await verifyPassword(hash, password), true)
    assert.equal(await verifyPassword(hash, 'wrong-password'), false)
})
