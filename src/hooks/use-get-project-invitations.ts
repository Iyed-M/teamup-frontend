import { api } from "@/api";
import { projectSchema, userSchema } from "@/types/project";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const useGetProjectInvtations = () => {
	return useQuery({
		queryKey: ["get-project-invitations"],
		queryFn: api({
			method: "GET",
			path: "/projects/invitations",
			responseSchema: z.object({
				invitations: z
					.object({ project: projectSchema, user: userSchema })
					.array(),
			}),
		}),
	});
};
