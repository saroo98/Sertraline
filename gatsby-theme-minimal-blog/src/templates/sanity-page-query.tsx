import { graphql } from "gatsby"
import SanityPage, { Head } from "../components/sanity-page"

export default SanityPage

export { Head }

export const query = graphql`
  query ($id: String!) {
    sanityPage(id: { eq: $id }) {
      title
      _rawBody(resolveReferences: { maxDepth: 10 })
      slug {
        current
      }
      seo {
        title
        description
        image {
          asset {
            url
          }
        }
      }
    }
  }
`
