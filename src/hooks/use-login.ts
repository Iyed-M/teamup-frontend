import { useMutation } from "@tanstack/react-query";
import { loginRequest, loginResopnse } from "@/types/login";
import { api } from "@/api";
import { z } from "zod";
import { useSetupUser } from "./use-setup-user";
import { useNavigate } from "@tanstack/react-router";

export const useLogin = () => {
	const setUpUser = useSetupUser();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: api({
			method: "POST",
			path: "/login",
			requestSchema: loginRequest,
			responseSchema: loginResopnse,
			withToken: false,
		}),
		mutationKey: ["login"],
		onSuccess: (res: z.infer<typeof loginResopnse>) => {
			console.log(res);
			setUpUser(res);
			navigate({ to: "/dashboard" });
		},
	});
};
