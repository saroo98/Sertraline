import { author } from './documents/author';
import { navigation } from './documents/navigation';
import { page } from './documents/page';
import { post } from './documents/post';
import { siteSettings } from './documents/siteSettings';
import { tag } from './documents/tag';
import { authorLink } from './objects/authorLink';
import { blockContent } from './objects/blockContent';
import { codeBlock } from './objects/codeBlock';
import { navigationItem } from './objects/navigationItem';
import { seo } from './objects/seo';
import { separator } from './objects/separator';

export const schemaTypes = [
  post,
  page,
  tag,
  author,
  siteSettings,
  navigation,
  blockContent,
  separator,
  codeBlock,
  authorLink,
  navigationItem,
  seo,
];
