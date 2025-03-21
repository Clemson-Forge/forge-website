export interface Member {
	id: number;
	name: string;
	githubUsername: string;
	image: string;
	linkedin: string;
	year: string;
}

export const members: Member[] = [
	{
		id: 0,
		name: "Ben Cuff",
		githubUsername: "ben-cuff",
		image: "/assets/headshots/ben-cuff.jpg",
		linkedin: "https://www.linkedin.com/in/benjamin-cuff/",
		year: "Sophomore",
	},
	{
		id: 1,
		name: "Uzayr Syed",
		githubUsername: "busa8908",
		image: "/assets/headshots/placeholder.webp",
		linkedin: "https://www.linkedin.com/in/uzayrsyed/",
		year: "Sophomore",
	},
];

export interface Executive {
	id: number;
	name: string;
	role: string;
	image: string;
	linkedin: string;
}

export const executives: Executive[] = [
	{
		id: 0,
		name: "Uzayr Syed",
		role: "President",
		image: "/assets/headshots/placeholder.webp",
		linkedin: "https://www.linkedin.com/in/uzayrsyed/",
	},
	{
		id: 1,
		name: "Uzayr Syed",
		role: "President",
		image: "/assets/headshots/placeholder.webp",
		linkedin: "https://www.linkedin.com/in/uzayrsyed/",
	},
	{
		id: 2,
		name: "Uzayr Syed",
		role: "President",
		image: "/assets/headshots/placeholder.webp",
		linkedin: "https://www.linkedin.com/in/uzayrsyed/",
	},
];

export interface Mentor {
	id: number;
	name: string;
	image: string;
	skills: string;
	linkedin: string;
}

export const mentors: Mentor[] = [
	{
		id: 0,
		name: "Ben Cuff",
		image: "/assets/headshots/ben-cuff.jpg",
		skills: "Web Development, App Development & Machine Learning",
		linkedin: "https://www.linkedin.com/in/benjamin-cuff/",
	},
	{
		id: 1,
		name: "Ben Cuff",
		image: "/assets/headshots/ben-cuff.jpg",
		skills: "Web Development, App Development & Machine Learning",
		linkedin: "https://www.linkedin.com/in/benjamin-cuff/",
	},
	{
		id: 2,
		name: "Ben Cuff",
		image: "/assets/headshots/ben-cuff.jpg",
		skills: "Web Development, App Development & Machine Learning",
		linkedin: "https://www.linkedin.com/in/benjamin-cuff/",
	},
];
