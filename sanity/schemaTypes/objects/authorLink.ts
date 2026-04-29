import { defineField, defineType } from 'sanity';

export const authorLink = defineType({
  name: 'authorLink',
  title: 'Author link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'url', title: 'URL', type: 'url' }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'url',
    },
  },
});
