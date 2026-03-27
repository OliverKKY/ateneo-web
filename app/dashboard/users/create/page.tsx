import { prisma } from '@/lib/db'
import CreateUserForm from '@/app/ui/users/create-form'
import { requirePageRole } from '@/lib/auth'
import { ADMIN_ONLY_ROLES } from '@/lib/definitions'

export default async function CreateUserPage() {
    await requirePageRole(ADMIN_ONLY_ROLES)
    const roles = await prisma.role.findMany()

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b56a44]">
                    Správa sboru
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-[#241612]">Přidat nového uživatele</h1>
                <p className="max-w-2xl text-sm leading-6 text-[#6c5148]">
                    Založte účet, nastavte roli a připravte člena na přístup do intranetu.
                </p>
            </div>
            <CreateUserForm roles={roles} />
        </div>
    )
}
