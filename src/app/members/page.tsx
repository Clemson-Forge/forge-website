import { executives, members, mentors } from "@/models/members";
import Image from "next/image";

export default function MembersPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-between p-8 mt-16">
			<div className="w-full max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold mb-8 text-center">
					Our Executive Team
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{executives.map((executive) => (
						<div
							key={executive.id}
							className="dark:bg-gray-900 bg-gray-300 shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105 duration-300"
						>
							<div className="relative h-48 overflow-hidden">
								<Image
									src={executive.image}
									alt={`headshot for ${executive.name}`}
									fill
									className="object-cover"
								/>
							</div>
							<div className="p-4">
								<h2 className="text-lg font-semibold mb-1">
									{executive.name}
								</h2>
								<p className="text-sm mb-2 font-light">
									{executive.role}
								</p>
								<div className="flex flex-row">
									<div className="w-12 h-1 bg-blue-500 mb-2"></div>
									<a
										href={executive.linkedin}
										target="_blank"
										rel="noopener noreferrer"
										className="ml-auto inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors font-medium"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
										</svg>
									</a>
								</div>
							</div>
						</div>
					))}
				</div>
				<h1 className="text-3xl font-bold mb-8 mt-16 text-center">
					Our Mentors
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{mentors.map((mentor) => (
						<div
							key={mentor.id}
							className="dark:bg-gray-900 bg-gray-300 shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105 duration-300"
						>
							<div className="relative h-48 overflow-hidden">
								<Image
									src={mentor.image}
									alt={`headshot for ${mentor.name}`}
									fill
									className="object-cover"
								/>
							</div>
							<div className="p-4">
								<h2 className="text-lg font-semibold mb-1">
									{mentor.name}
								</h2>
								<p className="text-sm mb-2 font-light">
									{mentor.skills}
								</p>
								<div className="flex flex-row">
									<div className="w-12 h-1 bg-blue-500 mb-2"></div>
									<a
										href={mentor.linkedin}
										target="_blank"
										rel="noopener noreferrer"
										className="ml-auto inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors font-medium"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
										</svg>
									</a>
								</div>
							</div>
						</div>
					))}
				</div>
				<h1 className="text-3xl font-bold mb-8 mt-16 text-center">
					Our Members
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{members.map((member) => (
						<div
							key={member.id}
							className="dark:bg-gray-900 bg-gray-300 shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105 duration-300"
						>
							<div className="relative h-48 overflow-hidden">
								<Image
									src={member.image}
									alt={`headshot for ${member.name}`}
									fill
									className="object-cover"
								/>
							</div>
							<div className="p-4">
								<h2 className="text-lg font-semibold mb-1">
									{member.name}
								</h2>
								<p className="text-sm mb-2 font-light">
									{member.year}
								</p>
								<div className="flex flex-row">
									<div className="w-12 h-1 bg-blue-500 mb-2"></div>
									<a
										href={`https://github.com/${member.githubUsername}`}
										target="_blank"
										rel="noopener noreferrer"
										className="ml-auto inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors font-medium"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="currentColor"
											className="text-gray-900 dark:text-white"
										>
											<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
										</svg>
									</a>
									{member.linkedin && (
										<a
											href={member.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="ml-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors font-medium"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="currentColor"
											>
												<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
											</svg>
										</a>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
