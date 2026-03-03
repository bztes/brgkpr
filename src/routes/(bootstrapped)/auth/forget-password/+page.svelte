<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { FieldGroup, Field, FieldLabel } from '$lib/components/ui/field/index.js';
  import { forgotPassword } from '@/api/auth.remote';
  import { handleResult } from '@/remote-functions';
</script>

<Card.Root class="mx-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Forgot Password</Card.Title>
    <Card.Description>Enter your email below to reset your password</Card.Description>
  </Card.Header>
  <Card.Content>
    <form class="contents" {...forgotPassword.enhance(handleResult(forgotPassword))}>
      <FieldGroup>
        <Field>
          <FieldLabel for="email">Email</FieldLabel>
          <Input id="email" {...forgotPassword.fields.email.as('email')} />
        </Field>
        <Field>
          <Button type="submit" class="w-full" disabled={!!forgotPassword.pending}>
            Reset Password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  </Card.Content>
</Card.Root>
