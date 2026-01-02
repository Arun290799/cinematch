import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: Request) {
	if (!BACKEND_URL) {
		return NextResponse.json({ error: "Backend URL is not configured" }, { status: 500 });
	}

	try {
		const url = new URL(request.url);
		const searchParams = url.searchParams;
		const page = searchParams.get("page");
		const languages = searchParams.get("languages");

		const backendParams = new URLSearchParams();
		if (page) backendParams.set("page", page);
		if (languages) backendParams.set("languages", languages);

		const cookie = request.headers.get("cookie");

		const backendRes = await fetch(
			`${BACKEND_URL}/api/movies/recommendations${
				backendParams.toString() ? `?${backendParams.toString()}` : ""
			}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					...(cookie && { cookie }),
				},
				credentials: "include",
			}
		);

		const data = await backendRes.json().catch(() => null);

		return NextResponse.json(data ?? { recommendations: [] }, { status: backendRes.status });
	} catch (error) {
		console.error("Get recommendations error:", error);
		return NextResponse.json({ error: "Internal Server Error", recommendations: [] }, { status: 500 });
	}
}
