import { useAuthStore } from "@/state/auth-store";
import { clearAllUser } from "@/state/user-store";
import axios from "axios";

export async function refresh() {
	const { isRefreshing, refreshToken } = useAuthStore.getState();

	if (isRefreshing) {
		throw new Error("Already refreshing or no refresh token");
	}
	if (!refreshToken) {
		clearAllUser();
		window.location.href = "/login";
	}
	useAuthStore.setState((s) => ({ ...s, isRefreshing: true }));

	let refreshResponse;
	try {
		refreshResponse = await axios.post("refresh", { refreshToken: refreshToken as string });
	} catch {
		clearAllUser();
		window.location.href = "/login";
		return;
	}

	useAuthStore.setState((s) => ({
		...s,
		isRefreshing: false,
		accessToken: refreshResponse.data.accessToken,
	}));
	return refreshResponse.data as { accessToken: string };
}
