'use client'

import Link from 'next/link'
import { deleteSong } from '@/app/actions/songs'

export function SongManagementButtons({ id }: { id: number }) {
    return (
        <div className="flex items-center justify-end gap-3">
            <Link
                href={`/dashboard/songs/${id}/edit`}
                className="text-slate-700 hover:text-slate-900 transition-colors"
            >
                Upravit
            </Link>
            <button
                onClick={async () => {
                    if (confirm('Opravdu smazat skladbu?')) {
                        const result = await deleteSong(id)
                        if (result?.message && !result.success) {
                            alert(result.message)
                        }
                    }
                }}
                className="text-red-400 hover:text-red-600 transition-colors"
            >
                Smazat
            </button>
        </div>
    )
}
