import { GalleryVerticalEnd } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/hooks/use-signup";
import { cn } from "@/lib/utils";
import { signupRequest } from "@/types/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { z } from "zod";

type SignupRequest = z.infer<typeof signupRequest>;
export function Signup({ className }: { className: string }) {
	const form = useForm<SignupRequest>({
		resolver: zodResolver(signupRequest),
		defaultValues: {
			email: "",
			password: "",
			username: "",
		},
	});

	const { mutate, error, isPending } = useSignup();

	return (
		<Form {...form}>
			<form
				className={cn("flex flex-col gap-6  h-full w-full", className)}
				onSubmit={form.handleSubmit((v) => mutate(v))}
			>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<div className="flex flex-col items-center gap-2 font-medium">
							<div className="flex h-8 w-8 items-center justify-center rounded-md">
								<GalleryVerticalEnd className="size-6" />
							</div>
							<span className="sr-only">Team Up.</span>
						</div>
						<h1 className="text-xl font-bold">Welcome to Team Up.</h1>
						<div className="text-center text-sm">
							have an account?{" "}
							<Link to="/login" className="underline underline-offset-4">
								Login
							</Link>
							{error && (
								<p className="text-sm text-red-500">
									{error?.response?.data.error}
								</p>
							)}
						</div>
					</div>
					<div className="flex flex-col gap-6">
						<div className="grid gap-2">
							<Label htmlFor="username">Username</Label>
							<Input id="username" {...form.register("username")} />
							{form.formState.errors.username && (
								<p className="text-sm text-red-500">
									{form.formState.errors.username.message}
								</p>
							)}
						</div>
						<div className="grid gap-2">
							{form.formState.errors.root && (
								<p className="text-sm text-red-500">
									{form.formState.errors.root.message}
								</p>
							)}
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								{...form.register("email")}
							/>
							{form.formState.errors.email && (
								<p className="text-sm text-red-500">
									{form.formState.errors.email.message}
								</p>
							)}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								{...form.register("password")}
							/>
							{form.formState.errors.password && (
								<p className="text-sm text-red-500">
									{form.formState.errors.password.message}
								</p>
							)}
						</div>
						<Button type="submit" className="w-full" disabled={isPending}>
							Login
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
