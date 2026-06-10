import { createContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  type CaseNote,
  type CaseProgramEnrollment,
  type CaseStatus,
  type ClientCase,
  type ConcreteService,
  type Intake,
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

export type AddNoteInput = {
  enrollmentId: string
  contactType: string
  summary: string
  body: string
}

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
  metrics: ReturnType<typeof calculateMetrics>
  setRole: (role: UserRole) => void
  setCurrentStaffId: (staffId: string) => void
  updateCaseStatus: (caseId: string, status: CaseStatus) => void
  updateEnrollment: (
    caseId: string,
    enrollmentId: string,
    patch: Partial<CaseProgramEnrollment>,
  ) => void
  updateIntakeField: (
    caseId: string,
    field: keyof Intake,
    value: string,
  ) => void
  addNote: (caseId: string, input: AddNoteInput) => void
  addConcreteService: (caseId: string, input: AddServiceInput) => void
}

export const DemoWorkspaceContext =
  createContext<DemoWorkspaceContextValue | null>(null)

export function DemoWorkspaceProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [cases, setCases] = useState<ClientCase[]>(initialCases)
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
      metrics,
      setRole,
      setCurrentStaffId,
      updateCaseStatus,
      updateEnrollment,
      updateIntakeField,
      addNote,
      addConcreteService,
    }),
    [
      cases,
      currentStaffId,
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
