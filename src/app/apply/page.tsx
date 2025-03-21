"use client";

import { Chrono } from "react-chrono";

export default function ApplyPage() {
	return (
		<div className="flex min-h-screen flex-col items-center p-8 mt-16">
			<h1 className="text-3xl font-bold mb-8 mt-4">
				Application Process
			</h1>
			<div className="mb-10 text-center flex flex-row">
				<p className="text-lg mb-4 mr-1">
					Fill out the following form to apply as a mentor or mentee:
				</p>
				<a
					href="https://forms.gle/YourFormLinkHere"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-block text-lg underline"
				>
					Apply Now
				</a>
			</div>
			<Chrono
				items={[
					{
						title: "August 16th",
						cardTitle: "Applications open",
						cardSubtitle:
							"Applications for Mentors and Mentees open for the fall semester.",
					},
					{
						title: "September 1st",
						cardTitle: "Applications Close",
						cardSubtitle: `The executive team will review applications and may reach out for an interview or for more information.`,
					},
					{
						title: "September 8th",
						cardTitle: "Mentees and Mentors Announced",
						cardSubtitle: `Mentees will be notified if they have been chosen. Unfortunately space is limited due to a limited number of mentors.`,
					},
					{
						title: "September 12th",
						cardTitle: "Initial Meeting/kickoff",
						cardSubtitle: `Mentors will introduce themselves and you'll have the chance to discuss project ideas and more.`,
					},
					{
						title: "September 15th",
						cardTitle: "Mentor/Mentee Pairings announced",
						cardSubtitle: `Mentees and Mentors will be notified as to whom they have been paired with. At this point the Mentor will take over`,
					},
				]}
				mode="VERTICAL_ALTERNATING"
				cardHeight={50}
				disableToolbar
			/>
		</div>
	);
}
