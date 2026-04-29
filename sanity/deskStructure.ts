import type { StructureResolver } from 'sanity/structure';

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Sertraline')
    .items([
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('tag').title('Tags'),
      S.divider(),
      singleton(S, 'siteSettings', 'Site settings'),
      singleton(S, 'author', 'Author'),
      singleton(S, 'navigation', 'Navigation'),
    ]);
