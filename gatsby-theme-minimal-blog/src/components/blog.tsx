/** @jsx jsx */
import { jsx, Heading, Flex } from "theme-ui"
import { HeadFC, Link } from "gatsby"
import Layout from "./layout"
import Listing from "./listing"
import useMinimalBlogConfig from "../hooks/use-minimal-blog-config"
import replaceSlashes from "../utils/replaceSlashes"
import Seo from "./seo"

export type MBBlogProps = {
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

const Blog = ({ posts, pagination }: MBBlogProps) => {
  const { tagsPath, basePath, blogPath } = useMinimalBlogConfig()
  const blogBasePath = replaceSlashes(`/${basePath}/${blogPath}`)
  const pagePath = (page: number) => (page <= 1 ? blogBasePath : replaceSlashes(`${blogBasePath}/page/${page}`))

  return (
    <Layout>
       <div sx={{ mb: [5], variant: `cardWithP` }}>
      <Flex sx={{ alignItems: `center`, justifyContent: `space-between`, flexFlow: `wrap` }}>
        <Heading as="h1" variant="styles.h1" sx={{ marginY: 2 }}>
          بلاگ
        </Heading>
        <Link
          sx={(t) => ({ ...t.styles?.a, variant: `links.secondary`, marginY: 2 })}
          to={replaceSlashes(`/${basePath}/${tagsPath}`)}
        >
          مشاهده تمام برچسب‌ها
        </Link>
      </Flex>
      <Listing posts={posts} sx={{ mt: [4, 5] }} />
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
    </Layout>
  )
}

export default Blog

export const Head: HeadFC = () => <Seo title="وبلاگ" pathname="/blog" />
