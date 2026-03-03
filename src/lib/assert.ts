import { error } from '@sveltejs/kit';

export function requireDefined<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) {
    error(404, { message: 'Not found' });
  }
  return value;
}

export function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value == null || value == undefined) {
    error(404, { message: 'Not found' });
  }
}
