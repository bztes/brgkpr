<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import type { User } from 'better-auth';

  interface Props {
    user: User;
  }

  let { user }: Props = $props();

  export function getAvatarShortcut(username: string): string {
    const parts = username.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return '';

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
</script>

<Avatar.Root class="size-8 rounded-lg">
  <Avatar.Image src={user.image} alt={user.name} />
  <Avatar.Fallback class="rounded-lg">{getAvatarShortcut(user.name)}</Avatar.Fallback>
</Avatar.Root>
