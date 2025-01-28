
import { useMutation } from "@tanstack/react-query"
import { loginRequest, loginResopnse } from "@/types/login"
import { api } from "@/api"

export const useLogin = () => useMutation({ mutationFn: api({ method: "POST", path: "/login", requestSchema: loginRequest, responseSchema: loginResopnse, withToken: false }), mutationKey: ["login"] })

