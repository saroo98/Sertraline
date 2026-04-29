import * as React from "react"
import { withPrefix } from "gatsby"
import useSiteMetadata from "../hooks/use-site-metadata"

type SEOProps = {
  title?: string
  description?: string
  pathname?: string
  image?: string
  type?: "website" | "article"
  children?: React.ReactNode
  canonicalUrl?: string
}

const Seo = ({
  title = ``,
  description = ``,
  pathname = ``,
  image = ``,
  type = `website`,
  children = null,
  canonicalUrl = ``,
}: SEOProps) => {
  const site = useSiteMetadata()

  const {
    siteTitle,
    siteTitleAlt: defaultTitle,
    siteUrl,
    siteDescription: defaultDescription,
    siteImage: defaultImage,
    author,
    siteLanguage,
  } = site

  const canonical = canonicalUrl || `${siteUrl}${pathname || ``}`
  const shouldShowTwitterCreator = typeof author === `string` && author.startsWith(`@`)
  const seo = {
    title: title ? `${title} | ${siteTitle}` : defaultTitle,
    description: description || defaultDescription,
    url: `${siteUrl}${pathname || ``}`,
    image: `${siteUrl}${image || defaultImage}`,
  }
  return (
    <>
      <html lang={siteLanguage || `fa-IR`} dir="rtl" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:type" content={type} />
      <meta property="og:image:alt" content={seo.description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:image:alt" content={seo.description} />
      {shouldShowTwitterCreator ? <meta name="twitter:creator" content={author} /> : null}
      <meta name="gatsby-theme" content="sertraline-blog" />
      <link rel="icon" type="image/png" sizes="32x32" href={withPrefix(`/favicon-32x32.png`)} />
      <link rel="icon" type="image/png" sizes="16x16" href={withPrefix(`/favicon-16x16.png`)} />
      <link rel="apple-touch-icon" sizes="180x180" href={withPrefix(`/apple-touch-icon.png`)} />
      <link rel="canonical" href={canonical} />
      {children}
    </>
  )
}

export default Seo
