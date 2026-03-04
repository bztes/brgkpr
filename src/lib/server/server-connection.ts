import { NodeSSH } from 'node-ssh';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { serverTbl } from './db/schema';
import { SSH_PASSPHRASE } from '$env/static/private';
import { getKeyPath } from './server-keys';
import { join } from 'path';

export async function createServerConnection(serverId: string) {
  const server = await db.query.serverTbl.findFirst({ where: eq(serverTbl.id, serverId) });
  if (!server) {
    throw new Error(`Unknown server id ${serverId}`);
  }

  const ssh = new NodeSSH();
  await ssh.connect({
    host: server.host,
    username: server.username,
    privateKeyPath: getKeyPath(server.id).privateKeyPath,
    passphrase: SSH_PASSPHRASE,
  });

  const authorizedKeysPath = join(server.path, 'ssh_authorized_keys');

  function getRepoPath(repo: { id: string; userId: string }) {
    return join(server!.path, 'repos', repo.userId, repo.id);
  }

  function getAuthorizedKeyPath(repo: { id: string }) {
    return join(authorizedKeysPath, `${repo.id}.pub`);
  }

  return {
    checkHealth: async () => {
      return [
        {
          id: 'pathExists',
          healthy: (await ssh.execCommand(`[ -d "${server.path}" ]`)).code === 0,
        },
      ];
    },
    addRepoKey: async (repo: { id: string; userId: string; publicKey: string }) => {
      const repoPath = getRepoPath(repo);
      await ssh.mkdir(repoPath);

      await ssh.mkdir(authorizedKeysPath);
      await writeRemoteFile(
        ssh,
        getAuthorizedKeyPath(repo),
        `command="borg serve --restrict-to-path ${repoPath}",restrict ${repo.publicKey}`,
      );
    },
  };
}

async function writeRemoteFile(ssh: NodeSSH, path: string, content: string) {
  const sftp = await ssh.requestSFTP();

  return new Promise((resolve, reject) => {
    const stream = sftp.createWriteStream(path);
    stream.once('error', reject);
    stream.once('close', resolve);
    stream.end(content);
  });
}
