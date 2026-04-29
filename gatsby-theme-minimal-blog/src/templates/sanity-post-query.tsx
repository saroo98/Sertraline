import { graphql } from "gatsby"
import SanityPost, { Head } from "../components/sanity-post"

export default SanityPost

export { Head }

export const query = graphql`
  query ($id: String!, $formatString: String!) {
    sanityPost(id: { eq: $id }) {
      title
      publishedAt(formatString: $formatString)
      excerpt
      canonicalUrl
      legacyMdx
      _rawBody(resolveReferences: { maxDepth: 10 })
      slug {
        current
      }
      coverImage {
        asset {
          url
        }
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
      tags {
        title
        slug {
          current
        }
      }
    }
  }
`
