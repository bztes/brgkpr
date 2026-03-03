<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { FieldGroup, Field, FieldLabel } from '$lib/components/ui/field/index.js';
  import { bootstrap } from '@/api/bootstrap.remote';
  import { handleResult } from '@/remote-functions';
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <Card.Root class="mx-auto w-full max-w-sm">
    <Card.Header>
      <Card.Title class="text-2xl">Setup</Card.Title>
      <Card.Description>
        Enter your email and a password below to create the admin account
      </Card.Description>
    </Card.Header>
    <Card.Content>
      <form {...bootstrap.enhance(handleResult(bootstrap))}>
        <FieldGroup>
          <Field>
            <FieldLabel for="name">Name</FieldLabel>
            <Input id="name" {...bootstrap.fields.name.as('text')} />
          </Field>
          <Field>
            <FieldLabel for="email">Email</FieldLabel>
            <Input id="email" {...bootstrap.fields.email.as('email')} placeholder="m@example.com" />
          </Field>
          <Field>
            <FieldLabel for="password">Password</FieldLabel>
            <Input id="password" {...bootstrap.fields.password.as('password')} />
          </Field>
          <Field>
            <Button type="submit" class="w-full" disabled={!!bootstrap.pending}>Bootstrap</Button>
          </Field>
        </FieldGroup>
      </form>
    </Card.Content>
  </Card.Root>
</div>
