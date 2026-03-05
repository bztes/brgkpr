import { createHash } from 'crypto';
import { NodeSSH } from 'node-ssh';
import stringify from 'fast-json-stable-stringify';

export type SSHServerConfig = {
  id: string;
  host: string;
  port: number;
  username: string;
  privateKeyPath: string;
  passphrase: string;
};

type PoolEntry = {
  ssh: NodeSSH;
  configHash: string;
  connectPromise: Promise<NodeSSH> | null;
  refCount: number;
  lastUsedAt: number;
  idleTimer: ReturnType<typeof setTimeout> | null;
};

export class SSHConnectionPool {
  private readonly entries = new Map<string, PoolEntry>();

  constructor(private readonly idleTimeoutMs = 60_000) {}

  async acquire(config: SSHServerConfig): Promise<NodeSSH> {
    let entry = this.entries.get(config.id);
    const configHash = hashObject(config);

    if (entry && entry.configHash !== configHash) {
      this.disposeEntry(config.id, entry);
      entry = undefined;
    }

    if (!entry) {
      const ssh = new NodeSSH();
      entry = {
        ssh,
        configHash,
        connectPromise: null,
        refCount: 0,
        lastUsedAt: Date.now(),
        idleTimer: null,
      };
      this.entries.set(config.id, entry);
    }

    this.clearIdleTimer(entry);
    entry.refCount += 1;

    try {
      return await this.ensureConnected(entry, config);
    } catch (error) {
      entry.refCount = Math.max(0, entry.refCount - 1);
      if (entry.refCount === 0) {
        entry.lastUsedAt = Date.now();
        this.scheduleIdleDispose(config.id, entry);
      }
      throw error;
    }
  }

  release(serverId: string): void {
    const entry = this.entries.get(serverId);
    if (!entry) return;

    entry.refCount = Math.max(0, entry.refCount - 1);
    entry.lastUsedAt = Date.now();
    if (entry.refCount === 0) {
      this.scheduleIdleDispose(serverId, entry);
    }
  }

  async withConnection<T>(server: SSHServerConfig, fn: (ssh: NodeSSH) => Promise<T>): Promise<T> {
    const ssh = await this.acquire(server);
    try {
      return await fn(ssh);
    } finally {
      this.release(server.id);
    }
  }

  dispose(serverId: string): void {
    const entry = this.entries.get(serverId);
    if (!entry) return;
    this.disposeEntry(serverId, entry);
  }

  disposeAll(): void {
    for (const [serverId, entry] of this.entries.entries()) {
      this.disposeEntry(serverId, entry);
    }
  }

  private async ensureConnected(entry: PoolEntry, server: SSHServerConfig): Promise<NodeSSH> {
    if (entry.ssh.isConnected()) {
      return entry.ssh;
    }

    if (!entry.connectPromise) {
      entry.connectPromise = entry.ssh.connect(server);
      entry.connectPromise.finally(() => {
        entry.connectPromise = null;
      });
    }

    return await entry.connectPromise;
  }

  private scheduleIdleDispose(serverId: string, entry: PoolEntry): void {
    if (entry.idleTimer) {
      return;
    }

    entry.idleTimer = setTimeout(() => {
      entry.idleTimer = null;
      if (entry.refCount > 0) {
        return;
      }

      const idleFor = Date.now() - entry.lastUsedAt;
      if (idleFor >= this.idleTimeoutMs) {
        this.disposeEntry(serverId, entry);
      } else {
        this.scheduleIdleDispose(serverId, entry);
      }
    }, this.idleTimeoutMs);
  }

  private clearIdleTimer(entry: PoolEntry): void {
    if (!entry.idleTimer) {
      return;
    }
    clearTimeout(entry.idleTimer);
    entry.idleTimer = null;
  }

  private disposeEntry(serverId: string, entry: PoolEntry): void {
    this.clearIdleTimer(entry);
    entry.ssh.dispose();
    this.entries.delete(serverId);
  }
}

function hashObject(obj: unknown): string {
  const stable = stringify(obj);
  return createHash('sha256').update(stable).digest('hex');
}
