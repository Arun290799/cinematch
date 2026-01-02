"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Film, ChevronDown } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { useAuth } from "@/src/context/AuthContext";
import { languages } from "@/src/utils/common";

type Recommendation = {
	id: number;
	title: string;
	overview: string;
	poster_path?: string | null;
	posterUrl?: string | null;
	rating?: number | null;
	year?: number | string | null;
	genres?: string[];
	language?: string | null;
};

const RecommendationsPage = () => {
	const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
	const router = useRouter();

	const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loadingMore, setLoadingMore] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);
	const [likedMovies, setLikedMovies] = useState<Set<number>>(new Set());
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
	const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
	const [tempSelectedLanguages, setTempSelectedLanguages] = useState<string[]>([]);
	const languageDropdownRef = useRef<HTMLDivElement>(null);

	// Check auth then fetch recommendations
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
				const params = new URLSearchParams();
				if (page) params.set("page", page.toString());
				if (selectedLanguages.length) params.set("languages", selectedLanguages.join(","));

				const res = await fetch(`/api/recommendations?${params.toString()}`, { credentials: "include" });
				if (!res.ok) {
					throw new Error("Failed to load recommendations");
				}

				const data = await res.json();
				const items: Recommendation[] = Array.isArray(data?.results) ? data.results : [];
				const incomingTotalPages =
					typeof data?.total_pages === "number" && data.total_pages > 0 ? data.total_pages : 1;

				setTotalPages(incomingTotalPages);
				setRecommendations((prev) => (page === 1 ? items : [...prev, ...items]));
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unable to load recommendations");
				if (page === 1) {
					setRecommendations([]);
					setTotalPages(1);
				}
			} finally {
				setLoading(false);
				setLoadingMore(false);
			}
		};

		run();
	}, [isAuthenticated, isAuthLoading, router, page, refreshKey, selectedLanguages]);

	// Handle click outside for language dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
				// Don't close on outside click, keep selections for user to save
				// setIsLanguageDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Sync temp selections when dropdown opens
	useEffect(() => {
		if (isLanguageDropdownOpen) {
			setTempSelectedLanguages(selectedLanguages);
		}
	}, [isLanguageDropdownOpen, selectedLanguages]);

	const toggleLanguage = (language: string) => {
		setTempSelectedLanguages((prev: string[]) => {
			let newLanguages = prev.includes(language)
				? prev.filter((lang: string) => lang !== language)
				: [...prev, language];
			return newLanguages;
		});
	};

	const applyLanguageFilter = () => {
		setPage(1);
		setRefreshKey((prev) => prev + 1);
		setSelectedLanguages(tempSelectedLanguages);
		setIsLanguageDropdownOpen(false);
	};

	const clearLanguageFilter = () => {
		setTempSelectedLanguages([]);
		setSelectedLanguages([]);
		setPage(1);
		setRefreshKey((prev) => prev + 1);
		setIsLanguageDropdownOpen(false);
	};

	const handleLanguageDropdown = () => {
		setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
	};

	const handleLike = (movieId: number) => {
		console.log("entered handleLike");
		setLikedMovies((prev) => {
			const newLikes = new Set(prev);
			if (newLikes.has(movieId)) {
				newLikes.delete(movieId);
			} else {
				newLikes.add(movieId);
			}
			return newLikes;
		});
	};
	const handlePageChange = () => {
		console.log("likedMovies.size", likedMovies.size);
		if (likedMovies.size) {
			setPage(1);
			setRefreshKey((prev) => prev + 1);
			setLikedMovies(new Set());
		} else {
			setPage((prev) => prev + 1);
		}
	};

	const handleRefresh = () => {
		setPage(1);
		setRefreshKey((k) => k + 1);
	};
	if (!isAuthenticated && !isAuthLoading) {
		return null; // redirecting
	}

	if (loading || isAuthLoading || isCheckingAuth) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
					<p className="text-sm text-gray-600 dark:text-gray-400">Loading your recommendations...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
					<div className="mb-6 flex items-center justify-between gap-3">
						<div className="flex items-center gap-3">
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recommended for you</h1>
							<Sparkles className="h-6 w-6 text-amber-400" />
						</div>
						<button
							type="button"
							onClick={handleRefresh}
							title="Like some movies and click refresh to get new recommendations"
							className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm transition hover:border-gray-900 hover:bg-gray-900 hover:text-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-white dark:hover:text-gray-900"
						>
							{loading && page === 1 ? "Refreshing..." : "Refresh"}
						</button>
					</div>

					{/* Languages Filter */}
					<div className="flex items-center gap-3">
						<label
							htmlFor="languages"
							className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
						>
							Languages
						</label>
						<div className="relative" ref={languageDropdownRef}>
							<button
								type="button"
								onClick={handleLanguageDropdown}
								className="flex min-h-10 w-full items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-left text-sm text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-900 focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-gray-600 min-w-48"
							>
								<span className="truncate">
									{selectedLanguages.length === 0
										? "Select languages"
										: selectedLanguages
												.map(
													(lang: string) =>
														languages.find(
															(opt: { code: string; name: string }) => opt.code === lang
														)?.name || lang
												)
												.join(", ")}
								</span>
								<ChevronDown
									className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
										isLanguageDropdownOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{isLanguageDropdownOpen && (
								<div className="absolute right-0 z-50 mt-2 w-full rounded-xl border border-gray-300 bg-white shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900 min-w-48 sm:w-56">
									<div className="max-h-60 overflow-y-auto p-2">
										{languages.map((option: { code: string; name: string }) => (
											<div
												key={option.code}
												className="flex items-center rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150 dark:text-gray-100 dark:hover:bg-gray-800"
												onClick={() => toggleLanguage(option.code)}
											>
												<input
													type="checkbox"
													checked={tempSelectedLanguages.includes(option.code)}
													onChange={() => {}}
													className="h-4 w-4 rounded border-gray-300 bg-white text-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-offset-gray-900"
												/>
												<span className="ml-3 font-medium">{option.name}</span>
											</div>
										))}
									</div>
									{/* Action Buttons */}
									<div className="border-t border-gray-200 p-2 dark:border-gray-700">
										<div className="flex gap-2">
											<button
												type="button"
												onClick={clearLanguageFilter}
												className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
											>
												Clear
											</button>
											<button
												type="button"
												onClick={applyLanguageFilter}
												className="flex-1 rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-600"
											>
												Apply ({tempSelectedLanguages.length})
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</motion.div>

				{error && (
					<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
						{error}
					</div>
				)}

				{recommendations.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 dark:border-gray-700 dark:bg-gray-900"
					>
						<div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
							<Film className="h-12 w-12 text-gray-400" />
						</div>
						<h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
							No recommendations yet
						</h2>
						<p className="mb-6 max-w-sm text-center text-gray-600 dark:text-gray-400">
							Like or wishlist some movies and check back for personalized picks.
						</p>
						<button
							onClick={() => router.push("/")}
							className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
						>
							Discover Movies
						</button>
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.1 }}
						className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
					>
						{recommendations.map((movie, index) => (
							<MovieCard
								key={movie.id}
								id={movie.id}
								title={movie.title}
								overview={movie.overview}
								posterUrl={movie.posterUrl ?? movie.poster_path}
								index={index}
								onLike={handleLike}
							/>
						))}
					</motion.div>
				)}

				{/* Pagination */}
				{recommendations.length > 0 && (
					<div className="mt-6 flex items-center justify-end gap-3">
						<span className="text-xs text-gray-500 dark:text-gray-400">
							Page {page} of {totalPages}
						</span>
						{page < totalPages && (
							<button
								type="button"
								disabled={loadingMore}
								onClick={handlePageChange}
								className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm transition ${
									likedMovies.size > 0
										? "bg-blue-500 text-white hover:bg-blue-600"
										: "bg-gray-900 text-white hover:bg-gray-800"
								} disabled:cursor-not-allowed disabled:bg-gray-500`}
							>
								{loadingMore ? "Loading..." : likedMovies.size > 0 ? "Refresh Recommendations" : "Next"}
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default RecommendationsPage;
