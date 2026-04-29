/** @jsx jsx */
import { Link as GatsbyLink } from "gatsby"
import { jsx, Link } from "theme-ui"

const Footer = () => (
  <footer
    sx={{
      boxSizing: `border-box`,
      display: `grid`,
      gap: 3,
      mt: [5],
      color: `secondary`,
      a: {
        variant: `links.secondary`,
      },
      variant: `cardWithP`,
      py: [4],
    }}
  >
    <p sx={{ m: 0 }}>
      سرترالین یک وبلاگ شخصی است. نوشته‌های این سایت راهنمای پزشکی، توصیه مصرف دارو، یا جایگزین مراجعه به پزشک،
      روان‌پزشک، روان‌شناس یا داروساز نیست.
    </p>
    <nav
      aria-label="پیوندهای پایانی"
      sx={{
        display: `flex`,
        flexWrap: `wrap`,
        gap: 3,
      }}
    >
      <GatsbyLink to="/about/">درباره</GatsbyLink>
      <GatsbyLink to="/contact/">تماس</GatsbyLink>
      <GatsbyLink to="/disclaimer/">سلب مسئولیت</GatsbyLink>
      <GatsbyLink to="/editorial-policy/">سیاست محتوایی</GatsbyLink>
      <GatsbyLink to="/privacy/">حریم خصوصی</GatsbyLink>
      <Link href="/rss.xml">RSS</Link>
    </nav>
    <p sx={{ m: 0 }}>
      بعضی از حقوق محفوظ است. محتوای سایت با مجوز{" "}
      <Link
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fa"
        target="_blank"
        rel="noopener noreferrer"
      >
        CC BY-NC-SA 4.0
      </Link>{" "}
      منتشر می‌شود.
    </p>
  </footer>
)

export default Footer
