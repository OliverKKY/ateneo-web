import { ROLES } from './definitions'

type SelfUpdateInput = {
    actorUserId: number
    targetUserId: number
    nextIsActive: boolean
    currentRoleName: string
    nextRoleName: string
}

export function validateSelfUpdateSafety({
    actorUserId,
    targetUserId,
    nextIsActive,
    currentRoleName,
    nextRoleName,
}: SelfUpdateInput): string | null {
    if (actorUserId !== targetUserId) {
        return null
    }

    if (!nextIsActive) {
        return 'Nemůžete deaktivovat právě přihlášený účet.'
    }

    if (currentRoleName === ROLES.ADMIN && nextRoleName !== ROLES.ADMIN) {
        return 'Nemůžete odebrat administrátorskou roli právě přihlášenému účtu.'
    }

    return null
}

export function validateDeleteUserSafety(
    actorUserId: number,
    targetUserId: number,
): string | null {
    if (actorUserId === targetUserId) {
        return 'Nemůžete smazat právě přihlášený účet.'
    }

    return null
}
