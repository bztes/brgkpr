import { tv, type TV, type VariantProps } from 'tailwind-variants';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export type PartialVariantProps<T extends (args: unknown[]) => unknown> = Partial<VariantProps<T>>;

export function tvMerge<T extends TV>(param0: Parameters<T>[0]) {
  const variants = tv(param0) as ReturnType<T>;

  return (props: VariantProps<ReturnType<T>>, className?: ClassValue | null) =>
    twMerge(clsx(variants(props), className));
}

export const tw = String.raw;
