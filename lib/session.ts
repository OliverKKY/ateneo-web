import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import {
    RoleSchema,
    SessionPayloadSchema,
} from './definitions'

function getJwtSecret(): string {
    const secretKey = process.env.JWT_SECRET

    if (!secretKey) {
        throw new Error('Missing required environment variable: JWT_SECRET')
    }

    return secretKey
}

const SESSION_COOKIE_NAME = 'session'
const SESSION_MAX_AGE = 7 * 24 * 60 * 60
const SESSION_DURATION_MS = SESSION_MAX_AGE * 1000

function getEncodedKey() {
    return new TextEncoder().encode(getJwtSecret())
}

export async function createSession(userId: number, role: string) {
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
    const session = await new SignJWT({
        userId,
        role: RoleSchema.parse(role),
        expiresAt,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(getEncodedKey())

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        maxAge: SESSION_MAX_AGE,
        sameSite: 'lax',
        path: '/',
    })
}

async function verifySessionToken(session: string | undefined) {
    if (!session) {
        return null
    }

    const encodedKey = getEncodedKey()

    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        const parsedPayload = SessionPayloadSchema.safeParse(payload)

        return parsedPayload.success ? parsedPayload.data : null
    } catch {
        return null
    }
}

export async function verifySession(request?: NextRequest) {
    const session = request
        ? request.cookies.get(SESSION_COOKIE_NAME)?.value
        : (await cookies()).get(SESSION_COOKIE_NAME)?.value

    return verifySessionToken(session)
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
}
