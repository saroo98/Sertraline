import { graphql } from "gatsby"
import BlogComponent, { Head } from "../components/blog"

export default BlogComponent

export { Head }

export const query = graphql`
  query ($formatString: String!) {
    allPost(sort: { date: DESC }) {
      nodes {
        slug
        title
        date(formatString: $formatString)
        excerpt
        timeToRead
        description
        tags {
          name
          slug
        }
      }
    }
    allSanityPost(sort: { publishedAt: DESC }, filter: { isHidden: { ne: true } }) {
      nodes {
        title
        publishedAt(formatString: $formatString)
        excerpt
        isHidden
        slug {
          current
        }
        tags {
          title
          slug {
            current
          }
        }
      }
    }
  }
`
