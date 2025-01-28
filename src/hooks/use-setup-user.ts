import { useAuthStore } from "@/state/auth-store";
import { useUserStore } from "@/state/user-store";
import { loginResopnse } from "@/types/login";
import { z } from "zod";

export const useSetupUser = () => {
	const authActions = useAuthStore((s) => s.actions);
	const setUserData = useUserStore((s) => s.setUserData);

	return (data: z.infer<typeof loginResopnse>) => {
		authActions.setAccessToken(data.accessToken);
		authActions.setRefreshToken(data.refreshToken);
		setUserData({ id: data.id, email: data.email, username: data.username });
	};
};
