<script lang="ts">
  import Button from '@/components/ui/button/button.svelte';
  import Input from '@/components/ui/input/input.svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
  import { userRoles } from '@/roles';
  import Separator from '@/components/ui/separator/separator.svelte';
  import * as Field from '$lib/components/ui/field/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import PageTitle from '@/components/ui/page-title.svelte';
  import { deleteUser, getUser, inviteUser, updateUser } from '@/api/users.remote';
  import FieldIssues from '@/components/field-issues.svelte';
  import FormIssues from '@/components/form-issues.svelte';
  import { PencilIcon } from '@lucide/svelte';
  import { routeNode } from '@/route.svelte.js';
  import { handleResult } from '@/remote-functions.js';

  let { params } = $props();

  let user = $derived(await getUser({ userId: params.id }));
  let editEnabled = $state(false);

  $effect(routeNode(import.meta.url, () => user.name));

  $effect(() => {
    updateUser.fields.set(user);
  });

  function handleCancelUpdate() {
    editEnabled = false;
    updateUser.fields.set(user);
  }
</script>

<PageTitle
  title={`User Details: ${user.name}`}
  description="Comprehensive user information, including details, role, status, and management options."
>
  {#snippet badges()}
    <Badge variant="outline">{user.id}</Badge>
  {/snippet}
</PageTitle>

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
      {...updateUser.enhance(handleResult(updateUser, { onSuccess: () => (editEnabled = false) }))}
    >
      <Card.Content>
        <FormIssues issues={updateUser.fields.allIssues()} />
        <Input {...updateUser.fields.id.as('hidden', user.id)} />
        <Field.Group>
          <Field.Field>
            <Field.Label for="name">Name</Field.Label>
            <Input id="name" {...updateUser.fields.name.as('text')} readonly={!editEnabled} />
            <FieldIssues issues={updateUser.fields.name.issues()} />
          </Field.Field>
          <Field.Field>
            <Field.Label for="email">Email</Field.Label>
            <Input id="email" {...updateUser.fields.email.as('email')} readonly={!editEnabled} />
            <FieldIssues issues={updateUser.fields.email.issues()} />
          </Field.Field>
          <Field.Field>
            <Field.Label for="role">Role</Field.Label>
            <RadioGroup.Root
              {...updateUser.fields.role.as('radio', user.role)}
              readonly={!editEnabled}
            >
              {#each userRoles as userRole}
                <Field.Field orientation="horizontal">
                  <RadioGroup.Item value={userRole.value} id={`userrole-${userRole.value}`} />
                  <Field.Label for={`userrole-${userRole.value}`}>
                    {userRole.label}
                    <span class="font-normal text-muted-foreground">({userRole.description})</span>
                  </Field.Label>
                </Field.Field>
              {/each}
            </RadioGroup.Root>
            <FieldIssues issues={updateUser.fields.role.issues()} />
          </Field.Field>
        </Field.Group>
      </Card.Content>
      <Card.Footer class="flex justify-end gap-3">
        {#if editEnabled}
          <Button variant="outline" onclick={handleCancelUpdate}>Cancel</Button>
          <Button type="submit" disabled={!!updateUser.pending}>Save Changes</Button>
        {/if}
      </Card.Footer>
    </form>
  </Card.Root>
  <Card.Root>
    <Card.Header>
      <Card.Title>Actions</Card.Title>
      <Card.Description>
        Manage necessary user actions including edit, resend email, and account deactivation.
      </Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col gap-4">
      <Field.Field orientation="horizontal">
        <Field.Content>
          <Field.Label>Reset Password</Field.Label>
          <Field.Description>Sends a reset link to the user's registered email.</Field.Description>
        </Field.Content>
        <form {...inviteUser.enhance(handleResult(inviteUser))}>
          <Input {...inviteUser.fields.email.as('hidden', user.email)} />
          <Button
            type="submit"
            variant="outline"
            class="border-destructive text-destructive"
            disabled={!!inviteUser.pending}
          >
            Send Email
          </Button>
        </form>
      </Field.Field>
      <Separator />
      <Field.Field orientation="horizontal">
        <Field.Content>
          <Field.Label>Delete User</Field.Label>
          <Field.Description>Deletes the user's account.</Field.Description>
        </Field.Content>
        <form {...deleteUser.enhance(handleResult(deleteUser))}>
          <Input {...deleteUser.fields.id.as('hidden', user.id)} />
          <Input {...deleteUser.fields.redirectPath.as('hidden', '/admin/users')} />
          <Button type="submit" variant="destructive" disabled={!!deleteUser.pending}>
            Delete
          </Button>
        </form>
      </Field.Field>
    </Card.Content>
  </Card.Root>
</div>
