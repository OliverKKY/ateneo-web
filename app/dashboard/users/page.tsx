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
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b56a44]">
                        Správa sboru
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#241612]">
                        Správa uživatelů
                    </h1>
                    <p className="max-w-2xl text-sm leading-6 text-[#6c5148]">
                        Přístupové role, hlasové zařazení i stav členství na jednom místě.
                    </p>
                </div>
                <Link
                    href="/dashboard/users/create"
                    className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#2f1b16_0%,#51342b_100%)] px-5 py-3 text-sm font-semibold text-[#fff7f0] shadow-[0_16px_35px_rgba(47,27,22,0.18)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                    Přidat uživatele
                </Link>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
                <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="border-b border-[#ead8cd] bg-[rgba(255,255,255,0.65)]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6c61]">Jméno</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6c61]">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6c61]">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6c61]">Hlas</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6c61]">Akce</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#efdfd5] bg-transparent">
                        {users.map((user: Prisma.UserGetPayload<{ include: { role: true } }>) => {
                            const voice = VoiceSchema.safeParse(user.voice)

                            return (
                            <tr key={user.id} className="transition-colors hover:bg-[rgba(255,255,255,0.5)]">
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-[#241612]">{user.firstName} {user.lastName}</div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm text-[#6c5148]">{user.email}</td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span className="inline-flex rounded-full border border-[#d7c0b3] bg-[rgba(255,255,255,0.72)] px-3 py-1 text-xs font-semibold text-[#5a3b31]">
                                        {user.role.name}
                                    </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm text-[#6c5148]">
                                    {voice.success ? VOICE_LABELS[voice.data] : '-'}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
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
