import {
    ADMIN_ONLY_ROLES,
    EVENT_MANAGER_ROLES,
    ROLES,
    SONG_DELETE_ROLES,
    SONG_EDITOR_ROLES,
    type RoleName,
} from './definitions'

export type DashboardQuickAction = {
    href: string
    label: string
    tone: 'primary' | 'secondary'
}

function roleIn(role: RoleName, allowedRoles: readonly RoleName[]): boolean {
    return allowedRoles.includes(role)
}

export function getDashboardQuickActions(role: RoleName): DashboardQuickAction[] {
    const actions: DashboardQuickAction[] = [
        {
            href: '/dashboard/events',
            label: role === ROLES.SINGER ? 'Zapsat se na událost' : 'Přehled událostí',
            tone: 'primary',
        },
        {
            href: '/dashboard/profile',
            label: 'Můj profil',
            tone: 'secondary',
        },
    ]

    if (roleIn(role, SONG_EDITOR_ROLES)) {
        actions.unshift({
            href: '/dashboard/songs',
            label: roleIn(role, SONG_DELETE_ROLES) ? 'Správa skladeb' : 'Archiv skladeb',
            tone: 'primary',
        })
    }

    if (roleIn(role, EVENT_MANAGER_ROLES)) {
        actions.push({
            href: '/dashboard/events/create',
            label: 'Nová událost',
            tone: 'secondary',
        })
    }

    if (roleIn(role, ADMIN_ONLY_ROLES)) {
        actions.push({
            href: '/dashboard/users/create',
            label: 'Přidat uživatele',
            tone: 'secondary',
        })
    }

    return actions
}
