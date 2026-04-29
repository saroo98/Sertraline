import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const postsRoot = path.join(root, 'content', 'posts');
const outputPath = path.join(root, 'sanity', 'import', 'posts.ndjson');

const walk = (directory) => {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const current = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(current);
    if (entry.isFile() && entry.name.endsWith('.mdx')) return [current];
    return [];
  });
};

const parseFrontmatter = (source) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { body: source, data: {} };

  const data = {};
  const lines = match[1].split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!keyMatch) continue;

    const [, key, rawValue] = keyMatch;

    if (rawValue === '') {
      const list = [];
      while (lines[index + 1]?.match(/^\s*-\s+/)) {
        index += 1;
        list.push(lines[index].replace(/^\s*-\s+/, '').trim().replace(/^"|"$/g, ''));
      }
      data[key] = list.length ? list : '';
      continue;
    }

    data[key] = rawValue.trim().replace(/^"|"$/g, '');
  }

  return {
    body: source.slice(match[0].length),
    data,
  };
};

const slugify = (value) =>
  String(value || '')
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const stableId = (prefix, value) => `${prefix}.${slugify(value).slice(0, 120)}`;

const toPostSlug = (frontmatter, fallbackTitle, fallbackFileName) => {
  if (typeof frontmatter.slug === 'string' && frontmatter.slug.trim()) {
    return frontmatter.slug.replace(/^\/+/, '');
  }

  return slugify(fallbackTitle || fallbackFileName);
};

const documents = [];
const tags = new Map();

for (const filePath of walk(postsRoot)) {
  const source = fs.readFileSync(filePath, 'utf8');
  const { body, data } = parseFrontmatter(source);
  const relativePath = path.relative(root, filePath).replaceAll(path.sep, '/');
  const fileName = path.basename(filePath, '.mdx');
  const title = data.title || fileName;
  const slug = toPostSlug(data, title, fileName);
  const date = data.date || new Date().toISOString().slice(0, 10);
  const tagNames = Array.isArray(data.tags) ? data.tags.filter(Boolean) : [];

  for (const tagName of tagNames) {
    const tagSlug = slugify(tagName);
    if (!tagSlug || tags.has(tagSlug)) continue;

    tags.set(tagSlug, {
      _id: stableId('tag', tagSlug),
      _type: 'tag',
      title: tagName,
      slug: {
        _type: 'slug',
        current: tagSlug,
      },
    });
  }

  documents.push({
    _id: stableId('post', slug),
    _type: 'post',
    title,
    slug: {
      _type: 'slug',
      current: slug,
    },
    publishedAt: `${date}T00:00:00.000Z`,
    excerpt: data.description || '',
    legacyMdx: body,
    importSourcePath: relativePath,
    tags: tagNames
      .map((tagName) => {
        const tagSlug = slugify(tagName);
        const tag = tags.get(tagSlug);
        if (!tag) return null;

        return {
          _key: tagSlug,
          _type: 'reference',
          _ref: tag._id,
        };
      })
      .filter(Boolean),
  });
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  [...tags.values(), ...documents].map((document) => JSON.stringify(document)).join('\n') + '\n',
  'utf8'
);

console.log(`Wrote ${tags.size} tags and ${documents.length} posts to ${path.relative(root, outputPath)}.`);
console.log('This file is intentionally gitignored. Review it before importing into Sanity.');
