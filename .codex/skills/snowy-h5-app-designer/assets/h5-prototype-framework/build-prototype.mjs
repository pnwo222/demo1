import { cp, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const source = path.dirname(fileURLToPath(import.meta.url))
const targetArg = process.argv[2]

if (!targetArg) {
  console.error('用法: node build-prototype.mjs <输出目录>')
  process.exit(1)
}

const target = path.resolve(process.cwd(), targetArg)

try {
  await stat(target)
  console.error(`输出目录已存在，拒绝覆盖: ${target}`)
  process.exit(1)
} catch (_) {
  await mkdir(path.dirname(target), { recursive: true })
}

await cp(source, target, {
  recursive: true,
  filter: entry => path.resolve(entry) !== path.resolve(import.meta.filename)
})

console.log(`H5 原型骨架已复制到: ${target}`)
