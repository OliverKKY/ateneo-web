import Link from 'next/link'

export function PublicFooter() {
    return (
        <footer className="border-t border-white/10 bg-[#08131a] text-white">
            <div className="mx-auto max-w-6xl px-6 py-14">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.1fr_0.7fr_1.2fr]">
                    <section aria-labelledby="footer-brand">
                        <h2 id="footer-brand" className="mb-4 text-xl font-black tracking-[0.24em] text-[#f5dfd0] uppercase">Ateneo</h2>
                        <p className="max-w-sm text-sm leading-7 text-slate-300">
                            Smíšený pěvecký sbor Univerzity Palackého v Olomouci. Koncerty, soustředění a interní zázemí pro členy na jednom místě.
                        </p>
                    </section>
                    <nav aria-labelledby="footer-nav">
                        <h2 id="footer-nav" className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Navigace</h2>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li><Link href="/events" className="hover:text-white">Události</Link></li>
                            <li><Link href="/about" className="hover:text-white">O sboru</Link></li>
                            <li><Link href="/gallery" className="hover:text-white">Galerie</Link></li>
                            <li><Link href="/login" className="hover:text-white">Intranet</Link></li>
                        </ul>
                    </nav>
                    <section aria-labelledby="footer-focus">
                        <h2 id="footer-focus" className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Zaměření</h2>
                        <ul className="grid grid-cols-2 gap-3">
                            {['Koncerty', 'Soustředění', 'Sborový archiv', 'Členský intranet'].map((item) => (
                                <li key={item} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
                <div className="mt-12 border-t border-white/8 pt-6 text-center text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} Ateneo. Všechna práva vyhrazena.
                </div>
            </div>
        </footer>
    )
}
