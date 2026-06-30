import { useQuery } from '@tanstack/react-query'
import { createContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  CaseNote,
  CaseProgramEnrollment,
  CaseStatus,
  ClientCase,
  ConcreteService,
  EntityId,
  Frc,
  Intake,
  IntakeSubmission,
  Program,
  ProgramStatus,
  Staff,
  UserRole,
} from '~/domain/workspace'
import {
  calculateMetrics,
  emptyWorkspaceSnapshot,
  getProgram,
  visibleCasesForRole,
} from '~/domain/workspace'
import {
  useAddCaseworkerAssignmentMutation,
  useAddConcreteServiceMutation,
  useAddNoteMutation,
  useCreateCaseFromIntakeMutation,
  useCreateEnrollmentMutation,
  useEditNoteMutation,
  useRemoveCaseworkerAssignmentMutation,
  useSetPrimaryCaseworkerMutation,
  useUpdateCaseStatusMutation,
  useUpdateEnrollmentMutation,
  useUpdateIntakeFieldMutation,
} from '~/hooks/useWorkspaceMutations'
import { workspaceSnapshotQueryOptions } from '~/queries/workspace'
import type {
  AddNoteInput,
  AddServiceInput,
  CreateEnrollmentInput,
} from '~/schema/workspace'

export type EditNoteInput = AddNoteInput

export type DemoWorkspaceContextValue = {
  frcs: Frc[]
  programs: Program[]
  staff: Staff[]
  cases: ClientCase[]
  notes: CaseNote[]
  services: ConcreteService[]
  role: UserRole
  currentStaffId?: EntityId
  staffChoices: Staff[]
  visibleCases: ClientCase[]
  intakeSubmissions: IntakeSubmission[]
  metrics: ReturnType<typeof calculateMetrics>
  setRole: (role: UserRole) => void
  setCurrentStaffId: (staffId: EntityId) => void
  updateCaseStatus: (caseId: EntityId, status: CaseStatus) => void
  updateEnrollment: (
    caseId: EntityId,
    enrollmentId: EntityId,
    patch: Partial<CaseProgramEnrollment>,
  ) => void
  addCaseworkerAssignment: (
    caseId: EntityId,
    enrollmentId: EntityId,
    staffId: EntityId,
  ) => void
  createEnrollment: (input: CreateEnrollmentInput) => void
  removeCaseworkerAssignment: (
    caseId: EntityId,
    enrollmentId: EntityId,
    staffId: EntityId,
  ) => void
  setPrimaryCaseworker: (
    caseId: EntityId,
    enrollmentId: EntityId,
    staffId: EntityId,
  ) => void
  updateIntakeField: (
    caseId: EntityId,
    field: keyof Intake,
    value: string,
  ) => void
  findIntakeMatches: (input: IntakeMatchInput) => IntakeMatch[]
  createCaseFromIntake: (input: Omit<IntakeSubmission, 'id'>) => Promise<EntityId | undefined>
  addNote: (caseId: EntityId, input: AddNoteInput) => void
  editNote: (noteId: EntityId, input: EditNoteInput) => void
  addConcreteService: (caseId: EntityId, input: AddServiceInput) => void
}

export const DemoWorkspaceContext =
  createContext<DemoWorkspaceContextValue | null>(null)

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

const normalize = (value?: string) => value?.trim().toLowerCase() ?? ''
const normalizePhone = (value?: string) => value?.replace(/\D/g, '') ?? ''
const normalizeSsn = (value?: string) => value?.replace(/\D/g, '') ?? ''

export function DemoWorkspaceProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { data = emptyWorkspaceSnapshot } = useQuery(workspaceSnapshotQueryOptions())
  const [role, setRole] = useState<UserRole>('Caseworker')
  const [currentStaffId, setCurrentStaffId] = useState<EntityId | undefined>()

  const updateCaseStatusMutation = useUpdateCaseStatusMutation()
  const updateEnrollmentMutation = useUpdateEnrollmentMutation()
  const addCaseworkerAssignmentMutation = useAddCaseworkerAssignmentMutation()
  const createEnrollmentMutation = useCreateEnrollmentMutation()
  const removeCaseworkerAssignmentMutation =
    useRemoveCaseworkerAssignmentMutation()
  const setPrimaryCaseworkerMutation = useSetPrimaryCaseworkerMutation()
  const updateIntakeFieldMutation = useUpdateIntakeFieldMutation()
  const addNoteMutation = useAddNoteMutation()
  const editNoteMutation = useEditNoteMutation()
  const addConcreteServiceMutation = useAddConcreteServiceMutation()
  const createCaseFromIntakeMutation = useCreateCaseFromIntakeMutation()

  const staffChoices = useMemo(
    () => data.staff.filter((person) => person.role === role),
    [data.staff, role],
  )

  useEffect(() => {
    if (
      currentStaffId &&
      staffChoices.some((person) => person.id === currentStaffId)
    ) {
      return
    }

    setCurrentStaffId(staffChoices[0]?.id)
  }, [currentStaffId, staffChoices])

  const visibleCases = useMemo(
    () => visibleCasesForRole(data.cases, role, currentStaffId),
    [currentStaffId, data.cases, role],
  )

  const visibleCaseIds = useMemo(
    () => new Set(visibleCases.map((caseRecord) => caseRecord.id)),
    [visibleCases],
  )

  const visibleNotes = useMemo(
    () => data.notes.filter((note) => visibleCaseIds.has(note.caseId)),
    [data.notes, visibleCaseIds],
  )

  const visibleServices = useMemo(
    () => data.services.filter((service) => visibleCaseIds.has(service.caseId)),
    [data.services, visibleCaseIds],
  )

  const metrics = useMemo(
    () => calculateMetrics(visibleCases, visibleNotes, visibleServices),
    [visibleCases, visibleNotes, visibleServices],
  )

  function updateCaseStatus(caseId: EntityId, status: CaseStatus) {
    updateCaseStatusMutation.mutate({ caseId, status })
  }

  function updateEnrollment(
    _caseId: EntityId,
    enrollmentId: EntityId,
    patch: Partial<CaseProgramEnrollment>,
  ) {
    updateEnrollmentMutation.mutate({
      enrollmentId,
      patch: {
        goal: patch.goal,
        opened: patch.opened,
        status: patch.status as ProgramStatus | undefined,
        target: patch.target,
      },
    })
  }

  function addCaseworkerAssignment(
    caseId: EntityId,
    enrollmentId: EntityId,
    staffId: EntityId,
  ) {
    const caseRecord = data.cases.find((item) => item.id === caseId)
    const enrollment = caseRecord?.enrollments.find(
      (item) => item.id === enrollmentId,
    )

    addCaseworkerAssignmentMutation.mutate({
      enrollmentId,
      staffId,
      isFirstAssignment: (enrollment?.caseworkers.length ?? 0) === 0,
    })
  }

  function createEnrollment(input: CreateEnrollmentInput) {
    createEnrollmentMutation.mutate(input)
  }

  function removeCaseworkerAssignment(
    _caseId: EntityId,
    enrollmentId: EntityId,
    staffId: EntityId,
  ) {
    removeCaseworkerAssignmentMutation.mutate({ enrollmentId, staffId })
  }

  function setPrimaryCaseworker(
    _caseId: EntityId,
    enrollmentId: EntityId,
    staffId: EntityId,
  ) {
    setPrimaryCaseworkerMutation.mutate({ enrollmentId, staffId })
  }

  function updateIntakeField(
    caseId: EntityId,
    field: keyof Intake,
    value: string,
  ) {
    updateIntakeFieldMutation.mutate({ caseId, field, value })
  }

  function findIntakeMatches(input: IntakeMatchInput) {
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

    const caseMatches = data.cases.reduce<IntakeMatch[]>((matches, caseRecord) => {
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
        ? getProgram(data.programs, firstEnrollment.programId)
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
          ? data.staff.find((person) => person.id === primaryStaffId)?.name
          : undefined,
        strength,
      })

      return matches
    }, [])

    const intakeMatches = data.intakeSubmissions
      .filter((submission) => submission.status !== 'Converted to Case')
      .reduce<IntakeMatch[]>((matches, submission) => {
        const exactContact =
          (phone && normalizePhone(submission.client.phone) === phone) ||
          (email && normalize(submission.client.email) === email)
        const exactSsn = ssn && normalizeSsn(submission.client.ssn) === ssn
        const exactIdentity =
          (input.dateOfBirth &&
            submission.client.dateOfBirth === input.dateOfBirth) ||
          exactSsn
        const nameScore =
          (firstName &&
            normalize(submission.client.firstName).startsWith(firstName)) ||
          (lastName &&
            normalize(submission.client.lastName).startsWith(lastName))

        if (!nameScore && !exactContact && !exactIdentity) {
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
          assignedStaff: data.staff.find(
            (person) => person.id === submission.createdById,
          )?.name,
          strength:
            exactContact || exactSsn ? 'High confidence' : 'Medium confidence',
        })

        return matches
      }, [])

    return [...caseMatches, ...intakeMatches]
  }

  async function createCaseFromIntake(input: Omit<IntakeSubmission, 'id'>) {
    if (!currentStaffId) {
      return undefined
    }

    return createCaseFromIntakeMutation.mutateAsync({
      intake: input,
      currentStaffId,
    })
  }

  function addNote(caseId: EntityId, input: AddNoteInput) {
    if (!currentStaffId) {
      return
    }

    addNoteMutation.mutate({
      caseId,
      currentStaffId,
      note: input,
    })
  }

  function editNote(noteId: EntityId, input: EditNoteInput) {
    editNoteMutation.mutate({ noteId, note: input })
  }

  function addConcreteService(caseId: EntityId, input: AddServiceInput) {
    if (!currentStaffId) {
      return
    }

    addConcreteServiceMutation.mutate({
      caseId,
      currentStaffId,
      service: input,
    })
  }

  const value = useMemo(
    () => ({
      frcs: data.frcs,
      programs: data.programs,
      staff: data.staff,
      cases: data.cases,
      notes: data.notes,
      services: data.services,
      role,
      currentStaffId,
      staffChoices,
      visibleCases,
      intakeSubmissions: data.intakeSubmissions,
      metrics,
      setRole,
      setCurrentStaffId,
      updateCaseStatus,
      updateEnrollment,
      addCaseworkerAssignment,
      createEnrollment,
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
      currentStaffId,
      data,
      metrics,
      role,
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
