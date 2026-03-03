<script lang="ts">
  import { page } from '$app/state';
  import Button from '@/components/ui/button/button.svelte';
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-8 text-center">
  <h2 class="text-5xl font-semibold">Whoops!</h2>
  <h3 class="text-3xl font-semibold">Something went wrong</h3>
  <p class="max-w-sm text-muted-foreground">
    {page.status} - {page.error?.message}
  </p>
  <p></p>
  <Button size="lg">
    <a href="/">Back to home page</a>
  </Button>
</div>
