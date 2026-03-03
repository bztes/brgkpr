<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    description?: string;
    badges?: Snippet;
    children?: Snippet;
  }
  let { title, description, badges, children }: Props = $props();
</script>

<div class="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] items-start gap-x-3">
  <div class="flex gap-3">
    <h1 class="text-lg font-semibold">{title}</h1>
    {@render badges?.()}
  </div>
  <div class={{ 'row-span-2': description }}>
    {@render children?.()}
  </div>
  <p class="text-muted-foreground">
    {description}
  </p>
</div>
