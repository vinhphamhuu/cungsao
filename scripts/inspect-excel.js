const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')

const filePath = path.join(process.cwd(), 'data-migration', 'ẤP 1', 'BUOI THI BIEN.xlsx')

console.log('Reading file:', filePath)

if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath)
  // Listing directory to debug path issues
  const dir = path.dirname(filePath)
  console.log('Files in directory:', dir)
  if (fs.existsSync(dir)) {
    console.log(fs.readdirSync(dir))
  } else {
    console.log('Directory not found:', dir)
  }
  process.exit(1)
}

const workbook = XLSX.readFile(filePath)
const sheetName = workbook.SheetNames[0]
const sheet = workbook.Sheets[sheetName]

// Read as array of arrays first to see headers
const data = XLSX.utils.sheet_to_json(sheet, {header: 1})

console.log('First 10 rows:')
console.log(JSON.stringify(data.slice(0, 10), null, 2))
