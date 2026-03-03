<script lang="ts">
  import { routeNode } from '@/route.svelte';

  let { children } = $props();

  $effect(routeNode(import.meta.url, () => 'Servers'));
</script>

{@render children()}
