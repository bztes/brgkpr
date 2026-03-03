<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
  import { routes } from '@/route.svelte';

  let { ...restProps } = $props();
</script>

<Breadcrumb.Root {...restProps}>
  <Breadcrumb.List>
    {#each routes as node, index (node.metaUrl)}
      {@const leaf = index + 1 === routes.length}
      <Breadcrumb.Item class="hidden md:block">
        {#if leaf}
          <Breadcrumb.Page>{node.name()}</Breadcrumb.Page>
        {:else}
          <Breadcrumb.Link href={resolve(node.routeId, page.params)}>
            {node.name()}
          </Breadcrumb.Link>
        {/if}
      </Breadcrumb.Item>
      {#if !leaf}
        <Breadcrumb.Separator class="hidden md:block" />
      {/if}
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
