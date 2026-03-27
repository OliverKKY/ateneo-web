import { prisma } from '@/lib/db'
import { verifySession } from '@/lib/session'
import { hasRole } from '@/lib/auth'
import { getSignupAvailability } from '@/lib/event-signup'
import {
    EVENT_MANAGER_ROLES,
    EVENT_TYPE_LABELS,
    EventTypeSchema,
    SignupStatusSchema,
} from '@/lib/definitions'
import Link from 'next/link'
import { EventManagementButtons, SignupButton } from '@/app/ui/events/buttons'

export default async function EventsPage() {
    const session = await verifySession()
    if (!session) return null
    const role = session.role
    const canManage = hasRole(role, EVENT_MANAGER_ROLES)

    const events = await prisma.event.findMany({
        orderBy: { startDateTime: 'asc' },
        include: {
            signups: {
                where: { userId: Number(session.userId) }
            }
        }
    })

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Události</h1>
                {canManage && (
                    <Link
                        href="/dashboard/events/create"
                        className="rounded-2xl bg-[linear-gradient(180deg,#17303a,#10212a)] px-4 py-3 text-white shadow-[0_16px_40px_rgba(16,33,42,0.18)] transition-colors hover:bg-[#10212a]"
                    >
                        Nová událost
                    </Link>
                )}
            </div>

            <div className="grid gap-6">
                {events.map((event) => {
                    const userSignup = SignupStatusSchema.safeParse(
                        event.signups[0]?.status,
                    )
                    const eventType = EventTypeSchema.safeParse(event.type)
                    const availability = getSignupAvailability(event)
                    const startDate = new Date(event.startDateTime).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })

                    return (
                        <div key={event.id} className="flex flex-col items-start justify-between rounded-[1.9rem] border border-[#d9cabc] bg-[rgba(255,255,255,0.74)] p-6 shadow-[0_18px_50px_rgba(64,43,30,0.08)] backdrop-blur-sm md:flex-row md:items-center">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${eventType.success && eventType.data === 'CONCERT' ? 'bg-[#f0d8ca] text-[#6f4634]' : 'bg-[#d9e9eb] text-[#204954]'}`}>
                                        {eventType.success ? EVENT_TYPE_LABELS[eventType.data] : event.type}
                                    </span>
                                    <span className="text-sm text-slate-500">{startDate}</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">{event.name}</h2>
                                <p className="text-slate-600">{event.location}</p>
                            </div>

                            <div className="mt-4 flex flex-col gap-2 md:mt-0 md:items-end">
                                {canManage && <EventManagementButtons eventId={event.id} />}
                                <SignupButton
                                    eventId={event.id}
                                    initialStatus={userSignup.success ? userSignup.data : undefined}
                                    canSignup={availability.canSignup}
                                    disabledReason={availability.reason}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
