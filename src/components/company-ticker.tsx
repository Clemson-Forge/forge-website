"use client";

import Image from "next/image";
import Ticker from "react-ticker";

export default function CompanyTicker() {
	return (
		<Ticker>
			{({ index }) => (
				<div className="flex flex-row items-center">
					{[
						{ src: "/assets/apple.svg", alt: "apple logo" },
						{ src: "/assets/meta.png", alt: "meta logo" },
						{ src: "/assets/visa.png", alt: "visa logo" },
						{
							src: "/assets/verizon.png",
							alt: "verizon logo",
						},
						{
							src: "/assets/intuit.png",
							alt: "intuit logo",
						},
						{
							src: "/assets/michelin.png",
							alt: "michelin logo",
						},
						{
							src: "/assets/clemson.png",
							alt: "clemson logo",
						},
					].map((img, idx) => (
						<div
							key={`ticker-${index}-${idx}`}
							className="flex items-center justify-center h-24 mx-4"
						>
							<Image
								src={img.src}
								alt={img.alt}
								width={80}
								height={80}
								className="max-h-full max-w-full object-contain"
							/>
						</div>
					))}
				</div>
			)}
		</Ticker>
	);
}
