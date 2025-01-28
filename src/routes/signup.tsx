import { Signup } from "@/pages/signup";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
	component: Signup,
});
