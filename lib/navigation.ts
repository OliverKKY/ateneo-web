export type AccessDecision =
    | { action: 'next' }
    | { action: 'redirect'; destination: '/login' | '/dashboard' }

export function getAccessDecision(
    path: string,
    hasSession: boolean,
): AccessDecision {
    const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/intranet')
    const isPublicRoute = path === '/login' || path === '/' || path.startsWith('/public')

    if (isProtectedRoute && !hasSession) {
        return { action: 'redirect', destination: '/login' }
    }

    if (isPublicRoute && hasSession && path === '/login') {
        return { action: 'redirect', destination: '/dashboard' }
    }

    return { action: 'next' }
}
