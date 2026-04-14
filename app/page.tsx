import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavbar } from '@/app/ui/public/navbar'
import { PublicFooter } from '@/app/ui/public/footer'

export const metadata: Metadata = {
    title: 'Ateneo | Domů',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#09141c] text-white selection:bg-white selection:text-slate-900">
      <a href="#main-content" className="skip-link">Přeskočit na obsah</a>
      <PublicNavbar />

      <section id="main-content" className="relative overflow-hidden px-6 pb-20 pt-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,176,125,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(71,162,180,0.16),transparent_32%),linear-gradient(180deg,#10222c_0%,#09141c_55%,#08131a_100%)]" />
          <div className="absolute left-[8%] top-[14%] h-[26rem] w-[26rem] rounded-full bg-[#d18152]/18 blur-[150px]" />
          <div className="absolute bottom-[8%] right-[10%] h-[24rem] w-[24rem] rounded-full bg-[#3e8896]/16 blur-[130px]" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[72vh] max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.38em] text-[#f2c8ae]">Smíšený pěvecký sbor</p>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-white md:text-7xl">
              Univerzitní sbor se zvukem, který stojí na detailu i energii.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Ateneo propojuje studenty a absolventy napříč obory. Vystupujeme na koncertech, připravujeme soustředění a budujeme moderní interní zázemí pro členy.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/events" className="rounded-full bg-[#f2dfd1] px-8 py-3 font-bold text-slate-900 shadow-lg shadow-black/15 hover:bg-[#f7ebe3]">
                Nadcházející koncerty
              </Link>
              <Link href="/about" className="rounded-full border border-white/18 bg-white/6 px-8 py-3 font-semibold hover:bg-white/12">
                Přidej se k nám
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Sezóna</div>
              <div className="mt-3 text-3xl font-bold text-white">Koncerty, zkoušky, soustředění</div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Program stavíme od renesance po současnost a vedle koncertů pracujeme i s interním archivem a plánováním účasti.
              </p>
            </div>
            <div className="rounded-[2rem] border border-[#f2c8ae]/18 bg-[#f2c8ae]/10 p-6 backdrop-blur-xl">
              <div className="text-sm uppercase tracking-[0.28em] text-[#f4d7c4]">Intranet</div>
              <div className="mt-3 text-3xl font-bold text-white">Události a správa sboru na jednom místě</div>
              <p className="mt-4 text-sm leading-7 text-slate-200">
                Přihlášky na akce, uživatelské role i správa skladeb jsou sjednocené v jednom rozhraní pro vedení i členy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 bg-[#08131a] py-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-3">
          {[
            {
              title: 'Repertoár bez šablony',
              text: 'Od renesanční polyfonie po současné aranže. Hudební dramaturgie stojí na kontrastu, ne na rutině.',
            },
            {
              title: 'Komunita a disciplína',
              text: 'Sbor funguje jako živé těleso: zkoušky, akce a vystoupení mají rytmus, odpovědnost i radost z detailu.',
            },
            {
              title: 'Digitální zázemí',
              text: 'Veřejná prezentace a interní správa už nejsou oddělené světy. Členové i vedení mají jasný pracovní tok.',
            },
          ].map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-white/8 bg-white/5 p-7">
              <h2 className="text-2xl font-bold text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <PublicFooter />
    </main>
  )
}
