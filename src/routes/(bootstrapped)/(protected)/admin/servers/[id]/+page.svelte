<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import Button from '@/components/ui/button/button.svelte';
  import PageTitle from '@/components/ui/page-title.svelte';
  import Badge from '@/components/ui/badge/badge.svelte';
  import * as Field from '$lib/components/ui/field/index.js';
  import Input from '@/components/ui/input/input.svelte';
  import BrgkprCode from '@/components/brgkpr-code.svelte';
  import { activateServer, deleteServer, getServer, updateServer } from '@/api/servers.remote.js';
  import FieldIssues from '@/components/field-issues.svelte';
  import { PencilIcon } from '@lucide/svelte';
  import { routeNode } from '@/route.svelte.js';
  import Spinner from '@/components/ui/spinner/spinner.svelte';
  import { handleResult } from '@/remote-functions.js';

  let { params } = $props();

  const server = $derived(await getServer({ serverId: params.id }));
  let editEnabled = $state(false);

  $effect(routeNode(import.meta.url, () => server.name));

  $effect(() => {
    updateServer.fields.set(server);
  });

  function handleCancelUpdate() {
    editEnabled = false;
    updateServer.fields.set(server);
  }
</script>

<PageTitle title={`Server Details: ${server.name}`} description="TODO">
  {#snippet badges()}
    <Badge variant="outline">{server.id}</Badge>
  {/snippet}
</PageTitle>

{#if server.status === 'new'}
  <Card.Root>
    <Card.Header>
      <Card.Title>Server Configuration</Card.Title>
      <Card.Description>
        Configure SSH access to allow this app to securely connect and manage server setup.
      </Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col gap-6">
      <p>This is a mandatory manual step required to complete the server setup.</p>
      <h3 class="font-semibold">1. Add the SSH Public Key</h3>
      <p>
        Append the following public key to the servers authorized keys file. The access granted here
        is used by this app to connect to the server and apply configuration changes:
      </p>
      <BrgkprCode value={server.publicKey} title="./ssh/authorized_keys" />
      <h3 class="font-semibold">2. Update SSH Daemon Configuration</h3>
      <p>
        Add the following configuration to the SSH configuration file to allow additional authorized
        keys for the users:
      </p>
      <BrgkprCode
        value={`Match User ${server.username}\n  AuthorizedKeysFile .ssh/authorized_keys ${server.path}/ssh_authorized_keys/*.pub`}
        title="/etc/ssh/sshd_config.d/20-brgkpr.conf"
      />
      <p>After making this change, reload or restart the SSH service for it to take effect.</p>
    </Card.Content>
    <Card.Footer class="flex justify-end">
      <form {...activateServer.enhance(handleResult(activateServer))}>
        <Input {...updateServer.fields.id.as('hidden', server.id)} />
        <Button type="submit" disabled={!!activateServer.pending}>
          {#if activateServer.pending}
            <Spinner /> Processing
          {:else}
            Activate Server
          {/if}
        </Button>
      </form>
    </Card.Footer>
  </Card.Root>
{/if}

<div class="grid items-start gap-3 lg:grid-cols-[2fr_1fr]">
  <Card.Root>
    <Card.Header>
      <Card.Title>Overview</Card.Title>
      <Card.Description>Profile details, including name, role and status.</Card.Description>
      <Card.Action>
        {#if !editEnabled}
          <Button variant="ghost" size="icon" onclick={() => (editEnabled = true)}>
            <PencilIcon />
          </Button>
        {/if}
      </Card.Action>
    </Card.Header>
    <form
      class="contents"
      {...updateServer.enhance(
        handleResult(updateServer, { onSuccess: () => (editEnabled = false) }),
      )}
    >
      <Card.Content>
        <Field.Group>
          <Field.Field>
            <Field.Label for="name">Name</Field.Label>
            <Input id="name" {...updateServer.fields.name.as('text')} readonly={!editEnabled} />
            <FieldIssues issues={updateServer.fields.name.issues()} />
          </Field.Field>
          <Field.Field>
            <Field.Label for="host">Host</Field.Label>
            <Input id="host" {...updateServer.fields.host.as('text')} readonly={!editEnabled} />
            <FieldIssues issues={updateServer.fields.host.issues()} />
          </Field.Field>
          <Field.Field>
            <Field.Label for="port">Port</Field.Label>
            <Input id="port" {...updateServer.fields.port.as('number')} readonly={!editEnabled} />
          </Field.Field>
          <Field.Field>
            <Field.Label for="username">Username</Field.Label>
            <Input
              id="username"
              {...updateServer.fields.username.as('text')}
              readonly={!editEnabled}
            />
            <FieldIssues issues={updateServer.fields.username.issues()} />
          </Field.Field>
          <Field.Field>
            <Field.Label for="username">Path</Field.Label>
            <Input id="path" {...updateServer.fields.path.as('text')} readonly={!editEnabled} />
            <FieldIssues issues={updateServer.fields.path.issues()} />
          </Field.Field>
          <Field.Field>
            <Field.Label for="sshKeyId">Public Key</Field.Label>
            <p class="font-mono text-xs">{server.publicKey}</p>
          </Field.Field>
        </Field.Group>
      </Card.Content>
      <Card.Footer class="flex justify-end gap-3">
        <Input {...updateServer.fields.id.as('hidden', server.id)} />
        {#if editEnabled}
          <Button variant="outline" onclick={handleCancelUpdate}>Cancel</Button>
          <Button type="submit" disabled={!!updateServer.pending}>Save Changes</Button>
        {/if}
      </Card.Footer>
    </form>
  </Card.Root>
  <Card.Root>
    <Card.Header>
      <Card.Title>Actions</Card.Title>
      <Card.Description>Manage server actions.</Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col gap-4">
      <Field.Field orientation="horizontal">
        <Field.Content>
          <Field.Label>Delete Server</Field.Label>
          <Field.Description>Deletes the server connection.</Field.Description>
        </Field.Content>
        <form
          {...deleteServer.enhance(
            handleResult(deleteServer, { goto: '/(bootstrapped)/(protected)/admin/servers' }),
          )}
        >
          <Input {...deleteServer.fields.id.as('hidden', server.id)} />
          <Button type="submit" variant="destructive" disabled={!!deleteServer.pending}>
            Delete
          </Button>
        </form>
      </Field.Field>
    </Card.Content>
  </Card.Root>
</div>
