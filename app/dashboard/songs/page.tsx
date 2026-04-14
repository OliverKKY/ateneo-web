import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { hasRole, requireSession } from '@/lib/auth'
import { SheetTypeSchema, SHEET_TYPE_LABELS, SONG_EDITOR_ROLES } from '@/lib/definitions'
import Link from 'next/link'
import { SongManagementButtons } from '@/app/ui/songs/buttons'

export const metadata: Metadata = {
    title: 'Skladby',
}

export default async function SongsPage() {
    const session = await requireSession()
    const role = session.role
    const canEdit = hasRole(role, SONG_EDITOR_ROLES)

    const songs = await prisma.song.findMany({
        orderBy: { title: 'asc' }
    })

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b56a44]">
                        Repertoár
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#241612]">
                        Archiv skladeb
                    </h1>
                    <p className="max-w-2xl text-sm leading-6 text-[#6c5148]">
                        Přehled not, poznámek a materiálů pro aktuální i starší repertoár.
                    </p>
                </div>
                {canEdit && (
                    <Link
                        href="/dashboard/songs/create"
                        className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#2f1b16_0%,#51342b_100%)] px-5 py-3 text-sm font-semibold text-[#fff7f0] shadow-[0_16px_35px_rgba(47,27,22,0.18)] transition-transform duration-200 hover:-translate-y-0.5"
                    >
                        Nová skladba
                    </Link>
                )}
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
                {songs.length === 0 ? (
                    <div className="p-6 text-sm text-[#6c5148]">
                        V archivu zatím nejsou žádné skladby.
                    </div>
                ) : (
                <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="border-b border-[#ead8cd] bg-[rgba(255,255,255,0.65)]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6c61]">Název</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6c61]">Autor</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6c61]">Typ not</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6c61]">Kopie</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6c61]">Akce</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#efdfd5] bg-transparent">
                        {songs.map((song) => {
                            const sheetType = SheetTypeSchema.safeParse(song.sheetType)

                            return (
                            <tr key={song.id} className="transition-colors hover:bg-[rgba(255,255,255,0.5)]">
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-[#241612]">{song.title}</div>
                                    {song.description && <div className="text-xs text-[#8c6c61]">{song.description}</div>}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm text-[#6c5148]">{song.author || '-'}</td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm text-[#6c5148]">
                                    {sheetType.success ? SHEET_TYPE_LABELS[sheetType.data] : '-'}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm text-[#6c5148]">{song.copyCount}</td>
                                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                    {canEdit && <SongManagementButtons id={song.id} />}
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
                </div>
                )}
            </div>
        </div>
    )
}
