import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/password'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    const roles = [
        "Administrátor",
        "Zpěvák",
        "Sbormistr",
        "Hlasový vedoucí",
        "Dresscode lady",
        "Předseda",
        "Místopředseda",
        "Notář",
        "Manažer"
    ]

    console.log('Seeding roles...')
    for (const roleName of roles) {
        await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        })
    }

    const adminRole = await prisma.role.findUnique({ where: { name: "Administrátor" } })

    if (adminRole) {
        console.log('Seeding admin user...')
        const passwordHash = await hashPassword("admin123")
        await prisma.user.upsert({
            where: { email: 'admin@ateneo.cz' },
            update: {},
            create: {
                email: 'admin@ateneo.cz',
                firstName: 'Admin',
                lastName: 'User',
                passwordHash,
                roleId: adminRole.id,
                isActive: true,
                gdprConsent: true
            }
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
