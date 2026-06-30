import { queryOptions } from '@tanstack/react-query'
import { loadWorkspaceFn } from '~/fns/workspace'

export const WorkspaceQueries = {
  all: () => ['workspace'] as const,
  snapshot: () => [...WorkspaceQueries.all(), 'snapshot'] as const,
}

export function workspaceSnapshotQueryOptions() {
  return queryOptions({
    queryKey: WorkspaceQueries.snapshot(),
    queryFn: () => loadWorkspaceFn(),
    staleTime: 15_000,
  })
}
