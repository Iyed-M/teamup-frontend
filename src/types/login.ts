import { z } from "zod";

export const loginRequest = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginRequest = z.infer<typeof loginRequest>

export const loginResopnse = z.object({
	id: z.string().nonempty(),
	email: z.string().nonempty(),
	username: z.string().nonempty(),
	accessToken: z.string().nonempty(),
	refreshToken: z.string().nonempty(),
})
