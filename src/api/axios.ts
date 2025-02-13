import axios, {
	AxiosError,
	CreateAxiosDefaults,
	InternalAxiosRequestConfig,
} from "axios";
import { logout, refresh } from "./refresh";
import { useAuthStore } from "@/state/auth-store";
import { clearAllUser } from "@/state/user-store";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_user_retry?: boolean;
}

const AxiosConfig: CreateAxiosDefaults = {
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
	// fix url params of type array
	paramsSerializer: {
		indexes: null,
	},
};
export const clientUnauthenticated = axios.create(AxiosConfig);

export const client = axios.create(AxiosConfig);

client.interceptors.request.use(
	async function (config) {
		let accessToken = useAuthStore.getState().accessToken;

		if (!accessToken) {
			const refreshResponse = await refresh();
			// if response is undefined user in redirected to login from refresh()
			accessToken = refreshResponse!.accessToken;
		}

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	function (error) {
		return Promise.reject(error);
	},
);

client.interceptors.response.use(
	function (response) {
		return response;
	},
	async function (error: AxiosError) {
		const originalRequest: CustomAxiosRequestConfig | undefined = error.config;
		console.error(error);

		if (
			[401, 403].includes(error.response?.status) &&
			originalRequest &&
			!originalRequest._user_retry
		) {
			originalRequest._user_retry = true;
			try {
				const response = await refresh();
				if (!response) {
					logout();
					return;
				}
				useAuthStore.setState((s) => ({
					...s,
					accessToken: response.accessToken,
				}));

				originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;

				return client(originalRequest);
			} catch (error) {
				if (error instanceof AxiosError && error.response?.status === 403) {
					logout();
					return;
				}
			}
		}

		//@ts-expect-error <backend errors are always the same schema >
		return Promise.reject(error.response?.data?.error);
	},
);
