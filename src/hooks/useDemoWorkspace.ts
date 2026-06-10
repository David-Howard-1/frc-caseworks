import { useContext } from 'react'
import { DemoWorkspaceContext } from '~/context/DemoWorkspaceContext'

export function useDemoWorkspace() {
  const context = useContext(DemoWorkspaceContext)

  if (!context) {
    throw new Error('useDemoWorkspace must be used inside DemoWorkspaceProvider')
  }

  return context
}
