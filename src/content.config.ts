import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categoryEnum = z.enum([
	'essay',      // 생각, 오피니언, 에세이
	'tutorial',   // 기술 튜토리얼, 가이드
	'research',   // AX 리서치, 업계 분석
	'note',       // 짧은 메모, TIL, 스니펫
]);

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			summary: z.string().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
			category: categoryEnum.default('essay'),
			series: z.string().optional(),
			seriesOrder: z.number().optional(),
			concepts: z.array(z.object({
				name: z.string(),
				related: z.array(z.string()).optional(),
			})).optional(),
			draft: z.boolean().default(false),
			toolsUsed: z.array(z.string()).optional(), // 글 작성에 사용한 도구들
		}),
});

export const collections = { blog };
