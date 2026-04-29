/** @jsx jsx */
import * as React from "react"
import { jsx, Link as TLink } from "theme-ui"
import useMinimalBlogConfig from "../hooks/use-minimal-blog-config"

const HeaderExternalLinks = () => {
  const { externalLinks } = useMinimalBlogConfig()
  const validExternalLinks = externalLinks?.filter((link) => link.url && link.url !== `#`)

  return (
    <React.Fragment>
      {validExternalLinks && validExternalLinks.length > 0 && (
        <div sx={{ "a:not(:first-of-type)": { ml: 3 }, fontSize: [1, `18px`] }}>
          {validExternalLinks.map((link) => (
            <TLink key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.name}
            </TLink>
          ))}
        </div>
      )}
    </React.Fragment>
  )
}

export default HeaderExternalLinks
