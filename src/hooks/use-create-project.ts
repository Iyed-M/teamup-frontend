import { api } from "@/api";
import { useProjectStore } from "@/state/project-store";
import { createProjectReq, CreateProjectReq } from "@/types/create-project";
import { projectSchema, Project } from "@/types/project";
import { useMutation } from "@tanstack/react-query";
import { useId } from "react";

export const useCreateProject = ({ onSuccess }: { onSuccess: () => void }) => {
	const now = new Date().toLocaleString();
	const projectActions = useProjectStore((s) => s.actions);

	const tempraryId = useId();
	const mutation = useMutation({
		mutationKey: ["create-project"],
		mutationFn: api({
			method: "POST",
			path: "/projects",
			requestSchema: createProjectReq,
			responseSchema: projectSchema,
		}),

		onMutate(variables: CreateProjectReq) {
			projectActions.addProject({
				...variables,
				id: tempraryId,
				createdAt: now,
			});
		},
		onSuccess(res: Project) {
			projectActions.updateProject(tempraryId, res);
			onSuccess();
		},
		onError(error) {
			//TODO:
			console.error("DISPLAYME TO USER", error);
			projectActions.removeProject(tempraryId);
		},
	});
	return mutation;
};
