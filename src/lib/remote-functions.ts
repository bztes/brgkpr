import { goto } from '$app/navigation';
import {
  isRedirect,
  type RemoteForm,
  type RemoteFormInput,
  type RemoteQueryFunction,
} from '@sveltejs/kit';
import { resolve } from '$app/paths';
import type { RouteId } from '$app/types';
import type { RouteParams } from '$app/types';
import { command, form } from '$app/server';
import { APIError, type StandardSchemaV1 } from 'better-auth';
import { toast } from 'svelte-sonner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferQuery<T> = T extends RemoteQueryFunction<any, infer U> ? U : never;

export type NormalizedRouteParams<R extends RouteId> =
  RouteParams<R> extends Record<string, never> ? object : RouteParams<R>;

export type RouteIdFromParams<P> = {
  [R in RouteId]: P extends NormalizedRouteParams<R> ? R : never;
}[RouteId];

type FormEnhanceCallback = Parameters<RemoteForm<RemoteFormInput, unknown>['enhance']>[0];

export function handleResult<
  T extends RouteId,
  D extends RouteParams<T> extends Record<string, never> ? object : RouteParams<T>,
>(
  action: { result: MergePartial<RemoteResponse, { data: D }> | undefined },
  options?: { goto?: T; onSuccess?: () => void },
): FormEnhanceCallback {
  return async ({ submit, form }) => {
    await submit();

    const result = action.result;
    if (!result) {
      return;
    } else if (!result.success) {
      toast.error(result.message);
      return;
    }

    form.reset();
    toast.success(result.message);
    options?.onSuccess?.();
    if (options?.goto) {
      // @ts-expect-error type is checked in the function definition
      goto(resolve(options.goto, result?.data));
    }
  };
}

export interface RemoteResponse<D = unknown> {
  success: boolean;
  message: string;
  data: D;
}

export function safeForm<
  Schema extends StandardSchemaV1<RemoteFormInput, Record<string, unknown>>,
  Output extends RemoteResponse,
  Fn extends (data: StandardSchemaV1.InferOutput<Schema>) => Promise<Output>,
>(schema: Schema, fn: Fn) {
  return form(schema, (data) => safeRemoteAction(() => fn(data)));
}

export function safeCommand0<Output extends RemoteResponse>(fn: () => Promise<Output>) {
  return command(() => safeRemoteAction(fn));
}

export function safeCommand<
  Schema extends StandardSchemaV1<RemoteFormInput, Record<string, unknown>>,
  Output extends RemoteResponse,
  Fn extends (data: StandardSchemaV1.InferOutput<Schema>) => Promise<Output>,
>(schema: Schema, fn: Fn) {
  return command(schema, (data) => safeRemoteAction(() => fn(data)));
}

type MergePartial<T, S> = T & Partial<Omit<S, keyof T>>;

async function safeRemoteAction<R extends RemoteResponse>(fn: () => Promise<R>) {
  try {
    return await fn();
  } catch (e) {
    if (isRedirect(e)) {
      throw e;
    }

    console.error(e);

    if (e instanceof APIError) {
      return { success: false, message: 'Authentication Error' } as MergePartial<RemoteResponse, R>;
    }

    if (e instanceof Error) {
      return { success: false, message: 'Internal Error' } as MergePartial<RemoteResponse, R>;
    }

    return { success: false, message: 'Unknown Internal error' } as MergePartial<RemoteResponse, R>;
  }
}

export function successResponse(message?: string, data: unknown = {}): RemoteResponse {
  return { success: true, message: message ?? '', data };
}

export function errorResponse(message?: string, data: unknown = {}): RemoteResponse {
  return { success: false, message: message ?? '', data };
}
