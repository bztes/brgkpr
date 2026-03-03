<script lang="ts">
  import Button from '@/components/ui/button/button.svelte';
  import PageTitle from '@/components/ui/page-title.svelte';
  import AddRepositoryDialog from './add-repository-dialog.svelte';
  import BrgkprTable, { createSvelteTable } from '@/components/brgkpr-table.svelte';
  import { listMyRepos, type ListMyRepos } from '@/api/repositories.remote';
  import { resolve } from '$app/paths';

  const table = createSvelteTable([{ id: 'name', headerName: 'Name', snippet: nameSnippet }]);

  let repositoriesList = await listMyRepos();

  let addDialogOpen = $state(false);
</script>

{#snippet nameSnippet(server: ListMyRepos[number])}
  <a
    href={resolve('/(bootstrapped)/(protected)/repos/[id]', { id: server.id })}
    class="font-medium underline">{server.name}</a
  >
{/snippet}

<AddRepositoryDialog bind:open={addDialogOpen} />

<PageTitle title="Repositories" description="TODO">
  <Button onclick={() => (addDialogOpen = true)}>Add Repository</Button>
</PageTitle>

<BrgkprTable columns={table.columns} rows={repositoriesList} />
