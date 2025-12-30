import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: Request, { params }: { params: Promise<{ movieId: string }> }) {
	if (!BACKEND_URL) {
		return NextResponse.json({ error: "Backend URL is not configured" }, { status: 500 });
	}

	try {
		const movieId = (await params).movieId;

		if (!movieId) {
			return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
		}

		// Make request to backend API
		const backendUrl = `${BACKEND_URL}/api/movies/details/${movieId}`;

		const response = await fetch(backendUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			return NextResponse.json(
				{ error: errorData.error || "Failed to fetch movie details" },
				{ status: response.status }
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching movie details:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
