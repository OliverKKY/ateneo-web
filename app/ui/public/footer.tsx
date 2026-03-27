import Link from 'next/link'

export function PublicFooter() {
    return (
        <footer className="bg-slate-900 text-white py-12 border-t border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white font-bold mb-4">ATENEO</h3>
                        <p className="text-gray-400 text-sm">Smíšený pěvecký sbor Univerzity Palackého v Olomouci.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Odkazy</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/events" className="hover:text-white">Události</Link></li>
                            <li><Link href="/about" className="hover:text-white">O sboru</Link></li>
                            <li><Link href="/login" className="hover:text-white">Intranet</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-2">
                        <h4 className="font-bold mb-4">Partneři</h4>
                        <div className="grid grid-cols-4 gap-4 opacity-50">
                            <div className="h-10 bg-white/10 rounded"></div>
                            <div className="h-10 bg-white/10 rounded"></div>
                            <div className="h-10 bg-white/10 rounded"></div>
                            <div className="h-10 bg-white/10 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 text-center text-gray-600 text-xs">
                    &copy; {new Date().getFullYear()} Ateneo. Všechna práva vyhrazena.
                </div>
            </div>
        </footer>
    )
}
