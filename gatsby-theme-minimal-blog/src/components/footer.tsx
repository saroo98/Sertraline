/** @jsx jsx */
import { jsx, Link } from "theme-ui"

const Footer = () => {

  return (
    <footer
      sx={{
        boxSizing: `border-box`,
        display: `flex`,
        justifyContent: `space-between`,
        mt: [6],
        color: `secondary`,
        a: {
          variant: `links.secondary`,
        },
        flexDirection: [`column`, `column`, `row`],
        variant: `dividers.top`,
      }}
    >
      <div>
        &copy; بعضی از حقوق محفوظ است
      </div>
      <div>
        <span>
          پشتیبانی فنی
        </span>
        {` `}
        توسط
        {` `}
        <Link
          aria-label="Link to the technical maintainer of the blog"
          href="https://jourlog.xyz?utm_source=sertraline&utm_medium=footer"
        >
          ژورلاگ
        </Link>
      </div>
    </footer>
  )
}

export default Footer
