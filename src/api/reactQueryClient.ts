import {
  QueryKey,
  useMutation,
  useQuery,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

type RefetchBehaviour = boolean | 'always';

type QueryBehaviourOptions = {
  staleTime?: number;
  gcTime?: number;
  retry?: number;
  refetchOnWindowFocus?: RefetchBehaviour;
  refetchOnReconnect?: RefetchBehaviour;
  refetchOnMount?: RefetchBehaviour;
};

export type ApiClientOptions = {
  baseUrl?: string;
  defaultHeaders?: HeadersInit;
  defaultQueryOptions?: QueryBehaviourOptions;
};

type RequestOptions = {
  useBaseUrl?: boolean;
};

export type UseApiQueryConfig<TQueryFnData, TData = TQueryFnData, TVariables = void> = {
  queryKey: QueryKey | ((variables: TVariables | undefined) => QueryKey);
  path: string | ((variables: TVariables | undefined) => string);
  variables?: TVariables;
  requestInit?: RequestInit | ((variables: TVariables | undefined) => RequestInit);
  enabled?: boolean | ((variables: TVariables | undefined) => boolean);
  useBaseUrl?: boolean;
} & Omit<
  UseQueryOptions<TQueryFnData, ApiError, TData, QueryKey>,
  'queryKey' | 'queryFn' | 'enabled'
>;

export type UseApiMutationConfig<TResponse, TVariables = void, TContext = unknown> = {
  path: string | ((variables: TVariables) => string);
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  requestInit?: RequestInit | ((variables: TVariables) => RequestInit);
  bodySerializer?: (variables: TVariables) => BodyInit | undefined;
  useBaseUrl?: boolean;
} & Omit<UseMutationOptions<TResponse, ApiError, TVariables, TContext>, 'mutationFn'>;

/* ---------- snake_case / camelCase helpers ---------- */

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const toCamelCase = (key: string) =>
    key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

const toSnakeCase = (key: string) =>
    key.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);

const transformKeysToCamel = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(transformKeysToCamel);
  }
  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    Object.entries(value).forEach(([k, v]) => {
      result[toCamelCase(k)] = transformKeysToCamel(v);
    });
    return result;
  }
  return value;
};

const transformKeysToSnake = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(transformKeysToSnake);
  }
  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    Object.entries(value).forEach(([k, v]) => {
      result[toSnakeCase(k)] = transformKeysToSnake(v);
    });
    return result;
  }
  return value;
};

/* ---------------------------------------------------- */

export class ReactQueryApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private queryDefaults: QueryBehaviourOptions;

  constructor(options: ApiClientOptions = {}) {
    const rawBaseUrl = options.baseUrl ?? import.meta.env?.VITE_API_BASE_URL ?? '';
    this.baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
    this.defaultHeaders = options.defaultHeaders ?? { 'Content-Type': 'application/json' };
    this.queryDefaults = options.defaultQueryOptions ?? {
      staleTime: 0,
      gcTime: 15 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    };
  }

  getQueryDefaults() {
    return this.queryDefaults;
  }

  buildBody<TVariables>(
      variables: TVariables,
      bodySerializer?: (variables: TVariables) => BodyInit | undefined,
  ) {
    if (bodySerializer) {
      return bodySerializer(variables);
    }
    return this.stringifyBody(variables);
  }

  async get<TResponse>(path: string, init?: RequestInit, options?: RequestOptions) {
    return this.request<TResponse>(path, init, options);
  }

  async request<TResponse>(path: string, init?: RequestInit, options?: RequestOptions) {
    const finalInit: RequestInit = {
      ...init,
      headers: this.buildHeaders(init?.headers, init?.body ?? null),
    };

    const response = await fetch(this.buildUrl(path, options), finalInit);
    const payload = await this.parseResponse(response);

    if (!response.ok) {
      throw {
        status: response.status,
        message: this.extractErrorMessage(payload) ?? response.statusText,
        details: payload,
      } satisfies ApiError;
    }

    return payload as TResponse;
  }

  private stringifyBody(variables: unknown) {
    if (variables === undefined || variables === null) return undefined;

    if (
        variables instanceof FormData ||
        variables instanceof Blob ||
        variables instanceof URLSearchParams
    ) {
      // اترك المفاتيح زي ما هي في الفورم داتا/البلوب
      return variables;
    }

    if (typeof variables === 'string') {
      return variables;
    }

    // هنا نحول camelCase -> snake_case قبل الإرسال
    const transformed = transformKeysToSnake(variables);
    return JSON.stringify(transformed);
  }

  private buildHeaders(headers?: HeadersInit, body?: BodyInit | null) {
    const finalHeaders = new Headers(this.defaultHeaders ?? {});

    if (headers) {
      new Headers(headers).forEach((value, key) => finalHeaders.set(key, value));
    }

    if (body instanceof FormData || body instanceof Blob) {
      finalHeaders.delete('Content-Type');
    } else if (!finalHeaders.has('Content-Type')) {
      finalHeaders.set('Content-Type', 'application/json');
    }

    return finalHeaders;
  }

  private buildUrl(path: string, options?: RequestOptions) {
    if (!path) throw new Error('API path is required');
    if (options?.useBaseUrl === false) {
      return path;
    }
    if (/^https?:\/\//i.test(path) || !this.baseUrl) {
      return path;
    }
    return `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  private extractErrorMessage(payload: unknown) {
    if (!payload) return undefined;
    if (typeof payload === 'string') return payload;
    if (
        typeof payload === 'object' &&
        'message' in payload &&
        typeof (payload as { message?: unknown }).message === 'string'
    ) {
      return (payload as { message: string }).message;
    }
    return undefined;
  }

  private async parseResponse(response: Response) {
    if (response.status === 204) return undefined;
    const text = await response.text();
    if (!text) return undefined;

    try {
      const parsed = JSON.parse(text);
      // هنا نحول snake_case -> camelCase قبل ما يوصل للفرونت
      return transformKeysToCamel(parsed);
    } catch {
      return text;
    }
  }
}

export const apiQueryClient = new ReactQueryApiClient();

export const useApiQuery = <TQueryFnData, TData = TQueryFnData, TVariables = void>(
    config: UseApiQueryConfig<TQueryFnData, TData, TVariables>,
): UseQueryResult<TData, ApiError> => {
  const { variables, queryKey, path, requestInit, enabled, useBaseUrl, ...queryOptions } = config;

  const resolvedKey = typeof queryKey === 'function' ? queryKey(variables) : queryKey;
  const resolvedPath = typeof path === 'function' ? path(variables) : path;
  const resolvedInit =
      (typeof requestInit === 'function' ? requestInit(variables) : requestInit) ?? {};
  const resolvedEnabled = typeof enabled === 'function' ? enabled(variables) : enabled;

  return useQuery<TQueryFnData, ApiError, TData, QueryKey>({
    ...apiQueryClient.getQueryDefaults(),
    ...queryOptions,
    queryKey: resolvedKey,
    enabled: resolvedEnabled ?? true,
    queryFn: () => apiQueryClient.request<TQueryFnData>(resolvedPath, resolvedInit, { useBaseUrl }),
  });
};

export const useApiMutation = <TResponse, TVariables = void, TContext = unknown>(
    config: UseApiMutationConfig<TResponse, TVariables, TContext>,
): UseMutationResult<TResponse, ApiError, TVariables, TContext> => {
  const { path, method = 'POST', requestInit, bodySerializer, useBaseUrl, ...mutationOptions } = config;

  return useMutation<TResponse, ApiError, TVariables, TContext>({
    ...mutationOptions,
    mutationFn: async variables => {
      const resolvedPath = typeof path === 'function' ? path(variables) : path;
      const resolvedInit =
          (typeof requestInit === 'function' ? requestInit(variables) : requestInit) ?? {};

      const body = apiQueryClient.buildBody(variables, bodySerializer);

      const finalInit: RequestInit = {
        ...resolvedInit,
        method,
        body,
      };

      return apiQueryClient.request<TResponse>(resolvedPath, finalInit, { useBaseUrl });
    },
  });
};

export const buildQueryKey = (
    ...parts: Array<string | number | boolean | undefined | null>
): QueryKey =>
    parts.filter(part => part !== undefined && part !== null) as QueryKey;

export const withQueryParams = (
    path: string,
    params?: Record<string, string | number | boolean | undefined | null>,
) => {
  if (!params) return path;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  if (!queryString) return path;

  return `${path}${path.includes('?') ? '&' : '?'}${queryString}`;
};
