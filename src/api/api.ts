
import { z } from "zod";
import { AxiosRequestConfig, Method } from "axios";
import { client, clientUnauthenticated } from "./axios";

type APICallPayload<Request, Response> = {
    method: Method;
    path: string;
    requestSchema: z.ZodType<Request>;
    responseSchema?: z.ZodType<Response>;
    withToken?: boolean;
    config?: AxiosRequestConfig;
};

export function api<Request, Response>({
    withToken = true,
    method,
    path,
    requestSchema,
    responseSchema,
    config,
}: APICallPayload<Request, Response>): (r: Request) => Promise<Response> {
    return async (requestData: Request) => {
        requestSchema.parse(requestData);

        const url = path;
        const data = requestData;

        const opts: AxiosRequestConfig = {
            method,
            url,
            data,
        };

        const response = withToken
            ? await client({ ...opts, ...config })
            : await clientUnauthenticated({ ...opts, ...config });

        if (!responseSchema) return response.data;

        const result = responseSchema.safeParse(response.data);

        if (!result.success) {
            throw new Error(result.error.message);
        } else {
            return result.data as Response;
        }
    };
}
