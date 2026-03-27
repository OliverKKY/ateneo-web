'use client'

import Link from 'next/link'
import { deleteSong } from '@/app/actions/songs'

export function SongManagementButtons({ id }: { id: number }) {
    return (
        <div className="flex items-center justify-end gap-3">
            <Link
                href={`/dashboard/songs/${id}/edit`}
                className="rounded-full border border-[#d7c0b3] bg-[rgba(255,255,255,0.7)] px-3 py-1.5 text-xs font-semibold text-[#5a3b31] transition-colors hover:bg-white"
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
                className="rounded-full border border-[#edc2bd] bg-[rgba(255,240,238,0.8)] px-3 py-1.5 text-xs font-semibold text-[#a44c43] transition-colors hover:bg-[rgba(255,233,229,0.95)]"
            >
                Smazat
            </button>
        </div>
    )
}
