'use client'

import { useActionState } from 'react'
import { createSong, updateSong } from '@/app/actions/songs'
import {
    SHEET_TYPES,
    SHEET_TYPE_LABELS,
    type ActionState,
} from '@/lib/definitions'

type SongFormData = {
    id?: number
    title?: string
    author?: string | null
    description?: string | null
    duration?: string | null
    copyCount?: number
    sheetType?: (typeof SHEET_TYPES)[number]
    fileLinks?: string | null
}

export default function CreateSongForm({ song }: { song?: SongFormData }) {
    const isEditing = typeof song?.id === 'number'
    const songId = song?.id ?? 0
    const actionWithId = isEditing ? updateSong.bind(null, songId) : createSong
    const [state, action, isPending] = useActionState<ActionState<string> | undefined, FormData>(
        actionWithId,
        undefined,
    )

    return (
        <form action={action} className="space-y-5 rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] p-7 shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
            <div>
                <label className="block text-sm font-medium text-[#5a3b31]">Název skladby</label>
                <input
                    name="title"
                    defaultValue={song?.title ?? ''}
                    className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    required
                />
                {state?.errors?.title && <p className="mt-2 text-sm text-red-600">{state.errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Autor</label>
                    <input
                        name="author"
                        defaultValue={song?.author ?? ''}
                        className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    />
                    {state?.errors?.author && <p className="mt-2 text-sm text-red-600">{state.errors.author}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Typ not</label>
                    <select
                        name="sheetType"
                        defaultValue={song?.sheetType ?? ''}
                        className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    >
                        <option value="">Vyberte typ</option>
                        {SHEET_TYPES.map((sheetType) => (
                            <option key={sheetType} value={sheetType}>
                                {SHEET_TYPE_LABELS[sheetType]}
                            </option>
                        ))}
                    </select>
                    {state?.errors?.sheetType && <p className="mt-2 text-sm text-red-600">{state.errors.sheetType}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Délka</label>
                    <input
                        name="duration"
                        defaultValue={song?.duration ?? ''}
                        className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                        placeholder="např. 3:45"
                    />
                    {state?.errors?.duration && <p className="mt-2 text-sm text-red-600">{state.errors.duration}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#5a3b31]">Počet kopií</label>
                    <input
                        name="copyCount"
                        type="number"
                        min="0"
                        defaultValue={song?.copyCount ?? 0}
                        className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    />
                    {state?.errors?.copyCount && <p className="mt-2 text-sm text-red-600">{state.errors.copyCount}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#5a3b31]">Popis</label>
                <textarea
                    name="description"
                    defaultValue={song?.description ?? ''}
                    className="mt-2 block h-28 w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                />
                {state?.errors?.description && <p className="mt-2 text-sm text-red-600">{state.errors.description}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-[#5a3b31]">Odkazy na soubory (poznámka)</label>
                <input
                    name="fileLinks"
                    defaultValue={song?.fileLinks ?? ''}
                    className="mt-2 block w-full rounded-2xl border border-[#d8c2b6] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-[#241612] outline-none transition focus:border-[#b56a44] focus:ring-2 focus:ring-[#f0c7ac]"
                    placeholder="URL na Google Drive apod."
                />
                {state?.errors?.fileLinks && <p className="mt-2 text-sm text-red-600">{state.errors.fileLinks}</p>}
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
                    {isPending ? 'Ukládám...' : (isEditing ? 'Uložit změny' : 'Přidat skladbu')}
                </button>
            </div>
        </form>
    )
}
