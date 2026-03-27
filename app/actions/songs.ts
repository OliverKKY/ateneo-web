'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { handleActionError, validationError } from '@/lib/action-utils'
import {
    SheetTypeSchema,
    SONG_DELETE_ROLES,
    SONG_EDITOR_ROLES,
    type ActionState,
} from '@/lib/definitions'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const OptionalUrlSchema = z.preprocess(
    (value) => value === '' ? undefined : value,
    z.string().url('Zadejte platný odkaz.').optional(),
)

const SongSchema = z.object({
    title: z.string().min(1, 'Název skladby je povinný'),
    author: z.preprocess((value) => value === '' ? undefined : value, z.string().trim().optional()),
    description: z.preprocess((value) => value === '' ? undefined : value, z.string().trim().optional()),
    duration: z.preprocess((value) => value === '' ? undefined : value, z.string().trim().optional()),
    copyCount: z.coerce.number().min(0).default(0),
    sheetType: z.preprocess((value) => value === '' ? undefined : value, SheetTypeSchema.optional()),
    fileLinks: OptionalUrlSchema,
})

type SongFields =
    | 'title'
    | 'author'
    | 'description'
    | 'duration'
    | 'copyCount'
    | 'sheetType'
    | 'fileLinks'

async function parseAndAuthorizeSongForm(
    formData: FormData,
): Promise<
    | { success: true; data: z.infer<typeof SongSchema> }
    | { success: false; state: ActionState<SongFields> }
> {
    try {
        await requireRole(SONG_EDITOR_ROLES)
    } catch (error) {
        return {
            success: false,
            state: handleActionError<SongFields>(
                error,
                'Chyba při ukládání skladby.',
            ),
        }
    }

    const result = SongSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            success: false,
            state: validationError<SongFields>(result.error.flatten().fieldErrors),
        }
    }

    return {
        success: true,
        data: result.data,
    }
}

export async function createSong(
    _prevState: ActionState<SongFields> | undefined,
    formData: FormData,
) {
    const parsed = await parseAndAuthorizeSongForm(formData)

    if (!parsed.success) {
        return parsed.state
    }

    const { title, author, description, duration, copyCount, sheetType, fileLinks } = parsed.data

    try {
        await prisma.song.create({
            data: {
                title,
                author,
                description,
                duration,
                copyCount,
                sheetType,
                fileLinks
            }
        })
    } catch (error) {
        return handleActionError<SongFields>(error, 'Chyba při vytváření skladby.')
    }

    revalidatePath('/dashboard/songs')
    redirect('/dashboard/songs')
}

export async function updateSong(
    songId: number,
    _prevState: ActionState<SongFields> | undefined,
    formData: FormData,
) {
    const parsedSongId = z.coerce.number().int().positive().safeParse(songId)

    if (!parsedSongId.success) {
        return { message: 'Neplatná skladba.' }
    }

    const parsed = await parseAndAuthorizeSongForm(formData)

    if (!parsed.success) {
        return parsed.state
    }

    const { title, author, description, duration, copyCount, sheetType, fileLinks } = parsed.data

    try {
        await prisma.song.update({
            where: { id: parsedSongId.data },
            data: {
                title,
                author,
                description,
                duration,
                copyCount,
                sheetType,
                fileLinks,
            },
        })
    } catch (error) {
        return handleActionError<SongFields>(error, 'Chyba při aktualizaci skladby.')
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/songs')
    redirect('/dashboard/songs')
}

export async function deleteSong(id: number) {
    try {
        await requireRole(SONG_DELETE_ROLES)
        await prisma.song.delete({ where: { id } })
        revalidatePath('/dashboard/songs')
        return { success: true }
    } catch (error) {
        return handleActionError(error, 'Nelze smazat skladbu.')
    }
}
