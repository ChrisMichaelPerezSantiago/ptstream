import { Console, Context, Effect, Layer } from "effect";

import { HttpClientConfig } from "src/types";

const makeHttpClientService = (config: HttpClientConfig) =>
  Effect.gen(function* () {
    const makeRequest = (endpoint: string, options?: RequestInit) =>
      Effect.try({
        try: async () => {
          const url = `${config.baseUrl}${endpoint}`;
          const response = await fetch(url, {
            ...options,
          });

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          return response.json();
        },
        catch: (error: Error) => {
          Console.error("Fetch error:", error).pipe(Effect.runPromise);
          throw error;
        },
      });

    return { makeRequest } as const;
  });

export default class HttpClientService extends Context.Tag("HttpClientService")<
  HttpClientService,
  Effect.Effect.Success<ReturnType<typeof makeHttpClientService>>
>() {
  static Live = (config: HttpClientConfig) =>
    Layer.effect(HttpClientService, makeHttpClientService(config));
}
