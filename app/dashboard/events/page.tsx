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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Události</h1>
                {canManage && (
                    <Link
                        href="/dashboard/events/create"
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 shadow-md transition-colors"
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
                        <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${eventType.success && eventType.data === 'CONCERT' ? 'bg-gray-100 text-gray-800' : 'bg-slate-100 text-slate-800'}`}>
                                        {eventType.success ? EVENT_TYPE_LABELS[eventType.data] : event.type}
                                    </span>
                                    <span className="text-sm text-gray-600">{startDate}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{event.name}</h2>
                                <p className="text-gray-700">{event.location}</p>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col md:items-end gap-2">
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
