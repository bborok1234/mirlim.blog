// @ts-check

import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import rehypeMermaidSimple from './src/plugins/rehype-mermaid-simple.mjs';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://mirlim.blog',
	adapter: cloudflare(),
	integrations: [mdx(), sitemap()],
	markdown: {
		syntaxHighlight: {
			type: 'shiki',
			excludeLangs: ['mermaid'],
		},
		remarkPlugins: [remarkGfm],
		rehypePlugins: [rehypeMermaidSimple],
	},
});
