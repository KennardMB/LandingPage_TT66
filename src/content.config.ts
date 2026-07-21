import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const programs = defineCollection({
	loader: file('src/data/programs.json'),
	schema: z.object({
		id: z.string(),
		order: z.number(),
		code: z.string(),
		name: z.string(),
		description: z.string(),
		level: z.string(),
		scheduleStatus: z.string(),
	}),
});

const coaches = defineCollection({
	loader: file('src/data/coaches.json'),
	schema: z.object({
		id: z.string(),
		order: z.number(),
		name: z.string(),
		role: z.string(),
		quote: z.string(),
		initials: z.string(),
	}),
});

const stats = defineCollection({
	loader: file('src/data/stats.json'),
	schema: z.object({
		id: z.string(),
		order: z.number(),
		value: z.string(),
		label: z.string(),
	}),
});

const medals = defineCollection({
	loader: file('src/data/medals.json'),
	schema: z.object({
		id: z.string(),
		order: z.number(),
		count: z.number(),
		label: z.string(),
	}),
});

const results = defineCollection({
	loader: file('src/data/results.json'),
	schema: z.object({
		id: z.string(),
		order: z.number(),
		event: z.string(),
		result: z.string(),
		names: z.string(),
		dateStatus: z.string(),
	}),
});

export const collections = { programs, coaches, stats, medals, results };
