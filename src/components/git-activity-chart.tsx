"use client";

import { useEffect, useMemo, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface ActivityItem {
	date: string;
	count: number;
}

export default function GitActivity() {
	const [activityData, setActivityData] = useState<ActivityItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		async function fetchData() {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch("/api/git-activity", {
					cache: "no-store",
				});
				if (!response.ok) {
					throw new Error("Request failed");
				}
				const data = await response.json();
				if (!active) return;
				setActivityData(Array.isArray(data) ? data : []);
			} catch (err) {
				if (!active) return;
				console.error("Failed to fetch GitHub activity", err);
				setError("We couldn't load the activity chart right now.");
				setActivityData([]);
			} finally {
				if (active) setIsLoading(false);
			}
		}

		fetchData();
		return () => {
			active = false;
		};
	}, []);

	const today = new Date();
	const startDate = new Date();
	startDate.setDate(today.getDate() - 26 * 7);

	const maxCount = useMemo(() => {
		const counts = activityData
			.map((item) => item.count)
			.filter((count) => count > 0);
		return counts.length ? Math.max(...counts) : 0;
	}, [activityData]);

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
										className="h-3 w-3 bg-muted sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6"
									></div>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return <p className="text-center text-sm text-destructive">{error}</p>;
	}

	if (activityData.length === 0) {
		return (
			<div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
				No club GitHub activity has been synced yet. Schedule the sync
				job to populate this chart.
			</div>
		);
	}

	return (
		<CalendarHeatmap
			startDate={startDate}
			endDate={today}
			values={activityData}
			classForValue={(value) => {
				if (!value || !value.count || maxCount === 0) {
					return "color-empty";
				}
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
				}
				return "color-scale-8";
			}}
		/>
	);
}
