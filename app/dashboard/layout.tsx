import { requireSession, hasRole } from '@/lib/auth'
import { logout } from '@/app/actions/auth'
import { ADMIN_ONLY_ROLES, SONG_EDITOR_ROLES } from '@/lib/definitions'
import Link from 'next/link'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await requireSession()
    const role = session.role

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white">Ateneo</h2>
                    <p className="text-sm text-gray-400">Intranet</p>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">Přehled</Link>
                    <Link href="/dashboard/events" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">Události</Link>

                    {hasRole(role, SONG_EDITOR_ROLES) && (
                        <Link href="/dashboard/songs" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">Skladby</Link>
                    )}

                    {hasRole(role, ADMIN_ONLY_ROLES) && (
                        <Link href="/dashboard/users" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">Uživatelé</Link>
                    )}

                    <Link href="/dashboard/profile" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-colors mt-8 border-t border-white/10">Můj profil</Link>
                </nav>

                <div className="mt-auto border-t border-white/10 pt-4">
                    <div className="text-sm text-gray-400 mb-2">Přihlášen jako:</div>
                    <div className="font-semibold truncate">{role}</div>
                    <form action={logout} className="mt-4">
                        <button type="submit" className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 rounded-lg transition-colors">Odhlásit se</button>
                    </form>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
