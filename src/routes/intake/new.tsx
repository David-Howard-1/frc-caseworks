import { createFileRoute } from '@tanstack/react-router'
import { PrimaryIntakeFormPage } from '~/components/IntakeWorkflow'
import type { IntakeFormSearch } from '~/components/IntakeWorkflow'

export const Route = createFileRoute('/intake/new')({
  validateSearch: (search): IntakeFormSearch => ({
    name: typeof search.name === 'string' ? search.name : undefined,
    dateOfBirth:
      typeof search.dateOfBirth === 'string' ? search.dateOfBirth : undefined,
    ssn: typeof search.ssn === 'string' ? search.ssn : undefined,
    phone: typeof search.phone === 'string' ? search.phone : undefined,
    email: typeof search.email === 'string' ? search.email : undefined,
    personId:
      typeof search.personId === 'string'
        ? Number(search.personId)
        : typeof search.personId === 'number'
          ? search.personId
          : undefined,
    caseId:
      typeof search.caseId === 'string'
        ? Number(search.caseId)
        : typeof search.caseId === 'number'
          ? search.caseId
          : undefined,
    mode: search.mode === 'reintake' ? 'reintake' : undefined,
  }),
  component: IntakeNewRoute,
})

function IntakeNewRoute() {
  const search = Route.useSearch()

  return <PrimaryIntakeFormPage search={search} />
}
