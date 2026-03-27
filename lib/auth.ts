import 'server-only'

import { redirect } from 'next/navigation'
import {
    type RoleName,
    type SessionPayload,
} from './definitions'
import { verifySession } from './session'

export class AuthorizationError extends Error {
    constructor(message = 'Nemáte oprávnění k této akci.') {
        super(message)
        this.name = 'AuthorizationError'
    }
}

export function hasRole(
    role: RoleName,
    allowedRoles: readonly RoleName[],
): boolean {
    return allowedRoles.includes(role)
}

export async function requireSession(): Promise<SessionPayload> {
    const session = await verifySession()

    if (!session) {
        throw new AuthorizationError('Nejste přihlášen.')
    }

    return session
}

export async function requireRole(
    allowedRoles: readonly RoleName[],
): Promise<SessionPayload> {
    const session = await requireSession()

    if (!hasRole(session.role, allowedRoles)) {
        throw new AuthorizationError()
    }

    return session
}

export async function requirePageRole(
    allowedRoles: readonly RoleName[],
    redirectTo = '/dashboard',
): Promise<SessionPayload> {
    const session = await verifySession()

    if (!session) {
        redirect('/login')
    }

    if (!hasRole(session.role, allowedRoles)) {
        redirect(redirectTo)
    }

    return session
}
