import { api } from "@/api";
import { useProjectStore } from "@/state/project-store";
import { projectSchema } from "@/types/project";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const useJoinProject = ({ onSuccess }: { onSuccess: () => void }) => {
	const { acceptInvitationAndJoin } = useProjectStore((s) => s.actions);
	const responseSchema = z.object({ project: projectSchema });
	return useMutation({
		mutationFn: api({
			method: "POST",
			path: "/projects/join",
			requestSchema: z.object({ projectId: z.string() }),
			responseSchema,
		}),
		mutationKey: ["join-project"],
		onSuccess(data: z.infer<typeof responseSchema>) {
			acceptInvitationAndJoin(data.project);
			onSuccess();
		},
	});
};
