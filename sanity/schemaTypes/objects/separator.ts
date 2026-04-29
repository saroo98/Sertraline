import { defineField, defineType } from 'sanity';

export const separator = defineType({
  name: 'separator',
  title: 'Separator',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Internal label',
      type: 'string',
      hidden: true,
      initialValue: 'Separator',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Separator',
      };
    },
  },
});
