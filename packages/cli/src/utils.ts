import * as fs from 'node:fs'
import * as path from 'node:path'

export function getFullPath(filePath: string): string {
  return path.resolve(process.cwd(), filePath)
}

export function stripNewLines(text: string): string {
  return text.split('\n').join(' ')
}

export function readFileStream(filePath: string): fs.ReadStream {
  const pathFull = getFullPath(filePath)
  return fs.createReadStream(pathFull, 'utf-8')
}

export function readFile(filePath: string): string {
  const pathFull = getFullPath(filePath)
  return fs.readFileSync(pathFull, 'utf-8')
}

export function writeFile(filePath: string, content: string): void {
  const pathFull = getFullPath(filePath)
  if (fs.existsSync(pathFull)) fs.unlinkSync(pathFull)
  fs.writeFileSync(pathFull, content, 'utf-8')
}

export function cleanDir(directoryPath: string): void {
  const pathFull = getFullPath(directoryPath)
  if (fs.existsSync(directoryPath))
    fs.rmSync(pathFull, { recursive: true, force: true })
  fs.mkdirSync(pathFull)
}
