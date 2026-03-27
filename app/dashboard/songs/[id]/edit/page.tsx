import { notFound } from 'next/navigation'
import CreateSongForm from '@/app/ui/songs/create-form'
import { prisma } from '@/lib/db'
import { requirePageRole } from '@/lib/auth'
import { SONG_EDITOR_ROLES, SheetTypeSchema } from '@/lib/definitions'

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
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Upravit skladbu</h1>
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
