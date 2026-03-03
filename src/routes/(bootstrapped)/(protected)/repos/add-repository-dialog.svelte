<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Input from '@/components/ui/input/input.svelte';
  import * as Field from '$lib/components/ui/field/index.js';
  import { createRepository } from '@/api/repositories.remote';
  import { handleResult } from '@/remote-functions';
  import Select from '@/components/select.svelte';
  import { listMyServers } from '@/api/servers.remote';

  let serversList = await listMyServers();

  let { open = $bindable<boolean>() } = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Add Repository</Dialog.Title>
      <Dialog.Description>Add a repository that to store backups.</Dialog.Description>
    </Dialog.Header>
    <form
      class="contents"
      {...createRepository.enhance(
        handleResult(createRepository, { onSuccess: () => (open = false) }),
      )}
    >
      <Field.Group>
        <Field.Field>
          <Field.Label for="name">Name</Field.Label>
          <Input id="name" {...createRepository.fields.name.as('text')} />
        </Field.Field>
        <Field.Field>
          <Field.Label for="server">Server</Field.Label>
          <Select
            id="server"
            items={serversList}
            label={(s) => s.name}
            {...createRepository.fields.serverId.as('select')}
          />
        </Field.Field>
        <Field.Field>
          <Field.Label for="pubkey">Public Key</Field.Label>
          <Input id="pubkey" {...createRepository.fields.publicKey.as('text')} />
        </Field.Field>
      </Field.Group>
      <Dialog.Footer>
        <Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
        <Button type="submit" disabled={!!createRepository.pending}>Add Repository</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
