<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { FieldGroup, Field, FieldLabel } from '$lib/components/ui/field/index.js';
  import { signIn } from '@/api/auth.remote';
  import { handleResult } from '@/remote-functions';
</script>

<Card.Root class="mx-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Login</Card.Title>
    <Card.Description>Enter your email below to login to your account</Card.Description>
  </Card.Header>
  <Card.Content>
    <form class="contents" {...signIn.enhance(handleResult(signIn))}>
      <FieldGroup>
        <Field>
          <FieldLabel for="email">Email</FieldLabel>
          <Input id="email" placeholder="m@example.com" {...signIn.fields.email.as('email')} />
        </Field>
        <Field>
          <div class="flex items-center">
            <FieldLabel for="password">Password</FieldLabel>
            <a href="/forget-password" class="ms-auto inline-block text-sm underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" {...signIn.fields.password.as('password')} />
        </Field>
        <Field>
          <Button type="submit" class="w-full" disabled={!!signIn.pending}>Login</Button>
        </Field>
      </FieldGroup>
    </form>
  </Card.Content>
</Card.Root>
