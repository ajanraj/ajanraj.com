"use client";

const quotes = [
	{
		text: "Going to bed at night saying I've done something wonderful, that's what matters to me.",
		author: "Steve Jobs",
		date: "2025-01-01",
	},
	{
		text: "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma - which is living with the results of other people's thinking.",
		author: "Steve Jobs",
		date: "2025-01-02",
	},
	{
		text: "There is nothing impossible to him who will try.",
		author: "Alexander the Great",
		date: "2025-01-03",
	},
	{
		text: "We suffer more often in imagination than in reality.",
		author: "Seneca",
		date: "2025-01-04",
	},
	{
		text: "If a man knows not to which port he sails, no wind is favorable.",
		author: "Seneca",
		date: "2025-01-05",
	},
	{
		text: "Waste no more time arguing what a good man should be. Be One.",
		author: "Marcus Aurelius",
		date: "2025-01-06",
	},
	{
		text: "It never ceases to amaze me: We all love ourselves more than other people, but care more about their opinion than our own.",
		author: "Marcus Aurelius",
		date: "2025-01-07",
	},
	{
		text: "Don't tell people how to do things, tell them what to do and let them surprise you with their results.",
		author: "Phil Knight",
		date: "2025-01-08",
	},
	{
		text: "You know, sometimes all you need is twenty seconds of insane courage. Just literally twenty seconds of just embarrassing bravery. And I promise you, something great will come of it.",
		author: "Benjamin Mee",
		date: "2025-01-09",
	},
];

export default function QuotesPage() {
	const sortedQuotes = quotes.sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	);

	return (
		<main className="border-t border-dashed px-8 pt-8">
			<div className="relative">
				<svg
					aria-label="Quote marks decoration"
					className="-z-10 -top-8 -left-10 absolute h-14 w-14 text-muted"
					viewBox="0 0 512.5 512.5"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Quote marks</title>
					<g>
						<path
							d="M112.5,208.25c61.856,0,112,50.145,112,112s-50.144,112-112,112s-112-50.145-112-112l-0.5-16   c0-123.712,100.288-224,224-224v64c-42.737,0-82.917,16.643-113.137,46.863c-5.817,5.818-11.126,12.008-15.915,18.51   C100.667,208.723,106.528,208.25,112.5,208.25z M400.5,208.25c61.855,0,112,50.145,112,112s-50.145,112-112,112   s-112-50.145-112-112l-0.5-16c0-123.712,100.287-224,224-224v64c-42.736,0-82.918,16.643-113.137,46.863   c-5.818,5.818-11.127,12.008-15.916,18.51C388.666,208.723,394.527,208.25,400.5,208.25z"
							fill="currentColor"
						/>
					</g>
				</svg>
				<h1 className="font-medium text-4xl tracking-tight">Quotes</h1>
				<p className="mt-2 text-muted-foreground">
					Some quotes that I find interesting or inspiring.
				</p>
			</div>
			<ul className="mt-10 space-y-8">
				{sortedQuotes.map((quote, _i) => (
					<li className="font-serif" key={quote.text}>
						<blockquote className="italic">{quote.text}</blockquote>
						<p className="mt-1 text-muted-foreground">—{quote.author}</p>
					</li>
				))}
			</ul>
		</main>
	);
}
