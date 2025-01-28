import { User } from "@/types/user";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useAuthStore } from "./auth-store";

type UserStore = {
	data: User | null;
	setUserData: (userData: User | null) => void;
}
export const useUserStore = create<UserStore>()(
	devtools(
		persist(
			(set) => ({
				data: null,
				setUserData: (userData: User | null) =>
					set((state) => ({ ...state, userData })),
			}),
			{
				name: "userStore",
			},
		),
		{ name: "userStore" },
	),
);
export function clearAllUser() {
	useUserStore.setState({ data: null })
	useAuthStore.setState({ accessToken: null, refreshToken: null, isRefreshing: false })
}



