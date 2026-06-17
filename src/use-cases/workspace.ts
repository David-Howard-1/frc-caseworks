import {
  getProgram,
  type CaseProgramEnrollment,
  type CaseStatus,
  type ClientCase,
  type Intake,
  type IntakeSubmission,
  type ProgramStatus,
} from '~/domain/demo-data'
import {
  addCaseworkerAssignmentRecord,
  addConcreteServiceRecord,
  addNoteRecord,
  createCaseFromIntakeRecord,
  editNoteRecord,
  getWorkspaceSnapshot,
  removeCaseworkerAssignmentRecord,
  setPrimaryCaseworkerRecord,
  updateCaseStatusRecord,
  updateEnrollmentRecord,
  updateIntakeFieldRecord,
} from '~/repositories/workspaceRepository'

const today = () => new Date().toISOString().slice(0, 10)
const nowId = (prefix: string) => `${prefix}-${Date.now()}`

export type AddNoteInput = {
  enrollmentId: string
  contactType: string
  summary: string
  body: string
  isSession: boolean
  sessionHours?: number
}

export type AddServiceInput = {
  enrollmentId: string
  category: string
  description: string
  amount: number
}

export async function loadWorkspace() {
  return getWorkspaceSnapshot()
}

export async function updateCaseStatus(input: {
  caseId: string
  status: CaseStatus
}) {
  await updateCaseStatusRecord(input.caseId, input.status)
}

export async function updateEnrollment(input: {
  enrollmentId: string
  patch: Partial<CaseProgramEnrollment>
}) {
  await updateEnrollmentRecord(input.enrollmentId, {
    goal: input.patch.goal,
    opened: input.patch.opened,
    status: input.patch.status as ProgramStatus | undefined,
    target: input.patch.target,
  })
}

export async function addCaseworkerAssignment(input: {
  enrollment: CaseProgramEnrollment
  staffId: string
}) {
  await addCaseworkerAssignmentRecord(
    input.enrollment.id,
    input.staffId,
    input.enrollment.caseworkers.length === 0,
  )
}

export async function removeCaseworkerAssignment(input: {
  enrollmentId: string
  staffId: string
}) {
  await removeCaseworkerAssignmentRecord(input.enrollmentId, input.staffId)
}

export async function setPrimaryCaseworker(input: {
  enrollmentId: string
  staffId: string
}) {
  await setPrimaryCaseworkerRecord(input.enrollmentId, input.staffId)
}

export async function updateIntakeField(input: {
  caseId: string
  field: keyof Intake
  value: string
}) {
  await updateIntakeFieldRecord(input.caseId, input.field, input.value)
}

export async function addNote(input: {
  caseId: string
  currentStaffId: string
  note: AddNoteInput
  noteId?: string
}) {
  if (!input.note.enrollmentId || !input.note.body.trim()) {
    return
  }

  await addNoteRecord({
    id: input.noteId ?? nowId('note'),
    caseId: input.caseId,
    enrollmentId: input.note.enrollmentId,
    authorId: input.currentStaffId,
    date: today(),
    contactType: input.note.contactType,
    summary: input.note.summary.trim() || 'Case note',
    body: input.note.body.trim(),
    isSession: input.note.isSession,
    sessionHours: input.note.isSession ? input.note.sessionHours : undefined,
  })
}

export async function editNote(input: {
  noteId: string
  note: AddNoteInput
}) {
  if (!input.note.enrollmentId || !input.note.body.trim()) {
    return
  }

  await editNoteRecord(input.noteId, {
    enrollmentId: input.note.enrollmentId,
    contactType: input.note.contactType,
    summary: input.note.summary.trim() || 'Case note',
    body: input.note.body.trim(),
    isSession: input.note.isSession,
    sessionHours: input.note.isSession ? input.note.sessionHours : undefined,
  })
}

export async function addConcreteService(input: {
  caseRecord: ClientCase
  currentStaffId: string
  service: AddServiceInput
  serviceId?: string
}) {
  if (
    !input.service.enrollmentId ||
    !input.service.description.trim() ||
    input.service.amount <= 0
  ) {
    return
  }

  const enrollment = input.caseRecord.enrollments.find(
    (item) => item.id === input.service.enrollmentId,
  )
  const program = enrollment ? getProgram(enrollment.programId) : undefined

  await addConcreteServiceRecord({
    id: input.serviceId ?? nowId('svc'),
    caseId: input.caseRecord.id,
    enrollmentId: input.service.enrollmentId,
    providedById: input.currentStaffId,
    date: today(),
    category: input.service.category,
    description: input.service.description.trim(),
    amount: input.service.amount,
    grantor: program?.grantor ?? 'Private Foundation',
  })
}

export async function createCaseFromIntake(input: {
  intake: IntakeSubmission
  currentStaffId: string
  caseId?: string
  intakeId?: string
  personId?: string
}) {
  const newCaseId = input.caseId ?? nowId('case')
  const newPersonId = input.personId ?? nowId('person')
  const displayName =
    `${input.intake.client.firstName.trim()} ${input.intake.client.lastName.trim()}`.trim()
  const age = Number(input.intake.client.approximateAge) || 0
  const hasHighDuplicate = input.intake.duplicateWarnings.some((warning) =>
    warning.includes('High confidence'),
  )
  const createdDate = input.intake.savedAt?.slice(0, 10) ?? today()

  const caseRecord: ClientCase = {
    id: newCaseId,
    personId: newPersonId,
    displayName,
    pronouns: undefined,
    age,
    status: 'Open',
    opened: createdDate,
    lastContact: createdDate,
    risk: hasHighDuplicate ? 'Medium' : 'Low',
    county:
      input.intake.address.county ||
      input.intake.housing.currentLocation ||
      'Unknown',
    intake: {
      intakeDate: createdDate,
      referralSource: 'New intake workflow',
      county: input.intake.address.county,
      phone: input.intake.client.phone,
      email: input.intake.client.email,
      householdIncome: input.intake.incomeSources
        .map((source) => `${source.type}: ${source.amount} ${source.frequency}`)
        .join('; '),
      housing: input.intake.housing.status,
      strengths: input.intake.demographics.primaryLanguage
        ? `Primary language: ${input.intake.demographics.primaryLanguage}`
        : undefined,
      needs: [
        input.intake.legal.hasCourtInvolvement
          ? `Legal: ${input.intake.legal.matterType || 'court involvement'}`
          : undefined,
        input.intake.benefits.length > 0
          ? `Benefits: ${input.intake.benefits
              .map((benefit) => benefit.type)
              .join(', ')}`
          : undefined,
        input.intake.housing.notes,
      ]
        .filter(Boolean)
        .join('; '),
    },
    enrollments: [],
    relatedPeople: input.intake.relevantContacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      relationship: contact.relationship,
      age: 0,
      inHousehold: false,
    })),
  }

  await createCaseFromIntakeRecord(caseRecord, {
    ...input.intake,
    id: input.intakeId ?? nowId('intake'),
    status: 'Converted to Case',
    caseId: newCaseId,
    convertedById: input.currentStaffId,
    savedAt: `${createdDate}T10:30:00`,
  })

  return newCaseId
}
