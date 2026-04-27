"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Movie {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	vote_average: number;
	release_date: string;
	genre_ids: number[];
}

export default function PopularMoviesSection() {
	const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPopularMovies = async () => {
			try {
				const response = await fetch("/api/movies?page=1", { credentials: "include" });
				if (response.ok) {
					const data = await response.json();
					setPopularMovies(data.results || []);
				}
			} catch (error) {
				console.error("Error fetching popular movies:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPopularMovies();
	}, []);

	return (
		<section className="bg-accent/5 w-full">
			<div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
						Popular Movies Right Now
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Check out what everyone is watching
					</p>
				</div>
				{isLoading ? (
					<div className="flex justify-center items-center py-20">
						<Loader2 className="h-12 w-12 animate-spin text-accent" />
					</div>
				) : (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
						{popularMovies.slice(0, 10).map((movie, index) => (
							<MovieCard
								key={movie.id}
								id={movie.id}
								title={movie.title}
								overview={movie.overview}
								posterUrl={movie.poster_path}
								rating={movie.vote_average}
								year={movie.release_date ? new Date(movie.release_date).getFullYear() : null}
								genres={[]}
								index={index}
							/>
						))}
					</div>
				)}
				<div className="text-center mt-12">
					<Link
						href="/discover"
						className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 text-base font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
					>
						Discover More Movies
						<ArrowRight className="h-5 w-5" />
					</Link>
				</div>
			</div>
		</section>
	);
}
