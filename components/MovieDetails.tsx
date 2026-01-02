"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Calendar, Globe, Clock, Play, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getLanguageName } from "@/src/utils/common";
interface MovieDetailsProps {
	isOpen: boolean;
	onClose: () => void;
	movieId: number;
}

interface MovieDetails {
	id: number;
	title: string;
	overview: string;
	poster_path?: string | null;
	backdrop_path?: string | null;
	rating?: number | null;
	releaseDate?: string;
	genres?: string[];
	language?: string;
	runtime?: number | null;
	tagline?: string;
	status?: string;
	production_companies?: { name: string; logo_path: string | null }[];
	trailer?: {
		key: string;
		name: string;
		site: string;
		type: string;
	} | null;
}

export default function MovieDetails({ isOpen, onClose, movieId }: MovieDetailsProps) {
	const router = useRouter();
	const [movie, setMovie] = useState<MovieDetails | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showTrailer, setShowTrailer] = useState(false);
	useEffect(() => {
		if (!isOpen || !movieId) return;

		const fetchMovieDetails = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch(`/api/details/${movieId}?include_trailer=true`, {
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch movie details");
				}

				const data = await response.json();
				setMovie(data);
			} catch (err) {
				console.error("Error fetching movie details:", err);
				setError("Failed to load movie details. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchMovieDetails();
	}, [isOpen, movieId]);

	const formatRuntime = (minutes: number | null | undefined) => {
		if (!minutes) return "N/A";
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm"
					onClick={onClose}
				>
					<div className="flex min-h-screen items-center justify-center p-4">
						<motion.div
							initial={{ scale: 0.95, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.95, opacity: 0, y: 20 }}
							transition={{ type: "spring", damping: 25, stiffness: 300 }}
							className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-gray-900 shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							{isLoading ? (
								<div className="flex h-96 items-center justify-center">
									<Loader2 className="h-12 w-12 animate-spin text-blue-500" />
								</div>
							) : error ? (
								<div className="flex h-96 flex-col items-center justify-center p-8 text-center">
									<X className="mb-4 h-12 w-12 text-red-500" />
									<h3 className="text-xl font-semibold text-white">Error Loading Movie</h3>
									<p className="mt-2 text-gray-400">{error}</p>
									<button
										onClick={onClose}
										className="mt-6 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
									>
										Close
									</button>
								</div>
							) : movie ? (
								<>
									{/* Backdrop Image */}
									<div className="relative h-64 w-full md:h-80 lg:h-96">
										<div
											className="absolute inset-0 bg-cover bg-center"
											style={{
												backgroundImage: `url(${
													movie.backdrop_path
														? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
														: "/default-backdrop.jpg"
												})`,
											}}
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />

										<button
											onClick={onClose}
											className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
										>
											<X className="h-5 w-5" />
										</button>
									</div>

									<div className="relative -mt-16 px-6 pb-8">
										<div className="flex flex-col gap-6 md:flex-row">
											{/* Movie Poster */}
											<motion.div
												initial={{ y: -20, opacity: 0 }}
												animate={{ y: 0, opacity: 1 }}
												transition={{ delay: 0.2 }}
												className="w-full shrink-0 md:w-1/3 lg:w-1/4"
											>
												{movie.poster_path ? (
													<img
														src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
														alt={movie.title}
														className="h-auto w-full rounded-lg shadow-xl"
													/>
												) : (
													<div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-800 text-gray-400">
														No Image
													</div>
												)}
											</motion.div>

											{/* Movie Info */}
											<div className="flex-1 text-white">
												<motion.h2
													className="text-3xl font-bold"
													initial={{ y: -10, opacity: 0 }}
													animate={{ y: 0, opacity: 1 }}
													transition={{ delay: 0.1 }}
												>
													{movie.title}
												</motion.h2>

												{movie.tagline && (
													<motion.p
														className="mt-2 italic text-gray-400"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														transition={{ delay: 0.15 }}
													>
														{movie.tagline}
													</motion.p>
												)}

												{/* Metadata Row */}
												<motion.div
													className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-300"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 0.2 }}
												>
													{movie.releaseDate && (
														<span className="flex items-center gap-1">
															<Calendar className="h-4 w-4" />
															{new Date(movie.releaseDate).getFullYear()}
														</span>
													)}

													{movie.rating !== undefined && movie.rating !== null && (
														<span className="flex items-center gap-1">
															<Star className="h-4 w-4 text-yellow-400" />
															{movie.rating.toFixed(1)}/10
														</span>
													)}

													{movie.runtime && (
														<span className="flex items-center gap-1">
															<Clock className="h-4 w-4" />
															{formatRuntime(movie.runtime)}
														</span>
													)}

													{movie.language && (
														<span className="flex items-center gap-1">
															<Globe className="h-4 w-4" />
															{getLanguageName(movie.language)}
														</span>
													)}
												</motion.div>

												{/* Genres */}
												{movie.genres && movie.genres.length > 0 && (
													<motion.div
														className="mt-4 flex flex-wrap gap-2"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														transition={{ delay: 0.3 }}
													>
														{movie.genres.map((genre, index) => (
															<span
																key={index}
																className="rounded-full bg-blue-600/30 px-3 py-1 text-xs font-medium text-blue-200"
															>
																{genre}
															</span>
														))}
													</motion.div>
												)}

												{/* Overview */}
												<motion.div
													className="mt-6"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 0.4 }}
												>
													<h3 className="mb-2 text-lg font-semibold">Overview</h3>
													<p className="text-gray-300">
														{movie.overview || "No overview available."}
													</p>
												</motion.div>

												{/* Additional Details */}
												{movie.status && (
													<motion.div
														className="mt-4"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														transition={{ delay: 0.5 }}
													>
														<h3 className="mb-2 text-lg font-semibold">Status</h3>
														<p className="text-gray-300">{movie.status}</p>
													</motion.div>
												)}

												{/* Action Buttons */}
												<motion.div
													className="mt-8 flex flex-wrap gap-3"
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.7 }}
												>
													{movie.trailer && (
														<>
															<button
																className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500/90 to-red-600/90 px-6 py-2.5 font-medium text-white transition hover:from-red-600/95 hover:to-red-700/95 backdrop-blur-sm"
																onClick={() => setShowTrailer(!showTrailer)}
															>
																<Play className="h-5 w-5" />
																{showTrailer ? "Hide Trailer" : "Watch Trailer"}
															</button>

															<button
																className="rounded-lg border border-gray-600/50 bg-gray-800/30 px-6 py-2.5 font-medium text-white transition hover:bg-gray-800/50 hover:border-gray-500/70 backdrop-blur-sm"
																onClick={onClose}
															>
																Close
															</button>
														</>
													)}
												</motion.div>

												{/* Trailer Section */}
												<AnimatePresence>
													{showTrailer && movie.trailer && (
														<motion.div
															initial={{ opacity: 0, height: 0 }}
															animate={{ opacity: 1, height: "auto" }}
															exit={{ opacity: 0, height: 0 }}
															transition={{ duration: 0.3 }}
															className="mt-6 overflow-hidden"
														>
															<div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
																<iframe
																	className="h-full w-full"
																	src={`https://www.youtube.com/embed/${movie.trailer.key}?autoplay=1&rel=0`}
																	title={movie.trailer.name || "Movie Trailer"}
																	frameBorder="0"
																	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
																	allowFullScreen
																/>
															</div>
														</motion.div>
													)}
												</AnimatePresence>
											</div>
										</div>
									</div>
								</>
							) : null}
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
