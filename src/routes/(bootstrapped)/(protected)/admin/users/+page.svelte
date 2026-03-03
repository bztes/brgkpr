<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import type { UserWithRole } from 'better-auth/plugins';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import CreateUserDialog from './create-user-dialog.svelte';
  import { BadgeCheckIcon, PencilIcon } from '@lucide/svelte';
  import BrgkprTable, { createSvelteTable } from '@/components/brgkpr-table.svelte';
  import PageTitle from '@/components/ui/page-title.svelte';
  import { listUsers } from '@/api/users.remote.js';
  import { resolve } from '$app/paths';

  let usersList = await listUsers();

  const table = createSvelteTable([
    { id: 'name', headerName: 'Name', snippet: nameSnippet },
    { id: 'email', headerName: 'Email', snippet: emailSnippet },
    { id: 'status', headerName: 'Status', snippet: statusSnippet },
    { id: 'role', headerName: 'Role', snippet: roleSnippet },
    { id: 'actions', headerName: '', snippet: actionsSnippet, style: 'text-end' },
  ]);

  let createUserDialog = $state<CreateUserDialog>();
</script>

{#snippet nameSnippet(user: UserWithRole)}
  <a href={`/admin/users/${user.id}`} class="font-medium underline">{user.name}</a>
{/snippet}

{#snippet emailSnippet(user: UserWithRole)}
  {user.email}
{/snippet}

{#snippet statusSnippet(user: UserWithRole)}
  {#if user.banned}
    <Badge variant="destructive">Banned</Badge>
  {:else if user.emailVerified}
    <Badge>
      <BadgeCheckIcon />
      Verified
    </Badge>
  {:else}
    <Badge variant="secondary">Unverified</Badge>
  {/if}
{/snippet}

{#snippet roleSnippet(user: UserWithRole)}
  {user.role}
{/snippet}

{#snippet actionsSnippet(user: UserWithRole)}
  <Button
    size="sm"
    variant="ghost"
    href={resolve('/(bootstrapped)/(protected)/admin/users/[id]', { id: user.id })}
  >
    <PencilIcon />
  </Button>
{/snippet}

<CreateUserDialog bind:this={createUserDialog} />

<PageTitle title="User List">
  <Button onclick={() => createUserDialog?.openModal()}>New User</Button>
</PageTitle>

<BrgkprTable columns={table.columns} rows={usersList} />
