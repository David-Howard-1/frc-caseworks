import dayjs from 'dayjs'

export type CaseStatus = 'Open' | 'Pending' | 'Closed'
export type ProgramStatus =
  | 'Active'
  | 'Pending'
  | 'Completed'
  | 'Inactive'
  | 'Waitlisted'
export type UserRole = 'Caseworker' | 'Program Supervisor' | 'Executive Director'
export type Grantor = 'ANFRC' | 'A-RESET' | 'Private Foundation' | 'Medicaid'

export type Program = {
  id: string
  code: string
  name: string
  grantor: Grantor
  color: string
  supervisorId: string
}

export type Staff = {
  id: string
  name: string
  role: UserRole
  programs: string[]
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

export type ProgramCaseworkerAssignment = {
  staffId: string
  isPrimary: boolean
}

export type CaseProgramEnrollment = {
  id: string
  programId: string
  caseworkers: ProgramCaseworkerAssignment[]
  supervisorId: string
  status: ProgramStatus
  opened: string
  target: string
  goal: string
}

export type CaseNote = {
  id: string
  caseId: string
  enrollmentId: string
  authorId: string
  date: string
  contactType: string
  summary: string
  body: string
  isSession: boolean
  sessionHours?: number
}

export type ConcreteService = {
  id: string
  caseId: string
  enrollmentId: string
  date: string
  category: string
  description: string
  amount: number
  grantor: Grantor
}

export type RelatedPerson = {
  id: string
  name: string
  relationship: string
  age: number
  linkedCaseId?: string
  inHousehold: boolean
}

export type ClientCase = {
  id: string
  personId: string
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

export const programs: Program[] = [
  {
    id: 'anf-parents',
    code: 'ANFRC-PF',
    name: 'Parenting & Family Support',
    grantor: 'ANFRC',
    color: '#1C5380',
    supervisorId: 'u-2',
  },
  {
    id: 'areset-work',
    code: 'A-RESET',
    name: 'Workforce Readiness',
    grantor: 'A-RESET',
    color: '#2E7D61',
    supervisorId: 'u-4',
  },
  {
    id: 'clinical',
    code: 'CLIN-MED',
    name: 'Clinical Services',
    grantor: 'Medicaid',
    color: '#6B5CA5',
    supervisorId: 'u-2',
  },
  {
    id: 'basic-needs',
    code: 'BN-2026',
    name: 'Basic Needs Stabilization',
    grantor: 'Private Foundation',
    color: '#B7791F',
    supervisorId: 'u-4',
  },
]

export const staff: Staff[] = [
  {
    id: 'u-1',
    name: 'Maya Rios',
    role: 'Caseworker',
    programs: ['anf-parents', 'basic-needs'],
  },
  {
    id: 'u-2',
    name: 'Jordan Lee',
    role: 'Program Supervisor',
    programs: ['anf-parents', 'clinical'],
  },
  {
    id: 'u-3',
    name: 'Sam Carter',
    role: 'Caseworker',
    programs: ['areset-work', 'clinical'],
  },
  {
    id: 'u-6',
    name: 'Riley Chen',
    role: 'Caseworker',
    programs: ['anf-parents', 'clinical'],
  },
  {
    id: 'u-7',
    name: 'Taylor Nguyen',
    role: 'Caseworker',
    programs: ['areset-work', 'basic-needs'],
  },
  {
    id: 'u-4',
    name: 'Priya Nair',
    role: 'Program Supervisor',
    programs: ['areset-work', 'basic-needs'],
  },
  {
    id: 'u-5',
    name: 'Elena Brooks',
    role: 'Executive Director',
    programs: ['anf-parents', 'areset-work', 'clinical', 'basic-needs'],
  },
]

export const initialCases: ClientCase[] = [
  {
    id: 'case-1042',
    personId: 'person-1042',
    displayName: 'Alicia Morgan',
    pronouns: 'she/her',
    age: 34,
    status: 'Open',
    opened: '2026-04-02',
    lastContact: '2026-06-05',
    risk: 'Medium',
    county: 'Jefferson',
    intake: {
      intakeDate: '2026-04-02',
      referralSource: 'School family advocate',
      county: 'Jefferson',
      phone: '(502) 555-0198',
      email: 'alicia@example.org',
      householdIncome: '$2,250 monthly',
      housing: 'Renting; behind one month',
      strengths: 'Strong extended family support; reliable transportation.',
      needs: 'Diapers, utility support, parenting group, diabetes medication.',
    },
    enrollments: [
      {
        id: 'enr-1',
        programId: 'anf-parents',
        caseworkers: [
          { staffId: 'u-1', isPrimary: true },
          { staffId: 'u-6', isPrimary: false },
        ],
        supervisorId: 'u-2',
        status: 'Active',
        opened: '2026-04-02',
        target: '2026-09-30',
        goal: 'Complete parenting circle and stabilize child care routine.',
      },
      {
        id: 'enr-2',
        programId: 'basic-needs',
        caseworkers: [
          { staffId: 'u-1', isPrimary: true },
          { staffId: 'u-7', isPrimary: false },
        ],
        supervisorId: 'u-4',
        status: 'Active',
        opened: '2026-04-04',
        target: '2026-07-15',
        goal: 'Resolve immediate household supply and medication gaps.',
      },
      {
        id: 'enr-3',
        programId: 'clinical',
        caseworkers: [
          { staffId: 'u-6', isPrimary: true },
          { staffId: 'u-3', isPrimary: false },
        ],
        supervisorId: 'u-2',
        status: 'Pending',
        opened: '2026-06-03',
        target: '2026-08-01',
        goal: 'Confirm Medicaid eligibility for behavioral health referral.',
      },
    ],
    relatedPeople: [
      {
        id: 'rel-1',
        name: 'Noah Morgan',
        relationship: 'Child',
        age: 5,
        inHousehold: true,
      },
      {
        id: 'rel-2',
        name: 'Denise Morgan',
        relationship: 'Parent',
        age: 61,
        linkedCaseId: 'case-1088',
        inHousehold: false,
      },
    ],
  },
  {
    id: 'case-1088',
    personId: 'person-1088',
    displayName: 'Denise Morgan',
    pronouns: 'she/her',
    age: 61,
    status: 'Open',
    opened: '2026-05-11',
    lastContact: '2026-06-03',
    risk: 'Low',
    county: 'Jefferson',
    intake: {
      intakeDate: '2026-05-11',
      referralSource: 'Family member',
      county: 'Jefferson',
      phone: '(502) 555-0172',
      housing: 'Owns home',
      strengths: 'Stable housing; willing to be a caregiver support.',
      needs: 'Diabetes medication assistance and benefits checkup.',
    },
    enrollments: [
      {
        id: 'enr-4',
        programId: 'basic-needs',
        caseworkers: [
          { staffId: 'u-1', isPrimary: true },
          { staffId: 'u-7', isPrimary: false },
        ],
        supervisorId: 'u-4',
        status: 'Active',
        opened: '2026-05-11',
        target: '2026-07-01',
        goal: 'Bridge medication costs while Medicare Part D issue is resolved.',
      },
    ],
    relatedPeople: [
      {
        id: 'rel-3',
        name: 'Alicia Morgan',
        relationship: 'Adult child',
        age: 34,
        linkedCaseId: 'case-1042',
        inHousehold: false,
      },
    ],
  },
  {
    id: 'case-1150',
    personId: 'person-1150',
    displayName: 'Marcus Reed',
    pronouns: 'he/him',
    age: 29,
    status: 'Open',
    opened: '2026-03-18',
    lastContact: '2026-06-06',
    risk: 'High',
    county: 'Fayette',
    intake: {
      intakeDate: '2026-03-18',
      referralSource: 'Probation reentry partner',
      county: 'Fayette',
      phone: '(859) 555-0124',
      email: 'marcus@example.org',
      householdIncome: '$960 monthly',
      housing: 'Transitional housing',
      strengths: 'Prior warehouse experience; CDL permit in progress.',
      needs: 'A-RESET participation, CDL fees, work clothing, rent deposit.',
    },
    enrollments: [
      {
        id: 'enr-5',
        programId: 'areset-work',
        caseworkers: [
          { staffId: 'u-3', isPrimary: true },
          { staffId: 'u-7', isPrimary: false },
        ],
        supervisorId: 'u-4',
        status: 'Active',
        opened: '2026-03-18',
        target: '2026-08-30',
        goal: 'Obtain CDL license and secure full-time employment.',
      },
      {
        id: 'enr-6',
        programId: 'basic-needs',
        caseworkers: [
          { staffId: 'u-7', isPrimary: true },
          { staffId: 'u-1', isPrimary: false },
        ],
        supervisorId: 'u-4',
        status: 'Active',
        opened: '2026-04-15',
        target: '2026-07-30',
        goal: 'Support work readiness with transportation and clothing.',
      },
    ],
    relatedPeople: [
      {
        id: 'rel-4',
        name: 'Imani Reed',
        relationship: 'Sibling',
        age: 25,
        inHousehold: false,
      },
    ],
  },
  {
    id: 'case-1214',
    personId: 'person-1214',
    displayName: 'Theresa Kim',
    pronouns: 'she/her',
    age: 42,
    status: 'Pending',
    opened: '2026-06-07',
    lastContact: '2026-06-07',
    risk: 'Medium',
    county: 'Oldham',
    intake: {
      intakeDate: '2026-06-07',
      referralSource: 'Walk-in',
      county: 'Oldham',
      phone: '(502) 555-0166',
      housing: 'Staying with friend',
      strengths: 'Recently completed intake; open to employment services.',
      needs: 'Program assignment and immediate food support screening.',
    },
    enrollments: [],
    relatedPeople: [
      {
        id: 'rel-5',
        name: 'Grace Kim',
        relationship: 'Child',
        age: 14,
        inHousehold: true,
      },
    ],
  },
  {
    id: 'case-0995',
    personId: 'person-0995',
    displayName: 'Owen Patel',
    pronouns: 'he/him',
    age: 47,
    status: 'Closed',
    opened: '2025-11-03',
    lastContact: '2026-04-29',
    risk: 'Low',
    county: 'Shelby',
    intake: {
      intakeDate: '2025-11-03',
      referralSource: 'Community clinic',
      county: 'Shelby',
      phone: '(502) 555-0111',
      housing: 'Stable rental',
      strengths: 'Completed treatment plan; employed full time.',
      needs: 'Case closed after goals completed.',
    },
    enrollments: [
      {
        id: 'enr-7',
        programId: 'clinical',
        caseworkers: [
          { staffId: 'u-3', isPrimary: true },
          { staffId: 'u-6', isPrimary: false },
        ],
        supervisorId: 'u-2',
        status: 'Completed',
        opened: '2025-11-03',
        target: '2026-04-30',
        goal: 'Complete counseling referral and medication continuity plan.',
      },
    ],
    relatedPeople: [],
  },
]

export const initialNotes: CaseNote[] = [
  {
    id: 'note-1',
    caseId: 'case-1042',
    enrollmentId: 'enr-1',
    authorId: 'u-1',
    date: '2026-06-05',
    contactType: 'Home visit',
    summary: 'Parenting group follow-up',
    body: 'Alicia attended the second parenting circle. Discussed child care schedule and summer meals.',
    isSession: true,
    sessionHours: 1.25,
  },
  {
    id: 'note-2',
    caseId: 'case-1042',
    enrollmentId: 'enr-2',
    authorId: 'u-1',
    date: '2026-06-02',
    contactType: 'Service coordination',
    summary: 'Medication bridge approved',
    body: 'Confirmed pharmacy quote for diabetes medication and routed service request to Basic Needs.',
    isSession: false,
  },
  {
    id: 'note-3',
    caseId: 'case-1150',
    enrollmentId: 'enr-5',
    authorId: 'u-3',
    date: '2026-06-06',
    contactType: 'Phone',
    summary: 'CDL class start date',
    body: 'Marcus confirmed CDL class begins June 17. Needs boots and state testing fee by June 14.',
    isSession: true,
    sessionHours: 0.5,
  },
  {
    id: 'note-4',
    caseId: 'case-0995',
    enrollmentId: 'enr-7',
    authorId: 'u-3',
    date: '2026-04-29',
    contactType: 'Closure',
    summary: 'Clinical case closure',
    body: 'Goals completed. Client has ongoing provider and medication plan.',
    isSession: true,
    sessionHours: 0.75,
  },
]

export const initialServices: ConcreteService[] = [
  {
    id: 'svc-1',
    caseId: 'case-1042',
    enrollmentId: 'enr-2',
    date: '2026-05-29',
    category: 'Medication',
    description: 'Diabetes medication',
    amount: 84.62,
    grantor: 'Private Foundation',
  },
  {
    id: 'svc-2',
    caseId: 'case-1042',
    enrollmentId: 'enr-2',
    date: '2026-06-02',
    category: 'Family supplies',
    description: 'Diapers and wipes',
    amount: 57.18,
    grantor: 'Private Foundation',
  },
  {
    id: 'svc-3',
    caseId: 'case-1150',
    enrollmentId: 'enr-5',
    date: '2026-06-01',
    category: 'Training',
    description: 'CDL learner permit and testing fees',
    amount: 265,
    grantor: 'A-RESET',
  },
  {
    id: 'svc-4',
    caseId: 'case-1150',
    enrollmentId: 'enr-6',
    date: '2026-05-22',
    category: 'Work supports',
    description: 'Steel-toe boots',
    amount: 119.99,
    grantor: 'Private Foundation',
  },
  {
    id: 'svc-5',
    caseId: 'case-1088',
    enrollmentId: 'enr-4',
    date: '2026-05-28',
    category: 'Medication',
    description: 'Diabetes medication bridge',
    amount: 92.35,
    grantor: 'Private Foundation',
  },
]

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

export const formatDate = (value: string) => dayjs(value).format('MMM D, YYYY')

export const formatDateTime = (value: string) =>
  dayjs(value).format('MMM D, YYYY h:mm A')

export function getProgram(programId: string) {
  return programs.find((program) => program.id === programId)
}

export function getStaff(staffId: string) {
  return staff.find((person) => person.id === staffId)
}

export function getAssignedCaseworkers(enrollment: CaseProgramEnrollment) {
  return enrollment.caseworkers
    .map((assignment) => ({
      assignment,
      staff: getStaff(assignment.staffId),
    }))
    .filter((item) => item.staff)
}

export function getPrimaryCaseworker(enrollment: CaseProgramEnrollment) {
  const primaryAssignment =
    enrollment.caseworkers.find((assignment) => assignment.isPrimary) ??
    enrollment.caseworkers[0]

  return primaryAssignment ? getStaff(primaryAssignment.staffId) : undefined
}

export function visibleCasesForRole(
  cases: ClientCase[],
  role: UserRole,
  staffId: string,
) {
  if (role === 'Executive Director') {
    return cases
  }

  if (role === 'Program Supervisor') {
    return cases.filter((caseRecord) =>
      caseRecord.enrollments.some((enrollment) => enrollment.supervisorId === staffId),
    )
  }

  return cases.filter((caseRecord) =>
    caseRecord.enrollments.some(
      (enrollment) =>
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

  return {
    openCases: openCases.length,
    pendingCases: pendingCases.length,
    activeEnrollments: activeEnrollments.length,
    serviceSpend,
    notesThisMonth: notes.filter((note) => note.date.startsWith('2026-06'))
      .length,
  }
}

export function buildGrantReport(
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
    enrollmentIds.includes(note.enrollmentId),
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
