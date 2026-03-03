<script lang="ts" module>
  import type { Snippet } from 'svelte';

  export interface Column<T> {
    id: string;
    headerName: string;
    snippet: Snippet<[T]>;
    style?: string;
  }

  export function createSvelteTable<T>(columnsDef: Column<T>[]) {
    const columns = $state(columnsDef);

    return {
      get columns() {
        return columns;
      },
    };
  }
</script>

<script lang="ts" generics="T extends {id: string}">
  import * as Table from '$lib/components/ui/table/index.js';

  interface Props<T> {
    columns: Column<T>[];
    rows: T[];
  }

  let { columns, rows }: Props<T> = $props();
</script>

<div class="rounded-md border">
  <Table.Root>
    <Table.Header>
      <Table.Row>
        {#each columns as column (column.id)}
          <Table.Head>
            {column.headerName}
          </Table.Head>
        {/each}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each rows as row (row.id)}
        <Table.Row>
          {#each columns as column (column.id)}
            <Table.Cell class={column.style}>
              {@render column.snippet(row)}
            </Table.Cell>
          {/each}
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
