import Link from 'next/link'
import { prisma } from '@/lib/db'
import { PublicFooter } from '@/app/ui/public/footer'
import { PublicNavbar } from '@/app/ui/public/navbar'
import { EVENT_TYPE_LABELS, EventTypeSchema } from '@/lib/definitions'

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
        <main className="min-h-screen bg-slate-950 text-white">
            <PublicNavbar />
            <section className="mx-auto max-w-5xl px-6 pb-16 pt-32">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Události</p>
                        <h1 className="mt-4 text-5xl font-black tracking-tight">Nadcházející program sboru</h1>
                    </div>
                    <Link href="/login" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/10">
                        Vstup do intranetu
                    </Link>
                </div>

                <div className="mt-10 grid gap-5">
                    {events.length === 0 && (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">
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
                            <article key={event.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <span className="rounded-full bg-sky-400/15 px-3 py-1 text-sky-200">
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
