'use client'

import Link from 'next/link'
import { deleteUser } from '@/app/actions/users'

export function UserManagementButtons({ id }: { id: number }) {
    const handleDelete = async () => {
        if (confirm('Opravdu chcete smazat tohoto uživatele?')) {
            const result = await deleteUser(id)
            if (result?.message && !result.success) {
                alert(result.message)
            }
        }
    }

    return (
        <div className="flex items-center justify-end gap-3">
            <Link
                href={`/dashboard/users/${id}/edit`}
                className="rounded-full border border-[#d7c0b3] bg-[rgba(255,255,255,0.7)] px-3 py-1.5 text-xs font-semibold text-[#5a3b31] transition-colors hover:bg-white"
            >
                Upravit
            </Link>
            <button
                onClick={handleDelete}
                className="rounded-full border border-[#edc2bd] bg-[rgba(255,240,238,0.8)] px-3 py-1.5 text-xs font-semibold text-[#a44c43] transition-colors hover:bg-[rgba(255,233,229,0.95)]"
            >
                Smazat
            </button>
        </div>
    )
}
