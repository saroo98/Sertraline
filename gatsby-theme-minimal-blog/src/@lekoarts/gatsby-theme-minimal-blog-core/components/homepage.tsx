import * as React from "react"
import Homepage, { Head } from "../../../components/homepage"
import { mergePosts } from "../../../utils/sanity-posts"

type Props = {
  data: {
    allPost: any
    allSanityPost?: any
    [key: string]: string
  }
  [key: string]: any
}

export default function MinimalBlogCoreHomepage({ ...props }: Props) {
  const {
    data: { allPost, allSanityPost },
  } = props

  return <Homepage posts={mergePosts(allPost.nodes, allSanityPost?.nodes).slice(0, 3)} {...props} />
}

export { Head }
