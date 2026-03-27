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
                className="text-slate-700 hover:text-slate-900 transition-colors"
            >
                Upravit
            </Link>
            <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-900"
            >
                Smazat
            </button>
        </div>
    )
}
