import { Project, Task } from "@/types/project";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ProjectStore {
	projects: Project[];

	actions: {
		setProjects: (projects: Project[]) => void;
		addProject: (project: Project) => void;
		removeProject: (projectId: string) => void;
		updateProject: (projectId: string, project: Partial<Project>) => void;
		clear: () => void;
	};
}

export const useProjectStore = create<ProjectStore>()(
	devtools((set) => ({
		projects: [],
		currentProjectId: null,

		actions: {
			setProjects: (projects) => set({ projects }),

			updateProject: (projectId, project) =>
				set((state) => {
					const idx = state.projects.findIndex((proj) => projectId === proj.id);
					return {
						...state,
						projects: [
							...state.projects.slice(0, idx),
							{ ...state.projects[idx], ...project },
							...state.projects.slice(idx + 1),
						],
					};
				}),

			clear() {
				set({ projects: [] });
			},

			addProject: (project) =>
				set((state) => ({
					...state,
					projects: [...state.projects, project],
				})),

			removeProject: (projectId) =>
				set((state) => ({
					...state,
					projects: state.projects.filter(
						(project) => project.id !== projectId,
					),
				})),
		},
	})),
);
