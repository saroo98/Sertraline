import { graphql } from "gatsby"
import HomepageComponent, { Head } from "../components/homepage"

export default HomepageComponent

export { Head }

export const query = graphql`
  query ($formatString: String!) {
    allPost(sort: { date: DESC }, limit: 3) {
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
    allSanityPost(sort: { publishedAt: DESC }, limit: 3, filter: { isHidden: { ne: true } }) {
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
