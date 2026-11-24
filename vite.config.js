import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/*
  The note editor loads lazily, so Vite would only find its dependencies when Notes first opens and then
  reload mid session. Listing them here prebundles them when the dev server starts.
*/
const LAZY_DEPENDENCIES = [
  '@tiptap/core',
  '@tiptap/pm/state',
  '@tiptap/react',
  '@tiptap/starter-kit',
  '@tiptap/extension-document',
  '@tiptap/extension-heading',
  '@tiptap/extension-list',
  '@tiptap/extensions',
  '@tiptap/markdown',
]

export default defineConfig({
  base: '/sprig/',
  plugins: [react()],
  optimizeDeps: {
    include: LAZY_DEPENDENCIES,
  },
})
