import Link from 'next/link'
import { prisma } from '@/lib/db'
import { PublicFooter } from '@/app/ui/public/footer'
import { PublicNavbar } from '@/app/ui/public/navbar'
import { EVENT_TYPE_LABELS, EventTypeSchema } from '@/lib/definitions'

export const dynamic = 'force-dynamic'

export default async function PublicEventsPage() {
    const events = await prisma.event.findMany({
        where: {
            startDateTime: {
                gte: new Date(),
            },
        },
        orderBy: { startDateTime: 'asc' },
        take: 6,
    })

    return (
        <main className="flex min-h-screen flex-col bg-[#09141c] text-white">
            <a href="#main-content" className="skip-link">Přeskočit na obsah</a>
            <PublicNavbar />
            <section id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-32">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-[#f2c8ae]">Události</p>
                        <h1 className="mt-4 text-5xl font-black tracking-tight">Nadcházející program sboru</h1>
                        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                            Přehled nejbližších koncertů, soustředění a dalších akcí. Veřejný program drží sbor viditelný, interní část pak řeší přihlášky a provozní koordinaci.
                        </p>
                    </div>
                    <Link href="/login" className="rounded-full border border-white/15 bg-white/6 px-5 py-3 text-sm font-semibold hover:bg-white/12">
                        Vstup do intranetu
                    </Link>
                </div>

                <div className="mt-10 grid gap-5">
                    {events.length === 0 && (
                        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-slate-300">
                            Momentálně nejsou zveřejněné žádné nadcházející události.
                        </div>
                    )}

                    {events.map((event) => {
                        const eventType = EventTypeSchema.safeParse(event.type)
                        const formattedDate = new Date(event.startDateTime).toLocaleDateString('cs-CZ', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })

                        return (
                            <article key={event.id} className="rounded-[2rem] border border-white/10 bg-white/6 p-7 shadow-xl shadow-black/10 backdrop-blur-sm">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                                            <span className="rounded-full bg-[#f2c8ae]/16 px-3 py-1 text-[#f8decc]">
                                                {eventType.success ? EVENT_TYPE_LABELS[eventType.data] : event.type}
                                            </span>
                                            <span>{formattedDate}</span>
                                        </div>
                                        <h2 className="mt-3 text-2xl font-bold">{event.name}</h2>
                                        <p className="mt-2 text-slate-300">{event.location || 'Místo bude upřesněno.'}</p>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>
            <PublicFooter />
        </main>
    )
}
