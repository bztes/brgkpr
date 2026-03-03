<script lang="ts">
  import { routeNode } from '@/route.svelte';

  let { children } = $props();

  $effect(routeNode(import.meta.url, () => 'User'));
</script>

{@render children()}
