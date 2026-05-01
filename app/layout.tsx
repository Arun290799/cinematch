import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { AuthProvider } from "@/src/context/AuthContext";
import { isAuthenticated } from "@/src/lib/auth";
import ClientAuthInit from "@/components/ClientAuthInit";
import { WishlistProvider } from "@/src/context/WishlistContext";
import { LikeProvider } from "@/src/context/LikeContext";
import ConditionalNavBar from "@/components/ConditionalNavBar";
import ConditionalMain from "@/components/ConditionalMain";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
	title: "CineMatch - AI-Powered Movie Recommendations | Discover Your Next Favorite Film",
	description:
		"Discover personalized movie recommendations with CineMatch. Browse thousands of movies, get AI-powered suggestions based on your preferences, and build your perfect watchlist. Sign up for free!",
	keywords: [
		"movie recommendations",
		"AI movie suggestions",
		"personalized movies",
		"movie discovery",
		"film recommendations",
		"watchlist",
		"movie streaming",
		"cinema",
		"film finder",
		"movie app",
		"entertainment",
		"movie genres",
		"movie ratings",
	],
	authors: [{ name: "CineMatch Team" }],
	creator: "CineMatch",
	publisher: "CineMatch",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://cinematch-jade.vercel.app"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://cinematch-jade.vercel.app",
		title: "CineMatch - AI-Powered Movie Recommendations",
		description:
			"Discover personalized movie recommendations with CineMatch. Browse thousands of movies, get AI-powered suggestions based on your preferences, and build your perfect watchlist.",
		siteName: "CineMatch",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "CineMatch - AI Movie Recommendation App",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "CineMatch - AI-Powered Movie Recommendations",
		description:
			"Discover personalized movie recommendations with CineMatch. Browse thousands of movies and get AI-powered suggestions.",
		images: ["/logo.png"],
		creator: "@cinematch",
	},
	verification: {
		google: "koZPZMIKXDUY8Cu5pQpgjfLLFaeljTy-LFb6q5h5LPw",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Server-side check for initial render; client will revalidate via AuthProvider.
	const authed = await isAuthenticated();

	return (
		<html lang="en">
			<head>
				<StructuredData />
			</head>
			<body className="min-h-screen bg-background text-foreground antialiased">
				<ThemeProvider>
					<AuthProvider>
						<ClientAuthInit />
						<WishlistProvider>
							<LikeProvider>
								<div className="relative flex min-h-screen flex-col">
									<ConditionalNavBar authed={authed} />
									<main className="flex-1">
										<ConditionalMain>{children}</ConditionalMain>
									</main>
									<Footer />
								</div>
							</LikeProvider>
						</WishlistProvider>
					</AuthProvider>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
