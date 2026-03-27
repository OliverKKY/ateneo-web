'use client'

import { useActionState } from 'react'
import { createEvent, updateEvent } from '@/app/actions/events'
import {
    EVENT_TYPES,
    EVENT_TYPE_LABELS,
    type ActionState,
} from '@/lib/definitions'
import { toDatetimeLocalValue } from '@/lib/date'

type EventFormData = {
    id?: number
    name?: string
    location?: string | null
    startDateTime?: Date | string
    endDateTime?: Date | string | null
    type?: (typeof EVENT_TYPES)[number]
    signupOpenDate?: Date | string | null
    signupCloseDate?: Date | string | null
}

type EventFormProps = {
    event?: EventFormData
}

export default function CreateEventForm({ event }: EventFormProps) {
    const isEditing = typeof event?.id === 'number'
    const eventId = event?.id ?? 0
    const actionWithId = isEditing ? updateEvent.bind(null, eventId) : createEvent
    const [state, action, isPending] = useActionState<ActionState<string> | undefined, FormData>(
        actionWithId,
        undefined,
    )

    return (
        <form action={action} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Název události</label>
                <input
                    name="name"
                    defaultValue={event?.name ?? ''}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                    placeholder="např. Vánoční koncert"
                />
                {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Místo konání</label>
                <input
                    name="location"
                    defaultValue={event?.location ?? ''}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="např. Reduta, Olomouc"
                />
                {state?.errors?.location && <p className="text-red-500 text-sm">{state.errors.location}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Začátek</label>
                    <input
                        type="datetime-local"
                        name="startDateTime"
                        defaultValue={toDatetimeLocalValue(event?.startDateTime)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                    />
                    {state?.errors?.startDateTime && <p className="text-red-500 text-sm">{state.errors.startDateTime}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Konec (volitelné)</label>
                    <input
                        type="datetime-local"
                        name="endDateTime"
                        defaultValue={toDatetimeLocalValue(event?.endDateTime)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    {state?.errors?.endDateTime && <p className="text-red-500 text-sm">{state.errors.endDateTime}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Typ</label>
                <select
                    name="type"
                    defaultValue={event?.type ?? EVENT_TYPES[0]}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                    {EVENT_TYPES.map((eventType) => (
                        <option key={eventType} value={eventType}>
                            {EVENT_TYPE_LABELS[eventType]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-gray-100">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Otevření přihlašování (volitelné)</label>
                    <input
                        type="datetime-local"
                        name="signupOpenDate"
                        defaultValue={toDatetimeLocalValue(event?.signupOpenDate)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    {state?.errors?.signupOpenDate && <p className="text-red-500 text-sm">{state.errors.signupOpenDate}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Uzavření přihlašování (volitelné)</label>
                    <input
                        type="datetime-local"
                        name="signupCloseDate"
                        defaultValue={toDatetimeLocalValue(event?.signupCloseDate)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    {state?.errors?.signupCloseDate && <p className="text-red-500 text-sm">{state.errors.signupCloseDate}</p>}
                </div>
            </div>

            {state?.message && (
                <p className="text-red-500 text-sm">{state.message}</p>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
                >
                    {isPending ? (isEditing ? 'Ukládám...' : 'Vytvářím...') : (isEditing ? 'Uložit změny' : 'Vytvořit událost')}
                </button>
            </div>
        </form>
    )
}
