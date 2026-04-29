/** @jsx jsx */
import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { Link } from "gatsby"
import { jsx } from "theme-ui"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

const NotFound = (_props: PageProps) => (
  <Layout>
    <div sx={{ variant: `cardWithP` }}>
      <h1>صفحه پیدا نشد</h1>
      <p>آدرسی که وارد کرده‌اید وجود ندارد یا جابه‌جا شده است.</p>
      <p>
        <Link to="/blog/">بازگشت به نوشته‌ها</Link>
      </p>
    </div>
  </Layout>
)

export default NotFound

export const Head: HeadFC = () => (
  <Seo title="صفحه پیدا نشد" pathname="/404">
    <meta name="robots" content="noindex" />
  </Seo>
)
