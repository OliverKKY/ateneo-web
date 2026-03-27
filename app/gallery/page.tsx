import { PublicFooter } from '@/app/ui/public/footer'
import { PublicNavbar } from '@/app/ui/public/navbar'

export default function GalleryPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <PublicNavbar />
            <section className="mx-auto max-w-5xl px-6 pb-16 pt-32">
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Galerie</p>
                <h1 className="mt-4 text-5xl font-black tracking-tight">Momentky z koncertů a soustředění</h1>
                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {['Koncertní sezóna', 'Soustředění', 'Zákulisí'].map((title) => (
                        <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <div className="aspect-[4/5] rounded-2xl bg-[linear-gradient(160deg,rgba(56,189,248,0.15),rgba(255,255,255,0.04),rgba(14,116,144,0.2))]" />
                            <h2 className="mt-4 text-xl font-bold">{title}</h2>
                            <p className="mt-2 text-sm leading-7 text-slate-300">
                                Vyhrazené místo pro budoucí fotogalerii. Struktura je připravená pro napojení na skutečný obsah.
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            <PublicFooter />
        </main>
    )
}
