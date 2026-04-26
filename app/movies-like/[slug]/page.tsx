import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import MovieGrid from "@/components/MovieGrid";
import { popularMovieSlugs } from "@/lib/seo/movies";
import { getLanguageName } from "@/src/utils/common";

interface Movie {
	id: number;
	title: string;
	overview: string;
	poster_path?: string | null;
	rating?: number | null;
	year?: number | string | null;
	genres?: string[];
	slug?: string;
}

interface MoviesLikeResponse {
	baseMovie: {
		id: number;
		title: string;
		overview: string;
		poster_path?: string | null;
		year?: number | string | null;
		rating?: number | null;
		genres?: string[];
		language?: string | null;
	};
	similarMovies: Movie[];
}

async function getMoviesLike(slug: string): Promise<MoviesLikeResponse> {
	const movieSlug = await decodeURIComponent(slug);
	const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

	try {
		const res = await fetch(`${baseUrl}/api/movies/movies-like/${movieSlug}`, {
			next: { revalidate: 3600 }, // 1 hour
		});

		if (!res.ok) {
			return notFound();
		}

		const data = await res.json();

		// Check if response has the expected structure
		if (!data || (!data.movie && !data.baseMovie)) {
			console.error("Invalid response structure:", data);
			return notFound();
		}

		return {
			baseMovie: data.movie || data.baseMovie,
			similarMovies: data.similarMovies || [],
		};
	} catch (error) {
		console.error("Error fetching movies like:", error);
		return notFound();
	}
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
	const paramsPromise = Promise.resolve(params);
	const movieSlug = await decodeURIComponent((await paramsPromise).slug);
	const data = await getMoviesLike(movieSlug);
	const movieName = data.baseMovie.title;
	const year = data.baseMovie.year || "2026";

	return {
		title: `Movies Like ${movieName} (${year}) | CineMatch`,
		description: `Discover movies similar to ${movieName} with AI-powered recommendations. Find your next favorite film based on similar themes, genres, and storytelling styles.`,
		keywords: [
			`movies like ${movieName}`,
			"similar movies",
			"movie recommendations",
			"film suggestions",
			"AI movie recommendations",
			"movie discovery",
			"film finder",
			"cinema recommendations",
		],
		openGraph: {
			title: `Movies Like ${movieName} (${year}) | CineMatch`,
			description: `Discover movies similar to ${movieName} with AI-powered recommendations.`,
			type: "website",
			images: data.baseMovie.poster_path
				? [`https://image.tmdb.org/t/p/w500${data.baseMovie.poster_path}`]
				: ["/logo.png"],
		},
	};
}

export default async function MoviesLikePage({ params }: { params: { slug: string } }) {
	const paramsPromise = Promise.resolve(params);
	const movieSlug = await decodeURIComponent((await paramsPromise).slug);
	const data = await getMoviesLike(movieSlug);
	const { baseMovie, similarMovies } = data;

	// Get 3 random popular movie slugs, excluding the current one
	const otherSlugs = popularMovieSlugs.filter((slug) => slug !== movieSlug);
	const shuffled = otherSlugs.sort(() => 0.5 - Math.random());
	const randomSlugs = shuffled.slice(0, 3);

	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Header */}
			<header className="border-b border-border bg-card/50 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Back to Home
					</Link>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
				{/* Hero Section */}
				<div className="mb-12">
					<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
						Movies Like {baseMovie.title}
					</h1>

					<div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
						{/* Base Movie Poster */}
						{baseMovie.poster_path && (
							<div className="shrink-0">
								<div className="relative aspect-2/3 w-48 overflow-hidden rounded-xl shadow-lg lg:w-64">
									<Image
										src={`https://image.tmdb.org/t/p/w500${baseMovie.poster_path}`}
										alt={baseMovie.title}
										fill
										className="object-cover"
										priority
									/>
								</div>
							</div>
						)}

						{/* Base Movie Info */}
						<div className="flex-1">
							<div className="mb-6">
								<h2 className="text-2xl font-semibold text-foreground mb-3">{baseMovie.title}</h2>

								{/* Movie Details */}
								<div className="flex flex-wrap items-center gap-3 mb-4">
									{baseMovie.year && (
										<span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
											{baseMovie.year}
										</span>
									)}
									{baseMovie.rating && (
										<span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-500">
											<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
											{baseMovie.rating.toFixed(1)}
										</span>
									)}
									{baseMovie.language && (
										<span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-500">
											{getLanguageName(baseMovie.language)}
										</span>
									)}
								</div>

								{baseMovie.genres && baseMovie.genres.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-4">
										{baseMovie.genres.map((genre) => (
											<span
												key={genre}
												className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
											>
												{genre}
											</span>
										))}
									</div>
								)}

								<p className="text-base text-muted-foreground leading-relaxed">{baseMovie.overview}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Similar Movies Section */}
				<div className="mt-12">
					<h2 className="text-3xl font-bold text-foreground mb-8">Similar Movies You Might Like</h2>

					{similarMovies.length > 0 ? (
						<MovieGrid movies={similarMovies} />
					) : (
						<div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border p-12 text-center">
							<svg
								className="h-16 w-16 text-muted-foreground"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
								/>
							</svg>
							<p className="text-lg font-medium text-foreground">No similar movies found</p>
							<p className="text-sm text-muted-foreground">Check back later for more recommendations</p>
						</div>
					)}
				</div>

				{/* Internal Links Section */}
				<div className="mt-16 rounded-xl bg-card/50 border border-border p-8 backdrop-blur-sm">
					<h3 className="text-xl font-semibold text-foreground mb-4">Explore More on CineMatch</h3>
					<div className="flex flex-wrap gap-4">
						<Link
							href="/"
							className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
						>
							<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							Home
						</Link>
						<Link
							href="/recommendations"
							className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
						>
							<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								/>
							</svg>
							Recommendations
						</Link>
						{randomSlugs.map((slug) => (
							<Link
								key={slug}
								href={`/movies-like/${slug}`}
								className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
							>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
									/>
								</svg>
								Movies Like{" "}
								{slug
									.split("-")
									.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
									.join(" ")}
							</Link>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
