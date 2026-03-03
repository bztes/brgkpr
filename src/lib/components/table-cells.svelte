<script lang="ts" module>
  export { createdAtSnippet };

  const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
</script>

{#snippet createdAtSnippet(data: { createdAt: Date })}
  {dateTimeFormat.format(data.createdAt)}
{/snippet}
