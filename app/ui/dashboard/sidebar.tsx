'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'

type SidebarItem = {
    href: string
    label: string
    divider?: boolean
}

type DashboardSidebarProps = {
    role: string
    items: SidebarItem[]
}

function SidebarLinks({
    items,
    pathname,
    onNavigate,
}: {
    items: SidebarItem[]
    pathname: string
    onNavigate?: () => void
}) {
    return (
        <nav aria-label="Navigace intranetu" className="flex-1 space-y-2">
            {items.map((item) => {
                const isActive = pathname === item.href

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={onNavigate}
                        className={[
                            'block rounded-2xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0c7ac] focus-visible:ring-offset-2 focus-visible:ring-offset-[#10212a]',
                            item.divider ? 'mt-8 border-t border-white/10 pt-5' : '',
                            isActive
                                ? 'bg-white/14 text-[#fff4ed] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                                : 'text-slate-100 hover:bg-white/10',
                        ].join(' ')}
                    >
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}

export function DashboardSidebar({ role, items }: DashboardSidebarProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [isOpen])

    return (
        <>
            <div className="sticky top-0 z-40 border-b border-[#e7d6cb] bg-[rgba(247,241,233,0.92)] px-4 py-3 backdrop-blur md:hidden">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="text-lg font-black uppercase tracking-[0.22em] text-[#3a241c]">
                            Ateneo
                        </div>
                        <p className="text-xs uppercase tracking-[0.22em] text-[#9a7565]">
                            Intranet
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls="dashboard-mobile-nav"
                        aria-label={isOpen ? 'Zavřít navigaci' : 'Otevřít navigaci'}
                        onClick={() => setIsOpen((current) => !current)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#d7c0b3] bg-[rgba(255,255,255,0.72)] px-4 py-2 text-sm font-semibold text-[#5a3b31] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b56a44] focus-visible:ring-offset-2"
                    >
                        <span aria-hidden="true" className="text-base leading-none">
                            {isOpen ? 'x' : '='}
                        </span>
                        Menu
                    </button>
                </div>
            </div>

            <div
                className={[
                    'fixed inset-0 z-50 bg-[#241612]/45 backdrop-blur-sm transition-opacity md:hidden',
                    isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                ].join(' ')}
                aria-hidden={!isOpen}
                onClick={() => setIsOpen(false)}
            />

            <aside
                id="dashboard-mobile-nav"
                className={[
                    'fixed inset-y-0 left-0 z-50 flex w-[min(85vw,22rem)] flex-col bg-[linear-gradient(180deg,#10212a_0%,#0c171e_100%)] p-6 text-white shadow-[0_24px_80px_rgba(8,16,22,0.22)] transition-transform md:sticky md:top-0 md:z-auto md:h-screen md:w-72 md:flex-shrink-0 md:self-start md:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                ].join(' ')}
            >
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-black uppercase tracking-[0.22em] text-[#f5e0d1] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0c7ac] focus-visible:ring-offset-2 focus-visible:ring-offset-[#10212a]"
                        >
                            Ateneo
                        </Link>
                        <p className="mt-2 text-sm text-slate-400">Intranet</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300 md:hidden"
                    >
                        Zavřít
                    </button>
                </div>

                <SidebarLinks items={items} pathname={pathname} onNavigate={() => setIsOpen(false)} />

                <div className="mt-auto rounded-[1.75rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                    <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-400">Přihlášen jako</div>
                    <div className="truncate font-semibold text-[#f7e7dc]">{role}</div>
                    <form action={logout} className="mt-4">
                        <button
                            type="submit"
                            className="w-full rounded-2xl border border-[#f0c5b3]/20 bg-[#f0c5b3]/10 px-4 py-3 text-left text-sm font-medium text-[#f3c5b1] transition-colors hover:bg-[#f0c5b3]/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0c7ac] focus-visible:ring-offset-2 focus-visible:ring-offset-[#10212a]"
                        >
                            Odhlásit se
                        </button>
                    </form>
                </div>
            </aside>
        </>
    )
}
