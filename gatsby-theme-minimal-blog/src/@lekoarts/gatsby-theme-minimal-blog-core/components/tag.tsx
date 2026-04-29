import * as React from "react"
import Tag, { Head } from "../../../components/tag"
import { mergePosts } from "../../../utils/sanity-posts"

type Props = {
  data: {
    allPost: any
    allSanityPost?: any
    [key: string]: any
  }
  pageContext: {
    isCreatedByStatefulCreatePages: boolean
    slug: string
    name: string
    [key: string]: any
  }
  [key: string]: any
}

export default function MinimalBlogCoreTag({ ...props }: Props) {
  const {
    data: { allPost, allSanityPost },
  } = props

  return <Tag posts={mergePosts(allPost.nodes, allSanityPost?.nodes)} {...props} />
}

export { Head }
