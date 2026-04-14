import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CreateSongForm from '@/app/ui/songs/create-form'
import { prisma } from '@/lib/db'
import { requirePageRole } from '@/lib/auth'
import { SONG_EDITOR_ROLES, SheetTypeSchema } from '@/lib/definitions'

export const metadata: Metadata = {
    title: 'Upravit skladbu',
}

type SongEditPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function SongEditPage({ params }: SongEditPageProps) {
    await requirePageRole(SONG_EDITOR_ROLES, '/dashboard/songs')

    const { id } = await params
    const songId = Number(id)

    if (!Number.isInteger(songId) || songId <= 0) {
        notFound()
    }

    const song = await prisma.song.findUnique({
        where: { id: songId },
    })

    if (!song) {
        notFound()
    }

    const sheetType = SheetTypeSchema.safeParse(song.sheetType)

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b56a44]">
                    Repertoár
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-[#241612]">Upravit skladbu</h1>
                <p className="max-w-2xl text-sm leading-6 text-[#6c5148]">
                    Aktualizujte detaily skladby, aby archiv zůstal přehledný a použitelný.
                </p>
            </div>
            <CreateSongForm
                song={{
                    id: song.id,
                    title: song.title,
                    author: song.author,
                    description: song.description,
                    duration: song.duration,
                    copyCount: song.copyCount,
                    sheetType: sheetType.success ? sheetType.data : undefined,
                    fileLinks: song.fileLinks,
                }}
            />
        </div>
    )
}
