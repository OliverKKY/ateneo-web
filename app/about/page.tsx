import { PublicFooter } from '@/app/ui/public/footer'
import { PublicNavbar } from '@/app/ui/public/navbar'

export default function AboutPage() {
    return (
        <main className="flex min-h-screen flex-col bg-[#09141c] text-white">
            <a href="#main-content" className="skip-link">Přeskočit na obsah</a>
            <PublicNavbar />
            <section id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-32">
                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-[#f2c8ae]">O sboru</p>
                        <h1 className="mt-4 text-5xl font-black tracking-tight">Ateneo spojuje hudební ambici, disciplínu a univerzitní komunitu.</h1>
                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
                            Nevznikáme jako dekorativní doplněk akademického života. Jsme aktivní těleso s vlastním tempem práce, koncertním programem a důrazem na kolektivní zvuk.
                        </p>
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-white/6 p-7 shadow-2xl shadow-black/20 backdrop-blur-xl">
                        <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Jak fungujeme</div>
                        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
                            <p>Pravidelné zkoušky, soustředění a koncertní bloky drží sbor ve formě během celé sezóny.</p>
                            <p>Vedle umělecké stránky řešíme i praktickou koordinaci členů, repertoáru a docházky.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
                        <h2 className="text-2xl font-bold">Repertoár</h2>
                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            Od renesanční polyfonie po současné autory, spirituály i aranže populární hudby.
                        </p>
                    </div>
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
                        <h2 className="text-2xl font-bold">Komunita</h2>
                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            Sborové zkoušky, soustředění a koncerty staví na dlouhodobé spolupráci a silném kolektivu.
                        </p>
                    </div>
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
                        <h2 className="text-2xl font-bold">Zázemí</h2>
                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            Interní systém sjednocuje akce, přihlášky i správu skladeb na jednom místě.
                        </p>
                    </div>
                </div>
            </section>
            <PublicFooter />
        </main>
    )
}
