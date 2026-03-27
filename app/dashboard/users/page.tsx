import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { requirePageRole } from '@/lib/auth'
import { ADMIN_ONLY_ROLES, VOICE_LABELS, VoiceSchema } from '@/lib/definitions'
import Link from 'next/link'
import { UserManagementButtons } from '@/app/ui/users/buttons'

export default async function UsersPage() {
    await requirePageRole(ADMIN_ONLY_ROLES)

    const users = await prisma.user.findMany({
        include: { role: true },
        orderBy: { lastName: 'asc' }
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Správa uživatelů</h1>
                <Link
                    href="/dashboard/users/create"
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 shadow-md transition-colors"
                >
                    Přidat uživatele
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Jméno</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hlas</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Akce</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user: Prisma.UserGetPayload<{ include: { role: true } }>) => {
                            const voice = VoiceSchema.safeParse(user.voice)

                            return (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                                        {user.role.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {voice.success ? VOICE_LABELS[voice.data] : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <UserManagementButtons id={user.id} />
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
