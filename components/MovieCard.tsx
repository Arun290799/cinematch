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
				className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition"
			>
				{/* Poster */}
				<div
					className="relative aspect-[2/3] w-full overflow-hidden bg-gradient-to-br from-muted via-muted to-background cursor-pointer"
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
						<div className="flex h-full w-full items-center justify-center text-muted-foreground">
							<PlayCircle className="h-12 w-12 opacity-70" />
						</div>
					)}

					{/* Icon overlay - only on large screens hover */}
					<div className="hidden sm:flex absolute inset-x-0 top-3 justify-between px-3 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto">
						<button
							type="button"
							onClick={handleLikeToggle}
							disabled={isProcessing}
							className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-foreground shadow-md backdrop-blur transition ${
								isProcessing
									? "bg-muted text-muted-foreground cursor-wait"
									: liked
										? "bg-destructive/10 text-destructive hover:bg-destructive/20"
										: "bg-muted text-muted-foreground hover:bg-accent/20"
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
							className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-foreground shadow-md backdrop-blur transition ${
								inWishlist
									? "bg-accent/10 text-accent hover:bg-accent/20"
									: "bg-muted text-muted-foreground hover:bg-accent/20"
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
						<h2 className="line-clamp-2 text-base font-semibold text-foreground">{title}</h2>
						<p className="line-clamp-2 text-xs text-muted-foreground">{overview}</p>
					</div>

					{/* Action buttons - only on small screens */}
					<div className="flex items-center gap-2 mt-auto sm:hidden">
						<button
							type="button"
							onClick={handleLikeToggle}
							disabled={isProcessing}
							className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm transition ${
								isProcessing
									? "bg-muted text-muted-foreground cursor-wait"
									: liked
										? "bg-destructive/10 text-destructive hover:bg-destructive/20"
										: "bg-muted text-muted-foreground hover:bg-accent/20"
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
									? "bg-accent/10 text-accent hover:bg-accent/20"
									: "bg-muted text-muted-foreground hover:bg-accent/20"
							}`}
							title={inWishlist ? "In Watchlist" : "Watchlist"}
						>
							<Bookmark className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
						</button>
					</div>

					<div className="flex flex-wrap items-center gap-2 text-xs hidden">
						{typeof rating === "number" && (
							<span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
								<Star className="h-3 w-3 fill-accent text-accent" />
								<span>{rating.toFixed(1)}</span>
							</span>
						)}
						{year && (
							<span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
								{year}
							</span>
						)}
						{genres.slice(0, 3).map((genre) => (
							<span
								key={genre}
								className="rounded-full bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
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
