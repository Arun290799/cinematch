"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { MovieDetails } from "./WishlistContext";

interface LikeContextType {
	likedIds: number[];
	guestLikedMovies: MovieDetails[];
	guestLikeLimit: number;
	isLiked: (movieId: number) => boolean;
	addLike: (movie: MovieDetails) => Promise<void>;
	removeLike: (movieId: number) => Promise<void>;
	toggleLike: (movie: MovieDetails) => Promise<void>;
	clearAllLikes: () => Promise<void>;
	loading: boolean;
	refetchLikes: () => Promise<void>;
}

type GuestLikedMovie = MovieDetails & {
	posterPath?: string | null;
};

type GuestLikesResponse = {
	results?: GuestLikedMovie[];
	likedMovieIds?: number[];
	limit?: number;
};

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [likedIds, setLikedIds] = useState<number[]>([]);
	const [guestLikedMovies, setGuestLikedMovies] = useState<MovieDetails[]>([]);
	const [guestLikeLimit, setGuestLikeLimit] = useState(10);
	const [loading, setLoading] = useState(true);
	const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

	const fetchLikes = useCallback(async () => {
		if (isAuthLoading) return;

		try {
			setLoading(true);
			const response = await fetch(isAuthenticated ? "/api/likedMovies?ids=1" : "/api/guestLikes", {
				credentials: "include",
			});
			const responseData = await response.json();

			if (response.ok) {
				if (isAuthenticated) {
					setLikedIds(responseData?.likedMovieIds || []);
					setGuestLikedMovies([]);
				} else {
					const guestData = responseData as GuestLikesResponse;
					const movies: MovieDetails[] = (guestData.results || []).map((movie) => ({
						...movie,
						posterUrl: movie.posterPath || "",
					}));
					setGuestLikedMovies(movies);
					setLikedIds(guestData.likedMovieIds || movies.map((movie) => movie.movieId));
					setGuestLikeLimit(guestData.limit || 10);
				}
			}
		} catch (error) {
			console.error("Failed to fetch likes:", error);
		} finally {
			setLoading(false);
		}
	}, [isAuthenticated, isAuthLoading]);

	useEffect(() => {
		fetchLikes();
	}, [fetchLikes]);

	const isLiked = useCallback(
		(movieId: number) => likedIds.includes(movieId),
		[likedIds]
	);

	const addLike = useCallback(
		async (movie: MovieDetails) => {
			try {
				const response = await fetch(isAuthenticated ? "/api/likedMovies" : "/api/guestLikes", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(movie),
				});

				if (response.ok) {
					const responseData = await response.json();
					if (Array.isArray(responseData?.likedMovieIds)) {
						setLikedIds(responseData.likedMovieIds);
					} else {
						setLikedIds((prev) => (prev.includes(movie.movieId) ? prev : [...prev, movie.movieId]));
					}
					if (!isAuthenticated) {
						setGuestLikedMovies((prev) =>
							prev.some((likedMovie) => likedMovie.movieId === movie.movieId) ? prev : [movie, ...prev],
						);
					}
				} else {
					const data = await response.json();
					throw new Error(data.error || "Failed to like movie");
				}
			} catch (error) {
				throw error;
			}
		},
		[isAuthenticated]
	);

	const removeLike = useCallback(
		async (movieId: number) => {
			try {
				const response = await fetch(isAuthenticated ? "/api/likedMovies" : "/api/guestLikes", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ movieId }),
				});

				if (response.ok) {
					const responseData = await response.json();
					if (Array.isArray(responseData?.likedMovieIds)) {
						setLikedIds(responseData.likedMovieIds);
					} else {
						setLikedIds((prev) => prev.filter((id) => id !== movieId));
					}
					if (!isAuthenticated) {
						setGuestLikedMovies((prev) => prev.filter((movie) => movie.movieId !== movieId));
					}
				} else {
					const data = await response.json();
					throw new Error(data.error || "Failed to remove like");
				}
			} catch (error) {
				console.error("Remove like error:", error);
				throw error;
			}
		},
		[isAuthenticated]
	);

	const clearAllLikes = useCallback(async () => {
		const response = await fetch(
			isAuthenticated ? "/api/likedMovies?deleteAll=true" : "/api/guestLikes?deleteAll=true",
			{ method: "DELETE", credentials: "include" },
		);
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.error || "Failed to clear liked movies");
		}

		setLikedIds([]);
		if (!isAuthenticated) {
			setGuestLikedMovies([]);
		}
	}, [isAuthenticated]);

	const toggleLike = useCallback(
		async (movie: MovieDetails) => {
			if (isLiked(movie.movieId)) {
				await removeLike(movie.movieId);
			} else {
				await addLike(movie);
			}
		},
		[isLiked, addLike, removeLike]
	);

	const refetchLikes = useCallback(async () => {
		await fetchLikes();
	}, [fetchLikes]);

	return (
		<LikeContext.Provider
			value={{
				likedIds,
				guestLikedMovies,
				guestLikeLimit,
				isLiked,
				addLike,
				removeLike,
				toggleLike,
				clearAllLikes,
				loading,
				refetchLikes,
			}}
		>
			{children}
		</LikeContext.Provider>
	);
};

export const useLike = () => {
	const context = useContext(LikeContext);
	if (context === undefined) {
		throw new Error("useLike must be used within a LikeProvider");
	}
	return context;
};
