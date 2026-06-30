import dayjs from 'dayjs'

export type EntityId = number

export type CaseStatus = 'Open' | 'Pending' | 'Closed'
export type ProgramStatus =
  | 'Active'
  | 'Pending'
  | 'Completed'
  | 'Inactive'
  | 'Waitlisted'
export type UserRole = 'Caseworker' | 'Program Supervisor' | 'Executive Director'
export type Grantor = string

export type Frc = {
  id: EntityId
  name: string
  legalName?: string
  county?: string
  state?: string
}

export type Program = {
  id: EntityId
  frcId: EntityId
  code: string
  name: string
  grantor: Grantor
  color: string
  supervisorId?: EntityId
}

export type Staff = {
  id: EntityId
  frcId: EntityId
  name: string
  role: UserRole
  programs: EntityId[]
}

export type PersonRole =
  | 'client'
  | 'caregiver'
  | 'child'
  | 'household_member'
  | 'collateral_contact'

export type Person = {
  id: EntityId
  frcId: EntityId
  role: PersonRole
  firstName?: string
  middleName?: string
  lastName?: string
  preferredName?: string
  pronouns?: string
  approximateAge?: string
  dateOfBirth?: string
  phone?: string
  email?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  county?: string
}

export type Intake = {
  intakeDate: string
  referralSource?: string
  county?: string
  phone?: string
  email?: string
  householdIncome?: string
  housing?: string
  strengths?: string
  needs?: string
}

export type IntakeStatus =
  | 'Draft'
  | 'Duplicate Review'
  | 'Rejected'
  | 'Converted to Case'

export type IntakeIncomeSource = {
  id: string
  type: string
  sourceName: string
  amount: string
  frequency: string
  notes?: string
}

export type IntakeBenefit = {
  id: string
  type: string
  isReceiving: boolean
  monthlyAmount?: string
  caseNumber?: string
  agency?: string
  notes?: string
}

export type IntakeContact = {
  id: string
  name: string
  relationship: string
  organization?: string
  role?: string
  phone?: string
  email?: string
  permissionToContact: boolean
  notes?: string
}

export type IntakeSubmission = {
  id: EntityId
  status: IntakeStatus
  createdById: EntityId
  convertedById?: EntityId
  caseId?: EntityId
  startedAt: string
  savedAt?: string
  duplicateWarnings: string[]
  duplicateOverrideReason?: string
  client: {
    firstName: string
    middleName?: string
    lastName: string
    preferredName?: string
    dateOfBirth?: string
    ssn?: string
    approximateAge?: string
    phone?: string
    alternatePhone?: string
    email?: string
    preferredContactMethod?: string
    safeToCall: boolean
    safeToText: boolean
    safeToEmail: boolean
    contactRestrictions?: string
  }
  demographics: {
    gender?: string
    race?: string
    ethnicity?: string
    primaryLanguage?: string
    interpreterNeeded: boolean
    veteranStatus?: string
    disabilityStatus?: string
    householdSize?: string
    dependents?: string
    maritalStatus?: string
  }
  address: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postalCode?: string
    county?: string
  }
  incomeSources: IntakeIncomeSource[]
  benefits: IntakeBenefit[]
  relevantContacts: IntakeContact[]
  legal: {
    hasCourtInvolvement: boolean
    matterType?: string
    courtName?: string
    county?: string
    caseNumber?: string
    judge?: string
    attorney?: string
    officer?: string
    nextCourtDate?: string
    courtTime?: string
    legalStatus?: string
    warrantsKnown: boolean
    notes?: string
  }
  housing: {
    status: string
    currentLocation?: string
    lengthOfStay?: string
    safeHousing: boolean
    atRisk: boolean
    evictionPending: boolean
    livingWithFamily: boolean
    notes?: string
  }
}

export type ProgramCaseworkerAssignment = {
  staffId: EntityId
  isPrimary: boolean
}

export type CaseProgramEnrollment = {
  id: EntityId
  programId: EntityId
  caseworkers: ProgramCaseworkerAssignment[]
  supervisorId?: EntityId
  status: ProgramStatus
  opened: string
  target: string
  goal: string
}

export type CaseNote = {
  id: EntityId
  caseId: EntityId
  enrollmentId?: EntityId
  authorId: EntityId
  date: string
  contactType: string
  summary: string
  body: string
  isSession: boolean
  sessionHours?: number
}

export type ConcreteService = {
  id: EntityId
  caseId: EntityId
  enrollmentId?: EntityId
  date: string
  category: string
  description: string
  amount: number
  grantor: Grantor
}

export type RelatedPerson = {
  id: EntityId
  name: string
  relationship: string
  age: number
  linkedCaseId?: EntityId
  inHousehold: boolean
}

export type ClientCase = {
  id: EntityId
  personId: EntityId
  displayName: string
  pronouns?: string
  age: number
  status: CaseStatus
  opened: string
  lastContact: string
  risk: 'Low' | 'Medium' | 'High'
  county: string
  intake: Intake
  enrollments: CaseProgramEnrollment[]
  relatedPeople: RelatedPerson[]
}

export type WorkspaceSnapshot = {
  frcs: Frc[]
  programs: Program[]
  staff: Staff[]
  people: Person[]
  cases: ClientCase[]
  intakeSubmissions: IntakeSubmission[]
  notes: CaseNote[]
  services: ConcreteService[]
}

export const emptyWorkspaceSnapshot: WorkspaceSnapshot = {
  frcs: [],
  programs: [],
  staff: [],
  people: [],
  cases: [],
  intakeSubmissions: [],
  notes: [],
  services: [],
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export const formatExactCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)

export const formatDate = (value: string) =>
  value ? dayjs(value).format('MMM D, YYYY') : 'Not recorded'

export const formatDateTime = (value: string) =>
  dayjs(value).format('MMM D, YYYY h:mm A')

export function getProgram(programs: Program[], programId?: EntityId) {
  return programs.find((program) => program.id === programId)
}

export function getStaff(staff: Staff[], staffId?: EntityId) {
  return staff.find((person) => person.id === staffId)
}

export function getAssignedCaseworkers(
  staff: Staff[],
  enrollment: CaseProgramEnrollment,
) {
  return enrollment.caseworkers
    .map((assignment) => ({
      assignment,
      staff: getStaff(staff, assignment.staffId),
    }))
    .filter((item) => item.staff)
}

export function getPrimaryCaseworker(
  staff: Staff[],
  enrollment: CaseProgramEnrollment,
) {
  const primaryAssignment =
    enrollment.caseworkers.find((assignment) => assignment.isPrimary) ??
    enrollment.caseworkers[0]

  return primaryAssignment ? getStaff(staff, primaryAssignment.staffId) : undefined
}

export function visibleCasesForRole(
  cases: ClientCase[],
  role: UserRole,
  staffId?: EntityId,
) {
  if (role === 'Executive Director') {
    return cases
  }

  if (!staffId) {
    return []
  }

  if (role === 'Program Supervisor') {
    return cases.filter((caseRecord) =>
      caseRecord.enrollments.some((enrollment) => enrollment.supervisorId === staffId),
    )
  }

  return cases.filter((caseRecord) =>
    caseRecord.enrollments.some((enrollment) =>
      enrollment.caseworkers.some(
        (assignment) => assignment.staffId === staffId,
      ),
    ),
  )
}

export function calculateMetrics(
  cases: ClientCase[],
  notes: CaseNote[],
  services: ConcreteService[],
) {
  const openCases = cases.filter((caseRecord) => caseRecord.status === 'Open')
  const pendingCases = cases.filter(
    (caseRecord) => caseRecord.status === 'Pending',
  )
  const activeEnrollments = cases.flatMap((caseRecord) =>
    caseRecord.enrollments.filter(
      (enrollment) => enrollment.status === 'Active',
    ),
  )
  const serviceSpend = services.reduce((sum, service) => sum + service.amount, 0)
  const currentMonth = dayjs().format('YYYY-MM')

  return {
    openCases: openCases.length,
    pendingCases: pendingCases.length,
    activeEnrollments: activeEnrollments.length,
    serviceSpend,
    notesThisMonth: notes.filter((note) => note.date.startsWith(currentMonth))
      .length,
  }
}

export function buildGrantReport(
  programs: Program[],
  cases: ClientCase[],
  notes: CaseNote[],
  services: ConcreteService[],
  grantor: Grantor,
) {
  const programIds = programs
    .filter((program) => program.grantor === grantor)
    .map((program) => program.id)
  const enrollments = cases.flatMap((caseRecord) =>
    caseRecord.enrollments
      .filter((enrollment) => programIds.includes(enrollment.programId))
      .map((enrollment) => ({ caseRecord, enrollment })),
  )
  const enrollmentIds = enrollments.map(({ enrollment }) => enrollment.id)
  const grantServices = services.filter((service) => service.grantor === grantor)
  const grantNotes = notes.filter((note) =>
    note.enrollmentId ? enrollmentIds.includes(note.enrollmentId) : false,
  )
  const activeClients = new Set(
    enrollments
      .filter(({ enrollment }) => enrollment.status === 'Active')
      .map(({ caseRecord }) => caseRecord.id),
  )

  return {
    activeClients: activeClients.size,
    totalEnrollments: enrollments.length,
    servicesProvided: grantServices.length,
    dollarsSpent: grantServices.reduce((sum, service) => sum + service.amount, 0),
    caseNotes: grantNotes.length,
  }
}
