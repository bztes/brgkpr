import { SSH_PASSPHRASE } from '$env/static/private';
import { getKeyPath } from './server-keys';
import { join } from 'path';
import { SSHConnectionPool, type SSHServerConfig } from './ssh-connection-pool';
import type { NodeSSH } from 'node-ssh';
import { getServer } from '@/api/servers.remote';
import { SvelteMap } from 'svelte/reactivity';
import type { InferQuery } from '@/remote-functions';

class RepoServerHub {
  private readonly sshConnectionPool = new SSHConnectionPool();
  private readonly byServerId = new SvelteMap<string, RepoServer>();

  public async get(serverId: string) {
    let repoServer = this.byServerId.get(serverId);
    if (repoServer) {
      return repoServer;
    }

    const server = await getServer({ serverId });
    repoServer = new RepoServer(server, this.sshConnectionPool);
    this.byServerId.set(server.id, repoServer);

    return repoServer;
  }
}

class RepoServer {
  private readonly server: InferQuery<typeof getServer>;
  private readonly sshConnectionPool: SSHConnectionPool;
  private readonly sshConfig: SSHServerConfig;
  private readonly authorizedKeysPath: string;

  constructor(server: InferQuery<typeof getServer>, sshConnectionPool: SSHConnectionPool) {
    this.server = server;
    this.sshConnectionPool = sshConnectionPool;
    this.sshConfig = {
      id: this.server.id,
      host: this.server.host,
      port: this.server.port,
      username: this.server.username,
      privateKeyPath: getKeyPath(this.server.id).privateKeyPath,
      passphrase: SSH_PASSPHRASE,
    };

    this.authorizedKeysPath = join(this.server.path, 'ssh_authorized_keys');
  }

  private repoPath(repo: { id: string; userId: string }) {
    return join(this.server.path, 'repos', repo.userId, repo.id);
  }

  private authorizedKeyPath(repo: { id: string }) {
    return join(this.authorizedKeysPath, `${repo.id}.pub`);
  }

  public checkHealth() {
    return this.sshConnectionPool.withConnection(this.sshConfig, async (ssh) => [
      {
        id: 'pathExists',
        healthy: (await ssh.execCommand(`[ -d "${this.server.path}" ]`)).code === 0,
      },
    ]);
  }

  public addRepoKey(repo: { id: string; userId: string; publicKey: string }) {
    return this.sshConnectionPool.withConnection(this.sshConfig, async (ssh) => {
      const repoPath = this.repoPath(repo);

      await ssh.mkdir(repoPath);
      await ssh.mkdir(this.authorizedKeysPath);
      await writeRemoteFile(
        ssh,
        this.authorizedKeyPath(repo),
        `command="cd ${repoPath}; borg serve --restrict-to-path ${repoPath}",restrict ${repo.publicKey}`,
      );
    });
  }

  public deleteRepoKey(repo: { id: string; userId: string }) {
    return this.sshConnectionPool.withConnection(this.sshConfig, async (ssh) => {
      await ssh.execCommand(`rm ${this.authorizedKeyPath(repo)}`);
      await ssh.execCommand(`rm -r ${this.repoPath(repo)}`);
    });
  }
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

export const repoServerHub = new RepoServerHub();
