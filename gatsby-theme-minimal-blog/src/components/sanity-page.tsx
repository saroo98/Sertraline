/** @jsx jsx */
import type { HeadFC, PageProps } from "gatsby"
import { Heading, jsx } from "theme-ui"
import Layout from "./layout"
import PortableContent from "./portable-text"
import Seo from "./seo"

type SanityPageData = {
  sanityPage: {
    title: string
    _rawBody?: unknown[]
    slug?: {
      current?: string
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
  }
}

const normalizePath = (slug?: string) => {
  if (!slug) return ``
  return slug.startsWith(`/`) ? slug : `/${slug}`
}

const SanityPage = ({ data: { sanityPage } }: PageProps<SanityPageData>) => (
  <Layout>
    <article sx={{ mb: [5], variant: `cardWithP` }}>
      <Heading as="h1" variant="styles.h1">
        {sanityPage.title}
      </Heading>
      <section sx={{ my: 5, variant: `layout.content` }}>
        <PortableContent value={sanityPage._rawBody || []} />
      </section>
    </article>
  </Layout>
)

export default SanityPage

export const Head: HeadFC<SanityPageData> = ({ data: { sanityPage } }) => (
  <Seo
    description={sanityPage.seo?.description}
    image={sanityPage.seo?.image?.asset?.url}
    pathname={normalizePath(sanityPage.slug?.current)}
    title={sanityPage.seo?.title || sanityPage.title}
  />
)
