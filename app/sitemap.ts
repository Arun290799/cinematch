import { MetadataRoute } from "next";
import { popularMovieSlugs } from "@/lib/seo/movies";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://cinematch-jade.vercel.app";

	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${baseUrl}/discover`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.95,
		},
		{
			url: `${baseUrl}/recommendations`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},
	];

	const moviePages = popularMovieSlugs.map((slug) => ({
		url: `${baseUrl}/movies-like/${slug}`,
		lastModified: new Date(),
		changeFrequency: "weekly",
		priority: 0.8,
	}));

	return [...staticPages, ...moviePages] as MetadataRoute.Sitemap;
}
