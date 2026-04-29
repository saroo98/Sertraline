import { defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'metadata', title: 'Metadata' },
    { name: 'seo', title: 'SEO' },
    { name: 'migration', title: 'Migration' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'metadata',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      group: 'metadata',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short excerpt',
      type: 'text',
      rows: 3,
      group: 'metadata',
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: 'isHidden',
      title: 'Hidden from website',
      type: 'boolean',
      group: 'metadata',
      description: 'Turn this on to keep the post in Sanity but remove it from the public website.',
      initialValue: false,
    }),
    defineField({
      name: 'commentsEnabled',
      title: 'Allow comments',
      type: 'boolean',
      group: 'metadata',
      description: 'Prepared for the public comment system. This does not publish comments by itself yet.',
      initialValue: true,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'metadata',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'legacyMdx',
      title: 'Legacy MDX backup',
      type: 'text',
      rows: 12,
      group: 'migration',
      description:
        'Exact imported MDX text from the previous file-based blog. Keep this as a backup while manually converting old posts to the rich editor.',
    }),
    defineField({
      name: 'importSourcePath',
      title: 'Import source path',
      type: 'string',
      group: 'migration',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Published date, newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'publishedAt',
      media: 'coverImage',
      slug: 'slug.current',
    },
    prepare({ title, date, media, slug }) {
      return {
        title,
        subtitle: [date ? new Date(date).toLocaleDateString('fa-IR') : undefined, slug ? `/${slug}` : undefined]
          .filter(Boolean)
          .join(' - '),
        media,
      };
    },
  },
});
