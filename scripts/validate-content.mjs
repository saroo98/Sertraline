import fs from "node:fs"
import path from "node:path"
import process from "node:process"

const root = process.cwd()
const errors = []

const walk = (directory) => {
  if (!fs.existsSync(directory)) return []

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const current = path.join(directory, entry.name)

    if (entry.isDirectory()) return walk(current)
    if (entry.isFile() && entry.name.endsWith(".mdx")) return [current]
    return []
  })
}

const parseFrontmatter = (filePath) => {
  const source = fs.readFileSync(filePath, "utf8")
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)

  if (!match) {
    errors.push(`${filePath}: missing frontmatter`)
    return {}
  }

  return Object.fromEntries(
    match[1]
      .split(/\r?\n/)
      .filter((line) => line.includes(":"))
      .map((line) => {
        const index = line.indexOf(":")
        const key = line.slice(0, index).trim()
        const value = line.slice(index + 1).trim().replace(/^"|"$/g, "")
        return [key, value]
      })
  )
}

for (const postPath of walk(path.join(root, "content", "posts"))) {
  const relativePath = path.relative(root, postPath)
  const frontmatter = parseFrontmatter(postPath)

  if (!frontmatter.title) errors.push(`${relativePath}: post title is required`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date || "")) {
    errors.push(`${relativePath}: post date must be YYYY-MM-DD`)
  }
  if (frontmatter.description && frontmatter.description.length > 180) {
    errors.push(`${relativePath}: post description should stay under 180 characters`)
  }
}

for (const pagePath of walk(path.join(root, "content", "pages"))) {
  const relativePath = path.relative(root, pagePath)
  const frontmatter = parseFrontmatter(pagePath)

  if (!frontmatter.title) errors.push(`${relativePath}: page title is required`)
  if (!frontmatter.slug?.startsWith("/")) {
    errors.push(`${relativePath}: page slug must start with /`)
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"))
  process.exit(1)
}

console.log("Content metadata looks valid.")
