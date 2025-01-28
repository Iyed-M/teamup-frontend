import { GalleryVerticalEnd } from "lucide-react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequest, loginRequest } from "@/types/login";
import { useLogin } from "@/hooks/useLogin";
import { Link } from "@tanstack/react-router";
import { Form } from "@/components/ui/form";

export function Login({ className }: { className: string }) {
	const form = useForm<LoginRequest>({
		resolver: zodResolver(loginRequest),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { mutate, error, isPending } = useLogin();

	return (
		<Form {...form}>
			<form
				className={cn(
					"flex flex-col gap-6 bg-red-200 h-full w-full",
					className,
				)}
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
							Don&apos;t have an account?{" "}
							<Link to="/signup" className="text-blue-500">
								Sign up
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
