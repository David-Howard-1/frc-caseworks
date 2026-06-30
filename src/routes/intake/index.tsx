import { createFileRoute } from '@tanstack/react-router'
import { IntakeMatchFinder } from '~/components/IntakeWorkflow'
import type { IntakeLookupSearch } from '~/components/IntakeWorkflow'

export const Route = createFileRoute('/intake/')({
  validateSearch: (search): IntakeLookupSearch => ({
    name: typeof search.name === 'string' ? search.name : undefined,
    dateOfBirth:
      typeof search.dateOfBirth === 'string' ? search.dateOfBirth : undefined,
    ssn: typeof search.ssn === 'string' ? search.ssn : undefined,
    phone: typeof search.phone === 'string' ? search.phone : undefined,
    email: typeof search.email === 'string' ? search.email : undefined,
  }),
  component: IntakeRoute,
})

function IntakeRoute() {
  const search = Route.useSearch()

  return <IntakeMatchFinder initialSearch={search} />
}
