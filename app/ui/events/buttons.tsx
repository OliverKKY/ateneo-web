'use client'

import Link from 'next/link'
import { deleteEvent, eventSignup } from '@/app/actions/events'
import { SIGNUP_STATUSES, type SignupStatus } from '@/lib/definitions'
import { useState } from 'react'

export function SignupButton({
    eventId,
    initialStatus,
    canSignup,
    disabledReason,
}: {
    eventId: number
    initialStatus?: SignupStatus
    canSignup: boolean
    disabledReason?: string
}) {
    const [status, setStatus] = useState(initialStatus)
    const [isPending, setIsPending] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const handleSignup = async (newStatus: SignupStatus) => {
        setIsPending(true)
        setMessage(null)

        const result = await eventSignup(eventId, newStatus)

        if (result?.success) {
            setStatus(newStatus)
        } else if (result?.message) {
            setMessage(result.message)
        }

        setIsPending(false)
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
                <button
                    onClick={() => handleSignup(SIGNUP_STATUSES[0])}
                    disabled={isPending || !canSignup}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${status === 'going' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                    Jdu
                </button>
                <button
                    onClick={() => handleSignup(SIGNUP_STATUSES[1])}
                    disabled={isPending || !canSignup}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${status === 'maybe' ? 'bg-orange-400 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                    Možná
                </button>
                <button
                    onClick={() => handleSignup(SIGNUP_STATUSES[2])}
                    disabled={isPending || !canSignup}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${status === 'not_going' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                    Nejdu
                </button>
            </div>
            {!canSignup && disabledReason && (
                <p className="text-sm text-gray-500">{disabledReason}</p>
            )}
            {message && <p className="text-sm text-red-600">{message}</p>}
        </div>
    )
}

export function EventManagementButtons({ eventId }: { eventId: number }) {
    const [isPending, setIsPending] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Opravdu chcete smazat tuto událost? Přihlášky budou odstraněny také.')) {
            return
        }

        setIsPending(true)
        const result = await deleteEvent(eventId)
        setIsPending(false)

        if (result?.message && !result.success) {
            alert(result.message)
        }
    }

    return (
        <div className="flex items-center gap-3">
            <Link
                href={`/dashboard/events/${eventId}/edit`}
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
                Upravit
            </Link>
            <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? 'Mažu...' : 'Smazat'}
            </button>
        </div>
    )
}
