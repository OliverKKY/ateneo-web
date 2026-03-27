import Link from 'next/link'
import { prisma } from '@/lib/db'
import { hasRole, requireSession } from '@/lib/auth'
import { getSignupAvailability } from '@/lib/event-signup'
import { getDashboardQuickActions } from '@/lib/dashboard'
import {
    ADMIN_ONLY_ROLES,
    EVENT_MANAGER_ROLES,
    EVENT_TYPE_LABELS,
    EventTypeSchema,
    ROLES,
    SIGNUP_STATUSES,
    SONG_DELETE_ROLES,
    SONG_EDITOR_ROLES,
    SignupStatusSchema,
} from '@/lib/definitions'

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
            take: 4,
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
            take: 5,
        }),
        prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { role: true },
        }),
    ])

    const nextEventLabel = nextEvent
        ? new Date(nextEvent.startDateTime).toLocaleDateString('cs-CZ', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        })
        : 'Zatím není naplánovaná žádná další událost.'
    const quickActions = getDashboardQuickActions(role)
    const signupOverview = {
        going: currentUserSignups.filter((signup) => signup.status === SIGNUP_STATUSES[0]).length,
        maybe: currentUserSignups.filter((signup) => signup.status === SIGNUP_STATUSES[1]).length,
        notGoing: currentUserSignups.filter((signup) => signup.status === SIGNUP_STATUSES[2]).length,
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Ateneo intranet</p>
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Vítejte v systému Ateneo</h1>
                        <p className="mt-2 max-w-2xl text-sm text-gray-600">
                            {role === ROLES.SINGER && 'Sledujte přihlášky na akce a mějte přehled o nejbližším programu.'}
                            {hasRole(role, SONG_EDITOR_ROLES) && !hasRole(role, ADMIN_ONLY_ROLES) && role !== ROLES.SINGER && 'Máte rychlý přístup ke správě skladeb a nadcházejícím akcím.'}
                            {hasRole(role, ADMIN_ONLY_ROLES) && 'Máte dohled nad uživateli, událostmi i archivem skladeb z jednoho místa.'}
                            {!hasRole(role, SONG_EDITOR_ROLES) && !hasRole(role, ADMIN_ONLY_ROLES) && role !== ROLES.SINGER && 'Zde najdete nejbližší akce a svoje poslední reakce na přihlášky.'}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Aktuální role</div>
                        <div className="mt-1 font-semibold text-slate-900">{role}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-gray-600 text-sm font-medium uppercase">Nadcházející události</h3>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{eventCount}</p>
                    <p className="mt-2 text-sm text-gray-500">{nextEventLabel}</p>
                </div>

                {hasRole(role, SONG_DELETE_ROLES) && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-gray-600 text-sm font-medium uppercase">Počet skladeb</h3>
                        <p className="text-3xl font-bold text-slate-800 mt-2">{songCount}</p>
                        <p className="mt-2 text-sm text-gray-500">
                            {songCount === 0 ? 'Archiv je zatím prázdný.' : 'Poslední změny najdete níže v přehledu skladeb.'}
                        </p>
                    </div>
                )}

                {hasRole(role, ADMIN_ONLY_ROLES) && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-gray-600 text-sm font-medium uppercase">Aktivní uživatelé</h3>
                        <p className="text-3xl font-bold text-slate-800 mt-2">{userCount}</p>
                        <p className="mt-2 text-sm text-gray-500">
                            {userCount === 1 ? 'V systému je zatím pouze seed administrátor.' : 'Správa uživatelů je dostupná níže a v levém menu.'}
                        </p>
                    </div>
                )}

                {!hasRole(role, ADMIN_ONLY_ROLES) && !hasRole(role, SONG_DELETE_ROLES) && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-gray-600 text-sm font-medium uppercase">Moje odpovědi</h3>
                        <p className="text-3xl font-bold text-slate-800 mt-2">{currentUserSignups.length}</p>
                        <p className="mt-2 text-sm text-gray-500">
                            {signupOverview.going} jdu, {signupOverview.maybe} možná, {signupOverview.notGoing} nejdu
                        </p>
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Rychlé akce</h2>
                <div className="flex flex-wrap gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className={action.tone === 'primary'
                                ? 'rounded-xl bg-slate-900 px-5 py-3 text-white shadow-md transition-colors hover:bg-slate-800'
                                : 'rounded-xl border border-gray-200 bg-white px-5 py-3 text-slate-900 shadow-sm transition-colors hover:bg-gray-50'}
                        >
                            {action.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Nejbližší program</h2>
                        <Link href="/dashboard/events" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                            Všechny události
                        </Link>
                    </div>
                    <div className="mt-5 space-y-4">
                        {upcomingEvents.length === 0 && (
                            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
                                Zatím nejsou vypsané žádné budoucí akce.
                            </div>
                        )}
                        {upcomingEvents.map((event) => {
                            const eventType = EventTypeSchema.safeParse(event.type)
                            const userSignup = SignupStatusSchema.safeParse(event.signups[0]?.status)
                            const availability = getSignupAvailability(event)

                            return (
                                <div key={event.id} className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                                <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                    {eventType.success ? EVENT_TYPE_LABELS[eventType.data] : event.type}
                                                </span>
                                                <span>
                                                    {new Date(event.startDateTime).toLocaleDateString('cs-CZ', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            <h3 className="mt-2 text-lg font-semibold text-slate-900">{event.name}</h3>
                                            <p className="text-sm text-gray-600">{event.location || 'Místo bude doplněno.'}</p>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {userSignup.success && <span>Moje odpověď: <strong className="text-slate-900">{userSignup.data}</strong></span>}
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
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900">Moje poslední odpovědi</h2>
                            <div className="mt-5 space-y-3">
                                {currentUserSignups.length === 0 && (
                                    <p className="text-sm text-gray-500">Zatím jste nereagovali na žádnou událost.</p>
                                )}
                                {currentUserSignups.map((signup) => {
                                    const signupStatus = SignupStatusSchema.safeParse(signup.status)

                                    return (
                                        <div key={signup.id} className="rounded-xl border border-gray-100 p-4">
                                            <div className="text-sm text-gray-500">
                                                {new Date(signup.event.startDateTime).toLocaleDateString('cs-CZ', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                })}
                                            </div>
                                            <div className="mt-1 font-semibold text-slate-900">{signup.event.name}</div>
                                            <div className="mt-1 text-sm text-gray-600">
                                                Stav: {signupStatus.success ? signupStatus.data : signup.status}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {hasRole(role, SONG_EDITOR_ROLES) && (
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Archiv skladeb</h2>
                                <Link href="/dashboard/songs" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                    Otevřít archiv
                                </Link>
                            </div>
                            <div className="mt-5 space-y-3">
                                {recentSongs.length === 0 && (
                                    <p className="text-sm text-gray-500">V archivu ještě nejsou žádné skladby.</p>
                                )}
                                {recentSongs.map((song) => (
                                    <div key={song.id} className="rounded-xl border border-gray-100 p-4">
                                        <div className="font-semibold text-slate-900">{song.title}</div>
                                        <div className="mt-1 text-sm text-gray-600">
                                            {song.author || 'Autor neuveden'} • {song.copyCount} kopií
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {hasRole(role, ADMIN_ONLY_ROLES) && (
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Poslední uživatelé</h2>
                                <Link href="/dashboard/users" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                    Správa uživatelů
                                </Link>
                            </div>
                            <div className="mt-5 space-y-3">
                                {newestUsers.map((user) => (
                                    <div key={user.id} className="rounded-xl border border-gray-100 p-4">
                                        <div className="font-semibold text-slate-900">{user.firstName} {user.lastName}</div>
                                        <div className="mt-1 text-sm text-gray-600">
                                            {user.email} • {user.role.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {hasRole(role, EVENT_MANAGER_ROLES) && (
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900">Správa událostí</h2>
                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                {eventCount === 0
                                    ? 'Zatím není vytvořená žádná událost. Začněte založením první akce.'
                                    : `V systému je aktuálně ${eventCount} událostí. Zkontrolujte termíny a okna přihlašování před zveřejněním.`}
                            </p>
                            <div className="mt-4">
                                <Link
                                    href="/dashboard/events/create"
                                    className="inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-md hover:bg-slate-800"
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
