import { prisma } from '@/lib/db'
import { verifySession } from '@/lib/session'
import { hasRole } from '@/lib/auth'
import { SheetTypeSchema, SHEET_TYPE_LABELS, SONG_EDITOR_ROLES } from '@/lib/definitions'
import Link from 'next/link'
import { SongManagementButtons } from '@/app/ui/songs/buttons'

export default async function SongsPage() {
    const session = await verifySession()
    if (!session) return null
    const role = session.role
    const canEdit = hasRole(role, SONG_EDITOR_ROLES)

    const songs = await prisma.song.findMany({
        orderBy: { title: 'asc' }
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Archiv skladeb</h1>
                {canEdit && (
                    <Link
                        href="/dashboard/songs/create"
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 shadow-lg transition-colors"
                    >
                        Nová skladba
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Název</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typ not</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kopie</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {songs.map((song) => {
                            const sheetType = SheetTypeSchema.safeParse(song.sheetType)

                            return (
                            <tr key={song.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{song.title}</div>
                                    {song.description && <div className="text-xs text-gray-400">{song.description}</div>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{song.author || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {sheetType.success ? SHEET_TYPE_LABELS[sheetType.data] : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{song.copyCount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {canEdit && <SongManagementButtons id={song.id} />}
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )
}
