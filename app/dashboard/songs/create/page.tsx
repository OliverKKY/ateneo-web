import type { Metadata } from 'next'
import CreateSongForm from '@/app/ui/songs/create-form'
import { requirePageRole } from '@/lib/auth'
import { SONG_EDITOR_ROLES } from '@/lib/definitions'

export const metadata: Metadata = {
    title: 'Nová skladba',
}

export default async function CreateSongPage() {
    await requirePageRole(SONG_EDITOR_ROLES, '/dashboard/songs')

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b56a44]">
                    Repertoár
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-[#241612]">Nová skladba</h1>
                <p className="max-w-2xl text-sm leading-6 text-[#6c5148]">
                    Přidejte noty a podklady tak, aby byly snadno dohledatelné pro další zkoušky.
                </p>
            </div>
            <CreateSongForm />
        </div>
    )
}
