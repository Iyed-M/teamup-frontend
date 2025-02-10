import { SubTask, Task, TaskWithUsers } from "@/types/project";
import { User } from "@/types/user";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TaskStore {
	tasks: TaskWithUsers[];
	fetchedProjectTasks: string[];
	subTasks: SubTask[];

	actions: {
		addFetchedProject: (projectId: string) => void;
		setTasks: (tasks: TaskWithUsers[]) => void;
		addSubTask: (taskId: string, subTaskId: string) => void;
		removeSubTask: (subTask: SubTask) => void;
		addTask: (task: TaskWithUsers) => void;
		addUser: (taskId: string, user: User) => void;
		removeTask: (taskId: string) => void;
		updateTask: (taskId: string, task: Partial<Task>) => void;
		clear: () => void;
	};
}

export const useTaskStore = create<TaskStore>()(
	devtools((set) => ({
		tasks: [],
		fetchedProjectTasks: [],
		subTasks: [],

		actions: {
			setTasks: (tasks) => set({ tasks }),

			addUser(taskId, user) {
				set((s) => {
					const taskIdx = s.tasks.findIndex((task) => task.id === taskId);
					const updatedTask: TaskWithUsers = {
						...s.tasks[taskIdx],
						users: [...s.tasks[taskIdx].users, user],
					};
					return {
						...s,
						tasks: [
							...s.tasks.slice(0, taskIdx),
							updatedTask,
							...s.tasks.slice(taskIdx + 1),
						],
					};
				});
			},

			updateTask: (taskId, task) =>
				set((state) => {
					const idx = state.tasks.findIndex((task) => task.id === taskId);
					return {
						...state,
						tasks: [
							...state.tasks.slice(0, idx),
							{
								...state.tasks[idx],
								...task,
							},
							...state.tasks.slice(idx + 1),
						],
					};
				}),

			clear() {
				set({ tasks: [] });
			},

			removeSubTask({ mainTaskId, subTaskId }) {
				set((s) => {
					const subTaskIdx = s.subTasks.findIndex(
						(s) => s.mainTaskId === mainTaskId && s.subTaskId === subTaskId,
					);
					return {
						...s,
						subTasks: [
							...s.subTasks.slice(0, subTaskIdx),
							...s.subTasks.slice(subTaskIdx + 1),
						],
					};
				});
			},

			addFetchedProject: (id) => {
				set((s) => ({
					...s,
					fetchedProjectTasks: [...s.fetchedProjectTasks, id],
				}));
			},

			addSubTask(mainTaskId, subTaskId) {
				set((state) => ({
					...state,
					subTasks: [
						...state.subTasks,
						{
							mainTaskId,
							subTaskId,
						},
					],
				}));
			},

			addTask: (task) =>
				set((state) => ({
					...state,
					tasks: [...state.tasks, task],
				})),

			removeTask: (taskId) =>
				set((state) => ({
					...state,
					tasks: state.tasks.filter((task) => task.id !== taskId),
				})),
		},
	})),
);

export const useProjectTasks = (projectId: string) =>
	useTaskStore((s) => s.tasks).filter((task) => task.projectId === projectId);
