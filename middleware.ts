import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAccessDecision } from '@/lib/navigation'
import { verifySession } from '@/lib/session'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const session = await verifySession()
    const decision = getAccessDecision(path, Boolean(session))

    if (decision.action === 'redirect') {
        return NextResponse.redirect(new URL(decision.destination, request.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
