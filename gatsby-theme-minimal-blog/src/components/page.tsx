/** @jsx jsx */
import type { HeadFC, PageProps } from "gatsby"
import { jsx, Heading } from "theme-ui"
import Layout from "./layout"
import Seo from "./seo"

export type MBPageProps = {
  page: {
    title: string
    slug: string
    excerpt: string
  }
}

const Page: React.FC<React.PropsWithChildren<PageProps<MBPageProps>>> = ({ data: { page }, children }) => (
  <Layout>
    <div sx={{ mb: [5], variant: `cardWithP` }}>
      <Heading as="h1" variant="styles.h1">
        {page.title}
      </Heading>
      <section sx={{ my: 5, variant: `layout.content` }}>{children}</section>
    </div>
  </Layout>
)

export default Page

export const Head: HeadFC<MBPageProps> = ({ data: { page }, location }) => (
  <Seo title={page.title} description={page.excerpt} pathname={location.pathname} />
)
