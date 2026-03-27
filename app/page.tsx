import Link from 'next/link'
import { PublicNavbar } from '@/app/ui/public/navbar'
import { PublicFooter } from '@/app/ui/public/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-white selection:text-slate-900">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-600/40 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[200px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">
            ATENEO
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-10">
            Smíšený pěvecký sbor Univerzity Palackého
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/events" className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-gray-200 transition-colors">
              Nadcházející koncerty
            </Link>
            <Link href="/about" className="px-8 py-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
              Přidej se k nám
            </Link>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 bg-slate-900 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">O nás</h2>
          <p className="max-w-2xl mx-auto text-gray-400 leading-relaxed">
            Ateneo je dynamické hudební těleso, které spojuje studenty i absolventy napříč všemi obory.
            Soustředíme se na interpretaci skladeb od renesance po současnost, včetně populární hudby a spirituálů.
          </p>
        </div>
      </section>

      <PublicFooter />
    </main>
  )
}
