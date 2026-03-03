<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Input from '@/components/ui/input/input.svelte';
  import * as Field from '$lib/components/ui/field/index.js';
  import { createServer } from '@/api/servers.remote';
  import { handleResult } from '@/remote-functions';

  export function openModal() {
    open = true;
  }

  let open = $state(false);
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Add Server</Dialog.Title>
      <Dialog.Description>Add a server that can be used to store backups.</Dialog.Description>
    </Dialog.Header>
    <form class="contents" {...createServer.enhance(handleResult(createServer))}>
      <Field.Group>
        <Field.Field>
          <Field.Label for="name">Name</Field.Label>
          <Input id="name" {...createServer.fields.name.as('text')} />
        </Field.Field>
        <Field.Field>
          <Field.Label for="host">Host</Field.Label>
          <Input id="host" {...createServer.fields.host.as('text')} />
        </Field.Field>
        <Field.Field>
          <Field.Label for="port">Port</Field.Label>
          <Input id="port" {...createServer.fields.port.as('number')} value="22" placeholder="22" />
        </Field.Field>
        <Field.Field>
          <Field.Label for="username">Username</Field.Label>
          <Input id="username" {...createServer.fields.username.as('text')} />
        </Field.Field>
        <Field.Field>
          <Field.Label for="path">Path</Field.Label>
          <Input id="path" {...createServer.fields.path.as('text')} />
        </Field.Field>
      </Field.Group>
      <Dialog.Footer>
        <Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
        <Button type="submit" disabled={!!createServer.pending}>Add Server</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
