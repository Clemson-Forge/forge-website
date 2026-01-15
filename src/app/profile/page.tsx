"use client";

import { ProfileForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		let active = true;

		async function ensureSession() {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				router.push("/signin");
				return;
			}

			if (active) {
				setLoading(false);
			}
		}

		ensureSession();

		return () => {
			active = false;
		};
	}, [router]);

	async function handleSignOut() {
		await supabase.auth.signOut();
		router.push("/signin");
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/40 px-4 py-12 mt-14">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
				<header className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm uppercase tracking-wider text-muted-foreground">
							Member hub
						</p>
						<h1 className="text-3xl font-semibold">
							Keep your Forge profile up to date
						</h1>
						<p className="text-sm text-muted-foreground">
							Your info powers the public directory, mentor
							matching, and GitHub activity stats.
						</p>
					</div>
					<div className="flex gap-3">
						<Button asChild variant="outline">
							<Link href="/members">View directory</Link>
						</Button>
						<Button variant="destructive" onClick={handleSignOut}>
							Sign out
						</Button>
					</div>
				</header>

				<div className="rounded-3xl border bg-card/90 p-6 shadow-sm backdrop-blur">
					{loading ? (
						<div className="rounded-2xl border p-6">
							<p className="text-sm text-muted-foreground">
								Loading profile editor…
							</p>
						</div>
					) : (
						<ProfileForm showPreview />
					)}
				</div>
			</div>
		</div>
	);
}
