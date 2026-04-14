'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireRole, requireSession } from '@/lib/auth'
import {
    handleActionError,
    parsePositiveIntegerId,
    validationError,
} from '@/lib/action-utils'
import { getSignupAvailability } from '@/lib/event-signup'
import {
    EVENT_MANAGER_ROLES,
    EventTypeSchema,
    SignupStatusSchema,
    type ActionState,
    type SessionPayload,
} from '@/lib/definitions'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const OptionalDateSchema = z.preprocess(
    (value) => value === '' ? undefined : value,
    z.coerce.date().optional(),
)

const EventSchema = z.object({
    name: z.string().min(1, 'Název události je povinný'),
    location: z.preprocess((value) => value === '' ? undefined : value, z.string().trim().optional()),
    startDateTime: z.coerce.date(),
    endDateTime: OptionalDateSchema,
    type: EventTypeSchema,
    signupOpenDate: OptionalDateSchema,
    signupCloseDate: OptionalDateSchema,
}).refine(
    ({ endDateTime, startDateTime }) => !endDateTime || endDateTime >= startDateTime,
    {
        message: 'Konec události nesmí být před začátkem.',
        path: ['endDateTime'],
    },
).refine(
    ({ signupOpenDate, signupCloseDate }) => !signupOpenDate || !signupCloseDate || signupCloseDate >= signupOpenDate,
    {
        message: 'Uzavření přihlašování nesmí být před otevřením.',
        path: ['signupCloseDate'],
    },
)

type EventFields =
    | 'name'
    | 'location'
    | 'startDateTime'
    | 'endDateTime'
    | 'type'
    | 'signupOpenDate'
    | 'signupCloseDate'

async function parseAndAuthorizeEventForm(
    formData: FormData,
): Promise<
    | { success: true; data: z.infer<typeof EventSchema> }
    | { success: false; state: ActionState<EventFields> }
> {
    try {
        await requireRole(EVENT_MANAGER_ROLES)
    } catch (error) {
        return {
            success: false,
            state: handleActionError<EventFields>(
                error,
                'Chyba při ukládání události.',
            ),
        }
    }

    const result = EventSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            success: false,
            state: validationError<EventFields>(
                result.error.flatten().fieldErrors,
                'Chybná pole. Zkontrolujte datumy a povinné údaje.',
            ),
        }
    }

    return {
        success: true,
        data: result.data,
    }
}

export async function createEvent(
    _prevState: ActionState<EventFields> | undefined,
    formData: FormData,
) {
    const parsed = await parseAndAuthorizeEventForm(formData)

    if (!parsed.success) {
        return parsed.state
    }

    const { name, location, startDateTime, endDateTime, type, signupOpenDate, signupCloseDate } = parsed.data

    try {
        await prisma.event.create({
            data: {
                name,
                location,
                startDateTime,
                endDateTime,
                type,
                signupOpenDate,
                signupCloseDate
            }
        })
    } catch (error) {
        return handleActionError<EventFields>(error, 'Chyba při vytváření události.')
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/events')
    redirect('/dashboard/events')
}

export async function updateEvent(
    eventId: number,
    _prevState: ActionState<EventFields> | undefined,
    formData: FormData,
) {
    const parsedEventId = parsePositiveIntegerId(eventId)

    if (parsedEventId === null) {
        return { message: 'Neplatná událost.' }
    }

    const parsed = await parseAndAuthorizeEventForm(formData)

    if (!parsed.success) {
        return parsed.state
    }

    const { name, location, startDateTime, endDateTime, type, signupOpenDate, signupCloseDate } = parsed.data

    try {
        await prisma.event.update({
            where: { id: parsedEventId },
            data: {
                name,
                location,
                startDateTime,
                endDateTime,
                type,
                signupOpenDate,
                signupCloseDate,
            },
        })
    } catch (error) {
        return handleActionError<EventFields>(error, 'Chyba při aktualizaci události.', {
            notFoundMessage: 'Událost nebyla nalezena.',
        })
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/events')
    revalidatePath('/events')
    redirect('/dashboard/events')
}

export async function deleteEvent(eventId: number) {
    const parsedEventId = parsePositiveIntegerId(eventId)

    if (parsedEventId === null) {
        return { message: 'Neplatná událost.' }
    }

    try {
        await requireRole(EVENT_MANAGER_ROLES)
    } catch (error) {
        return handleActionError(error, 'Událost nelze smazat.', {
            notFoundMessage: 'Událost nebyla nalezena.',
        })
    }

    try {
        await prisma.$transaction([
            prisma.eventSignup.deleteMany({
                where: { eventId: parsedEventId },
            }),
            prisma.event.delete({
                where: { id: parsedEventId },
            }),
        ])
    } catch (error) {
        return handleActionError(error, 'Událost nelze smazat.', {
            notFoundMessage: 'Událost nebyla nalezena.',
        })
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/events')
    revalidatePath('/events')
    return { success: true }
}

export async function eventSignup(eventId: number, status: string) {
    let session: SessionPayload

    try {
        session = await requireSession()
    } catch (error) {
        return handleActionError(error, 'Chyba při ukládání.')
    }

    const parsedEventId = parsePositiveIntegerId(eventId)

    if (parsedEventId === null) {
        return { message: 'Neplatná událost.' }
    }

    const parsedStatus = SignupStatusSchema.safeParse(status)

    if (!parsedStatus.success) {
        return { message: 'Neplatný stav přihlášení.' }
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id: parsedEventId },
        })

        if (!event) {
            return { message: 'Událost nebyla nalezena.' }
        }

        const availability = getSignupAvailability(event)

        if (!availability.canSignup) {
            return { message: availability.reason }
        }

        await prisma.eventSignup.upsert({
            where: {
                userId_eventId: {
                    userId: Number(session.userId),
                    eventId: parsedEventId
                }
            },
            update: { status: parsedStatus.data },
            create: {
                userId: Number(session.userId),
                eventId: parsedEventId,
                status: parsedStatus.data
            }
        })
        revalidatePath('/dashboard')
        revalidatePath('/dashboard/events')
        return { message: 'Úspěšně uloženo.', success: true }
    } catch (error) {
        return handleActionError(error, 'Chyba při ukládání.')
    }
}
