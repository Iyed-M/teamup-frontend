import { useUserStore } from "@/state/user-store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	beforeLoad: () => {
		const user = useUserStore.getState().data;
		console.log(user);
		if (!user) {
			throw redirect({ to: "/login" });
		}
	},
	component: Outlet,
});
