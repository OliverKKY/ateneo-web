import { notFound } from 'next/navigation'
import CreateEventForm from '@/app/ui/events/create-form'
import { prisma } from '@/lib/db'
import { requirePageRole } from '@/lib/auth'
import { EVENT_MANAGER_ROLES, EventTypeSchema } from '@/lib/definitions'

type EventEditPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function EventEditPage({ params }: EventEditPageProps) {
    await requirePageRole(EVENT_MANAGER_ROLES, '/dashboard/events')

    const { id } = await params
    const eventId = Number(id)

    if (!Number.isInteger(eventId) || eventId <= 0) {
        notFound()
    }

    const event = await prisma.event.findUnique({
        where: { id: eventId },
    })

    if (!event) {
        notFound()
    }

    const eventType = EventTypeSchema.safeParse(event.type)

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b56a44]">
                    Kalendář
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-[#241612]">Upravit událost</h1>
                <p className="max-w-2xl text-sm leading-6 text-[#6c5148]">
                    Udržujte termíny, místo i přihlašování v souladu s aktuálním plánem sboru.
                </p>
            </div>
            <CreateEventForm
                event={{
                    id: event.id,
                    name: event.name,
                    location: event.location,
                    startDateTime: event.startDateTime,
                    endDateTime: event.endDateTime,
                    type: eventType.success ? eventType.data : undefined,
                    signupOpenDate: event.signupOpenDate,
                    signupCloseDate: event.signupCloseDate,
                }}
            />
        </div>
    )
}
