/** @jsx jsx */
import { jsx } from "theme-ui"
import { HeadFC, Link } from "gatsby"
import Layout from "./layout"
import Listing from "./listing"
import List from "./list"
import useMinimalBlogConfig from "../hooks/use-minimal-blog-config"
import useSiteMetadata from "../hooks/use-site-metadata"
import replaceSlashes from "../utils/replaceSlashes"
import { visuallyHidden } from "../styles/utils"
import Seo from "./seo"
import Hero from "../texts/hero.mdx"
import Bottom from "../texts/bottom.mdx"

export type MBHomepageProps = {
  posts: {
    slug: string
    title: string
    date: string
    excerpt: string
    description: string
    timeToRead?: number
    tags?: {
      name: string
      slug: string
    }[]
  }[]
  pagination?: {
    currentPage: number
    numPages: number
  }
}

const Homepage = ({ posts, pagination }: MBHomepageProps) => {
  const { basePath, blogPath } = useMinimalBlogConfig()
  const { siteTitle } = useSiteMetadata()
  const pagePath = (page: number) => (page <= 1 ? `/` : replaceSlashes(`/page/${page}`))

  return (
    <Layout>
      <h1 sx={visuallyHidden}>{siteTitle}</h1>
      <section sx={{ mb: [5], p: { fontSize: [1, 2, 3], mt: 2 }, variant: `section_hero` }}>
        <div sx={{ variant: `cardWithP` }}>
          <Hero />
        </div>
      </section>
      <div sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'] }}>
        <div sx={{ mb: [5, 0, 0], ml: [null, null, 5], width: '100%', variant: `cardWithP` }}>
          <Listing posts={posts} showTags={false} />
          {pagination && pagination.numPages > 1 && (
            <nav aria-label="صفحه‌های نوشته‌ها" sx={{ display: `flex`, gap: 3, justifyContent: `center`, mt: 4 }}>
              {pagination.currentPage > 1 && (
                <Link sx={(t) => ({ ...t.styles?.a, variant: `links.secondary` })} to={pagePath(pagination.currentPage - 1)}>
                  نوشته‌های تازه‌تر
                </Link>
              )}
              <span sx={{ color: `secondary` }}>
                صفحه {pagination.currentPage} از {pagination.numPages}
              </span>
              {pagination.currentPage < pagination.numPages && (
                <Link sx={(t) => ({ ...t.styles?.a, variant: `links.secondary` })} to={pagePath(pagination.currentPage + 1)}>
                  نوشته‌های قدیمی‌تر
                </Link>
              )}
            </nav>
          )}
        </div>
        <div sx={{ width: '100%', variant: `cardWithP` }}>
          <List>
            <Bottom />
          </List>
        </div>
      </div>

    </Layout>
  )
}

export default Homepage

export const Head: HeadFC = () => <Seo />
