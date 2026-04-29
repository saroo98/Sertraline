import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import sanityCli from 'sanity/cli';

const root = process.cwd();
const postsRoot = path.join(root, 'content', 'posts');
const dryRun = process.argv.includes('--dry-run');
const { getCliClient } = sanityCli;
const client = getCliClient({ apiVersion: '2026-04-29' }).withConfig({ useCdn: false });

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

const hash = (value) => crypto.createHash('sha1').update(value).digest('hex').slice(0, 12);
const keyFor = (...parts) => hash(parts.join(':'));
const stableId = (prefix, value) => `${prefix}.${hash(String(value || prefix))}`;

const toPostSlug = (frontmatter, fallbackTitle, fallbackFileName) => {
  if (typeof frontmatter.slug === 'string' && frontmatter.slug.trim()) {
    return frontmatter.slug.replace(/^\/+/, '');
  }

  return slugify(fallbackTitle || fallbackFileName);
};

const isThematicBreak = (line) => /^(\s*[-*_]\s*){3,}$/.test(line.trim());
const isImageLine = (line) => line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
const isListLine = (line) => line.match(/^\s*(?:[-*+]\s+|\d+\.\s+)/);
const isHeadingLine = (line) => line.match(/^(#{1,3})\s+(.+)$/);
const isFenceLine = (line) => line.match(/^```\s*([A-Za-z0-9_-]+)?\s*$/);
const isBlockStart = (line) =>
  !line.trim() ||
  line.startsWith('>') ||
  isHeadingLine(line) ||
  isListLine(line) ||
  isThematicBreak(line) ||
  isImageLine(line) ||
  isFenceLine(line);

const normalizeMarkdownText = (lines) =>
  lines
    .map((line) => line.replace(/\\\s*$/, ''))
    .join('\n')
    .trim();

const pushSpan = (children, text, marks = []) => {
  if (!text) return;

  children.push({
    _key: keyFor('span', children.length, text, marks.join(',')),
    _type: 'span',
    text,
    marks,
  });
};

const parseInline = (text) => {
  const children = [];
  const markDefs = [];
  const tokenRe = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*\n]+)\*|_([^_\n]+)_/g;
  let cursor = 0;
  let match;

  while ((match = tokenRe.exec(text)) !== null) {
    pushSpan(children, text.slice(cursor, match.index));

    if (match[1] && match[2]) {
      const key = keyFor('link', match.index, match[2]);
      markDefs.push({
        _key: key,
        _type: 'link',
        href: match[2],
        blank: /^https?:\/\//.test(match[2]),
      });
      pushSpan(children, match[1], [key]);
    } else if (match[3]) {
      pushSpan(children, match[3], ['strong']);
    } else if (match[4] || match[5]) {
      pushSpan(children, match[4] || match[5], ['em']);
    }

    cursor = match.index + match[0].length;
  }

  pushSpan(children, text.slice(cursor));

  return {
    children: children.length
      ? children
      : [
          {
            _key: keyFor('span', text),
            _type: 'span',
            text,
            marks: [],
          },
        ],
    markDefs,
  };
};

const makeBlock = (text, style = 'normal', extra = {}) => {
  const parsed = parseInline(text);

  return {
    _key: keyFor('block', style, text, JSON.stringify(extra)),
    _type: 'block',
    style,
    markDefs: parsed.markDefs,
    children: parsed.children,
    ...extra,
  };
};

const resolveLocalImage = (fileDirectory, imagePath) => {
  const cleanPath = imagePath.trim().replace(/^<|>$/g, '');
  if (/^https?:\/\//.test(cleanPath)) return null;

  const absolutePath = path.resolve(fileDirectory, cleanPath);
  return fs.existsSync(absolutePath) ? absolutePath : null;
};

const uploadImage = async (absolutePath, title) => {
  if (dryRun) {
    return {
      _id: `dry-run-${hash(absolutePath)}`,
    };
  }

  return client.assets.upload('image', fs.createReadStream(absolutePath), {
    filename: path.basename(absolutePath),
    title,
    preserveFilename: true,
  });
};

const makeImageBlock = async (fileDirectory, imageMarkdownMatch, title) => {
  const [, alt, imagePath] = imageMarkdownMatch;
  const absolutePath = resolveLocalImage(fileDirectory, imagePath);
  if (!absolutePath) return makeBlock(imageMarkdownMatch[0]);

  const asset = await uploadImage(absolutePath, alt || title);

  return {
    _key: keyFor('image', absolutePath),
    _type: 'image',
    alt: alt || title,
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  };
};

const markdownToPortableText = async (body, fileDirectory, title) => {
  const blocks = [];
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const imageMatch = isImageLine(line);
    if (imageMatch) {
      blocks.push(await makeImageBlock(fileDirectory, imageMatch, title));
      index += 1;
      continue;
    }

    if (isThematicBreak(line)) {
      blocks.push({
        _key: keyFor('break', blocks.length, line),
        _type: 'separator',
        label: 'Separator',
      });
      index += 1;
      continue;
    }

    const fenceMatch = isFenceLine(line);
    if (fenceMatch) {
      const codeLines = [];
      index += 1;
      while (index < lines.length && !isFenceLine(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({
        _key: keyFor('code', blocks.length, codeLines.join('\n')),
        _type: 'codeBlock',
        language: fenceMatch[1] || '',
        code: codeLines.join('\n'),
      });
      continue;
    }

    const headingMatch = isHeadingLine(line);
    if (headingMatch) {
      const style = headingMatch[1].length <= 2 ? 'h2' : 'h3';
      blocks.push(makeBlock(headingMatch[2].trim(), style));
      index += 1;
      continue;
    }

    if (line.startsWith('>')) {
      const quoteLines = [];
      while (index < lines.length && lines[index].startsWith('>')) {
        quoteLines.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      const text = normalizeMarkdownText(quoteLines);
      if (text) blocks.push(makeBlock(text, 'blockquote'));
      continue;
    }

    if (isListLine(line)) {
      while (index < lines.length && isListLine(lines[index])) {
        const current = lines[index];
        const ordered = /^\s*\d+\.\s+/.test(current);
        const text = current.replace(/^\s*(?:[-*+]\s+|\d+\.\s+)/, '').trim();
        blocks.push(
          makeBlock(text, 'normal', {
            listItem: ordered ? 'number' : 'bullet',
            level: 1,
          })
        );
        index += 1;
      }
      continue;
    }

    const paragraphLines = [];
    while (index < lines.length && !isBlockStart(lines[index])) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    if (!paragraphLines.length) {
      paragraphLines.push(line);
      index += 1;
    }

    const text = normalizeMarkdownText(paragraphLines);
    if (text) blocks.push(makeBlock(text));
  }

  return blocks;
};

const createPostDocuments = async () => {
  const tags = new Map();
  const posts = [];

  for (const filePath of walk(postsRoot)) {
    const source = fs.readFileSync(filePath, 'utf8');
    const { body, data } = parseFrontmatter(source);
    const relativePath = path.relative(root, filePath).replaceAll(path.sep, '/');
    const fileDirectory = path.dirname(filePath);
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

    const bodyBlocks = await markdownToPortableText(body, fileDirectory, title);
    let coverImage;

    if (data.banner) {
      const bannerPath = resolveLocalImage(fileDirectory, data.banner);
      if (bannerPath) {
        const asset = await uploadImage(bannerPath, title);
        coverImage = {
          _type: 'image',
          alt: title,
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        };
      }
    }

    posts.push({
      _id: stableId('post', slug),
      _type: 'post',
      title,
      slug: {
        _type: 'slug',
        current: slug,
      },
      publishedAt: `${date}T00:00:00.000Z`,
      excerpt: data.description || '',
      isHidden: false,
      commentsEnabled: true,
      coverImage,
      body: bodyBlocks,
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

  return {
    tags: [...tags.values()],
    posts,
  };
};

const commitDocuments = async (documents) => {
  if (dryRun) return;

  let transaction = client.transaction();
  for (const document of documents) {
    transaction = transaction.createOrReplace(document);
  }

  await transaction.commit({ visibility: 'sync' });
};

const main = async () => {
  const { tags, posts } = await createPostDocuments();
  const documents = [...tags, ...posts];

  await commitDocuments(documents);

  console.log(`${dryRun ? 'Prepared' : 'Imported'} ${tags.length} tags and ${posts.length} posts.`);
  console.log('The exact original MDX body is stored in each post as legacyMdx.');
  console.log('Post cover images and inline local images were uploaded when local files existed.');
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
