"use client";

import { ProfileForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabase from "@/lib/supabase";
import { FormEvent, useEffect, useState } from "react";

export default function SignInPage() {
	const [sessionReady, setSessionReady] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [feedback, setFeedback] = useState<string | null>(null);
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

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

	const isSignup = authMode === "signup";

	function handleModeChange(mode: "signup" | "signin") {
		setAuthMode(mode);
		setFeedback(null);
		setStatus("idle");
	}

	async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setStatus("loading");
		setFeedback(null);

		const trimmedEmail = email.trim();
		const normalizedEmail = trimmedEmail.toLowerCase();
		const trimmedName = fullName.trim();

		if (!trimmedEmail || !password) {
			setStatus("error");
			setFeedback("Email and password are required.");
			return;
		}

		if (!normalizedEmail.endsWith("@clemson.edu")) {
			setStatus("error");
			setFeedback("Please use your Clemson email (…@clemson.edu).");
			return;
		}

		if (isSignup && password.length < 6) {
			setStatus("error");
			setFeedback("Password must be at least 6 characters long.");
			return;
		}

		try {
			if (isSignup) {
				const { data, error } = await supabase.auth.signUp({
					email: normalizedEmail,
					password,
					options: {
						data: {
							full_name: trimmedName || undefined,
						},
					},
				});
				if (error) {
					throw error;
				}
				setStatus("success");
				setFeedback(
					data.session
						? "Account created! You are now signed in."
						: "Check your inbox to confirm your email before signing in.",
				);
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email: normalizedEmail,
					password,
				});
				if (error) {
					throw error;
				}
				setStatus("success");
				setFeedback("Signed in successfully. Redirecting…");
			}
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Something went wrong. Please try again.";
			setStatus("error");
			setFeedback(message);
		} finally {
			setStatus((current) => (current === "loading" ? "idle" : current));
		}
	}

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
					<div className="rounded-2xl border bg-card/90 p-6 shadow-sm">
						<div className="flex flex-col gap-2">
							<p className="text-sm uppercase tracking-widest text-muted-foreground">
								Member access
							</p>
							<h1 className="text-3xl font-semibold">
								{isSignup
									? "Create your account"
									: "Welcome back"}
							</h1>
							<p className="text-sm text-muted-foreground">
								{isSignup
									? "Use your Clemson email to unlock the Forge members area."
									: "Sign in with your Clemson email to keep your profile up to date."}
							</p>
						</div>

						<div className="mt-6 flex gap-2 rounded-full border bg-muted/40 p-1 text-sm font-medium">
							<button
								type="button"
								onClick={() => handleModeChange("signup")}
								className={`flex-1 rounded-full px-4 py-2 transition ${
									authMode === "signup"
										? "bg-background text-foreground shadow"
										: "text-muted-foreground"
								}`}
							>
								Sign up
							</button>
							<button
								type="button"
								onClick={() => handleModeChange("signin")}
								className={`flex-1 rounded-full px-4 py-2 transition ${
									authMode === "signin"
										? "bg-background text-foreground shadow"
										: "text-muted-foreground"
								}`}
							>
								Sign in
							</button>
						</div>

						<form
							className="mt-6 space-y-5"
							onSubmit={handleAuthSubmit}
						>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									required
									value={email}
									onChange={(event) =>
										setEmail(event.target.value)
									}
									placeholder="you@clemson.edu"
									className="bg-background text-foreground placeholder:text-muted-foreground/70"
								/>
							</div>

							{isSignup && (
								<div className="space-y-2">
									<Label htmlFor="fullName">Full name</Label>
									<Input
										id="fullName"
										type="text"
										value={fullName}
										onChange={(event) =>
											setFullName(event.target.value)
										}
										placeholder="Jordan Doe"
										className="bg-background text-foreground placeholder:text-muted-foreground/70"
									/>
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={(event) =>
										setPassword(event.target.value)
									}
									placeholder="Create a secure password"
									className="bg-background text-foreground placeholder:text-muted-foreground/70"
									minLength={6}
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={status === "loading"}
							>
								{status === "loading"
									? "Submitting…"
									: isSignup
										? "Create account"
										: "Sign in"}
							</Button>

							{feedback && (
								<p
									className={`text-sm ${
										status === "error"
											? "text-destructive"
											: "text-green-500"
									}`}
								>
									{feedback}
								</p>
							)}
						</form>
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
