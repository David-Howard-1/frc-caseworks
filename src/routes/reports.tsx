import { createFileRoute } from '@tanstack/react-router'
import { ReportsOverview } from '~/components/ReportsOverview'

export const Route = createFileRoute('/reports')({
  component: ReportsOverview,
})
