<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import { FieldGroup, Field, FieldLabel } from '$lib/components/ui/field/index.js';
  import { completeRegistration } from '@/api/auth.remote';
  import Button from '@/components/ui/button/button.svelte';
  import Input from '@/components/ui/input/input.svelte';
  import { handleResult } from '@/remote-functions.js';

  let { data } = $props();
</script>

<Card.Root class="mx-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Complete Registration</Card.Title>
    <Card.Description>Enter your new password below to complete registration</Card.Description>
  </Card.Header>
  <Card.Content>
    <form
      class="contents"
      {...completeRegistration.enhance(
        handleResult(completeRegistration, { goto: '/(bootstrapped)/auth/sign-in' }),
      )}
    >
      <FieldGroup>
        <Field>
          <FieldLabel for="password">Password</FieldLabel>
          <Input id="password" {...completeRegistration.fields.password.as('password')} />
        </Field>
        <Field>
          <FieldLabel for="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            {...completeRegistration.fields.confirmPassword.as('password')}
          />
        </Field>
        <Field>
          <Input {...completeRegistration.fields.token.as('hidden', data.token)} />
          <Button type="submit" class="w-full" disabled={!!completeRegistration.pending}>
            Set Password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  </Card.Content>
</Card.Root>
