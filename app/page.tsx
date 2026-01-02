"use client";

import { useEffect, useMemo, useState, type ChangeEvent, useRef } from "react";
import { useAuth } from "@/src/context/AuthContext";
import MovieCard from "@/components/MovieCard";
import { ChevronDown, X, Heart } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { languages } from "@/src/utils/common";

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
	const [moviesLoading, setMoviesLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
	const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
	const [tempSelectedLanguages, setTempSelectedLanguages] = useState<string[]>([]);
	const languageDropdownRef = useRef<HTMLDivElement>(null);
	const [totalPages, setTotalPages] = useState(1);
	const debouncedSearchQuery = useDebounce(search, 500);

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
		setMovies([]);
		setPage(1);
		setSelectedLanguages(tempSelectedLanguages);
		setIsLanguageDropdownOpen(false);
	};

	const clearLanguageFilter = () => {
		setTempSelectedLanguages([]);
		setSelectedLanguages([]);
		setMovies([]);
		setPage(1);
		setIsLanguageDropdownOpen(false);
	};

	const handleLanguageDropdown = () => {
		setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
	};

	// Fetch movies for current page and auth state
	useEffect(() => {
		let active = true;
		const fetchMovies = async () => {
			setMoviesLoading(true);
			setError(null);
			try {
				const params = new URLSearchParams();

				if (debouncedSearchQuery.trim()) {
					params.set("search", debouncedSearchQuery.trim());
				}

				if (selectedLanguages.length) {
					params.set("languages", selectedLanguages.join(","));
				}

				params.set("page", String(page));

				const endpoint = `/api/movies?${params.toString()}`;
				const res = await fetch(endpoint, { credentials: "include" });
				if (!res.ok) {
					throw new Error("Failed to load movies");
				}
				const data = await res.json();
				if (!active) return;

				const newMovies: Movie[] = Array.isArray(data?.results) ? data.results : [];
				setTotalPages(data?.total_pages && data?.total_pages > 0 ? data?.total_pages : 1);

				setMovies((prevMovies) => [...prevMovies, ...newMovies]);
			} catch (err) {
				if (!active) return;
				setError(err instanceof Error ? err.message : "Unable to load movies right now");
				setMovies([]);
				setTotalPages(1);
			} finally {
				if (active) {
					setMoviesLoading(false);
					setLoadingMore(false);
				}
			}
		};

		fetchMovies();

		return () => {
			active = false;
		};
	}, [isAuthenticated, page, debouncedSearchQuery, selectedLanguages]);

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
				className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
			>
				<div className="aspect-[2/3] w-full bg-gray-200 dark:bg-gray-800" />
				<div className="space-y-3 p-4">
					<div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
					<div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-800" />
					<div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
				</div>
			</div>
		));

	return (
		<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
					<div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 backdrop-blur-sm dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-800">
						<div className="flex items-start gap-3">
							<Heart className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
							<div className="space-y-2">
								<p className="text-sm text-blue-900 dark:text-blue-100">
									<strong>Get Better Recommendations:</strong> Like your favorite movies to help us
									understand your preferences and provide personalized recommendations just for you.
								</p>
								<Link
									href="/recommendations"
									className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-800 hover:text-blue-900 dark:text-blue-200 dark:hover:text-blue-100 transition-colors duration-200"
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

			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
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
			</div>

			{error && (
				<div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 backdrop-blur-sm">
					<p className="text-sm text-red-400" role="alert">
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
				<div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-6 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
					<span className="text-2xl">🎬</span>
					<p className="text-sm font-medium">No movies found</p>
					<p className="text-xs">Try adjusting your filters or check back later for new releases.</p>
				</div>
			)}
			<div className="mt-8 flex items-center justify-end gap-4">
				<span className="text-sm text-muted-foreground">Page {page}</span>
				{page < totalPages && (
					<button
						type="button"
						disabled={moviesLoading || loadingMore}
						onClick={() => {
							setLoadingMore(true);
							setPage((p) => p + 1);
						}}
						className="rounded-full bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
					>
						{loadingMore || moviesLoading ? "Loading..." : "Next"}
					</button>
				)}
			</div>
		</section>
	);
}
