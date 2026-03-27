import { requireSession, hasRole } from '@/lib/auth'
import { ADMIN_ONLY_ROLES, SONG_EDITOR_ROLES } from '@/lib/definitions'
import { DashboardSidebar } from '@/app/ui/dashboard/sidebar'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await requireSession()
    const role = session.role
    const navigationItems = [
        { href: '/dashboard', label: 'Přehled' },
        { href: '/dashboard/events', label: 'Události' },
        ...(hasRole(role, SONG_EDITOR_ROLES) ? [{ href: '/dashboard/songs', label: 'Skladby' }] : []),
        ...(hasRole(role, ADMIN_ONLY_ROLES) ? [{ href: '/dashboard/users', label: 'Uživatelé' }] : []),
        { href: '/dashboard/profile', label: 'Můj profil', divider: true },
    ]

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f6f1e7_0%,#f1ebe0_100%)]">
            <a href="#main-content" className="skip-link">
                Přeskočit na obsah
            </a>
            <div className="flex min-h-screen flex-col md:flex-row">
                <DashboardSidebar role={role} items={navigationItems} />

                <main id="main-content" className="min-w-0 flex-1 p-6 md:p-8">
                {children}
                </main>
            </div>
        </div>
    )
}
