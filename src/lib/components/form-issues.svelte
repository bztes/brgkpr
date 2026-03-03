<script lang="ts">
  import type { RemoteFormIssue } from '@sveltejs/kit';

  interface Props {
    issues?: RemoteFormIssue[];
  }

  let { issues }: Props = $props();
</script>

{#if issues}
  <ul>
    {#each issues as issue}
      <li>{issue.message}</li>
    {/each}
  </ul>
{/if}
