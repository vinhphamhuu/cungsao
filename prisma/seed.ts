import 'dotenv/config'

import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Areas
  const area1 = await prisma.area.upsert({
    where: {code: 'CHUA_A'},
    update: {},
    create: {
      address: 'Việt Nam quốc, Tiền Giang tỉnh, Gò Công thị xã, Bình Xuân xã',
      code: 'CHUA_A',
      name: 'Bửu Hưng Tự',
    },
  })

  const area2 = await prisma.area.upsert({
    where: {code: 'CHUA_B'},
    update: {},
    create: {
      address: 'Việt Nam quốc, TP. Hồ Chí Minh, Quận 3, Phường Võ Thị Sáu',
      code: 'CHUA_B',
      name: 'Chùa Vĩnh Nghiêm',
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

  console.log({area1, area2, group1, group2})
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
