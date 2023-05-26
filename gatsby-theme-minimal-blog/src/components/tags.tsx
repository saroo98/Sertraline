/** @jsx jsx */
import { jsx, Heading, Box, Flex } from "theme-ui"
// @ts-ignore
import { kebabCase } from "@lekoarts/themes-utils"
import { HeadFC, Link } from "gatsby"
import Layout from "./layout"
import useMinimalBlogConfig from "../hooks/use-minimal-blog-config"
import Seo from "./seo"
import replaceSlashes from "../utils/replaceSlashes"

export type MBTagsProps = {
  list: {
    fieldValue: string
    totalCount: number
  }[]
}

function toFarsiNumber(n) {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  return n
    .toString()
    .replace(/\d/g, x => farsiDigits[x]);
}


const Tags = ({ list }: MBTagsProps) => {
  const { tagsPath, basePath } = useMinimalBlogConfig()

  return (
    <Layout>
      <div sx={{ mb: [5], variant: `cardWithP` }}>
        <Heading as="h1" variant="styles.h1">
          برچسب‌ها
        </Heading>
        <Box mt={[4, 5]}>
          {list.map((listItem) => (
            <Flex key={listItem.fieldValue} mb={[1, 1, 2]} sx={{ alignItems: `center` }}>
              <Link
                sx={(t) => ({ ...t.styles?.a, variant: `links.listItem`, mr: 2 })}
                to={replaceSlashes(`/${basePath}/${tagsPath}/${kebabCase(listItem.fieldValue)}`)}
              >
                {listItem.fieldValue} <span sx={{ color: `secondary` }}>({toFarsiNumber(listItem.totalCount)})</span>
              </Link>
            </Flex>
          ))}
        </Box>
      </div>
    </Layout >
  )
}

export default Tags

export const Head: HeadFC = () => <Seo title="Tags" />
