const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const families = await prisma.family.count()
  const members = await prisma.member.count()
  const areas = await prisma.area.count()
  const groups = await prisma.group.count()

  console.log(`Familes: ${families}`)
  console.log(`Members: ${members}`)
  console.log(`Areas: ${areas}`)
  console.log(`Groups: ${groups}`)

  // Check one family
  const sample = await prisma.family.findFirst({
    include: {members: true, area: true, group: true},
  })
  if (sample) {
    console.log('Sample Family:', sample.name)
    console.log('  Group:', sample.group.name)
    console.log('  Area:', sample.area.name)
    console.log('  Members:', sample.members.map((m) => `${m.fullName} (${m.birthYear}, ${m.gender})`).join(', '))
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
