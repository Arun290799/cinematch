"use client";

import { useEffect, useMemo, useState, useCallback, type ChangeEvent, useRef } from "react";
import { useAuth } from "@/src/context/AuthContext";
import MovieCard from "@/components/MovieCard";
import ScrollToTop from "@/components/ScrollToTop";
import { ChevronDown, X, Heart } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { languages, genres } from "@/src/utils/common";
import { popularMovieSlugs } from "@/lib/seo/movies";

type Movie = {
	id: number;
	title: string;
	overview: string;
	poster_path?: string | null;
	rating?: number | null;
	year?: number | string | null;
	genres?: string[];
	language?: string | null;
};

export default function Home() {
	const { isAuthenticated, isLoading } = useAuth();
	const [movies, setMovies] = useState<Movie[]>([]);
	const [page, setPage] = useState(1);
	const [moviesLoading, setMoviesLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
	const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
	const [tempSelectedLanguages, setTempSelectedLanguages] = useState<string[]>([]);
	const languageDropdownRef = useRef<HTMLDivElement>(null);
	const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
	const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
	const [tempSelectedGenres, setTempSelectedGenres] = useState<number[]>([]);
	const genreDropdownRef = useRef<HTMLDivElement>(null);
	const [totalPages, setTotalPages] = useState(1);
	const debouncedSearchQuery = useDebounce(search, 500);
	const [preferencesLoaded, setPreferencesLoaded] = useState(false);
	const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
	const [randomSlugs, setRandomSlugs] = useState<string[]>([]);

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

	// Fetch first 3 popular movies from API and set random slugs
	useEffect(() => {
		const fetchPopularMovies = async () => {
			try {
				const res = await fetch("/api/movies?page=1", { credentials: "include" });
				if (res.ok) {
					const data = await res.json();
					const items = Array.isArray(data?.results) ? data.results : [];
					setPopularMovies(items.slice(0, 3));
				}
			} catch (error) {
				console.error("Error fetching popular movies:", error);
			}
		};

		fetchPopularMovies();

		// Get 2 random slugs from popularMovieSlugs
		const shuffled = [...popularMovieSlugs].sort(() => 0.5 - Math.random());
		setRandomSlugs(shuffled.slice(0, 2));
	}, []);

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
		setMovies([]);
		setPage(1);
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
		setMovies([]);
		setPage(1);
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
		setMovies([]);
		setPage(1);
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
		setMovies([]);
		setPage(1);
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

	// Fetch movies for current page and auth state
	const fetchMovies = useCallback(
		async (isLoadMore = false) => {
			if (!preferencesLoaded) return;

			// Prevent multiple simultaneous requests
			if (isLoadMore ? loadingMore : moviesLoading) return;

			setError(null);
			if (!isLoadMore) {
				setMoviesLoading(true);
			} else {
				setLoadingMore(true);
			}

			try {
				const params = new URLSearchParams();

				if (debouncedSearchQuery.trim()) {
					params.set("search", debouncedSearchQuery.trim());
				}

				if (selectedLanguages.length) {
					params.set("languages", selectedLanguages.join(","));
				}

				if (selectedGenres.length) {
					params.set("genres", selectedGenres.join(","));
				}

				params.set("page", String(page));

				const endpoint = `/api/movies?${params.toString()}`;
				const res = await fetch(endpoint, { credentials: "include" });

				if (!res.ok) {
					throw new Error("Failed to load movies");
				}
				const data = await res.json();

				const newMovies: Movie[] = Array.isArray(data?.results) ? data.results : [];
				setTotalPages(data?.total_pages && data?.total_pages > 0 ? data?.total_pages : 1);

				// Only append if loading more, otherwise replace
				if (isLoadMore && page > 1) {
					setMovies((prevMovies) => [...prevMovies, ...newMovies]);
				} else {
					setMovies(newMovies);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unable to load movies right now");
				setMovies([]);
				setTotalPages(1);
			} finally {
				setMoviesLoading(false);
				setLoadingMore(false);
			}
		},
		[preferencesLoaded, debouncedSearchQuery, selectedLanguages, selectedGenres, page],
	);

	useEffect(() => {
		// Determine if this is a load more operation or fresh fetch
		const isLoadMore = page > 1;
		fetchMovies(isLoadMore);
	}, [
		isAuthenticated,
		page,
		debouncedSearchQuery,
		selectedLanguages,
		selectedGenres,
		preferencesLoaded,
		fetchMovies,
	]);

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setMovies([]);
		setPage(1);
		setSearch(e.target.value);
	};

	const showLoading = isLoading || moviesLoading;

	const renderSkeletons = (count: number) =>
		Array.from({ length: count }).map((_, i) => (
			<div
				key={i}
				className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
			>
				<div className="aspect-[2/3] w-full bg-muted" />
				<div className="space-y-3 p-4">
					<div className="h-4 w-3/4 rounded bg-muted" />
					<div className="h-3 w-full rounded bg-muted" />
					<div className="h-3 w-5/6 rounded bg-muted" />
				</div>
			</div>
		));

	return (
		<>
			<section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
				<div className="mb-8 space-y-4">
					<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Discover Movies</h1>
					{!isAuthenticated && (
						<div className="rounded-xl bg-card/50 border border-border p-4 backdrop-blur-sm">
							<p className="text-muted-foreground">
								Sign in to get personalized recommendations tailored just for you
							</p>
						</div>
					)}
					{isAuthenticated && (
						<div className="rounded-xl bg-gradient-to-r from-accent/10 to-accent/20 border border-accent/30 p-4 backdrop-blur-sm">
							<div className="flex items-start gap-3">
								<Heart className="h-5 w-5 text-accent mt-0.5 shrink-0" />
								<div className="space-y-2">
									<p className="text-sm text-foreground">
										<strong>Get Better Recommendations:</strong> Like your favorite movies to help
										us understand your preferences and provide personalized recommendations just for
										you.
									</p>
									<Link
										href="/recommendations"
										className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200"
									>
										View Your Recommendations
										<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</Link>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="mb-8 space-y-4">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex-1">
							<div className="relative">
								<input
									type="text"
									value={search}
									onChange={handleSearchChange}
									placeholder="Search movies by title..."
									className="w-full rounded-xl border border-border bg-input px-4 py-3 pr-12 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all duration-200 focus:border-accent focus:outline-none"
								/>
								<div className="absolute right-3 top-1/2 -translate-y-1/2">
									<svg
										className="h-5 w-5 text-muted-foreground"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</div>
							</div>
						</div>

						{/* Filters */}
						<div className="flex items-center gap-4 flex-wrap">
							{/* Languages Filter */}
							<div className="flex items-center gap-2">
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
							<div className="flex items-center gap-2">
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
					</div>
				</div>

				{error && (
					<div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 backdrop-blur-sm">
						<p className="text-sm text-destructive" role="alert">
							{error}
						</p>
					</div>
				)}

				<div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{movies.map((movie, index) => (
						<MovieCard
							key={movie.id}
							id={movie.id}
							title={movie.title}
							overview={movie.overview}
							posterUrl={movie.poster_path}
							genres={movie.genres}
							index={index}
						/>
					))}

					{showLoading && renderSkeletons(8)}
				</div>

				{!showLoading && movies.length === 0 && !error && (
					<div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground">
						<span className="text-2xl">🎬</span>
						<p className="text-sm font-medium">No movies found</p>
						<p className="text-xs">Try adjusting your filters or check back later for new releases.</p>
					</div>
				)}
				<div className="mt-8 flex items-center justify-start sm:justify-end gap-4">
					<span className="text-sm text-muted-foreground">Page {page}</span>
					{page < totalPages && (
						<button
							type="button"
							disabled={moviesLoading || loadingMore}
							onClick={() => {
								setPage((p) => p + 1);
							}}
							className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-muted"
						>
							{loadingMore || moviesLoading ? "Loading..." : "Next"}
						</button>
					)}
				</div>

				{/* Movies Like Section */}
				<div className="mt-12 rounded-xl bg-card/50 border border-border p-8 backdrop-blur-sm">
					<h3 className="text-xl font-semibold text-foreground mb-4">Explore Movies Like</h3>
					<div className="flex flex-wrap gap-4">
						{popularMovies.map((movie) => (
							<Link
								key={movie.id}
								href={`/movies-like/${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
								className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
							>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
									/>
								</svg>
								Movies Like {movie.title}
							</Link>
						))}
						{randomSlugs.map((slug) => (
							<Link
								key={slug}
								href={`/movies-like/${slug}`}
								className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
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
			</section>
			<ScrollToTop />
		</>
	);
}
