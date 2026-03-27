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
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Upravit událost</h1>
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
