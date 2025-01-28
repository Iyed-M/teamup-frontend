import { z } from "zod";

export const signupRequest = z.object({
	username: z.string().min(3, "Username must be at least 3 characters"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupResponse = z.object({
	id: z.string().nonempty(),
	accessToken: z.string().nonempty(),
	refreshToken: z.string().nonempty(),
	username: z.string().nonempty(),
	email: z.string().nonempty(),
});
