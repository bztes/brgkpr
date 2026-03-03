import type { RouteId } from '$app/types';

interface RouteNode {
  metaUrl: string;
  routeId: string;
  name: () => string;
  depth: number;
}

export const routes = $state<RouteNode[]>([]);

export function routeNode(metaUrl: string, name: () => string) {
  const routeId = toRouteId(metaUrl);
  const depth = metaUrl.split('/').length + (metaUrl.endsWith('+page.svelte') ? 0.5 : 0);
  addNode({ metaUrl, routeId, name, depth });
  return () => () => removeNode(metaUrl);
}

function addNode(node: RouteNode) {
  if (routes.find((n) => n.metaUrl === node.metaUrl)) {
    return;
  }
  routes.push(node);
  routes.sort((a, b) => a.depth - b.depth);
}

function removeNode(metaUrl: string) {
  const index = routes.findIndex((n) => n.metaUrl === metaUrl);
  routes.splice(index, 1);
}

function toRouteId(metaUrl: string): RouteId {
  const filePath = new URL(metaUrl).pathname;
  return filePath
    .replace('/src/routes', '')
    .replace('/page.meta.ts', '')
    .replace('/+page.svelte', '')
    .replace('/+layout.svelte', '') as RouteId;
}
