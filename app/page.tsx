export default function Home() {
	return (
		<div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			<h1 className="text-4xl font-bold text-center text-txt-primary sm:text-5xl lg:text-6xl">
				Heading 1 - Primary
			</h1>
			<h1 className="text-4xl font-bold text-center text-txt-secondary sm:text-5xl lg:text-6xl">
				Heading 2 - secondary
			</h1>
			<h1 className="text-4xl font-bold text-center text-txt-tertiary sm:text-5xl lg:text-6xl">
				Heading 3 - tertiary
			</h1>
		</div>
	);
}
