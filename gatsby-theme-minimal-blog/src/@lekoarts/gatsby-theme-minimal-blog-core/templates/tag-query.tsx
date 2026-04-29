import { graphql } from "gatsby"
import TagComponent, { Head } from "../components/tag"

export default TagComponent

export { Head }

export const query = graphql`
  query ($slug: String!, $formatString: String!) {
    allPost(sort: { date: DESC }, filter: { tags: { elemMatch: { slug: { eq: $slug } } } }) {
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
    allSanityPost(
      sort: { publishedAt: DESC }
      filter: { isHidden: { ne: true }, tags: { elemMatch: { slug: { current: { eq: $slug } } } } }
    ) {
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
