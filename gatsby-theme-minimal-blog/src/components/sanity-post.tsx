/** @jsx jsx */
import type { HeadFC, PageProps } from "gatsby"
import * as React from "react"
import { Heading, jsx } from "theme-ui"
import Layout from "./layout"
import ItemTags from "./item-tags"
import PortableContent from "./portable-text"
import Seo from "./seo"
import { formatPersianDate } from "../utils/format"

type SanityPostData = {
  sanityPost: {
    title: string
    publishedAt: string
    excerpt?: string
    canonicalUrl?: string
    _rawBody?: unknown[]
    legacyMdx?: string
    slug?: {
      current?: string
    }
    coverImage?: {
      asset?: {
        url?: string
      }
    }
    seo?: {
      title?: string
      description?: string
      image?: {
        asset?: {
          url?: string
        }
      }
    }
    tags?: {
      title?: string
      slug?: {
        current?: string
      }
    }[]
  }
}

const normalizePath = (slug?: string) => {
  if (!slug) return ``
  return slug.startsWith(`/`) ? slug : `/${slug}`
}

const normalizeTags = (tags: SanityPostData["sanityPost"]["tags"] = []) =>
  tags
    .filter((tag) => tag.title)
    .map((tag) => ({
      name: tag.title || ``,
      slug: tag.slug?.current || tag.title || ``,
    }))

const SanityPost = ({ data: { sanityPost } }: PageProps<SanityPostData>) => {
  const formattedDate = formatPersianDate(sanityPost.publishedAt)
  const tags = normalizeTags(sanityPost.tags)

  return (
    <Layout>
      <article sx={{ mb: [5], variant: `cardWithP` }}>
        {sanityPost.coverImage?.asset?.url && (
          <img
            alt={sanityPost.title}
            loading="eager"
            src={sanityPost.coverImage.asset.url}
            sx={{ borderRadius: `4px`, width: `100%` }}
          />
        )}
        <Heading as="h1" variant="styles.h1">
          {sanityPost.title}
        </Heading>
        <p sx={{ color: `secondary`, mt: 3, a: { color: `secondary` }, fontSize: [1, 1, 2] }}>
          <time dateTime={sanityPost.publishedAt}>{formattedDate}</time>
          {tags.length > 0 && (
            <React.Fragment>
              {` - `}
              <ItemTags tags={tags} />
            </React.Fragment>
          )}
        </p>
        <section sx={{ my: 5, variant: `layout.content` }}>
          <PortableContent value={sanityPost._rawBody || []} />
          {!sanityPost._rawBody?.length && sanityPost.legacyMdx && (
            <div sx={{ whiteSpace: `pre-wrap` }}>{sanityPost.legacyMdx}</div>
          )}
        </section>
      </article>
    </Layout>
  )
}

export default SanityPost

export const Head: HeadFC<SanityPostData> = ({ data: { sanityPost } }) => (
  <Seo
    canonicalUrl={sanityPost.canonicalUrl}
    description={sanityPost.seo?.description || sanityPost.excerpt}
    image={sanityPost.seo?.image?.asset?.url || sanityPost.coverImage?.asset?.url}
    pathname={normalizePath(sanityPost.slug?.current)}
    title={sanityPost.seo?.title || sanityPost.title}
    type="article"
  />
)
