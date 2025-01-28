import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserAuthState {
	accessToken: string | null;
	refreshToken: string | null;
	isRefreshing: boolean;
	actions: {
		setAccessToken: (accessToken: string) => void;
		setRefreshToken: (refreshToken: string | null) => void;
	};
}
export const useAuthStore = create<UserAuthState>()(
	devtools(
		persist(
			(set) => ({
				accessToken: null,
				refreshToken: null,
				isRefreshing: false,
				actions: {
					setAccessToken: (accessToken: string | null) =>
						set((state) => ({ ...state, accessToken })),
					setRefreshToken: (refreshToken: string | null) =>
						set((state) => ({ ...state, refreshToken })),
				},
			}),
			{
				name: "authStore",
				// only persist refresh-token
				partialize: (state) => ({ refreshToken: state.refreshToken }),
			},
		),
		{ name: "authStore" },
	),
);
