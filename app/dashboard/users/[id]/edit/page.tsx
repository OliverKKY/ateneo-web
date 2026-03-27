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
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Upravit uživatele</h1>
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
