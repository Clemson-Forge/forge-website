"use client";

import { ProfileForm } from "@/components/profile-form";
import supabase from "@/lib/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect, useState } from "react";

export default function SignInPage() {
	const [sessionReady, setSessionReady] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		let mounted = true;
		supabase.auth.getSession().then(({ data }) => {
			if (!mounted) return;
			setIsLoggedIn(!!data.session);
			setSessionReady(true);
		});
		const { data: sub } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setIsLoggedIn(!!session);
			},
		);
		return () => {
			mounted = false;
			sub.subscription?.unsubscribe();
		};
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-2xl space-y-6">
				{!sessionReady ? (
					<div className="rounded-lg border p-6">
						<p className="text-sm text-muted-foreground">
							Loading…
						</p>
					</div>
				) : !isLoggedIn ? (
					<div className="rounded-lg border p-6">
						<h1 className="text-2xl font-semibold mb-4">
							Create your account
						</h1>
						<p className="text-sm text-muted-foreground mb-6">
							Sign up with your Clemson email to unlock the
							members area.
						</p>
						<Auth
							supabaseClient={supabase}
							appearance={{ theme: ThemeSupa }}
							providers={[]}
							view="sign_up"
						/>
					</div>
				) : (
					<div className="space-y-4">
						<div className="rounded-lg border p-6">
							<h2 className="text-xl font-semibold mb-2">
								Complete your member profile
							</h2>
							<p className="text-sm text-muted-foreground">
								Add your LinkedIn (required) and GitHub
								(optional). Once saved, your info powers the
								member directory and GitHub activity chart.
							</p>
						</div>
						<ProfileForm />
					</div>
				)}
			</div>
		</div>
	);
}
