import { Project } from "@/types/project";
import { User } from "@/types/user";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Invitation = {
	project: Project;
	user: User;
};
interface ProjectStore {
	projects: Project[];
	invitations: Invitation[];

	actions: {
		setProjects: (projects: Project[]) => void;
		addProject: (project: Project) => void;
		acceptInvitationAndJoin: (project: Project) => void;
		addInivtations: (...invitations: Invitation[]) => void;
		removeProject: (projectId: string) => void;
		updateProject: (projectId: string, project: Partial<Project>) => void;
		clear: () => void;
	};
}

export const useProjectStore = create<ProjectStore>()(
	devtools((set, get) => ({
		projects: [],
		invitations: [],

		actions: {
			setProjects: (projects) => set({ projects }),
			addInivtations: (...invitations) => {
				const newInvitations = invitations.filter((newInv) =>
					get().invitations.every(
						(inv) =>
							inv.project.id !== newInv.project.id &&
							inv.user.id !== newInv.user.id,
					),
				);
				if (newInvitations.length > 0) {
					set((s) => ({
						...s,
						invitations: [...s.invitations, ...newInvitations],
					}));
				}
			},

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

			acceptInvitationAndJoin(project) {
				const invitations = get().invitations.filter(
					(inv) => inv.project.id === project.id,
				);
				set((s) => ({ ...s, invitations }));
				this.addProject(project);
			},

			addProject: (project) => {
				if (!get().projects.some((proj) => proj.id === project.id))
					set((state) => ({
						...state,
						projects: [...state.projects, project],
					}));
			},

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
