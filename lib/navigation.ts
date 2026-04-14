export type AccessDecision =
    | { action: 'next' }
    | { action: 'redirect'; destination: '/login' | '/dashboard' }

function matchesRoutePrefix(path: string, prefix: string): boolean {
    return path === prefix || path.startsWith(`${prefix}/`)
}

export function getAccessDecision(
    path: string,
    hasSession: boolean,
): AccessDecision {
    const isProtectedRoute =
        matchesRoutePrefix(path, '/dashboard') ||
        matchesRoutePrefix(path, '/intranet')
    const isPublicRoute =
        path === '/login' ||
        path === '/' ||
        matchesRoutePrefix(path, '/public')

    if (isProtectedRoute && !hasSession) {
        return { action: 'redirect', destination: '/login' }
    }

    if (isPublicRoute && hasSession && path === '/login') {
        return { action: 'redirect', destination: '/dashboard' }
    }

    return { action: 'next' }
}
