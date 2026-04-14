'use client'

import { useActionState } from 'react'
import { createEvent, updateEvent } from '@/app/actions/events'
import {
    EVENT_TYPE,
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
        <form action={action} className="space-y-5 rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] p-7 shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
            <div>
                <label className="block text-sm font-medium text-[#5a3b31]">Název události</label>
                <input
                    name="name"
                    defaultValue={event?.name ?? ''}
                    className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    required
                    placeholder="např. Vánoční koncert"
                />
                {state?.errors?.name && <p className="mt-2 text-sm text-red-600">{state.errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-[#5a3b31]">Místo konání</label>
                <input
                    name="location"
                    defaultValue={event?.location ?? ''}
                    className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    placeholder="např. Reduta, Olomouc"
                />
                {state?.errors?.location && <p className="mt-2 text-sm text-red-600">{state.errors.location}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Začátek</label>
                    <input
                        type="datetime-local"
                        name="startDateTime"
                        defaultValue={toDatetimeLocalValue(event?.startDateTime)}
                        className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                        required
                    />
                    {state?.errors?.startDateTime && <p className="mt-2 text-sm text-red-600">{state.errors.startDateTime}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Konec (volitelné)</label>
                    <input
                        type="datetime-local"
                        name="endDateTime"
                        defaultValue={toDatetimeLocalValue(event?.endDateTime)}
                        className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    />
                    {state?.errors?.endDateTime && <p className="mt-2 text-sm text-red-600">{state.errors.endDateTime}</p>}
                </div>
            </div>

            <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Typ</label>
                <select
                    name="type"
                    defaultValue={event?.type ?? EVENT_TYPE.CONCERT}
                    className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                >
                    {EVENT_TYPES.map((eventType) => (
                        <option key={eventType} value={eventType}>
                            {EVENT_TYPE_LABELS[eventType]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-[#ead8cd] pt-5 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Otevření přihlašování (volitelné)</label>
                    <input
                        type="datetime-local"
                        name="signupOpenDate"
                        defaultValue={toDatetimeLocalValue(event?.signupOpenDate)}
                        className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    />
                    {state?.errors?.signupOpenDate && <p className="mt-2 text-sm text-red-600">{state.errors.signupOpenDate}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Uzavření přihlašování (volitelné)</label>
                    <input
                        type="datetime-local"
                        name="signupCloseDate"
                        defaultValue={toDatetimeLocalValue(event?.signupCloseDate)}
                        className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    />
                    {state?.errors?.signupCloseDate && <p className="mt-2 text-sm text-red-600">{state.errors.signupCloseDate}</p>}
                </div>
            </div>

            {state?.message && (
                <p className="text-sm text-red-600">{state.message}</p>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full justify-center rounded-full bg-[linear-gradient(135deg,#2f1b16_0%,#51342b_100%)] px-5 py-3 text-sm font-semibold text-[#fff7f0] shadow-[0_16px_35px_rgba(47,27,22,0.18)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                >
                    {isPending ? (isEditing ? 'Ukládám...' : 'Vytvářím...') : (isEditing ? 'Uložit změny' : 'Vytvořit událost')}
                </button>
            </div>
        </form>
    )
}
