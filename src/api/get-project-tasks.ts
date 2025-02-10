import { subTaskSchema, taskWithUsers } from "@/types/project";
import { z } from "zod";
import { api } from "./api";
import { useTaskStore } from "@/state/task-store";

export async function getProjectTasks(projectId: string) {
	try {
		const data = await api({
			method: "GET",
			path: `/projects/${projectId}/tasks`,
			responseSchema: z.object({
				subTasks: subTaskSchema.array(),
				tasks: taskWithUsers.array(),
			}),
		})(undefined);

		useTaskStore.setState((s) => ({
			...s,
			fetchedProjectTasks: [...s.fetchedProjectTasks, projectId],
			subTasks: [...s.subTasks, ...data.subTasks],
			tasks: [...s.tasks, ...data.tasks],
		}));
	} catch (e) {
		console.error(e);
	}
}
