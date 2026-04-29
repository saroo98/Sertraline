type MinimalPost = {
  slug: string
  title: string
  date: string
  excerpt?: string
  description?: string
  timeToRead?: number
  tags?: {
    name: string
    slug: string
  }[]
}

type SanityTagNode = {
  title?: string
  slug?: {
    current?: string
  }
}

type SanityPostNode = {
  title?: string
  excerpt?: string
  publishedAt?: string
  isHidden?: boolean
  slug?: {
    current?: string
  }
  tags?: SanityTagNode[]
}

const normalizePath = (slug?: string) => {
  if (!slug) return ``

  return slug.startsWith(`/`) ? slug : `/${slug}`
}

const normalizeTagSlug = (tag: SanityTagNode) => tag.slug?.current || tag.title || ``

export const mapSanityPosts = (posts: SanityPostNode[] = []): MinimalPost[] =>
  posts
    .filter((post) => !post.isHidden && post.title && post.slug?.current && post.publishedAt)
    .map((post) => ({
      slug: normalizePath(post.slug?.current),
      title: post.title || ``,
      date: post.publishedAt || ``,
      excerpt: post.excerpt || ``,
      description: post.excerpt || ``,
      tags: (post.tags || [])
        .filter((tag) => tag.title)
        .map((tag) => ({
          name: tag.title || ``,
          slug: normalizeTagSlug(tag),
        })),
    }))

export const mergePosts = (mdxPosts: MinimalPost[] = [], sanityPosts: SanityPostNode[] = []) => {
  const hiddenSanitySlugs = new Set(
    sanityPosts.filter((post) => post.isHidden).map((post) => normalizePath(post.slug?.current)).filter(Boolean)
  )
  const postsBySlug = new Map<string, MinimalPost>()

  for (const post of mdxPosts) {
    if (!hiddenSanitySlugs.has(post.slug)) {
      postsBySlug.set(post.slug, post)
    }
  }

  for (const post of mapSanityPosts(sanityPosts)) {
    postsBySlug.set(post.slug, post)
  }

  return [...postsBySlug.values()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const mergeTagGroups = (
  mdxGroups: { fieldValue: string; totalCount: number }[] = [],
  sanityPosts: SanityPostNode[] = []
) => {
  const counts = new Map<string, number>()

  for (const group of mdxGroups) {
    counts.set(group.fieldValue, (counts.get(group.fieldValue) || 0) + group.totalCount)
  }

  for (const post of sanityPosts) {
    if (post.isHidden) continue

    for (const tag of post.tags || []) {
      if (!tag.title) continue
      counts.set(tag.title, (counts.get(tag.title) || 0) + 1)
    }
  }

  return Array.from(counts, ([fieldValue, totalCount]) => ({ fieldValue, totalCount })).sort((a, b) =>
    a.fieldValue.localeCompare(b.fieldValue, `fa`)
  )
}
