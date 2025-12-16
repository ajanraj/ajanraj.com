import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import mdx from '@mdx-js/rollup'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkSmartyPants from 'remark-smartypants'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    // MDX plugin must come BEFORE tanstackStart and viteReact
    mdx({
      jsxImportSource: 'react',
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkMath, remarkGfm, remarkSmartyPants],
      rehypePlugins: [rehypeKatex, [rehypeHighlight, { detect: true }]],
    }),
    tanstackStart(),
    // Don't include .mdx in the React plugin - MDX plugin handles it
    viteReact({ include: /\.(js|jsx|ts|tsx)$/ }),
  ],
})

export default config
