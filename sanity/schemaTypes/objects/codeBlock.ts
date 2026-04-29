import { defineField, defineType } from 'sanity';

export const codeBlock = defineType({
  name: 'codeBlock',
  title: 'Code block',
  type: 'object',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 8,
    }),
  ],
});
