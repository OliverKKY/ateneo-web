import { prisma } from '@/lib/db'
import CreateUserForm from '@/app/ui/users/create-form'
import { requirePageRole } from '@/lib/auth'
import { ADMIN_ONLY_ROLES } from '@/lib/definitions'

export default async function CreateUserPage() {
    await requirePageRole(ADMIN_ONLY_ROLES)
    const roles = await prisma.role.findMany()

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Přidat nového uživatele</h1>
            <CreateUserForm roles={roles} />
        </div>
    )
}
