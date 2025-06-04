import { exec } from 'child_process'
import path from 'path'

async function runSeedScript(scriptName: string) {
  return new Promise<void>((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'seeds', scriptName)
    const cmd = `ts-node --transpile-only ${scriptPath}`
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error on seed ${scriptName}:`, stderr)
        reject(error)
        return
      }
      console.log(stdout)
      resolve()
    })
  })
}

async function main() {
  await runSeedScript('mongo.seed.ts')
  await runSeedScript('postgres.seed.ts')
  console.log('All seeds finnished correctly!')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
