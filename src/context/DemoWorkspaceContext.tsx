import { createContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  type CaseNote,
  type CaseProgramEnrollment,
  type CaseStatus,
  type ClientCase,
  type ConcreteService,
  type Intake,
  type IntakeSubmission,
  type ProgramStatus,
  type UserRole,
  calculateMetrics,
  getProgram,
  initialCases,
  initialNotes,
  initialServices,
  staff,
  visibleCasesForRole,
} from '~/domain/demo-data'

const TODAY = '2026-06-10'

const roleDefaults: Record<UserRole, string> = {
  Caseworker: 'u-1',
  'Program Supervisor': 'u-2',
  'Executive Director': 'u-5',
}

const normalize = (value?: string) => value?.trim().toLowerCase() ?? ''
const normalizePhone = (value?: string) => value?.replace(/\D/g, '') ?? ''

export type AddNoteInput = {
  enrollmentId: string
  contactType: string
  summary: string
  body: string
  isSession: boolean
  sessionHours?: number
}

export type EditNoteInput = AddNoteInput

export type AddServiceInput = {
  enrollmentId: string
  category: string
  description: string
  amount: number
}

export type DemoWorkspaceContextValue = {
  cases: ClientCase[]
  notes: CaseNote[]
  services: ConcreteService[]
  role: UserRole
  currentStaffId: string
  staffChoices: typeof staff
  visibleCases: ClientCase[]
  intakeSubmissions: IntakeSubmission[]
  metrics: ReturnType<typeof calculateMetrics>
  setRole: (role: UserRole) => void
  setCurrentStaffId: (staffId: string) => void
  updateCaseStatus: (caseId: string, status: CaseStatus) => void
  updateEnrollment: (
    caseId: string,
    enrollmentId: string,
    patch: Partial<CaseProgramEnrollment>,
  ) => void
  addCaseworkerAssignment: (
    caseId: string,
    enrollmentId: string,
    staffId: string,
  ) => void
  removeCaseworkerAssignment: (
    caseId: string,
    enrollmentId: string,
    staffId: string,
  ) => void
  setPrimaryCaseworker: (
    caseId: string,
    enrollmentId: string,
    staffId: string,
  ) => void
  updateIntakeField: (
    caseId: string,
    field: keyof Intake,
    value: string,
  ) => void
  findIntakeMatches: (input: IntakeMatchInput) => IntakeMatch[]
  createCaseFromIntake: (input: IntakeSubmission) => string
  addNote: (caseId: string, input: AddNoteInput) => void
  editNote: (noteId: string, input: EditNoteInput) => void
  addConcreteService: (caseId: string, input: AddServiceInput) => void
}

export const DemoWorkspaceContext =
  createContext<DemoWorkspaceContextValue | null>(null)

export type IntakeMatchInput = {
  firstName: string
  lastName: string
  dateOfBirth?: string
  phone?: string
  email?: string
}

export type IntakeMatch = {
  id: string
  recordType: 'Case' | 'Intake'
  clientName: string
  dateOfBirth?: string
  phone?: string
  email?: string
  caseStatus?: CaseStatus
  programArea: string
  lastUpdated: string
  assignedStaff?: string
  strength: 'High confidence' | 'Medium confidence' | 'Low confidence'
}

export function DemoWorkspaceProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [cases, setCases] = useState<ClientCase[]>(initialCases)
  const [intakeSubmissions, setIntakeSubmissions] = useState<
    IntakeSubmission[]
  >([])
  const [notes, setNotes] = useState<CaseNote[]>(initialNotes)
  const [services, setServices] =
    useState<ConcreteService[]>(initialServices)
  const [role, setRole] = useState<UserRole>('Caseworker')
  const [currentStaffId, setCurrentStaffId] = useState(roleDefaults.Caseworker)

  useEffect(() => {
    setCurrentStaffId(roleDefaults[role])
  }, [role])

  const staffChoices = useMemo(
    () => staff.filter((person) => person.role === role),
    [role],
  )

  const visibleCases = useMemo(
    () => visibleCasesForRole(cases, role, currentStaffId),
    [cases, currentStaffId, role],
  )

  const visibleCaseIds = useMemo(
    () => new Set(visibleCases.map((caseRecord) => caseRecord.id)),
    [visibleCases],
  )

  const visibleNotes = useMemo(
    () => notes.filter((note) => visibleCaseIds.has(note.caseId)),
    [notes, visibleCaseIds],
  )

  const visibleServices = useMemo(
    () => services.filter((service) => visibleCaseIds.has(service.caseId)),
    [services, visibleCaseIds],
  )

  const metrics = useMemo(
    () => calculateMetrics(visibleCases, visibleNotes, visibleServices),
    [visibleCases, visibleNotes, visibleServices],
  )

  function updateCaseStatus(caseId: string, status: CaseStatus) {
    setCases((currentCases) =>
      currentCases.map((caseRecord) =>
        caseRecord.id === caseId
          ? {
              ...caseRecord,
              status,
              lastContact: TODAY,
            }
          : caseRecord,
      ),
    )
  }

  function updateEnrollment(
    caseId: string,
    enrollmentId: string,
    patch: Partial<CaseProgramEnrollment>,
  ) {
    setCases((currentCases) =>
      currentCases.map((caseRecord) =>
        caseRecord.id === caseId
          ? {
              ...caseRecord,
              status:
                patch.status === 'Active' && caseRecord.status === 'Pending'
                  ? 'Open'
                  : caseRecord.status,
              enrollments: caseRecord.enrollments.map((enrollment) =>
                enrollment.id === enrollmentId
                  ? { ...enrollment, ...patch }
                  : enrollment,
              ),
            }
          : caseRecord,
      ),
    )
  }

  function addCaseworkerAssignment(
    caseId: string,
    enrollmentId: string,
    staffId: string,
  ) {
    setCases((currentCases) =>
      currentCases.map((caseRecord) =>
        caseRecord.id === caseId
          ? {
              ...caseRecord,
              enrollments: caseRecord.enrollments.map((enrollment) => {
                if (
                  enrollment.id !== enrollmentId ||
                  enrollment.caseworkers.some(
                    (assignment) => assignment.staffId === staffId,
                  )
                ) {
                  return enrollment
                }

                return {
                  ...enrollment,
                  caseworkers: [
                    ...enrollment.caseworkers,
                    {
                      staffId,
                      isPrimary: enrollment.caseworkers.length === 0,
                    },
                  ],
                }
              }),
            }
          : caseRecord,
      ),
    )
  }

  function removeCaseworkerAssignment(
    caseId: string,
    enrollmentId: string,
    staffId: string,
  ) {
    setCases((currentCases) =>
      currentCases.map((caseRecord) =>
        caseRecord.id === caseId
          ? {
              ...caseRecord,
              enrollments: caseRecord.enrollments.map((enrollment) => {
                if (enrollment.id !== enrollmentId) {
                  return enrollment
                }

                const remaining = enrollment.caseworkers.filter(
                  (assignment) => assignment.staffId !== staffId,
                )
                const hasPrimary = remaining.some(
                  (assignment) => assignment.isPrimary,
                )

                return {
                  ...enrollment,
                  caseworkers: remaining.map((assignment, index) => ({
                    ...assignment,
                    isPrimary: hasPrimary
                      ? assignment.isPrimary
                      : index === 0,
                  })),
                }
              }),
            }
          : caseRecord,
      ),
    )
  }

  function setPrimaryCaseworker(
    caseId: string,
    enrollmentId: string,
    staffId: string,
  ) {
    setCases((currentCases) =>
      currentCases.map((caseRecord) =>
        caseRecord.id === caseId
          ? {
              ...caseRecord,
              enrollments: caseRecord.enrollments.map((enrollment) =>
                enrollment.id === enrollmentId
                  ? {
                      ...enrollment,
                      caseworkers: enrollment.caseworkers.map((assignment) => ({
                        ...assignment,
                        isPrimary: assignment.staffId === staffId,
                      })),
                    }
                  : enrollment,
              ),
            }
          : caseRecord,
      ),
    )
  }

  function updateIntakeField(
    caseId: string,
    field: keyof Intake,
    value: string,
  ) {
    setCases((currentCases) =>
      currentCases.map((caseRecord) =>
        caseRecord.id === caseId
          ? {
              ...caseRecord,
              intake: {
                ...caseRecord.intake,
                [field]: value,
              },
              lastContact: TODAY,
            }
          : caseRecord,
      ),
    )
  }

  function findIntakeMatches(input: IntakeMatchInput) {
    const firstName = normalize(input.firstName)
    const lastName = normalize(input.lastName)
    const phone = normalizePhone(input.phone)
    const email = normalize(input.email)

    if (!firstName && !lastName && !phone && !email && !input.dateOfBirth) {
      return []
    }

    const caseMatches = cases.reduce<IntakeMatch[]>((matches, caseRecord) => {
        const [caseFirstName = '', ...rest] = caseRecord.displayName.split(' ')
        const caseLastName = rest.at(-1) ?? ''
        const intake = caseRecord.intake
        const nameScore =
          (firstName && normalize(caseFirstName).startsWith(firstName)) ||
          (lastName && normalize(caseLastName).startsWith(lastName))
        const exactContact =
          (phone && normalizePhone(intake.phone) === phone) ||
          (email && normalize(intake.email) === email)
        if (!nameScore && !exactContact) {
          return matches
        }

        const strength: IntakeMatch['strength'] = exactContact
          ? 'High confidence'
          : firstName && lastName && nameScore
            ? 'Medium confidence'
            : 'Low confidence'

        const firstEnrollment = caseRecord.enrollments[0]
        const program = firstEnrollment
          ? getProgram(firstEnrollment.programId)
          : undefined
        const primaryStaffId = firstEnrollment?.caseworkers.find(
          (assignment) => assignment.isPrimary,
        )?.staffId

        matches.push({
          id: caseRecord.id,
          recordType: 'Case',
          clientName: caseRecord.displayName,
          phone: intake.phone,
          email: intake.email,
          caseStatus: caseRecord.status,
          programArea: program?.name ?? 'No program assigned',
          lastUpdated: caseRecord.lastContact,
          assignedStaff: primaryStaffId
            ? staff.find((person) => person.id === primaryStaffId)?.name
            : undefined,
          strength,
        })

        return matches
      }, [])

    const intakeMatches = intakeSubmissions
      .filter((submission) => submission.status !== 'Converted to Case')
      .reduce<IntakeMatch[]>((matches, submission) => {
        const exactContact =
          (phone && normalizePhone(submission.client.phone) === phone) ||
          (email && normalize(submission.client.email) === email)
        const nameScore =
          (firstName &&
            normalize(submission.client.firstName).startsWith(firstName)) ||
          (lastName &&
            normalize(submission.client.lastName).startsWith(lastName))

        if (!nameScore && !exactContact) {
          return matches
        }

        matches.push({
          id: submission.id,
          recordType: 'Intake',
          clientName: `${submission.client.firstName} ${submission.client.lastName}`,
          dateOfBirth: submission.client.dateOfBirth,
          phone: submission.client.phone,
          email: submission.client.email,
          programArea: 'Draft intake',
          lastUpdated: submission.savedAt ?? submission.startedAt,
          assignedStaff: staff.find((person) => person.id === submission.createdById)
            ?.name,
          strength: exactContact ? 'High confidence' : 'Medium confidence',
        })

        return matches
      }, [])

    return [...caseMatches, ...intakeMatches]
  }

  function createCaseFromIntake(input: IntakeSubmission) {
    const newCaseId = `case-${Date.now()}`
    const displayName = `${input.client.firstName.trim()} ${input.client.lastName.trim()}`
    const age = Number(input.client.approximateAge) || 0
    const hasHighDuplicate = input.duplicateWarnings.some((warning) =>
      warning.includes('High confidence'),
    )

    const caseRecord: ClientCase = {
      id: newCaseId,
      personId: `person-${Date.now()}`,
      displayName,
      pronouns: undefined,
      age,
      status: 'Open',
      opened: input.savedAt?.slice(0, 10) ?? TODAY,
      lastContact: input.savedAt?.slice(0, 10) ?? TODAY,
      risk: hasHighDuplicate ? 'Medium' : 'Low',
      county: input.address.county || input.housing.currentLocation || 'Unknown',
      intake: {
        intakeDate: input.savedAt?.slice(0, 10) ?? TODAY,
        referralSource: 'New intake workflow',
        county: input.address.county,
        phone: input.client.phone,
        email: input.client.email,
        householdIncome: input.incomeSources
          .map((source) => `${source.type}: ${source.amount} ${source.frequency}`)
          .join('; '),
        housing: input.housing.status,
        strengths: input.demographics.primaryLanguage
          ? `Primary language: ${input.demographics.primaryLanguage}`
          : undefined,
        needs: [
          input.legal.hasCourtInvolvement
            ? `Legal: ${input.legal.matterType || 'court involvement'}`
            : undefined,
          input.benefits.length > 0
            ? `Benefits: ${input.benefits.map((benefit) => benefit.type).join(', ')}`
            : undefined,
          input.housing.notes,
        ]
          .filter(Boolean)
          .join('; '),
      },
      enrollments: [],
      relatedPeople: input.relevantContacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        relationship: contact.relationship,
        age: 0,
        inHousehold: false,
      })),
    }

    setCases((currentCases) => [caseRecord, ...currentCases])
    setIntakeSubmissions((currentSubmissions) => [
      {
        ...input,
        id: `intake-${Date.now()}`,
        status: 'Converted to Case',
        caseId: newCaseId,
        convertedById: currentStaffId,
        savedAt: `${TODAY}T10:30:00`,
      },
      ...currentSubmissions,
    ])

    return newCaseId
  }

  function addNote(caseId: string, input: AddNoteInput) {
    if (!input.enrollmentId || !input.body.trim()) {
      return
    }

    setNotes((currentNotes) => [
      {
        id: `note-${Date.now()}`,
        caseId,
        enrollmentId: input.enrollmentId,
        authorId: currentStaffId,
        date: TODAY,
        contactType: input.contactType,
        summary: input.summary.trim() || 'Case note',
        body: input.body.trim(),
        isSession: input.isSession,
        sessionHours: input.isSession ? input.sessionHours : undefined,
      },
      ...currentNotes,
    ])
    setCases((currentCases) =>
      currentCases.map((caseRecord) =>
        caseRecord.id === caseId
          ? { ...caseRecord, lastContact: TODAY }
          : caseRecord,
      ),
    )
  }

  function editNote(noteId: string, input: EditNoteInput) {
    if (!input.enrollmentId || !input.body.trim()) {
      return
    }

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              enrollmentId: input.enrollmentId,
              contactType: input.contactType,
              summary: input.summary.trim() || 'Case note',
              body: input.body.trim(),
              isSession: input.isSession,
              sessionHours: input.isSession ? input.sessionHours : undefined,
            }
          : note,
      ),
    )
  }

  function addConcreteService(caseId: string, input: AddServiceInput) {
    if (!input.enrollmentId || !input.description.trim() || input.amount <= 0) {
      return
    }

    const caseRecord = cases.find((item) => item.id === caseId)
    const enrollment = caseRecord?.enrollments.find(
      (item) => item.id === input.enrollmentId,
    )
    const program = enrollment ? getProgram(enrollment.programId) : undefined

    setServices((currentServices) => [
      {
        id: `svc-${Date.now()}`,
        caseId,
        enrollmentId: input.enrollmentId,
        date: TODAY,
        category: input.category,
        description: input.description.trim(),
        amount: input.amount,
        grantor: program?.grantor ?? 'Private Foundation',
      },
      ...currentServices,
    ])
  }

  const value = useMemo(
    () => ({
      cases,
      notes,
      services,
      role,
      currentStaffId,
      staffChoices,
      visibleCases,
      intakeSubmissions,
      metrics,
      setRole,
      setCurrentStaffId,
      updateCaseStatus,
      updateEnrollment,
      addCaseworkerAssignment,
      removeCaseworkerAssignment,
      setPrimaryCaseworker,
      updateIntakeField,
      findIntakeMatches,
      createCaseFromIntake,
      addNote,
      editNote,
      addConcreteService,
    }),
    [
      cases,
      currentStaffId,
      intakeSubmissions,
      metrics,
      notes,
      role,
      services,
      staffChoices,
      visibleCases,
    ],
  )

  return (
    <DemoWorkspaceContext.Provider value={value}>
      {children}
    </DemoWorkspaceContext.Provider>
  )
}
