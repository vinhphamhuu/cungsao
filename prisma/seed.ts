import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    // Areas
    const area1 = await prisma.area.upsert({
        where: { code: 'CHUA_A' },
        update: {},
        create: {
            name: 'Chùa Pháp Hoa',
            code: 'CHUA_A',
        },
    })

    const area2 = await prisma.area.upsert({
        where: { code: 'CHUA_B' },
        update: {},
        create: {
            name: 'Chùa Vĩnh Nghiêm',
            code: 'CHUA_B',
        },
    })

    // Groups
    const group1 = await prisma.group.create({
        data: {
            name: 'Ấp 1',
            description: 'Khu vực chợ',
        },
    })

    const group2 = await prisma.group.create({
        data: {
            name: 'Phường Đa Kao',
            description: 'Khu dân cư',
        },
    })

    console.log({ area1, area2, group1, group2 })
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
