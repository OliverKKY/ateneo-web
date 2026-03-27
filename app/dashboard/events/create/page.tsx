import CreateEventForm from '@/app/ui/events/create-form'
import { requirePageRole } from '@/lib/auth'
import { EVENT_MANAGER_ROLES } from '@/lib/definitions'

export default async function CreateEventPage() {
    await requirePageRole(EVENT_MANAGER_ROLES, '/dashboard/events')

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nová událost</h1>
            <CreateEventForm />
        </div>
    )
}
