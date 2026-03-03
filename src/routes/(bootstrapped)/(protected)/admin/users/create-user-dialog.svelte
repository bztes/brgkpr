<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Input from '@/components/ui/input/input.svelte';
  import { userRoles } from '@/roles';
  import * as Field from '$lib/components/ui/field/index.js';
  import Checkbox from '@/components/ui/checkbox/checkbox.svelte';
  import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
  import { randomPassword } from '@/password';
  import { createUser } from '@/api/users.remote';
  import FormIssues from '@/components/form-issues.svelte';
  import { handleResult } from '@/remote-functions';

  export function openModal() {
    open = true;
  }

  let open = $state(false);

  createUser.fields.password.set(randomPassword());
  createUser.fields.invite.set(true);
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Add New User</Dialog.Title>
      <Dialog.Description>Create new user here. Click add when you're done.</Dialog.Description>
    </Dialog.Header>
    <FormIssues issues={createUser.fields.allIssues()} />
    <form
      class="contents"
      {...createUser.enhance(handleResult(createUser, { onSuccess: () => (open = false) }))}
    >
      <Field.Group>
        <Field.Field>
          <Field.Label for="name">Name</Field.Label>
          <Input id="name" {...createUser.fields.name.as('text')} />
        </Field.Field>
        <Field.Field>
          <Field.Label for="email">Email</Field.Label>
          <Input id="email" autocomplete="off" {...createUser.fields.email.as('email')} />
        </Field.Field>
        <Field.Field>
          <Field.Label for="password">Password</Field.Label>
          <Input
            id="password"
            autocomplete="new-password"
            {...createUser.fields.password.as('password')}
          />
        </Field.Field>
        <Field.Field>
          <Field.Label for="role">Role</Field.Label>
          <RadioGroup.Root {...createUser.fields.role.as('radio', 'user')}>
            {#each userRoles as userRole}
              <Field.Field orientation="horizontal">
                <RadioGroup.Item value={userRole.value} id={`userrole-${userRole.value}`} />
                <Field.Content>
                  <Field.Label for={`userrole-${userRole.value}`}>{userRole.label}</Field.Label>
                  <Field.Description>{userRole.description}</Field.Description>
                </Field.Content>
              </Field.Field>
            {/each}
          </RadioGroup.Root>
        </Field.Field>
        <Field.Field orientation="horizontal">
          <Checkbox id="invite" {...createUser.fields.invite.as('checkbox')} />
          <Field.Content>
            <Field.Label for="invite">Invite</Field.Label>
            <Field.Description>Send E-Mail invitation to reset password</Field.Description>
          </Field.Content>
        </Field.Field>
      </Field.Group>
      <Dialog.Footer>
        <Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
        <Button type="submit" disabled={!!createUser.pending}>Add User</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
