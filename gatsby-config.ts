import type { GatsbyConfig, PluginRef } from 'gatsby';
import 'dotenv/config';

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE;
const sanityProjectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const sanityDataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
const hasSanityConfig = Boolean(sanityProjectId);

const config: GatsbyConfig = {
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
  trailingSlash: `never`,
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-minimal-blog`,
      // See the theme's README for all available options
      options: {
        formatString: `YYYY-MM-DD`,
        postsPath: hasSanityConfig ? `content/legacy-posts-disabled` : `content/posts`,
        navigation: [
          {
            title: `برچسب‌ها`,
            slug: `/tags`,
          },
          {
            title: `درباره`,
            slug: `/about`,
          },
        ],
        externalLinks: [],
      },
    },
    hasSanityConfig && {
      resolve: `gatsby-source-sanity`,
      options: {
        projectId: sanityProjectId,
        dataset: sanityDataset,
        token: process.env.SANITY_API_TOKEN,
        overlayDrafts: Boolean(process.env.SANITY_API_TOKEN && process.env.GATSBY_SANITY_OVERLAY_DRAFTS),
        watchMode: process.env.NODE_ENV === `development`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/`,
      },
    },
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `سرترالین | وبلاگ شخصی سارو`,
        short_name: `سرترالین`,
        description: `یادداشت‌ها و نوشته‌های شخصی سارو؛ نه راهنمای پزشکی، نه توصیه مصرف دارو، و نه جایگزین کمک حرفه‌ای.`,
        start_url: `/`,
        background_color: `#f7faf7`,
        theme_color: `#f7faf7`,
        display: `standalone`,
        icons: [
          {
            src: `/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title: siteTitle
                description: siteDescription
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({
              query: { site, allPost, allSanityPost },
            }: {
              query: {
                allPost: IAllPost;
                allSanityPost?: IAllSanityPost;
                site: { siteMetadata: ISiteMetadata };
              };
            }) => {
              const mdxPosts = allPost.nodes.map((post) => ({
                date: post.date,
                description: post.description,
                excerpt: post.excerpt,
                slug: post.slug,
                title: post.title,
              }));
              const sanityPosts = (allSanityPost?.nodes || []).flatMap((post) => {
                const slug = post.slug?.current;
                if (!post.title || !slug || !post.publishedAt) return [];

                return [{
                  date: post.publishedAt,
                  description: post.excerpt,
                  excerpt: post.excerpt,
                  slug: slug.startsWith(`/`) ? slug : `/${slug}`,
                  title: post.title,
                }];
              });

              return [...mdxPosts, ...sanityPosts]
                .sort(
                  (a, b) =>
                    new Date(`${b.date}T00:00:00.000Z`).getTime() -
                    new Date(`${a.date}T00:00:00.000Z`).getTime()
                )
                .map((post) => {
                const url = site.siteMetadata.siteUrl + post.slug;
                const excerpt = post.description || post.excerpt;
                const content = `<p>${excerpt}</p><div style="margin-top: 32px;"><strong><a href="${url}">ادامه نوشته</a></strong></div>`;
                const theDate = new Date(`${post.date}T00:00:00.000Z`);
                return {
                  title: post.title,
                  date: theDate,
                  excerpt,
                  url,
                  guid: url,
                  custom_elements: [{ 'content:encoded': content }],
                };
              });
            },
            query: `{
  allPost(sort: {date: DESC}) {
    nodes {
      title
      date(formatString: "YYYY-MM-DD")
      excerpt
      description
      slug
    }
  }
  allSanityPost(sort: {publishedAt: DESC}, filter: {isHidden: {ne: true}}) {
    nodes {
      title
      publishedAt(formatString: "YYYY-MM-DD")
      excerpt
      isHidden
      slug {
        current
      }
    }
  }
}`,
            output: `rss.xml`,
            title: `سرترالین | وبلاگ شخصی سارو`,
          },
        ],
      },
    },
    // You can remove this plugin if you don't need it
    shouldAnalyseBundle && {
      resolve: `gatsby-plugin-webpack-statoscope`,
      options: {
        saveReportTo: `${__dirname}/public/.statoscope/_bundle.html`,
        saveStatsTo: `${__dirname}/public/.statoscope/_stats.json`,
        open: false,
      },
    },
  ].filter(Boolean) as Array<PluginRef>,
};

export default config;

interface IPostTag {
  name: string;
  slug: string;
}

interface IPost {
  slug: string;
  title: string;
  defer: boolean;
  date: string;
  excerpt: string;
  contentFilePath: string;
  html: string;
  timeToRead: number;
  wordCount: number;
  tags: Array<IPostTag>;
  banner: any;
  description: string;
  canonicalUrl: string;
}

interface IAllPost {
  nodes: Array<IPost>;
}

interface ISanityPost {
  title?: string;
  publishedAt?: string;
  excerpt?: string;
  slug?: {
    current?: string;
  };
}

interface IAllSanityPost {
  nodes: Array<ISanityPost>;
}

interface ISiteMetadata {
  siteTitle: string;
  siteTitleAlt: string;
  siteHeadline: string;
  siteUrl: string;
  siteDescription: string;
  siteImage: string;
  author: string;
}
