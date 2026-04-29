/** @jsx jsx */
import * as React from "react"
import { PortableText, PortableTextComponents } from "@portabletext/react"
import { Heading, jsx } from "theme-ui"

type PortableContentProps = {
  value?: unknown[]
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <Heading as="h2" variant="styles.h2">
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading as="h3" variant="styles.h3">
        {children}
      </Heading>
    ),
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || ``
      const isExternal = /^https?:\/\//.test(href)

      return (
        <a href={href} rel={isExternal ? `noopener noreferrer` : undefined} target={value?.blank ? `_blank` : undefined}>
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => {
      const src = value?.asset?.url
      if (!src) return null

      return (
        <figure>
          <img alt={value?.alt || ``} loading="lazy" src={src} sx={{ borderRadius: `4px`, width: `100%` }} />
          {value?.caption && <figcaption sx={{ color: `secondary`, fontSize: 1, mt: 2 }}>{value.caption}</figcaption>}
        </figure>
      )
    },
    separator: () => <hr />,
    codeBlock: ({ value }) => (
      <pre>
        <code>{value?.code || ``}</code>
      </pre>
    ),
  },
}

const PortableContent = ({ value = [] }: PortableContentProps) => {
  if (!value.length) return null

  return <PortableText components={components} value={value} />
}

export default PortableContent
