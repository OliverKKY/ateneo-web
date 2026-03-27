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
        <form action={action} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Název skladby</label>
                <input
                    name="title"
                    defaultValue={song?.title ?? ''}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                />
                {state?.errors?.title && <p className="text-red-500 text-sm">{state.errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Autor</label>
                    <input
                        name="author"
                        defaultValue={song?.author ?? ''}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    {state?.errors?.author && <p className="text-red-500 text-sm">{state.errors.author}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Typ not</label>
                    <select
                        name="sheetType"
                        defaultValue={song?.sheetType ?? ''}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                        <option value="">Vyberte typ</option>
                        {SHEET_TYPES.map((sheetType) => (
                            <option key={sheetType} value={sheetType}>
                                {SHEET_TYPE_LABELS[sheetType]}
                            </option>
                        ))}
                    </select>
                    {state?.errors?.sheetType && <p className="text-red-500 text-sm">{state.errors.sheetType}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Délka</label>
                    <input
                        name="duration"
                        defaultValue={song?.duration ?? ''}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="např. 3:45"
                    />
                    {state?.errors?.duration && <p className="text-red-500 text-sm">{state.errors.duration}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Počet kopií</label>
                    <input
                        name="copyCount"
                        type="number"
                        min="0"
                        defaultValue={song?.copyCount ?? 0}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    {state?.errors?.copyCount && <p className="text-red-500 text-sm">{state.errors.copyCount}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Popis</label>
                <textarea
                    name="description"
                    defaultValue={song?.description ?? ''}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 h-24"
                />
                {state?.errors?.description && <p className="text-red-500 text-sm">{state.errors.description}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Odkazy na soubory (poznámka)</label>
                <input
                    name="fileLinks"
                    defaultValue={song?.fileLinks ?? ''}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="URL na Google Drive apod."
                />
                {state?.errors?.fileLinks && <p className="text-red-500 text-sm">{state.errors.fileLinks}</p>}
            </div>

            {state?.message && (
                <p className="text-red-500 text-sm">{state.message}</p>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
                >
                    {isPending ? 'Ukládám...' : (isEditing ? 'Uložit změny' : 'Přidat skladbu')}
                </button>
            </div>
        </form>
    )
}
