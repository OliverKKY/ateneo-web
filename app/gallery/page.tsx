import { PublicFooter } from '@/app/ui/public/footer'
import { PublicNavbar } from '@/app/ui/public/navbar'

export default function GalleryPage() {
    return (
        <main className="flex min-h-screen flex-col bg-[#09141c] text-white">
            <a href="#main-content" className="skip-link">Přeskočit na obsah</a>
            <PublicNavbar />
            <section id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-32">
                <p className="text-sm uppercase tracking-[0.35em] text-[#f2c8ae]">Galerie</p>
                <h1 className="mt-4 text-5xl font-black tracking-tight">Momentky z koncertů a soustředění</h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                    Vizuální vrstva sboru si zaslouží stejnou pozornost jako zvuk. Tohle je připravený základ pro budoucí galerii s reálným obsahem.
                </p>
                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {['Koncertní sezóna', 'Soustředění', 'Zákulisí'].map((title) => (
                        <div key={title} className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-xl shadow-black/10">
                            <div className="aspect-[4/5] rounded-[1.5rem] bg-[linear-gradient(160deg,rgba(242,200,174,0.18),rgba(255,255,255,0.05),rgba(57,132,145,0.18))]" />
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
