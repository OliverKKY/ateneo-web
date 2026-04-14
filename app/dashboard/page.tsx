import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { hasRole, requireSession } from '@/lib/auth'
import { formatCzechDate, formatCzechDateTime } from '@/lib/date'
import { getSignupAvailability } from '@/lib/event-signup'
import { getDashboardQuickActions } from '@/lib/dashboard'
import {
    ADMIN_ONLY_ROLES,
    EVENT_MANAGER_ROLES,
    EVENT_TYPE_LABELS,
    EventTypeSchema,
    ROLES,
    SIGNUP_STATUS,
    SIGNUP_STATUS_LABELS,
    SONG_DELETE_ROLES,
    SONG_EDITOR_ROLES,
    SignupStatusSchema,
} from '@/lib/definitions'

export const metadata: Metadata = {
    title: 'Přehled',
}

export default async function DashboardPage() {
    const session = await requireSession()
    const role = session.role

    const [
        eventCount,
        songCount,
        userCount,
        nextEvent,
        upcomingEvents,
        currentUserSignups,
        recentSongs,
        newestUsers,
    ] = await Promise.all([
        prisma.event.count(),
        prisma.song.count(),
        prisma.user.count(),
        prisma.event.findFirst({
            where: { startDateTime: { gte: new Date() } },
            orderBy: { startDateTime: 'asc' },
        }),
        prisma.event.findMany({
            where: { startDateTime: { gte: new Date() } },
            orderBy: { startDateTime: 'asc' },
            take: 3,
            include: {
                signups: {
                    where: { userId: Number(session.userId) },
                },
            },
        }),
        prisma.eventSignup.findMany({
            where: { userId: Number(session.userId) },
            orderBy: { createdAt: 'desc' },
            take: 3,
            include: {
                event: true,
            },
        }),
        prisma.song.findMany({
            orderBy: { id: 'desc' },
            take: 4,
        }),
        prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 4,
            include: { role: true },
        }),
    ])

    const quickActions = getDashboardQuickActions(role)
    const nextEventLabel = nextEvent ? formatCzechDateTime(nextEvent.startDateTime) : 'Zatím není naplánovaná žádná další událost.'
    const signupOverview = {
        going: currentUserSignups.filter((signup) => signup.status === SIGNUP_STATUS.GOING).length,
        maybe: currentUserSignups.filter((signup) => signup.status === SIGNUP_STATUS.MAYBE).length,
        notGoing: currentUserSignups.filter((signup) => signup.status === SIGNUP_STATUS.NOT_GOING).length,
    }

    const overviewStats = [
        {
            label: 'Další událost',
            value: nextEvent ? formatCzechDate(nextEvent.startDateTime) : 'Bez termínu',
            detail: nextEvent ? nextEvent.name : 'Naplánujte další akci v kalendáři.',
        },
        {
            label: hasRole(role, SONG_DELETE_ROLES) ? 'Skladby v archivu' : 'Moje odpovědi',
            value: hasRole(role, SONG_DELETE_ROLES) ? String(songCount) : String(currentUserSignups.length),
            detail: hasRole(role, SONG_DELETE_ROLES)
                ? 'Rychlý přehled velikosti repertoáru.'
                : `${signupOverview.going} jdu, ${signupOverview.maybe} možná, ${signupOverview.notGoing} nejdu`,
        },
        ...(hasRole(role, ADMIN_ONLY_ROLES)
            ? [{
                label: 'Uživatelé',
                value: String(userCount),
                detail: 'Správa členů a přístupových rolí.',
            }]
            : []),
    ]

    const introText =
        role === ROLES.SINGER
            ? 'Nejdůležitější přehled o nejbližších akcích a vašich odpovědích.'
            : hasRole(role, ADMIN_ONLY_ROLES)
                ? 'Klidnější přehled nad událostmi, uživateli a správou sboru.'
                : hasRole(role, SONG_EDITOR_ROLES)
                    ? 'Rychlý přístup k programu a správě repertoáru bez zbytečného balastu.'
                    : 'Přehled nejbližších akcí a základních odpovědí na jednom místě.'

    return (
        <div className="space-y-8">
            <section className="rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] p-6 shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b56a44]">
                            Ateneo intranet
                        </p>
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-[#241612] md:text-4xl">
                                Přehled
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6c5148]">
                                {introText}
                            </p>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-[#e3cfc3] bg-white/60 px-4 py-3 text-sm text-[#5a3b31]">
                        <div className="text-xs uppercase tracking-[0.24em] text-[#9a7565]">Aktuální role</div>
                        <div className="mt-1 font-semibold">{role}</div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className={action.tone === 'primary'
                                ? 'inline-flex items-center rounded-full bg-[linear-gradient(135deg,#2f1b16_0%,#51342b_100%)] px-4 py-2.5 text-sm font-semibold text-[#fff7f0] shadow-[0_14px_30px_rgba(47,27,22,0.14)]'
                                : 'inline-flex items-center rounded-full border border-[#d7c0b3] bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#5a3b31]'}
                        >
                            {action.label}
                        </Link>
                    ))}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {overviewStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-[#ead8cd] bg-white/55 px-4 py-4"
                        >
                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7565]">
                                {stat.label}
                            </div>
                            <div className="mt-2 text-xl font-semibold text-[#241612]">{stat.value}</div>
                            <p className="mt-1 text-sm leading-6 text-[#6c5148]">{stat.detail}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
                <section className="rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] p-6 shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-[#241612]">Nejbližší program</h2>
                            <p className="mt-1 text-sm text-[#6c5148]">{nextEventLabel}</p>
                        </div>
                        <Link href="/dashboard/events" className="text-sm font-semibold text-[#7c5645] hover:text-[#241612]">
                            Všechny události
                        </Link>
                    </div>

                    <div className="mt-5 space-y-3">
                        {upcomingEvents.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-[#d9cabc] bg-white/45 p-5 text-sm text-[#6c5148]">
                                Zatím nejsou vypsané žádné budoucí akce.
                            </div>
                        )}
                        {upcomingEvents.map((event) => {
                            const eventType = EventTypeSchema.safeParse(event.type)
                            const userSignup = SignupStatusSchema.safeParse(event.signups[0]?.status)
                            const availability = getSignupAvailability(event)

                            return (
                                <div key={event.id} className="rounded-2xl border border-[#ead8cd] bg-white/55 p-4">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-[#7a5d52]">
                                                <span className="rounded-full bg-[#f0d8ca] px-2.5 py-1 text-xs font-semibold text-[#6f4634]">
                                                    {eventType.success ? EVENT_TYPE_LABELS[eventType.data] : event.type}
                                                </span>
                                                <span>{formatCzechDateTime(event.startDateTime)}</span>
                                            </div>
                                            <h3 className="mt-2 text-lg font-semibold text-[#241612]">{event.name}</h3>
                                            <p className="text-sm text-[#6c5148]">{event.location || 'Místo bude doplněno.'}</p>
                                        </div>
                                        <div className="text-sm text-[#6c5148] md:max-w-[16rem] md:text-right">
                                            {userSignup.success && (
                                                <span>
                                                    Moje odpověď: <strong className="text-[#241612]">{SIGNUP_STATUS_LABELS[userSignup.data]}</strong>
                                                </span>
                                            )}
                                            {!userSignup.success && availability.reason && <span>{availability.reason}</span>}
                                            {!userSignup.success && !availability.reason && <span>Přihlášení je otevřené.</span>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                <div className="space-y-6">
                    {(role === ROLES.SINGER || !hasRole(role, ADMIN_ONLY_ROLES)) && (
                        <section className="rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] p-6 shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
                            <h2 className="text-lg font-semibold text-[#241612]">Moje odpovědi</h2>
                            <div className="mt-4 space-y-3">
                                {currentUserSignups.length === 0 && (
                                    <p className="text-sm text-[#6c5148]">Zatím jste nereagovali na žádnou událost.</p>
                                )}
                                {currentUserSignups.map((signup) => {
                                    const signupStatus = SignupStatusSchema.safeParse(signup.status)

                                    return (
                                        <div key={signup.id} className="rounded-2xl border border-[#ead8cd] bg-white/55 p-4">
                                            <div className="text-sm text-[#7a5d52]">{formatCzechDate(signup.event.startDateTime)}</div>
                                            <div className="mt-1 font-semibold text-[#241612]">{signup.event.name}</div>
                                            <div className="mt-1 text-sm text-[#6c5148]">
                                                Stav: {signupStatus.success ? SIGNUP_STATUS_LABELS[signupStatus.data] : signup.status}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {hasRole(role, SONG_EDITOR_ROLES) && (
                        <section className="rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] p-6 shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-lg font-semibold text-[#241612]">Archiv skladeb</h2>
                                <Link href="/dashboard/songs" className="text-sm font-semibold text-[#7c5645] hover:text-[#241612]">
                                    Otevřít
                                </Link>
                            </div>
                            <div className="mt-4 space-y-3">
                                {recentSongs.length === 0 && (
                                    <p className="text-sm text-[#6c5148]">V archivu ještě nejsou žádné skladby.</p>
                                )}
                                {recentSongs.map((song) => (
                                    <div key={song.id} className="rounded-2xl border border-[#ead8cd] bg-white/55 p-4">
                                        <div className="font-semibold text-[#241612]">{song.title}</div>
                                        <div className="mt-1 text-sm text-[#6c5148]">
                                            {song.author || 'Autor neuveden'} • {song.copyCount} kopií
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {hasRole(role, ADMIN_ONLY_ROLES) && (
                        <section className="rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] p-6 shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-lg font-semibold text-[#241612]">Poslední uživatelé</h2>
                                <Link href="/dashboard/users" className="text-sm font-semibold text-[#7c5645] hover:text-[#241612]">
                                    Správa
                                </Link>
                            </div>
                            <div className="mt-4 space-y-3">
                                {newestUsers.map((user) => (
                                    <div key={user.id} className="rounded-2xl border border-[#ead8cd] bg-white/55 p-4">
                                        <div className="font-semibold text-[#241612]">{user.firstName} {user.lastName}</div>
                                        <div className="mt-1 text-sm text-[#6c5148]">
                                            {user.email} • {user.role.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {hasRole(role, EVENT_MANAGER_ROLES) && (
                        <section className="rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] p-6 shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
                            <h2 className="text-lg font-semibold text-[#241612]">Správa událostí</h2>
                            <p className="mt-3 text-sm leading-6 text-[#6c5148]">
                                {eventCount === 0
                                    ? 'Zatím není vytvořená žádná událost. Začněte založením první akce.'
                                    : `V systému je aktuálně ${eventCount} událostí. Zkontrolujte termíny a okna přihlašování před zveřejněním.`}
                            </p>
                            <div className="mt-4">
                                <Link
                                    href="/dashboard/events/create"
                                    className="inline-flex items-center rounded-full bg-[linear-gradient(135deg,#2f1b16_0%,#51342b_100%)] px-4 py-2.5 text-sm font-semibold text-[#fff7f0] shadow-[0_14px_30px_rgba(47,27,22,0.14)]"
                                >
                                    Vytvořit událost
                                </Link>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
