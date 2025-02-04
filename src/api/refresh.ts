import { useAuthStore } from "@/state/auth-store";
import { clearAllUser } from "@/state/user-store";
import axios from "axios";

export async function refresh() {
	const { isRefreshing, refreshToken } = useAuthStore.getState();

	if (isRefreshing) {
		throw new Error("Already refreshing or no refresh token");
	}
	if (!refreshToken) {
		logout();
	}
	useAuthStore.setState((s) => ({ ...s, isRefreshing: true }));

	let refreshResponse;
	try {
		refreshResponse = await axios.post(
			`${import.meta.env.VITE_API_URL}/refresh`,
			{},
			{ headers: { Authorization: `Bearer ${refreshToken}` } },
		);
	} catch {
		logout();
		return;
	}

	useAuthStore.setState((s) => ({
		...s,
		isRefreshing: false,
		accessToken: refreshResponse.data.accessToken,
	}));
	return refreshResponse.data as { accessToken: string };
}

export const logout = () => {
	clearAllUser();
	window.location.href = "/login";
};
