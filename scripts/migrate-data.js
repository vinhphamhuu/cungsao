const {PrismaClient} = require('@prisma/client')
const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')
const {customAlphabet} = require('nanoid')
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 20)

function createId(prefix) {
  return `${prefix}_${nanoid()}`
}

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Starting migration...')

    // 1. Find or create Area "Bửu Hưng Tự"
    const areaName = 'Bửu Hưng Tự'
    let area = await prisma.area.findFirst({
      where: {name: areaName},
    })

    if (!area) {
      console.log(`Creating Area: ${areaName}`)
      const code = 'buu_hung_tu'
      area = await prisma.area.create({
        data: {
          id: createId('ara'),
          name: areaName,
          code: code,
          address: 'Việt Nam quốc, Tiền Giang tỉnh, Gò Công thị xã, Bình Xuân xã',
        },
      })
    }
    console.log(`Using Area: ${area.name} (ID: ${area.id})`)

    const migrationDir = path.join(process.cwd(), 'data-migration')
    if (!fs.existsSync(migrationDir)) {
      console.error(`Directory not found: ${migrationDir}`)
      return
    }

    const groupDirs = fs.readdirSync(migrationDir).filter((file) => {
      return fs.statSync(path.join(migrationDir, file)).isDirectory()
    })

    for (const groupName of groupDirs) {
      let group = await prisma.group.findFirst({
        where: {name: groupName},
      })

      if (!group) {
        console.log(`Creating Group: ${groupName}`)
        group = await prisma.group.create({
          data: {
            id: createId('grp'),
            name: groupName,
            description: `Imported from folder ${groupName}`,
          },
        })
      }
      console.log(`  Processing Group: ${group.name} (ID: ${group.id})`)

      const groupPath = path.join(migrationDir, groupName)
      const files = fs.readdirSync(groupPath).filter((file) => file.endsWith('.xlsx') && !file.startsWith('~$'))

      for (const file of files) {
        const filePath = path.join(groupPath, file)

        try {
          const workbook = XLSX.readFile(filePath)
          const sheet = workbook.Sheets[workbook.SheetNames[0]]
          const data = XLSX.utils.sheet_to_json(sheet, {header: 1})

          // Find header row
          let headerRowIndex = -1
          for (let i = 0; i < data.length; i++) {
            const row = data[i]
            if (row && row.includes('Họ tên')) {
              headerRowIndex = i
              break
            }
          }

          if (headerRowIndex === -1) {
            console.warn(`      Skipping file ${file}: Header "Họ tên" not found`)
            continue
          }

          const members = []
          const headerRow = data[headerRowIndex]
          const nameIdx = headerRow.indexOf('Họ tên')
          const yearIdx = headerRow.indexOf('Năm sinh')
          const genderIdx = headerRow.indexOf('Giới tính')

          if (nameIdx === -1 || yearIdx === -1 || genderIdx === -1) {
            console.warn(`      Skipping file ${file}: Required columns not found`)
            continue
          }

          for (let i = headerRowIndex + 1; i < data.length; i++) {
            const row = data[i]
            if (!row || row.length === 0) continue

            const name = row[nameIdx]
            if (!name || typeof name !== 'string' || name.trim() === '') continue

            const rawYear = row[yearIdx]
            const birthYear = parseInt(rawYear)

            const rawGender = row[genderIdx]
            let gender = 'MALE'
            if (typeof rawGender === 'string') {
              const g = rawGender.trim().toUpperCase()
              if (g === 'NỮ' || g === 'NU') gender = 'FEMALE'
              else gender = 'MALE'
            }

            if (!birthYear || isNaN(birthYear)) {
              continue
            }

            members.push({
              fullName: name.trim(),
              birthYear,
              gender,
            })
          }

          if (members.length === 0) {
            console.warn(`      No valid members found in ${file}`)
            continue
          }

          const representative = members[0]
          const familyName = `Gia đình ${representative.fullName}`

          let family = await prisma.family.findFirst({
            where: {
              name: familyName,
              groupId: group.id,
              areaId: area.id,
            },
          })

          if (!family) {
            family = await prisma.family.create({
              data: {
                id: createId('fam'),
                name: familyName,
                groupId: group.id,
                areaId: area.id,
              },
            })
          } else {
            continue
          }

          let representativeId = null
          for (let i = 0; i < members.length; i++) {
            const m = members[i]
            const input = {
              id: createId('mem'),
              fullName: m.fullName,
              birthYear: m.birthYear,
              gender: m.gender,
              familyId: family.id,
            }

            const member = await prisma.member.create({
              data: input,
            })

            if (i === 0) {
              representativeId = member.id
            }
          }

          if (representativeId) {
            await prisma.family.update({
              where: {id: family.id},
              data: {representativeId: representativeId},
            })
          }
        } catch (err) {
          console.error(`      Error processing file ${file}:`, err)
        }
      }
    }

    console.log('Migration completed.')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
