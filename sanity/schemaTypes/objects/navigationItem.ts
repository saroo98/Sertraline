import { defineField, defineType } from 'sanity';

export const navigationItem = defineType({
  name: 'navigationItem',
  title: 'Navigation item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
    },
  },
});
