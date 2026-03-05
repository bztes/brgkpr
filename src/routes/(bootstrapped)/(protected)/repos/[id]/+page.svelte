<script>
  import { deleteRepository, getMyRepository } from '@/api/repositories.remote';
  import Button from '@/components/ui/button/button.svelte';
  import Input from '@/components/ui/input/input.svelte';
  import PageTitle from '@/components/ui/page-title.svelte';
  import { handleResult } from '@/remote-functions';

  let { params } = $props();

  let repository = $derived(await getMyRepository({ id: params.id }));
</script>

<PageTitle title={`Repository Details: ${repository.name}`} description="TODO" />

<form
  {...deleteRepository.enhance(
    handleResult(deleteRepository, { goto: '/(bootstrapped)/(protected)/repos' }),
  )}
>
  <Input {...deleteRepository.fields.id.as('hidden', repository.id)} />
  <Button type="submit" variant="destructive" disabled={!!deleteRepository.pending}>Delete</Button>
</form>
