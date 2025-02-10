import { getProjectTasks } from "@/api/get-project-tasks";
import { Card, CardHeader } from "@/components/ui/card";
import { useProjectTasks } from "@/state/task-store";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/projects/$projectId")({
	loader({ params }) {
		getProjectTasks(params.projectId);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const id = useParams({ from: "/_auth/projects/$projectId" }).projectId;
	const tasks = useProjectTasks(id);
	console.log("TASKS", tasks);
	return tasks.map((t) => (
		<Card key={t.id}>
			<CardHeader>{t.id}</CardHeader>
			users:
			{t.users.map((u) => (
				<div key={u.id}>{u.id}</div>
			))}
		</Card>
	));
}
