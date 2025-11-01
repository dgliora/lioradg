import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs'
import { createInterface } from 'readline'
import { join } from 'path'

interface AddressRecord {
  provinceCode: string
  province: string
  districtCode: string
  district: string
  neighborhoodCode: string
  neighborhood: string
  streetCode?: string
  street?: string
  postalCode: string
}

const OUTPUT_DIR = join(process.cwd(), 'public/tr-addresses')

// Ensure directories exist
function ensureDirectories() {
  const dirs = [
    OUTPUT_DIR,
    join(OUTPUT_DIR, 'districts'),
    join(OUTPUT_DIR, 'neighborhoods'),
    join(OUTPUT_DIR, 'streets'),
  ]
  
  dirs.forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  })
}

// Remove duplicates
function unique<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set()
  return arr.filter((item) => {
    const k = item[key]
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

async function processAddresses() {
  console.log('🚀 Adres verisi işleniyor...')
  
  ensureDirectories()

  const inputFile = join(process.cwd(), 'imports/tr-addresses.json')
  
  if (!existsSync(inputFile)) {
    console.log('⚠️  imports/tr-addresses.json dosyası bulunamadı')
    console.log('📝 Örnek verilerle devam ediliyor...')
    return
  }

  const provinces = new Map()
  const districts = new Map()
  const neighborhoods = new Map()
  const streets = new Map()

  // Read and process file line by line (for large files)
  const fileStream = createReadStream(inputFile)
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  let lineCount = 0
  
  for await (const line of rl) {
    try {
      const record: AddressRecord = JSON.parse(line)
      lineCount++

      // Collect provinces
      if (!provinces.has(record.provinceCode)) {
        provinces.set(record.provinceCode, {
          code: record.provinceCode,
          name: record.province,
        })
      }

      // Collect districts
      const districtKey = record.provinceCode
      if (!districts.has(districtKey)) {
        districts.set(districtKey, [])
      }
      districts.get(districtKey).push({
        code: record.districtCode,
        name: record.district,
        provinceCode: record.provinceCode,
      })

      // Collect neighborhoods
      const neighborhoodKey = record.districtCode
      if (!neighborhoods.has(neighborhoodKey)) {
        neighborhoods.set(neighborhoodKey, [])
      }
      neighborhoods.get(neighborhoodKey).push({
        code: record.neighborhoodCode,
        name: record.neighborhood,
        districtCode: record.districtCode,
        postalCode: record.postalCode,
      })

      // Collect streets (if available)
      if (record.streetCode && record.street) {
        const streetKey = record.neighborhoodCode
        if (!streets.has(streetKey)) {
          streets.set(streetKey, [])
        }
        streets.get(streetKey).push({
          code: record.streetCode,
          name: record.street,
          neighborhoodCode: record.neighborhoodCode,
        })
      }
    } catch (error) {
      console.error(`Satır ${lineCount} işlenirken hata:`, error)
    }
  }

  console.log(`✅ ${lineCount} kayıt işlendi`)

  // Write provinces
  const provincesArray = unique(Array.from(provinces.values()), 'code')
  const provincesJson = JSON.stringify(provincesArray, null, 2)
  createWriteStream(join(OUTPUT_DIR, 'provinces.json')).write(provincesJson)
  console.log(`✅ ${provincesArray.length} il kaydedildi`)

  // Write districts
  let totalDistricts = 0
  for (const [provinceCode, districtList] of districts.entries()) {
    const uniqueDistricts = unique(districtList, 'code')
    totalDistricts += uniqueDistricts.length
    const json = JSON.stringify(uniqueDistricts, null, 2)
    createWriteStream(join(OUTPUT_DIR, 'districts', `${provinceCode}.json`)).write(json)
  }
  console.log(`✅ ${totalDistricts} ilçe kaydedildi`)

  // Write neighborhoods
  let totalNeighborhoods = 0
  for (const [districtCode, neighborhoodList] of neighborhoods.entries()) {
    const uniqueNeighborhoods = unique(neighborhoodList, 'code')
    totalNeighborhoods += uniqueNeighborhoods.length
    const json = JSON.stringify(uniqueNeighborhoods, null, 2)
    createWriteStream(join(OUTPUT_DIR, 'neighborhoods', `${districtCode}.json`)).write(json)
  }
  console.log(`✅ ${totalNeighborhoods} mahalle kaydedildi`)

  // Write streets
  let totalStreets = 0
  for (const [neighborhoodCode, streetList] of streets.entries()) {
    const uniqueStreets = unique(streetList, 'code')
    totalStreets += uniqueStreets.length
    const json = JSON.stringify(uniqueStreets, null, 2)
    createWriteStream(join(OUTPUT_DIR, 'streets', `${neighborhoodCode}.json`)).write(json)
  }
  console.log(`✅ ${totalStreets} sokak kaydedildi`)

  console.log('🎉 İşlem tamamlandı!')
}

processAddresses().catch(console.error)

