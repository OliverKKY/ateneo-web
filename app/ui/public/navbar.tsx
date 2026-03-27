import Link from 'next/link'

export function PublicNavbar() {
    return (
        <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-center text-white">
            <div className="text-2xl font-bold tracking-widest uppercase">Ateneo</div>
            <div className="hidden md:flex space-x-8 font-light">
                <Link href="/" className="hover:text-white/80 transition-colors">Domů</Link>
                <Link href="/about" className="hover:text-white/80 transition-colors">O nás</Link>
                <Link href="/events" className="hover:text-white/80 transition-colors">Události</Link>
                <Link href="/gallery" className="hover:text-white/80 transition-colors">Galerie</Link>
            </div>
            <div>
                <Link href="/login" className="px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all">
                    Login
                </Link>
            </div>
        </nav>
    )
}
