<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { navAdmin, navUser } from './navigation.js';
  import AutoBreadcrumb from './breadcrumb.svelte';
  import NavUser from './nav-user.svelte';
  import { MoonIcon, SunIcon } from '@lucide/svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { resetMode, setMode } from 'mode-watcher';
  import { buttonVariants } from '@/components/ui/button/button.svelte';
  import { requireUser } from '@/api/auth.remote.js';
  import { routeNode } from '@/route.svelte.js';
  import Logo from '@/components/logo.svelte';
  import { page } from '$app/state';

  let { children } = $props();

  let user = $derived(await requireUser());

  $effect(routeNode(import.meta.url, () => 'Home'));

  let navItems = $derived([...navUser, ...(user.role === 'admin' ? navAdmin : [])]);
</script>

<Sidebar.Provider>
  <Sidebar.Root variant="inset">
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton size="lg">
            {#snippet child({ props })}
              <a href="/" {...props}>
                <div class="flex size-8 items-center justify-center">
                  <Logo />
                </div>
                <div class="grid flex-1 text-start text-sm leading-tight">
                  <span class="truncate font-medium">BrgKpr</span>
                  <span class="truncate text-xs">Borg Repo Manager</span>
                </div>
              </a>
            {/snippet}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content>
      {#each navItems as group (group.title)}
        <Sidebar.Group>
          <Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {#each group.items as item (item.title)}
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton isActive={item.path === page.url.pathname}>
                    {#snippet child({ props })}
                      <a href={item.path} {...props}>{item.title}</a>
                    {/snippet}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              {/each}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      {/each}
    </Sidebar.Content>
    <Sidebar.Footer>
      <NavUser {user} />
    </Sidebar.Footer>
  </Sidebar.Root>
  <Sidebar.Inset>
    <header class="mx-4 flex h-16 shrink-0 items-center gap-2">
      <Sidebar.Trigger class="-ms-1" />
      <div class="h-8 border-l pr-2"></div>
      <AutoBreadcrumb class="flex-1" />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
          <SunIcon
            class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
          />
          <MoonIcon
            class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
          />
          <span class="sr-only">Toggle theme</span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item onclick={() => setMode('light')}>Light</DropdownMenu.Item>
          <DropdownMenu.Item onclick={() => setMode('dark')}>Dark</DropdownMenu.Item>
          <DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </header>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      {@render children()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
