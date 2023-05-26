/** @jsx jsx */
import { Link } from "gatsby"
import { jsx } from "theme-ui"
import replaceSlashes from "../utils/replaceSlashes"
import useSiteMetadata from "../hooks/use-site-metadata"
import useMinimalBlogConfig from "../hooks/use-minimal-blog-config"

const HeaderTitle = () => {
  const { siteTitle } = useSiteMetadata()
  const { basePath } = useMinimalBlogConfig()

  return (
    <Link
      to={replaceSlashes(`/${basePath}`)}
      aria-label={`${siteTitle} - بازگشت به صفحه‌اصلی`}
      sx={{ color: `heading`, fontFamily: `heading`, textDecoration: `none` }}
    >
      <div sx={{ my: 0, fontWeight: `semibold`, fontSize: [4, 6] }}>{siteTitle}</div>
    </Link>
  )
}

export default HeaderTitle
