import * as React from "react"
import Blog, { Head } from "../../../components/blog"
import { mergePosts } from "../../../utils/sanity-posts"

const POSTS_PER_PAGE = 10

type Props = {
  data: {
    allPost: any
    allSanityPost?: any
    [key: string]: string
  }
  [key: string]: any
}

export default function MinimalBlogCoreBlog({ ...props }: Props) {
  const {
    data: { allPost, allSanityPost },
    pageContext,
  } = props
  const posts = mergePosts(allPost.nodes, allSanityPost?.nodes)
  const currentPage = Number(pageContext?.currentPage || 1)
  const postsPerPage = Number(pageContext?.postsPerPage || POSTS_PER_PAGE)
  const numPages = Math.max(1, Math.ceil(posts.length / postsPerPage))
  const startIndex = (currentPage - 1) * postsPerPage

  return (
    <Blog
      posts={posts.slice(startIndex, startIndex + postsPerPage)}
      pagination={{ currentPage, numPages }}
      {...props}
    />
  )
}

export { Head }
