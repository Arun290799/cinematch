"use client";

import { FC, MouseEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Bookmark, Star, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import MovieDetails from "./MovieDetails";
import { useAuth } from "@/src/context/AuthContext";
import { useWishlist } from "@/src/context/WishlistContext";
import { useLike } from "@/src/context/LikeContext";

export type MovieCardProps = {
	id: number;
	title: string;
	overview: string;
	posterUrl?: string | null;
	rating?: number | null;
	year?: number | string | null;
	genres?: string[];
	index?: number;
	onLike?: (movieId: number) => void;
};

const cardVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * 0.05,
			duration: 0.3,
			ease: "easeOut",
		},
	}),
};

const MovieCard: FC<MovieCardProps> = ({
	id,
	title,
	overview,
	posterUrl,
	rating,
	year,
	genres = [],
	index = 0,
	onLike,
}) => {
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const { isInWishlist, toggleWishlist } = useWishlist();
	const { isLiked, toggleLike } = useLike();
	// const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
	const inWishlist = isInWishlist(id);
	const liked = isLiked(id);
	const [isProcessing, setIsProcessing] = useState(false);

	const handleDetails = (e: MouseEvent) => {
		e.stopPropagation();
		setIsDetailsOpen(true);
	};

	const closeDetails = () => {
		setIsDetailsOpen(false);
	};

	const handleWishlistToggle = async (e: MouseEvent) => {
		e.stopPropagation();

		if (!isAuthenticated) {
			router.push("/login");
			return;
		}
		try {
			await toggleWishlist({
				movieId: id,
				title,
				posterUrl: posterUrl || "",
				rating,
				year,
				genres,
				overview,
			});
		} catch (error) {}
	};

	const handleLikeToggle = async (e: MouseEvent) => {
		e.stopPropagation();

		if (!isAuthenticated) {
			router.push("/login");
			return;
		}
		if (isProcessing) return;
		setIsProcessing(true);

		try {
			await toggleLike({
				movieId: id,
				title,
				posterUrl: posterUrl || "",
				rating,
				year,
				genres,
				overview,
			});
			if (onLike) {
				onLike(id);
			}
		} catch (error) {
			console.error("Error toggling like:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<>
			<MovieDetails isOpen={isDetailsOpen} onClose={closeDetails} movieId={id} />
			<motion.article
				layout
				custom={index}
				initial="hidden"
				animate="visible"
				variants={cardVariants}
				whileHover={{ scale: 1.03 }}
				className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition dark:border-gray-800 dark:bg-gray-900"
			>
				{/* Poster */}
				<div
					className="relative aspect-[2/3] w-full overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 cursor-pointer"
					onClick={handleDetails}
				>
					{posterUrl ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={`https://image.tmdb.org/t/p/w500${posterUrl}`}
							alt={title}
							className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-90"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center text-gray-400">
							<PlayCircle className="h-12 w-12 opacity-70" />
						</div>
					)}

					{/* Icon overlay - only on large screens hover */}
					<div className="hidden sm:flex absolute inset-x-0 top-3 justify-between px-3 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto">
						<button
							type="button"
							onClick={handleLikeToggle}
							disabled={isProcessing}
							className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white shadow-md backdrop-blur transition ${
								isProcessing
									? "bg-gray-400 cursor-wait"
									: liked
									? "bg-red-500 hover:bg-red-600"
									: "bg-black/60 hover:bg-black/70"
							}`}
							title={liked ? "Liked" : "Like"}
						>
							{isProcessing ? (
								<span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
							) : (
								<Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
							)}
						</button>
						<button
							type="button"
							onClick={handleWishlistToggle}
							className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white shadow-md backdrop-blur transition ${
								inWishlist ? "bg-emerald-500 hover:bg-emerald-600" : "bg-black/60 hover:bg-emerald-500"
							}`}
							title={inWishlist ? "In Watchlist" : "Watchlist"}
						>
							<Bookmark className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="flex flex-1 flex-col gap-3 p-4">
					<div className="space-y-1 cursor-pointer" onClick={handleDetails}>
						<h2 className="line-clamp-2 text-base font-semibold text-gray-900 dark:text-gray-50">
							{title}
						</h2>
						<p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{overview}</p>
					</div>

					{/* Action buttons - only on small screens */}
					<div className="flex items-center gap-2 mt-auto sm:hidden">
						<button
							type="button"
							onClick={handleLikeToggle}
							disabled={isProcessing}
							className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm transition ${
								isProcessing
									? "bg-gray-100 text-gray-400 cursor-wait"
									: liked
									? "bg-red-50 text-red-600 hover:bg-red-100"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
							title={liked ? "Liked" : "Like"}
						>
							{isProcessing ? (
								<span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
							) : (
								<Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
							)}
						</button>
						<button
							type="button"
							onClick={handleWishlistToggle}
							className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm transition ${
								inWishlist
									? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
							title={inWishlist ? "In Watchlist" : "Watchlist"}
						>
							<Bookmark className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
						</button>
					</div>

					<div className="flex flex-wrap items-center gap-2 text-xs hidden">
						{typeof rating === "number" && (
							<span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-[11px] font-medium text-yellow-500">
								<Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
								<span>{rating.toFixed(1)}</span>
							</span>
						)}
						{year && (
							<span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
								{year}
							</span>
						)}
						{genres.slice(0, 3).map((genre) => (
							<span
								key={genre}
								className="rounded-full bg-gray-900/5 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-700/70 dark:text-gray-200"
							>
								{genre}
							</span>
						))}
					</div>
				</div>
			</motion.article>
		</>
	);
};

export default MovieCard;
