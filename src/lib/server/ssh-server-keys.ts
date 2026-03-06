import { DATA } from '$env/static/private';
import { execFileSync } from 'child_process';
import { mkdir, rm, readFile } from 'fs/promises';
import { join, resolve } from 'path';

const keysDir = resolve(DATA, 'server-keys');

export function getKeyPath(id: string) {
  const keyPath = join(keysDir, id);
  return { privateKeyPath: keyPath, publicKeyPath: `${keyPath}.pub` };
}

export async function generateSSHKeyPair(passphrase: string) {
  await mkdir(keysDir, { recursive: true });
  const id = crypto.randomUUID();
  const { privateKeyPath, publicKeyPath } = getKeyPath(id);

  execFileSync('ssh-keygen', [
    '-t',
    'ed25519',
    '-f',
    privateKeyPath,
    '-C',
    'brgkpr',
    '-N',
    passphrase,
  ]);

  return {
    id,
    publicKey: await readFile(publicKeyPath, 'utf8'),
  };
}

export async function deleteKey(id: string) {
  await mkdir(keysDir, { recursive: true });
  const { privateKeyPath, publicKeyPath } = getKeyPath(id);
  await rm(privateKeyPath);
  await rm(publicKeyPath);
}
