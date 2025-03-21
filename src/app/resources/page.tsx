import Link from "next/link";

export default function ResourcesPage() {
	return (
		<div className="flex min-h-screen flex-col items-center p-8 mt-16">
			<h1 className="text-4xl">Quick Links</h1>
			<h2 className="text-2xl mt-4 mb-2 text-start w-full max-w-2xl font-semibold">
				Career Development
			</h2>

			<div className="w-full max-w-2xl space-y-4 mt-2">
				<div className="flex items-start">
					<Link
						href={
							"https://github.com/SimplifyJobs/Summer2025-Internships"
						}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium min-w-fit mr-2 underline"
					>
						Simplify Job Board
					</Link>
					<p>
						- Exhaustive list of Summer internship programs
						available for CS majors
					</p>
				</div>

				<div className="flex items-start">
					<Link
						href={"https://leetcode.com"}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium min-w-fit mr-2 underline"
					>
						LeetCode
					</Link>
					<p>
						- As much as we all hate it, LeetCode is still the
						standard for prepping for technical interview
					</p>
				</div>

				<div className="flex items-start">
					<Link
						href={
							"https://www.linkedin.com/business/sales/blog/profile-best-practices/17-steps-to-a-better-linkedin-profile-in-2017"
						}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium min-w-fit mr-2 underline"
					>
						Networking/Linkedin Tips
					</Link>
					<p>- Resources to help you improve your LinkedIn profile</p>
				</div>

				<div className="flex items-start">
					<Link
						href={
							"https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs"
						}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium min-w-fit mr-2 underline"
					>
						Resume Template
					</Link>
					<p>
						- Jakes resume is a highly customizable, professional
						resume template written in latex
					</p>
				</div>
			</div>

			<h2 className="text-2xl mt-4 mb-2 text-start w-full max-w-2xl font-semibold">
				University Resources
			</h2>

			<div className="w-full max-w-2xl space-y-4 mt-2">
				<div className="flex items-start">
					<Link
						href={
							"https://media.clemson.edu/studentaffairs/fb/ccpd/careerGuide/19-20/index.html"
						}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium min-w-fit mr-2 underline"
					>
						Career Guide by CCPD
					</Link>
					<p>
						- Walks you through how to write a resume, interview
						skills, and more
					</p>
				</div>
				<div className="flex items-start">
					<Link
						href={"https://career.clemson.edu/events/"}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium min-w-fit mr-2 underline"
					>
						CCPD Events
					</Link>
					<p>
						- These events are designed to help you prepare for your
						future career, events like the career fair can help you
						land internships and more
					</p>
				</div>
			</div>

			<h2 className="text-2xl mt-4 mb-2 text-start w-full max-w-2xl font-semibold">
				Building your Resume
			</h2>

			<div className="w-full max-w-2xl space-y-4 mt-2">
				<div className="flex items-start">
					<Link
						href={"https://mlh.io/"}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium min-w-fit mr-2 underline"
					>
						Hackathons by MLH
					</Link>
					<p>
						- Official student hackathon league behind over 300
						hackathons thorughout the year, including Clemson's
						CUHackit!
					</p>
				</div>

				<div className="flex items-start">
					<Link
						href={
							"https://github.com/practical-tutorials/project-based-learning"
						}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium min-w-fit mr-2 underline"
					>
						Project Based Learning
					</Link>
					<p>
						- A list of programming tutorials in which aspiring
						software developers learn how to build an application
						from scratch
					</p>
				</div>

				<div className="flex items-start">
					<Link
						href={"https://reactnative.dev/"}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium min-w-fit mr-2 underline"
					>
						React Native
					</Link>
					<p>
						- A good jumping off point for getting into mobile
						development while making it easy to switch to web dev
					</p>
				</div>

				<div className="flex items-start">
					<Link
						href={"https://nextjs.org/"}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium min-w-fit mr-2 underline"
					>
						NextJS
					</Link>
					<p>
						- Popular react framework and good starting point for
						learning web dev and react
					</p>
				</div>
			</div>
			<h2 className="text-2xl mt-4 mb-2 text-start w-full max-w-2xl font-semibold">
				Example Projects
			</h2>

			<div className="w-full max-w-2xl space-y-4 mt-2">
				<div className="flex flex-col">
					<Link
						href={
							"https://github.com/ben-cuff/virtual-paper-trading"
						}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium mr-2 underline"
					>
						Paper Trading Web App
					</Link>
					<p className="mb-1">
						Allows users to simulate trading in a risk-free
						environment using virtual currency
					</p>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						<span className="font-semibold">Tech Stack:</span>{" "}
						NextJS, TailwindCSS, PostgreSQL, FastAPi
					</p>
				</div>

				<div className="flex flex-col">
					<Link
						href={"https://github.com/ben-cuff/grind-code"}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium mr-2 underline"
					>
						Grind Code
					</Link>
					<p className="mb-1">
						A Mobile interview prep platform build that utilizes AI.
					</p>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						<span className="font-semibold">Tech Stack:</span> React
						Native, Expo, Prisma, Express
					</p>
				</div>
			</div>
		</div>
	);
}
