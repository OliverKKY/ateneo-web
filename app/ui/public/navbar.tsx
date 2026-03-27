'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const PUBLIC_NAV_ITEMS = [
    { href: '/', label: 'Domů' },
    { href: '/about', label: 'O nás' },
    { href: '/events', label: 'Události' },
    { href: '/gallery', label: 'Galerie' },
]

function PublicNavLinks({
    pathname,
    onNavigate,
    mobile = false,
}: {
    pathname: string
    onNavigate?: () => void
    mobile?: boolean
}) {
    return (
        <ul className={mobile ? 'space-y-2' : 'flex items-center gap-7'}>
            {PUBLIC_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href

                return (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            onClick={onNavigate}
                            className={[
                                'font-medium transition-colors',
                                mobile
                                    ? 'block rounded-2xl px-4 py-3 text-base'
                                    : 'text-sm',
                                isActive
                                    ? 'font-black text-[#fff4ed]'
                                    : 'text-slate-200 hover:text-white',
                            ].join(' ')}
                        >
                            {item.label}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export function PublicNavbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="absolute top-0 z-50 w-full px-4 py-5 md:px-6">
            <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/12 bg-slate-950/55 px-5 py-3 text-white shadow-[0_20px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        aria-label="Ateneo, domovská stránka"
                        className="text-xl font-black uppercase tracking-[0.28em] text-[#f7e7da]"
                    >
                        Ateneo
                    </Link>

                    <nav aria-label="Hlavní navigace" className="hidden md:block">
                        <PublicNavLinks pathname={pathname} />
                    </nav>

                    <div className="hidden md:block">
                        <Link
                            href="/login"
                            className="rounded-full border border-[#f0d8c8]/35 bg-[#f0d8c8]/12 px-4 py-2 text-sm font-semibold text-[#fff4ed] hover:bg-[#f0d8c8]/22"
                        >
                            Intranet
                        </Link>
                    </div>

                    <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls="public-mobile-nav"
                        aria-label={isOpen ? 'Zavřít hlavní navigaci' : 'Otevřít hlavní navigaci'}
                        onClick={() => setIsOpen((current) => !current)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-[#fff4ed] md:hidden"
                    >
                        <span aria-hidden="true">{isOpen ? 'x' : '='}</span>
                        Menu
                    </button>
                </div>

                <div
                    id="public-mobile-nav"
                    className={isOpen ? 'mt-4 border-t border-white/10 pt-4 md:hidden' : 'hidden'}
                >
                    <nav aria-label="Hlavní navigace pro mobil" className="space-y-4">
                        <PublicNavLinks pathname={pathname} onNavigate={() => setIsOpen(false)} mobile />
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="inline-flex rounded-full border border-[#f0d8c8]/35 bg-[#f0d8c8]/12 px-4 py-2 text-sm font-semibold text-[#fff4ed] hover:bg-[#f0d8c8]/22"
                        >
                            Intranet
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
