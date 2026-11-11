import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

function appendGuestCookie(backendRes: Response, response: NextResponse): void {
	const setCookieHeader = backendRes.headers.get("set-cookie");
	if (setCookieHeader) {
		response.headers.append("set-cookie", setCookieHeader);
	}
}

function backendHeaders(request: Request): HeadersInit {
	const cookie = request.headers.get("cookie");
	return {
		...(cookie && { cookie }),
		"Content-Type": "application/json",
	};
}

async function respondWithBackend(backendRes: Response): Promise<NextResponse> {
	const data = await backendRes.json().catch(() => null);
	const response = NextResponse.json(data ?? { success: backendRes.ok }, { status: backendRes.status });
	appendGuestCookie(backendRes, response);
	return response;
}

export async function GET(request: Request) {
	if (!BACKEND_URL) {
		return NextResponse.json({ error: "Backend URL is not configured" }, { status: 500 });
	}

	try {
		return await respondWithBackend(
			await fetch(`${BACKEND_URL}/api/movies/guest-likes`, {
				headers: backendHeaders(request),
				cache: "no-store",
			}),
		);
	} catch (error) {
		console.error("Get guest likes error:", error);
		return NextResponse.json({ success: false, error: "Failed to fetch guest likes" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	if (!BACKEND_URL) {
		return NextResponse.json({ error: "Backend URL is not configured" }, { status: 500 });
	}

	try {
		const body = await request.json();
		return await respondWithBackend(
			await fetch(`${BACKEND_URL}/api/movies/guest-likes`, {
				method: "POST",
				headers: backendHeaders(request),
				body: JSON.stringify(body),
			}),
		);
	} catch (error) {
		console.error("Add guest like error:", error);
		return NextResponse.json({ success: false, error: "Failed to like movie" }, { status: 500 });
	}
}

export async function DELETE(request: Request) {
	if (!BACKEND_URL) {
		return NextResponse.json({ error: "Backend URL is not configured" }, { status: 500 });
	}

	try {
		const url = new URL(request.url);
		const deleteAll = url.searchParams.get("deleteAll") === "true";
		const body = deleteAll ? undefined : JSON.stringify(await request.json());
		const endpoint = deleteAll ? "guest-likes/all" : "guest-likes";
		return await respondWithBackend(
			await fetch(`${BACKEND_URL}/api/movies/${endpoint}`, {
				method: "DELETE",
				headers: backendHeaders(request),
				...(body && { body }),
			}),
		);
	} catch (error) {
		console.error("Remove guest like error:", error);
		return NextResponse.json({ success: false, error: "Failed to remove guest like" }, { status: 500 });
	}
}
