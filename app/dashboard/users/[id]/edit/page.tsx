import { notFound } from 'next/navigation'
import CreateUserForm from '@/app/ui/users/create-form'
import { prisma } from '@/lib/db'
import { requirePageRole } from '@/lib/auth'
import { ADMIN_ONLY_ROLES, VoiceSchema } from '@/lib/definitions'

type UserEditPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function UserEditPage({ params }: UserEditPageProps) {
    await requirePageRole(ADMIN_ONLY_ROLES)

    const { id } = await params
    const userId = Number(id)

    if (!Number.isInteger(userId) || userId <= 0) {
        notFound()
    }

    const [user, roles] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
        }),
        prisma.role.findMany(),
    ])

    if (!user) {
        notFound()
    }

    const voice = VoiceSchema.safeParse(user.voice)

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b56a44]">
                    Správa sboru
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-[#241612]">Upravit uživatele</h1>
                <p className="max-w-2xl text-sm leading-6 text-[#6c5148]">
                    Změňte roli, kontaktní údaje nebo stav přístupu bez skákání mezi různými obrazovkami.
                </p>
            </div>
            <CreateUserForm
                roles={roles}
                user={{
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    roleId: user.roleId,
                    voice: voice.success ? voice.data : undefined,
                    phone: user.phone,
                    isActive: user.isActive,
                }}
            />
        </div>
    )
}
