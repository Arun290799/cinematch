export default function StructuredData() {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "WebSite",
					name: "CineMatch",
					url: "https://cinematch-jade.vercel.app",
				}),
			}}
		/>
	);
}
