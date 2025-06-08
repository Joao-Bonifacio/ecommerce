import path from 'path'

const filename =
  typeof __filename !== 'undefined' ? __filename : process.argv[1]
const __dirname = path.dirname(filename)

async function runSeedScript(scriptName: string) {
  const { seed } = await import(path.join(__dirname, 'seeds', scriptName))
  await seed()
}

export async function seed() {
  console.log('-----------------> Products <-----------------')
  await runSeedScript('mongo.seed.ts')
  console.log('-------------------> Users <-------------------')
  await runSeedScript('postgres.seed.ts')
  console.log('----------------------------------------------')
  console.log('OK: All seeds finished correctly')
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
