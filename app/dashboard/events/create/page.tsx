import CreateEventForm from '@/app/ui/events/create-form'
import { requirePageRole } from '@/lib/auth'
import { EVENT_MANAGER_ROLES } from '@/lib/definitions'

export default async function CreateEventPage() {
    await requirePageRole(EVENT_MANAGER_ROLES, '/dashboard/events')

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b56a44]">
                    Kalendář
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-[#241612]">Nová událost</h1>
                <p className="max-w-2xl text-sm leading-6 text-[#6c5148]">
                    Připravte koncert nebo soustředění včetně přihlašovacího okna pro členy.
                </p>
            </div>
            <CreateEventForm />
        </div>
    )
}
