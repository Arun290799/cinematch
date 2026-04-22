"use client";

import { FC } from "react";
import MovieCard from "./MovieCard";

export type MovieGridMovie = {
	id: number;
	title: string;
	overview: string;
	poster_path?: string | null;
	rating?: number | null;
	year?: number | string | null;
	genres?: string[];
	slug?: string;
};

interface MovieGridProps {
	movies: MovieGridMovie[];
}

const MovieGrid: FC<MovieGridProps> = ({ movies }) => {
	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{movies.map((movie, index) => (
				<MovieCard
					key={movie.id}
					id={movie.id}
					title={movie.title}
					overview={movie.overview}
					posterUrl={movie.poster_path}
					genres={movie.genres}
					rating={movie.rating}
					year={movie.year}
					index={index}
				/>
			))}
		</div>
	);
};

export default MovieGrid;
