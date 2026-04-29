import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = (options) => ({
  siteMetadata: {
    siteTitle: `سرترالین`,
    siteTitleAlt: `سرترالین | وبلاگ شخصی سارو`,
    siteHeadline: `سرترالین | وبلاگ شخصی سارو`,
    siteUrl: `https://sertraline.ir`,
    siteDescription: `یادداشت‌ها و نوشته‌های شخصی سارو؛ نه راهنمای پزشکی، نه توصیه مصرف دارو، و نه جایگزین کمک حرفه‌ای.`,
    siteImage: `/banner.jpg`,
    siteLanguage: `fa-IR`,
    author: `Saro`,
  },
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-minimal-blog-core`,
      options,
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Vazirmatn']
        }
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `texts`,
        path: `${__dirname}/src/texts`,
      },
    },
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-theme-ui`,
  ],
})

export default config
