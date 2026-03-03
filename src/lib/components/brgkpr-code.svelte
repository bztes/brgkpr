<script lang="ts">
  import { CheckIcon, CopyIcon } from '@lucide/svelte';
  import Button from './ui/button/button.svelte';

  interface Props {
    value: string;
    title: string;
  }

  let { value, title }: Props = $props();

  function copyValue() {
    navigator.clipboard.writeText(value);
    copied = true;
    setTimeout(() => (copied = false), 3000);
  }

  let copied = $state(false);
</script>

<div class="relative flex flex-col gap-4 rounded-md bg-muted p-4">
  <Button
    variant="ghost"
    size="sm"
    class="absolute top-1 right-1 text-xs font-light"
    onclick={copyValue}
  >
    {#if copied}
      <CheckIcon /> copied
    {:else}
      <CopyIcon />
    {/if}
  </Button>
  <div class="text-xs font-light">{title}</div>
  <code class=" text-sm">
    <pre>{value}</pre>
  </code>
</div>
