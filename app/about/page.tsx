import { PublicFooter } from '@/app/ui/public/footer'
import { PublicNavbar } from '@/app/ui/public/navbar'

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <PublicNavbar />
            <section className="mx-auto max-w-5xl px-6 pb-16 pt-32">
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">O sboru</p>
                <h1 className="mt-4 text-5xl font-black tracking-tight">Ateneo spojuje studenty, absolventy i publikum.</h1>
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-xl font-bold">Repertoár</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                            Od renesanční polyfonie po současné autory, spirituály i aranže populární hudby.
                        </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-xl font-bold">Komunita</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                            Sborové zkoušky, soustředění a koncerty staví na dlouhodobé spolupráci a silném kolektivu.
                        </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-xl font-bold">Zázemí</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                            Interní systém teď sjednocuje akce, přihlášky i správu skladeb na jednom místě.
                        </p>
                    </div>
                </div>
            </section>
            <PublicFooter />
        </main>
    )
}
