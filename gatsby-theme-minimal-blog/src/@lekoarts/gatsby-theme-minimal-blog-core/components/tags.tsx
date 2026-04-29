import * as React from "react"
import Tags, { Head } from "../../../components/tags"
import { mergeTagGroups } from "../../../utils/sanity-posts"

type Props = {
  data: {
    allPost: {
      group: {
        fieldValue: string
        totalCount: number
      }[]
    }
    allSanityPost?: any
  }
  [key: string]: any
}

export default function MinimalBlogCoreTags({ ...props }: Props) {
  const {
    data: { allPost, allSanityPost },
  } = props

  return <Tags list={mergeTagGroups(allPost.group, allSanityPost?.nodes)} {...props} />
}

export { Head }
