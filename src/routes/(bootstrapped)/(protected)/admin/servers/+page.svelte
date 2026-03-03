<script lang="ts">
  import Button from '@/components/ui/button/button.svelte';
  import { PencilIcon } from '@lucide/svelte';
  import { createdAtSnippet } from '@/components/table-cells.svelte';
  import BrgkprTable, { createSvelteTable } from '@/components/brgkpr-table.svelte';
  import PageTitle from '@/components/ui/page-title.svelte';
  import { listServers, type ListServersType } from '@/api/servers.remote';
  import CreateServerDialog from './create-server-dialog.svelte';
  import { set } from 'zod/v3';
  import { resolve } from '$app/paths';

  let serversList = await listServers();

  const table = createSvelteTable([
    { id: 'name', headerName: 'Name', snippet: nameSnippet },
    {
      id: 'created-at',
      headerName: 'Created At',
      snippet: createdAtSnippet,
    },
    {
      id: 'actions',
      headerName: '',
      snippet: actionsSnippet,
      style: 'text-end',
    },
  ]);

  let createServerDialog = $state<CreateServerDialog>();
</script>

{#snippet nameSnippet(server: ListServersType[number])}
  <a href={`/admin/servers/${server.id}`} class="font-medium underline">{server.name}</a>
{/snippet}

{#snippet actionsSnippet(server: ListServersType[number])}
  <Button
    size="sm"
    variant="ghost"
    href={resolve('/(bootstrapped)/(protected)/admin/servers/[id]', { id: server.id })}
  >
    <PencilIcon />
  </Button>
{/snippet}

<CreateServerDialog bind:this={createServerDialog} />

<PageTitle title="Server" description="TODO">
  <Button onclick={() => createServerDialog?.openModal()}>New Server</Button>
</PageTitle>

<BrgkprTable columns={table.columns} rows={serversList} />
