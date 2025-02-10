import { z } from "zod";

export const userSchema = z.object({
	id: z.string().uuid(),
	username: z.string().nonempty(),
	email: z.string().email(),
});
export type User = z.infer<typeof userSchema>;
