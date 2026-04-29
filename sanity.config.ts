import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { structure } from './sanity/deskStructure';
import { schemaTypes } from './sanity/schemaTypes';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error(
    'Missing SANITY_STUDIO_PROJECT_ID or SANITY_PROJECT_ID. Create a Sanity project, then add it to .env before running the Studio.'
  );
}

export default defineConfig({
  name: 'sertraline',
  title: 'Sertraline CMS',
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});
