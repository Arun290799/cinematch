// app/watchlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Loader2, Film } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import MovieCard from "@/components/MovieCard";

const WatchlistPage = () => {
	const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
	const router = useRouter();
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [movies, setMovies] = useState<
		{
			id: number;
			title: string;
			overview: string;
			posterUrl?: string | null;
			rating?: number | null;
			year?: number | string | null;
			genres?: string[];
		}[]
	>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Redirect if not authenticated and fetch wishlist on mount
	useEffect(() => {
		const run = async () => {
			if (isAuthLoading) return;

			if (!isAuthenticated) {
				router.push("/login");
				setIsCheckingAuth(false);
				return;
			}

			setIsCheckingAuth(false);
			setLoading(page === 1);
			setLoadingMore(page > 1);
			setError(null);

			try {
				const res = await fetch(`/api/wishlist?page=${page}`, { credentials: "include" });
				if (!res.ok) {
					throw new Error("Failed to load watchlist");
				}

				const data = await res.json();
				const items = Array.isArray(data?.results)
					? data.results
					: Array.isArray(data?.data?.items)
						? data.data.items
						: Array.isArray(data)
							? data
							: [];

				const mapped = items.map((movie: any) => ({
					id: movie.movieId ?? movie.id,
					title: movie.title,
					overview: movie.overview,
					posterUrl: movie.posterUrl ?? movie.posterPath ?? movie.poster_path ?? null,
					rating: movie.rating,
					year: movie.year,
					genres: movie.genres || [],
				}));

				const incomingTotalPages =
					typeof data?.total_pages === "number" && data.total_pages > 0 ? data.total_pages : 1;

				setTotalPages(incomingTotalPages);
				setMovies((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unable to load watchlist");
				if (page === 1) {
					setMovies([]);
					setTotalPages(1);
				}
			} finally {
				setLoading(false);
				setLoadingMore(false);
			}
		};

		run();
	}, [isAuthenticated, isAuthLoading, router, page]);

	if (!isAuthenticated && !isAuthLoading) {
		return null; // Will redirect
	}

	if ((loading && page === 1) || isAuthLoading || isCheckingAuth) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
					<p className="text-sm text-gray-600 dark:text-gray-400">Loading your watchlist...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Watchlist</h1>
					</div>
					<p className="text-gray-600 dark:text-gray-400">
						{movies.length === 0
							? "Start building your collection"
							: `${movies.length} ${movies.length === 1 ? "movie" : "movies"} saved`}
					</p>
				</motion.div>

				{/* Empty State */}
				{movies.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 dark:border-gray-700 dark:bg-gray-900"
					>
						<div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
							<Film className="h-12 w-12 text-gray-400" />
						</div>
						<h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
							Your watchlist is empty
						</h2>
						<p className="mb-6 max-w-sm text-center text-gray-600 dark:text-gray-400">
							Explore movies and add them to your watchlist to keep track of what you want to watch
						</p>
						<button
							onClick={() => router.push("/")}
							className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
						>
							Discover Movies
						</button>
					</motion.div>
				) : (
					/* Movie Grid */
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.1 }}
						className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
					>
						{movies.length > 0 ? (
							movies.map((movie, index) => (
								<MovieCard
									key={movie.id}
									id={movie.id}
									title={movie.title}
									overview={movie.overview}
									posterUrl={movie.posterUrl}
									rating={movie.rating}
									year={movie.year}
									genres={movie.genres}
									index={index}
								/>
							))
						) : (
							<div className="col-span-full text-center py-12">
								<Film className="mx-auto h-12 w-12 text-gray-400 mb-4" />
								<h3 className="text-lg font-medium text-gray-900 dark:text-white">
									No movies in your watchlist
								</h3>
								<p className="mt-1 text-gray-500 dark:text-gray-400">Add some movies to get started!</p>
							</div>
						)}
					</motion.div>
				)}

				{/* Pagination */}
				{movies.length > 0 && (
					<div className="mt-6 flex items-center justify-start sm:justify-end gap-3">
						<span className="text-xs text-gray-500 dark:text-gray-400">
							Page {page} of {totalPages}
						</span>
						{page < totalPages && (
							<button
								type="button"
								disabled={loadingMore}
								onClick={() => setPage((p) => p + 1)}
								className="rounded-full bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
							>
								{loadingMore ? "Loading..." : "Next"}
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default WatchlistPage;
