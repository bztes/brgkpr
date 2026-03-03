<script lang="ts" module>
  import { tvMerge, tw, type PartialVariantProps } from '@/tailwind';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import * as NativeSelect from '$lib/components/ui/native-select/index.js';

  const selectVariants = tvMerge({
    base: tw`rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
  });
</script>

<script lang="ts" generics="T extends {id:string}">
  type Props = HTMLSelectAttributes &
    PartialVariantProps<typeof selectVariants> & {
      items: T[];
      label: (item: T) => string;
    };

  let { class: className, items, label, ...restProps }: Props = $props();
</script>

<NativeSelect.Root class={selectVariants({}, className)} {...restProps}>
  <NativeSelect.Option disabled selected>-- select an option --</NativeSelect.Option>
  {#each items as item}
    <NativeSelect.Option value={item.id}>{label(item)}</NativeSelect.Option>
  {/each}
</NativeSelect.Root>
