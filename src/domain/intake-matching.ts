import type {
  CaseStatus,
  ClientCase,
  EntityId,
  Person,
  Program,
  Staff,
} from '~/domain/workspace'
import { getProgram } from '~/domain/workspace'

export type IntakeMatchInput = {
  firstName: string
  lastName: string
  dateOfBirth?: string
  phone?: string
  email?: string
  ssn?: string
}

export type IntakeMatch = {
  id: EntityId
  personId: EntityId
  caseId?: EntityId
  recordType: 'Person'
  clientName: string
  dateOfBirth?: string
  phone?: string
  email?: string
  caseStatus?: CaseStatus
  programArea: string
  lastUpdated: string
  assignedStaff?: string
  strength: 'High confidence' | 'Medium confidence' | 'Low confidence'
  action: 'view_case' | 'reintake' | 'start_intake'
}

const normalize = (value?: string) => value?.trim().toLowerCase() ?? ''
const normalizePhone = (value?: string) => value?.replace(/\D/g, '') ?? ''
const normalizeSsn = (value?: string) => value?.replace(/\D/g, '') ?? ''

export function findPersonIntakeMatches({
  cases,
  input,
  people,
  programs,
  staff,
}: {
  cases: ClientCase[]
  input: IntakeMatchInput
  people: Person[]
  programs: Program[]
  staff: Staff[]
}) {
  const firstName = normalize(input.firstName)
  const lastName = normalize(input.lastName)
  const phone = normalizePhone(input.phone)
  const email = normalize(input.email)
  const ssn = normalizeSsn(input.ssn)

  if (
    !firstName &&
    !lastName &&
    !phone &&
    !email &&
    !input.dateOfBirth &&
    !ssn
  ) {
    return []
  }

  return people.reduce<IntakeMatch[]>((matches, person) => {
    const nameScore =
      (firstName && normalize(person.firstName).startsWith(firstName)) ||
      (lastName && normalize(person.lastName).startsWith(lastName))
    const exactContact =
      (phone && normalizePhone(person.phone) === phone) ||
      (email && normalize(person.email) === email)
    const exactIdentity =
      input.dateOfBirth && person.dateOfBirth === input.dateOfBirth

    if (!nameScore && !exactContact && !exactIdentity) {
      return matches
    }

    const caseRecord = cases.find((item) => item.personId === person.id)
    const firstEnrollment = caseRecord?.enrollments[0]
    const program = firstEnrollment
      ? getProgram(programs, firstEnrollment.programId)
      : undefined
    const primaryStaffId = firstEnrollment?.caseworkers.find(
      (assignment) => assignment.isPrimary,
    )?.staffId
    const clientName = [person.firstName, person.lastName]
      .filter(Boolean)
      .join(' ')
      .trim()

    matches.push({
      id: person.id,
      personId: person.id,
      caseId: caseRecord?.id,
      recordType: 'Person',
      clientName: clientName || `Person ${person.id}`,
      dateOfBirth: person.dateOfBirth,
      phone: person.phone,
      email: person.email,
      caseStatus: caseRecord?.status,
      programArea: program?.name ?? (caseRecord ? 'No program assigned' : 'No case'),
      lastUpdated: caseRecord?.lastContact ?? '',
      assignedStaff: primaryStaffId
        ? staff.find((person) => person.id === primaryStaffId)?.name
        : undefined,
      strength:
        exactContact || exactIdentity
          ? 'High confidence'
          : firstName && lastName && nameScore
            ? 'Medium confidence'
            : 'Low confidence',
      action: caseRecord
        ? caseRecord.status === 'Closed'
          ? 'reintake'
          : 'view_case'
        : 'start_intake',
    })

    return matches
  }, [])
}
