import { z } from "zod";

// Enums
const InvitationStatus = z.enum(["accepted", "pending", "rejected"]);

// Base schemas
export const userSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	username: z.string(),
	createdAt: z.string().datetime(),
	refreshToken: z.string().nullable(),
});
export type User = z.infer<typeof userSchema>;

export const projectSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	createdAt: z.string().datetime(),
	color: z.string(),
});
export type Project = z.infer<typeof projectSchema>;

export const taskSchema = z.object({
	id: z.string().uuid(),
	content: z.string(),
	projectId: z.string().uuid(),
	createdAt: z.string().datetime(),
	deadline: z.string().datetime().nullable(),
	attachmentUrl: z.string().nullable(),
	taskOrder: z.number().int(),
});
export type Task = z.infer<typeof taskSchema>;

export const taskWithUsers = taskSchema.extend({ users: userSchema.array() });
export type TaskWithUsers = z.infer<typeof taskWithUsers>;

export const subTaskSchema = z.object({
	mainTaskId: z.string().uuid(),
	subTaskId: z.string().uuid(),
});
export type SubTask = z.infer<typeof subTaskSchema>;

export const taskAssignmentSchema = z.object({
	userId: z.string().uuid(),
	taskId: z.string().uuid(),
});
export type TaskAssignment = z.infer<typeof taskAssignmentSchema>;

export const userProjectSchema = z.object({
	id: z.string().uuid(),
	userId: z.string().uuid(),
	projectId: z.string().uuid(),
	isOwner: z.boolean(),
});
export type UserProject = z.infer<typeof userProjectSchema>;

export const projectInvitationSchema = z.object({
	id: z.string().uuid(),
	projectId: z.string().uuid(),
	senderId: z.string().uuid(),
	receiverId: z.string().uuid(),
	createdAt: z.string().datetime(),
	status: InvitationStatus,
});

export type ProjectInvitation = z.infer<typeof projectInvitationSchema>;
