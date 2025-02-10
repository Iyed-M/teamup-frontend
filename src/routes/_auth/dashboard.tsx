import { api } from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProject } from "@/hooks/use-create-project";
import { useJoinProject } from "@/hooks/use-join-project";
import { useProjectStore } from "@/state/project-store";
import { CreateProjectReq, createProjectReq } from "@/types/create-project";
import { projectSchema } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/_auth/dashboard")({
	loader: async () => {
		try {
			const projects = await api({
				method: "GET",
				path: "/projects",
				responseSchema: projectSchema.array(),
			})(undefined);
			useProjectStore.setState({ projects });
		} catch (e) {
			console.log(e);
		}
	},
	component: Dashboard,
});

function CreateProjectDialog() {
	const [open, setOpen] = useState(false);
	const form = useForm<CreateProjectReq>({
		resolver: zodResolver(createProjectReq),
		defaultValues: {
			color: "",
			name: "",
		},
	});

	const { mutate, isPending } = useCreateProject({
		onSuccess: () => {
			if (open) setOpen(false);
		},
	});

	return (
		<Dialog modal open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<Button variant="default">
					<PlusCircle className="mr-2 h-4 w-4" />
					Create Project
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new project</DialogTitle>
					<DialogDescription>
						Create a new project to start collaborating with others.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={form.handleSubmit((data) => {
						mutate(data);
					})}
					className="space-y-4"
				>
					<div>
						<Label htmlFor="name">Project Name</Label>
						<Input
							id="name"
							{...form.register("name")}
							placeholder="My Awesome Project"
						/>
					</div>
					<div>
						<Label htmlFor="color">Description</Label>
						<Input
							id="color"
							{...form.register("color")}
							placeholder="Color of your project"
						/>
					</div>
					<Button type="submit" disabled={isPending}>
						Create Project
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
function JoinProjectDialog() {
	const [open, setOpen] = useState(false);
	const form = useForm<{ projectId: string }>();

	const { mutate, isPending } = useJoinProject({
		onSuccess: () => {
			setOpen(false);
		},
	});

	return (
		<Dialog modal open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<UserPlus className="mr-2 h-4 w-4" />
					Join Project
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Join a project</DialogTitle>
					<DialogDescription>
						Enter the project ID to join an existing project.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={form.handleSubmit((data) => {
						mutate(data);
					})}
					className="space-y-4"
				>
					<div>
						<Label htmlFor="projectId">Project ID</Label>
						<Input
							id="projectId"
							{...form.register("projectId")}
							placeholder="Enter project ID"
						/>
					</div>
					<Button type="submit" disabled={isPending}>
						Join Project
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function Dashboard() {
	const projects = useProjectStore((s) => s.projects);

	return (
		<div className="container py-8">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-3xl font-bold">My Projects</h1>
				<div className="flex gap-2">
					<CreateProjectDialog />
					<JoinProjectDialog />
				</div>
			</div>

			{!projects || projects.length === 0 ? (
				<Card>
					<CardHeader>
						<CardTitle>No Projects Yet</CardTitle>
						<CardDescription>
							Create a new project or join an existing one to get started.
						</CardDescription>
					</CardHeader>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{projects.map((project) => (
						<Card key={project.id}>
							<CardHeader>
								<CardTitle>
									<Badge
										style={{
											background: project.color ? project.color : undefined,
										}}
									>
										{project.name}
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Link
									to="/projects/$projectId"
									params={{ projectId: project.id }}
								>
									<Button className="w-full" variant="secondary">
										View Project
									</Button>
								</Link>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
