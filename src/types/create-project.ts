import { z } from "zod";
import { projectSchema } from "./project";

export const createProjectReq = projectSchema.omit({
	id: true,
	createdAt: true,
});
export type CreateProjectReq = z.infer<typeof createProjectReq>;
