import z from 'zod';

export const createRepositorySchema = z.object({
  name: z.string().nonempty(),
  serverId: z.uuid(),
  publicKey: z.string().trim().min(1).refine(isValidSshPublicKey, 'Invalid SSH public key format.'),
});

export const getMyRepositorySchema = z.object({ id: z.uuid() });

export const deleteRepositorySchema = z.object({ id: z.uuid() });

export function isValidSshPublicKey(value: string): boolean {
  if (/[\r\n]/.test(value)) {
    return false;
  }

  const match = value.match(/^(ssh-rsa|ssh-ed25519) +([A-Za-z0-9+/]+={0,2})(?: +[^\r\n]*)?$/);
  if (!match) {
    return false;
  }

  const base64Payload = match[2];
  const withoutPadding = base64Payload.replace(/=+$/, '');
  if (withoutPadding.length === 0 || withoutPadding.length % 4 === 1) {
    return false;
  }

  try {
    atob(base64Payload);
    return true;
  } catch {
    return false;
  }
}
