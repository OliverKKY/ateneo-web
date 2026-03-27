import CreateSongForm from '@/app/ui/songs/create-form'
import { requirePageRole } from '@/lib/auth'
import { SONG_EDITOR_ROLES } from '@/lib/definitions'

export default async function CreateSongPage() {
    await requirePageRole(SONG_EDITOR_ROLES, '/dashboard/songs')

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nová skladba</h1>
            <CreateSongForm />
        </div>
    )
}
