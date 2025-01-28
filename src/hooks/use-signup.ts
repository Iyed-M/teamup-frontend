import { api } from "@/api/api";
import { signupRequest, signupResponse } from "@/types/signup";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useSetupUser } from "./use-setup-user";
import { useNavigate } from "@tanstack/react-router";

export const useSignup = () => {
	const navigate = useNavigate();
	const setUpUser = useSetupUser();
	return useMutation({
		mutationKey: ["signup"],
		mutationFn: api({
			method: "POST",
			path: "/signup",
			requestSchema: signupRequest,
			responseSchema: signupResponse,
			withToken: false,
		}),
		onSuccess: (res: z.infer<typeof signupResponse>) => {
			setUpUser(res);
			navigate({ to: "/dashboard" });
		},
	});
};
