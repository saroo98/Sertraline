/** @jsx jsx */
import type { HeadFC, PageProps } from "gatsby"
import * as React from "react"
import { jsx, Heading } from "theme-ui"
import Layout from "./layout"
import ItemTags from "./item-tags"
import Seo from "./seo"
import PostFooter from "./post-footer"

export type MBPostProps = {
  post: {
    slug: string
    title: string
    date: string
    tags?: {
      name: string
      slug: string
    }[]
    description?: string
    canonicalUrl?: string
    excerpt: string
    timeToRead?: number
    banner?: {
      childImageSharp: {
        resize: {
          src: string
        }
      }
    }
  }
}

function toFarsiNumber(n) {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  return n
    .toString()
    .replace(/\d/g, x => farsiDigits[x]);
}

const px = [`16px`, `8px`, `4px`]
const shadow = px.map((v) => `rgba(0, 0, 0, 0.1) 0px ${v} ${v} 0px`)

const Post: React.FC<React.PropsWithChildren<PageProps<MBPostProps>>> = ({ data: { post }, children }) => {
  const [day, month, year] = post.date.split('.');
  const date = new Date(year + '-' + month + '-' + day);
  const formattedDate = new Intl.DateTimeFormat('fa', {
    dateStyle: 'long',
  }).format(date);
  const formattedWeekday = new Intl.DateTimeFormat('fa', {
    weekday: 'long'
  }).format(date);

  console.log(post.banner);
  return (
    <Layout>
      <div sx={{ mb: [5], variant: `cardWithP` }}>
        {post.banner && <div>
          <img sx={{ width: '100%' }} alt={post.title} src={post.banner?.childImageSharp?.resize?.src} />
        </div>}
        <Heading as="h1" variant="styles.h1">
          {post.title}
        </Heading>
        <p sx={{ color: `secondary`, mt: 3, a: { color: `secondary` }, fontSize: [1, 1, 2] }}>
          <time> {formattedWeekday}، {formattedDate}</time>
          {post.tags && (
            <React.Fragment>
              {` — `}
              <ItemTags tags={post.tags} />
            </React.Fragment>
          )}
          {post.timeToRead && ` — `}
          {post.timeToRead && <span> {toFarsiNumber(post.timeToRead)} دقیقه</span>}
        </p>
        <section
          sx={{
            my: 5,
            ".gatsby-resp-image-wrapper": {
              my: [4, 4, 5],
              borderRadius: `4px`,
              boxShadow: shadow.join(`, `),
              ".gatsby-resp-image-image": {
                borderRadius: `4px`,
              },
            },
            variant: `layout.content`,
          }}
        >
          {children}
        </section>
        <PostFooter post={post} />
      </div>
    </Layout>
  )
}

export default Post

export const Head: HeadFC<MBPostProps> = ({ data: { post } }) => (
  <Seo
    title={post.title}
    description={post.description ? post.description : post.excerpt}
    image={post.banner ? post.banner?.childImageSharp?.resize?.src : undefined}
    pathname={post.slug}
    canonicalUrl={post.canonicalUrl}
  />
)
