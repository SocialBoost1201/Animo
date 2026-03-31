import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const TARGET_CASTS = [
  { stage_name: 'あいか', slug: 'aika' },
  { stage_name: 'あすみ', slug: 'asumi' },
  { stage_name: 'いぶき', slug: 'ibuki' },
  { stage_name: 'あんな', slug: 'anna' },
  { stage_name: 'みらん', slug: 'miran' },
  { stage_name: 'さやか', slug: 'sayaka' },
  { stage_name: 'ななせ', slug: 'nanase' },
  { stage_name: 'すい', slug: 'sui' },
  { stage_name: 'あみ', slug: 'ami' },
  { stage_name: 'じゅり', slug: 'juri' },
  { stage_name: 'りいな', slug: 'riina' },
  { stage_name: 'ゆうか', slug: 'yuuka' },
  { stage_name: 'れい', slug: 'rei' },
  { stage_name: 'れな', slug: 'rena' },
  { stage_name: 'るり', slug: 'ruri' },
  { stage_name: 'かな', slug: 'kana' },
]

function loadEnvFile() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const envPath = path.resolve(__dirname, '..', '.env.local')

  if (!fs.existsSync(envPath)) {
    return
  }

  const envLines = fs.readFileSync(envPath, 'utf8').split('\n')

  for (const line of envLines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex)
    const value = trimmed.slice(separatorIndex + 1)

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

function getRequiredEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env: ${name}`)
  }
  return value
}

function findDuplicate(existingCasts, stageName) {
  const stageNameExact = existingCasts.find((cast) => cast.stage_name === stageName)
  if (stageNameExact) {
    return { reason: 'stage_name', cast: stageNameExact }
  }

  const nameExact = existingCasts.find((cast) => cast.name === stageName)
  if (nameExact) {
    return { reason: 'name', cast: nameExact }
  }

  return null
}

function buildUniqueSlug(existingSlugs, baseSlug) {
  if (!existingSlugs.has(baseSlug)) {
    existingSlugs.add(baseSlug)
    return baseSlug
  }

  let counter = 2
  while (existingSlugs.has(`${baseSlug}-${counter}`)) {
    counter += 1
  }

  const uniqueSlug = `${baseSlug}-${counter}`
  existingSlugs.add(uniqueSlug)
  return uniqueSlug
}

async function main() {
  loadEnvFile()

  const supabase = createClient(
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  const dryRun = process.argv.includes('--dry-run')

  const { data: existingCasts, error: fetchError } = await supabase
    .from('casts')
    .select('id, stage_name, name, slug, is_active, status, display_order, name_kana')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (fetchError) {
    throw fetchError
  }

  const existingSlugs = new Set(existingCasts.map((cast) => cast.slug).filter(Boolean))
  let nextDisplayOrder = Math.max(0, ...existingCasts.map((cast) => cast.display_order ?? 0))

  const skipped = []
  const plannedInsertRows = []

  for (const target of TARGET_CASTS) {
    const duplicate = findDuplicate(existingCasts, target.stage_name)
    if (duplicate) {
      skipped.push({
        target: target.stage_name,
        reason: duplicate.reason,
        existing: duplicate.cast,
      })
      continue
    }

    nextDisplayOrder += 10
    plannedInsertRows.push({
      name: target.stage_name,
      stage_name: target.stage_name,
      name_kana: target.stage_name,
      slug: buildUniqueSlug(existingSlugs, target.slug),
      is_active: true,
      status: 'public',
      display_order: nextDisplayOrder,
    })
  }

  if (dryRun || plannedInsertRows.length === 0) {
    console.log(JSON.stringify({
      dryRun,
      skipped,
      toInsert: plannedInsertRows,
      inserted: [],
    }, null, 2))
    return
  }

  const { data: insertedRows, error: insertError } = await supabase
    .from('casts')
    .insert(plannedInsertRows)
    .select('id, stage_name, name, slug, is_active, status, display_order, name_kana')

  if (insertError) {
    throw insertError
  }

  console.log(JSON.stringify({
    dryRun,
    skipped,
    toInsert: plannedInsertRows,
    inserted: insertedRows,
  }, null, 2))
}

main().catch((error) => {
  console.error(JSON.stringify({
    error: error.message,
    details: error,
  }, null, 2))
  process.exit(1)
})
