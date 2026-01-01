export const languages: { code: string; name: string }[] = [
	{ code: "en", name: "English" },

	// Indian Languages
	{ code: "hi", name: "Hindi" },
	{ code: "te", name: "Telugu" },
	{ code: "ta", name: "Tamil" },
	{ code: "ml", name: "Malayalam" },
	{ code: "kn", name: "Kannada" },
	{ code: "mr", name: "Marathi" },
	{ code: "gu", name: "Gujarati" },
	{ code: "bn", name: "Bengali" },
	{ code: "pa", name: "Punjabi" },
	{ code: "ur", name: "Urdu" },
	{ code: "or", name: "Odia" },
	{ code: "as", name: "Assamese" },

	// Popular International Languages
	{ code: "es", name: "Spanish" },
	{ code: "fr", name: "French" },
	{ code: "de", name: "German" },
	{ code: "it", name: "Italian" },
	{ code: "pt", name: "Portuguese" },
	{ code: "ru", name: "Russian" },
	{ code: "ja", name: "Japanese" },
	{ code: "ko", name: "Korean" },
	{ code: "zh", name: "Chinese" },
	{ code: "ar", name: "Arabic" },
];

export const getLanguageName = (code: string): string => {
	const lang = languages.find((l) => l.code === code);
	return lang ? lang.name : code;
};

export const genres: { id: number; name: string }[] = [
	{ id: 28, name: "Action" },
	{ id: 12, name: "Adventure" },
	{ id: 16, name: "Animation" },
	{ id: 35, name: "Comedy" },
	{ id: 80, name: "Crime" },
	{ id: 99, name: "Documentary" },
	{ id: 18, name: "Drama" },
	{ id: 10751, name: "Family" },
	{ id: 14, name: "Fantasy" },
	{ id: 36, name: "History" },
	{ id: 27, name: "Horror" },
	{ id: 10402, name: "Music" },
	{ id: 9648, name: "Mystery" },
	{ id: 10749, name: "Romance" },
	{ id: 878, name: "Science Fiction" },
	{ id: 10770, name: "TV Movie" },
	{ id: 53, name: "Thriller" },
	{ id: 10752, name: "War" },
	{ id: 37, name: "Western" },
];
