"use client";

import { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface ActivityItem {
	date: string;
	count: number;
}

export default function GitActivity() {
	const [activityData, setActivityData] = useState<ActivityItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/git-activity");
				const data = await response.json();

				setActivityData(data);
			} catch (error) {
				console.error("Failed to fetch GitHub activity", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, []);

	if (isLoading) {
		return (
			<div className="animate-pulse">
				<div className="flex flex-col">
					<div className="grid grid-cols-26">
						{Array.from({ length: 26 }).map((_, row) => (
							<div key={row} className="flex flex-col gap-0.5">
								{Array.from({ length: 7 }).map((_, col) => (
									<div
										key={`${row}-${col}`}
										className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 bg-gray-200"
									></div>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	const today = new Date();
	const startDate = new Date();
	startDate.setDate(today.getDate() - 26 * 7);

	return (
		<CalendarHeatmap
			startDate={startDate}
			endDate={today}
			values={activityData}
			classForValue={(value) => {
				if (!value || !value.count) {
					return "color-empty";
				}
				const maxCount = Math.max(
					...activityData
						.filter((item) => item && item.count)
						.map((item) => item.count),
				);
				const step = Math.max(1, Math.ceil(maxCount / 8));
				if (value.count <= step) {
					return "color-scale-1";
				} else if (value.count <= step * 2) {
					return "color-scale-2";
				} else if (value.count <= step * 3) {
					return "color-scale-3";
				} else if (value.count <= step * 4) {
					return "color-scale-4";
				} else if (value.count <= step * 5) {
					return "color-scale-5";
				} else if (value.count <= step * 6) {
					return "color-scale-6";
				} else if (value.count <= step * 7) {
					return "color-scale-7";
				} else {
					return "color-scale-8";
				}
			}}
		/>
	);
}
