import path from 'node:path';
import type { GatsbyNode } from 'gatsby';

const sanityProjectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const sanityDataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
const hasSanityConfig = Boolean(sanityProjectId && sanityDataset);
const POSTS_PER_PAGE = 10;

const normalizePath = (slug?: string | null) => {
  if (!slug) return null;
  const trimmed = slug.trim();
  if (!trimmed) return null;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

const normalizeTagSlug = (slug?: string | null) => {
  if (!slug) return null;
  return slug.startsWith('/') ? slug.slice(1) : slug;
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
  if (hasSanityConfig) return;

  actions.createTypes(`
    type SanitySlug {
      current: String
    }

    type SanityImageAsset {
      url: String
    }

    type SanityImage {
      alt: String
      caption: String
      asset: SanityImageAsset
    }

    type SanitySeo {
      title: String
      description: String
      image: SanityImage
    }

    input SanityResolveReferencesConfiguration {
      maxDepth: Int
    }

    type SanityTag implements Node @dontInfer {
      id: ID!
      title: String
      slug: SanitySlug
    }

    type SanityPost implements Node @dontInfer {
      id: ID!
      _id: String
      title: String
      slug: SanitySlug
      publishedAt: Date @dateformat
      excerpt: String
      isHidden: Boolean
      commentsEnabled: Boolean
      canonicalUrl: String
      _rawBody(resolveReferences: SanityResolveReferencesConfiguration): JSON
      legacyMdx: String
      coverImage: SanityImage
      seo: SanitySeo
      tags: [SanityTag]
    }

    type SanityPage implements Node @dontInfer {
      id: ID!
      _id: String
      title: String
      slug: SanitySlug
      _rawBody(resolveReferences: SanityResolveReferencesConfiguration): JSON
      seo: SanitySeo
    }
  `);
};

export const createPages: GatsbyNode['createPages'] = async ({ actions, graphql, reporter }) => {
  if (!hasSanityConfig) {
    reporter.info('Sanity project is not configured; Gatsby is using the existing MDX content only.');
    return;
  }

  const result = await graphql<{
    allPost: { nodes: { slug: string; tags?: { slug: string; name: string }[] }[] };
    allPage: { nodes: { slug: string }[] };
    allSanityPost: {
      nodes: {
        id: string;
        title?: string;
        slug?: { current?: string };
        tags?: { title?: string; slug?: { current?: string } }[];
      }[];
    };
    allSanityPage: { nodes: { id: string; title?: string; slug?: { current?: string } }[] };
  }>(`
    {
      allPost {
        nodes {
          slug
          tags {
            name
            slug
          }
        }
      }
      allPage {
        nodes {
          slug
        }
      }
      allSanityPost(filter: { slug: { current: { ne: null } }, isHidden: { ne: true } }) {
        nodes {
          id
          title
          slug {
            current
          }
          tags {
            title
            slug {
              current
            }
          }
        }
      }
      allSanityPage(filter: { slug: { current: { ne: null } } }) {
        nodes {
          id
          title
          slug {
            current
          }
        }
      }
    }
  `);

  if (result.errors || !result.data) {
    reporter.panicOnBuild('Could not query Sanity content. Run `npm run sanity:graphql` after creating your Sanity project.');
    return;
  }

  const sanityPostTemplate = path.resolve('./gatsby-theme-minimal-blog/src/templates/sanity-post-query.tsx');
  const sanityPageTemplate = path.resolve('./gatsby-theme-minimal-blog/src/templates/sanity-page-query.tsx');
  const blogTemplate = path.resolve(
    './gatsby-theme-minimal-blog/src/@lekoarts/gatsby-theme-minimal-blog-core/templates/blog-query.tsx'
  );
  const tagTemplate = path.resolve(
    './gatsby-theme-minimal-blog/src/@lekoarts/gatsby-theme-minimal-blog-core/templates/tag-query.tsx'
  );
  const existingPostSlugs = new Set(result.data.allPost.nodes.map((post) => post.slug));
  const existingPageSlugs = new Set(result.data.allPage.nodes.map((page) => page.slug));
  const existingTagSlugs = new Set(
    result.data.allPost.nodes.flatMap((post) => post.tags?.map((tag) => tag.slug) || [])
  );

  for (const post of result.data.allSanityPost.nodes) {
    const slug = normalizePath(post.slug?.current);
    if (!slug) continue;

    if (existingPostSlugs.has(slug)) {
      reporter.warn(`Skipping Sanity post "${post.title || post.id}" because ${slug} already exists as an MDX post.`);
      continue;
    }

    actions.createPage({
      path: slug,
      component: sanityPostTemplate,
      context: {
        id: post.id,
        formatString: 'YYYY-MM-DD',
      },
    });
  }

  for (const page of result.data.allSanityPage.nodes) {
    const slug = normalizePath(page.slug?.current);
    if (!slug) continue;

    if (existingPageSlugs.has(slug)) {
      reporter.warn(`Skipping Sanity page "${page.title || page.id}" because ${slug} already exists as an MDX page.`);
      continue;
    }

    actions.createPage({
      path: slug,
      component: sanityPageTemplate,
      context: {
        id: page.id,
      },
    });
  }

  const sanityTags = new Map<string, string>();
  for (const post of result.data.allSanityPost.nodes) {
    for (const tag of post.tags || []) {
      const slug = normalizeTagSlug(tag.slug?.current);
      if (!slug || !tag.title || existingTagSlugs.has(slug)) continue;
      sanityTags.set(slug, tag.title);
    }
  }

  for (const [slug, name] of sanityTags) {
    actions.createPage({
      path: `/tags/${slug}`,
      component: tagTemplate,
      context: {
        slug,
        name,
        formatString: 'YYYY-MM-DD',
      },
    });
  }

  const visibleBlogSlugs = new Set<string>();
  for (const post of result.data.allPost.nodes) {
    visibleBlogSlugs.add(post.slug);
  }
  for (const post of result.data.allSanityPost.nodes) {
    const slug = normalizePath(post.slug?.current);
    if (slug) visibleBlogSlugs.add(slug);
  }

  const numBlogPages = Math.ceil(visibleBlogSlugs.size / POSTS_PER_PAGE);
  for (let currentPage = 2; currentPage <= numBlogPages; currentPage += 1) {
    actions.createPage({
      path: `/blog/page/${currentPage}`,
      component: blogTemplate,
      context: {
        currentPage,
        postsPerPage: POSTS_PER_PAGE,
        formatString: 'YYYY-MM-DD',
      },
    });
  }
};
