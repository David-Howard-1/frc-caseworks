import { createFileRoute } from '@tanstack/react-router'
import { IntakeWorkflow } from '~/components/IntakeWorkflow'

export const Route = createFileRoute('/intake')({
  component: IntakeWorkflow,
})
