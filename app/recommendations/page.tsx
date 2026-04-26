"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Film, ChevronDown } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import ScrollToTop from "@/components/ScrollToTop";
import { useAuth } from "@/src/context/AuthContext";
import { languages, genres } from "@/src/utils/common";

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
	const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
	const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
	const [tempSelectedGenres, setTempSelectedGenres] = useState<number[]>([]);
	const genreDropdownRef = useRef<HTMLDivElement>(null);
	const [preferencesLoaded, setPreferencesLoaded] = useState(false);

	// Load saved preferences from localStorage on mount
	useEffect(() => {
		try {
			const savedLanguages = localStorage.getItem("filter_languages");
			const savedGenres = localStorage.getItem("filter_genres");

			if (savedLanguages) {
				const parsedLanguages = JSON.parse(savedLanguages);
				if (Array.isArray(parsedLanguages)) {
					setSelectedLanguages(parsedLanguages);
				}
			}

			if (savedGenres) {
				const parsedGenres = JSON.parse(savedGenres);
				if (Array.isArray(parsedGenres)) {
					setSelectedGenres(parsedGenres);
				}
			}
		} catch (error) {
			console.error("Error loading preferences from localStorage:", error);
		} finally {
			setPreferencesLoaded(true);
		}
	}, []);

	// Check auth then fetch recommendations
	useEffect(() => {
		const run = async () => {
			if (isAuthLoading) return;
			if (!isAuthenticated) {
				router.push("/login");
				setIsCheckingAuth(false);
				return;
			}
			if (!preferencesLoaded) return; // Wait for localStorage to load

			setIsCheckingAuth(false);
			setLoading(page === 1);
			setLoadingMore(page > 1);
			setError(null);
			try {
				const params = new URLSearchParams();
				if (page) params.set("page", page.toString());
				if (selectedLanguages.length) params.set("languages", selectedLanguages.join(","));
				if (selectedGenres.length) {
					const genreNames = selectedGenres
						.map((id) => genres.find((g) => g.id === id)?.name || "")
						.filter((name) => name !== "");
					if (genreNames.length) params.set("genres", genreNames.join(","));
				}

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
	}, [
		isAuthenticated,
		isAuthLoading,
		router,
		page,
		refreshKey,
		selectedLanguages,
		selectedGenres,
		preferencesLoaded,
	]);

	// Handle click outside for language dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
				// Don't close on outside click, keep selections for user to save
				// setIsLanguageDropdownOpen(false);
			}
			if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
				// Don't close on outside click, keep selections for user to save
				// setIsGenreDropdownOpen(false);
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

	// Sync temp selections when dropdown opens
	useEffect(() => {
		if (isGenreDropdownOpen) {
			setTempSelectedGenres(selectedGenres);
		}
	}, [isGenreDropdownOpen, selectedGenres]);

	const toggleLanguage = (language: string) => {
		setTempSelectedLanguages((prev: string[]) => {
			let newLanguages = prev.includes(language)
				? prev.filter((lang: string) => lang !== language)
				: [...prev, language];
			return newLanguages;
		});
	};

	const toggleGenre = (genreId: number) => {
		setTempSelectedGenres((prev: number[]) => {
			let newGenres = prev.includes(genreId) ? prev.filter((id: number) => id !== genreId) : [...prev, genreId];
			return newGenres;
		});
	};

	const applyLanguageFilter = () => {
		setPage(1);
		setRefreshKey((prev) => prev + 1);
		setSelectedLanguages(tempSelectedLanguages);
		setIsLanguageDropdownOpen(false);

		// Save to localStorage
		try {
			localStorage.setItem("filter_languages", JSON.stringify(tempSelectedLanguages));
		} catch (error) {
			console.error("Error saving languages to localStorage:", error);
		}
	};

	const applyGenreFilter = () => {
		setPage(1);
		setRefreshKey((prev) => prev + 1);
		setSelectedGenres(tempSelectedGenres);
		setIsGenreDropdownOpen(false);

		// Save to localStorage
		try {
			localStorage.setItem("filter_genres", JSON.stringify(tempSelectedGenres));
		} catch (error) {
			console.error("Error saving genres to localStorage:", error);
		}
	};

	const clearLanguageFilter = () => {
		setTempSelectedLanguages([]);
		setSelectedLanguages([]);
		setPage(1);
		setRefreshKey((prev) => prev + 1);
		setIsLanguageDropdownOpen(false);

		// Clear from localStorage
		try {
			localStorage.removeItem("filter_languages");
		} catch (error) {
			console.error("Error clearing languages from localStorage:", error);
		}
	};

	const clearGenreFilter = () => {
		setTempSelectedGenres([]);
		setSelectedGenres([]);
		setPage(1);
		setRefreshKey((prev) => prev + 1);
		setIsGenreDropdownOpen(false);

		// Clear from localStorage
		try {
			localStorage.removeItem("filter_genres");
		} catch (error) {
			console.error("Error clearing genres from localStorage:", error);
		}
	};

	const handleLanguageDropdown = () => {
		setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
	};

	const handleGenreDropdown = () => {
		setIsGenreDropdownOpen(!isGenreDropdownOpen);
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
		setLikedMovies(new Set());
	};
	if (!isAuthenticated && !isAuthLoading) {
		return null; // redirecting
	}

	return (
		<>
			<div className="min-h-screen">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
					<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
						<div className="mb-6 flex items-center justify-between gap-3">
							<div className="flex items-center gap-3">
								<h1 className="text-3xl font-bold text-foreground">Recommended for you</h1>
								<Sparkles className="h-6 w-6 text-accent" />
							</div>
							<button
								type="button"
								onClick={handleRefresh}
								title="Like some movies and click refresh to get new recommendations"
								className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:border-accent hover:bg-accent hover:text-accent-foreground"
							>
								{loading && page === 1 ? "Refreshing..." : "Refresh"}
							</button>
						</div>

						{/* Languages and Genres Filters */}
						<div className="flex items-center gap-3 flex-wrap">
							{/* Languages Filter */}
							<div className="flex items-center gap-3">
								<label
									htmlFor="languages"
									className="text-sm font-medium text-foreground whitespace-nowrap"
								>
									Languages
								</label>
								<div className="relative" ref={languageDropdownRef}>
									<button
										type="button"
										onClick={handleLanguageDropdown}
										className="flex min-h-10 w-full items-center justify-between gap-2 rounded-xl border border-border bg-input px-4 py-2.5 text-left text-sm text-foreground shadow-sm transition-all duration-200 hover:border-accent focus:border-accent focus:outline-none min-w-48"
									>
										<span className="truncate">
											{selectedLanguages.length === 0
												? "Select languages"
												: selectedLanguages
														.map(
															(lang: string) =>
																languages.find(
																	(opt: { code: string; name: string }) =>
																		opt.code === lang,
																)?.name || lang,
														)
														.join(", ")}
										</span>
										<ChevronDown
											className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
												isLanguageDropdownOpen ? "rotate-180" : ""
											}`}
										/>
									</button>

									{isLanguageDropdownOpen && (
										<div className="absolute right-0 z-50 mt-2 w-full rounded-xl border border-border bg-card shadow-xl backdrop-blur-sm min-w-48 sm:w-56">
											<div className="max-h-60 overflow-y-auto p-2">
												{languages.map((option: { code: string; name: string }) => (
													<div
														key={option.code}
														className="flex items-center rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors duration-150"
														onClick={() => toggleLanguage(option.code)}
													>
														<input
															type="checkbox"
															checked={tempSelectedLanguages.includes(option.code)}
															onChange={() => {}}
															className="h-4 w-4 rounded border-border bg-card text-accent focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-card"
														/>
														<span className="ml-3 font-medium">{option.name}</span>
													</div>
												))}
											</div>
											{/* Action Buttons */}
											<div className="border-t border-border p-2">
												<div className="flex gap-2">
													<button
														type="button"
														onClick={clearLanguageFilter}
														className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
													>
														Clear
													</button>
													<button
														type="button"
														onClick={applyLanguageFilter}
														className="flex-1 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground transition hover:bg-accent-hover"
													>
														Apply ({tempSelectedLanguages.length})
													</button>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Genres Filter */}
							<div className="flex items-center gap-3">
								<label
									htmlFor="genres"
									className="text-sm font-medium text-foreground whitespace-nowrap"
								>
									Genres
								</label>
								<div className="relative" ref={genreDropdownRef}>
									<button
										type="button"
										onClick={handleGenreDropdown}
										className="flex min-h-10 w-full items-center justify-between gap-2 rounded-xl border border-border bg-input px-4 py-2.5 text-left text-sm text-foreground shadow-sm transition-all duration-200 hover:border-accent focus:border-accent focus:outline-none min-w-48"
									>
										<span className="truncate">
											{selectedGenres.length === 0
												? "Select genres"
												: selectedGenres
														.map(
															(id: number) =>
																genres.find(
																	(opt: { id: number; name: string }) =>
																		opt.id === id,
																)?.name || id.toString(),
														)
														.join(", ")}
										</span>
										<ChevronDown
											className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
												isGenreDropdownOpen ? "rotate-180" : ""
											}`}
										/>
									</button>

									{isGenreDropdownOpen && (
										<div className="absolute right-0 z-50 mt-2 w-full rounded-xl border border-border bg-card shadow-xl backdrop-blur-sm min-w-48 sm:w-56">
											<div className="max-h-60 overflow-y-auto p-2">
												{genres.map((option: { id: number; name: string }) => (
													<div
														key={option.id}
														className="flex items-center rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors duration-150"
														onClick={() => toggleGenre(option.id)}
													>
														<input
															type="checkbox"
															checked={tempSelectedGenres.includes(option.id)}
															onChange={() => {}}
															className="h-4 w-4 rounded border-border bg-card text-accent focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-card"
														/>
														<span className="ml-3 font-medium">{option.name}</span>
													</div>
												))}
											</div>
											{/* Action Buttons */}
											<div className="border-t border-border p-2">
												<div className="flex gap-2">
													<button
														type="button"
														onClick={clearGenreFilter}
														className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
													>
														Clear
													</button>
													<button
														type="button"
														onClick={applyGenreFilter}
														className="flex-1 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground transition hover:bg-accent-hover"
													>
														Apply ({tempSelectedGenres.length})
													</button>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</motion.div>

					{error && (
						<div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
							{error}
						</div>
					)}

					{/* Movie Cards Area - Show loader only here */}
					{loading ? (
						<div className="flex justify-center py-12">
							<div className="flex flex-col items-center gap-3">
								<Loader2 className="h-8 w-8 animate-spin text-accent" />
								<p className="text-sm text-muted-foreground">Loading recommendations...</p>
							</div>
						</div>
					) : recommendations.length === 0 ? (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-12"
						>
							<div className="mb-4 rounded-full bg-muted p-6">
								<Film className="h-12 w-12 text-muted-foreground" />
							</div>
							<h2 className="mb-2 text-xl font-semibold text-foreground">No recommendations yet</h2>
							<p className="mb-6 max-w-sm text-center text-muted-foreground">
								Like or wishlist some movies and check back for personalized picks.
							</p>
							<button
								onClick={() => router.push("/")}
								className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition hover:bg-accent-hover"
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
					{!loading && recommendations.length > 0 && (
						<div className="mt-6 flex items-center justify-start sm:justify-end gap-3">
							<span className="text-xs text-muted-foreground">
								Page {page} of {totalPages}
							</span>
							{page < totalPages && (
								<button
									type="button"
									disabled={loadingMore}
									onClick={handlePageChange}
									className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm transition ${
										likedMovies.size > 0
											? "bg-accent text-accent-foreground hover:bg-accent-hover"
											: "bg-muted text-foreground hover:bg-accent"
									} disabled:cursor-not-allowed disabled:bg-muted`}
								>
									{loadingMore
										? "Loading..."
										: likedMovies.size > 0
											? "Refresh Recommendations"
											: "Next"}
								</button>
							)}
						</div>
					)}
				</div>
			</div>
			<ScrollToTop />
		</>
	);
};

export default RecommendationsPage;
