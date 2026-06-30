import { getDb, hasDatabaseUrl } from '~/db/client'
import {
  addCaseworkerAssignmentRow,
  clearPrimaryCaseworkerRows,
  getFirstFrc,
  getUserById,
  getWorkspaceRows,
  insertCaseRow,
  insertConcreteServiceRow,
  insertEnrollmentRow,
  insertIntakeSubmissionRow,
  insertNoteRow,
  insertPersonRelationshipRow,
  insertPersonRow,
  insertPrimaryIntakeRow,
  removeCaseworkerAssignmentRow,
  setPrimaryCaseworkerRow,
  updateCaseStatusRow,
  updateEnrollmentRow,
  updateNoteRow,
  updatePrimaryIntakeJsonField,
  updatePrimaryIntakeRow,
} from '~/data-access/workspace'
import type {
  CaseStatus,
  ClientCase,
  Grantor,
  IntakeSubmission,
  Person,
  ProgramStatus,
  UserRole,
  WorkspaceSnapshot,
} from '~/domain/workspace'
import { emptyWorkspaceSnapshot } from '~/domain/workspace'
import type {
  AddNoteInput,
  AddServiceInput,
  CreateEnrollmentInput,
  IntakeSubmissionInput,
} from '~/schema/workspace'

const today = () => new Date().toISOString().slice(0, 10)

const roleFromDb: Record<
  'caseworker' | 'program_supervisor' | 'executive_director',
  UserRole
> = {
  caseworker: 'Caseworker',
  executive_director: 'Executive Director',
  program_supervisor: 'Program Supervisor',
}

const caseStatusFromDb: Record<'open' | 'pending' | 'closed', CaseStatus> = {
  closed: 'Closed',
  open: 'Open',
  pending: 'Pending',
}

const caseStatusToDb: Record<CaseStatus, 'open' | 'pending' | 'closed'> = {
  Closed: 'closed',
  Open: 'open',
  Pending: 'pending',
}

const programStatusFromDb: Record<
  'active' | 'pending' | 'completed' | 'inactive' | 'waitlisted',
  ProgramStatus
> = {
  active: 'Active',
  completed: 'Completed',
  inactive: 'Inactive',
  pending: 'Pending',
  waitlisted: 'Waitlisted',
}

const programStatusToDb: Record<
  ProgramStatus,
  'active' | 'pending' | 'completed' | 'inactive' | 'waitlisted'
> = {
  Active: 'active',
  Completed: 'completed',
  Inactive: 'inactive',
  Pending: 'pending',
  Waitlisted: 'waitlisted',
}

const toDateString = (value: Date | string | null | undefined) => {
  if (!value) {
    return ''
  }

  return value instanceof Date ? value.toISOString().slice(0, 10) : value.slice(0, 10)
}

const toDateTimeString = (value: Date | string | null | undefined) => {
  if (!value) {
    return undefined
  }

  return value instanceof Date ? value.toISOString() : value
}

const fullName = (person: {
  firstName: string | null
  lastName: string | null
}) => [person.firstName, person.lastName].filter(Boolean).join(' ')

function groupBy<T, K extends string | number>(
  items: T[],
  getKey: (item: T) => K,
) {
  return items.reduce<Map<K, T[]>>((groups, item) => {
    const key = getKey(item)
    groups.set(key, [...(groups.get(key) ?? []), item])
    return groups
  }, new Map<K, T[]>())
}

export function canUsePersistentWorkspace() {
  return hasDatabaseUrl()
}

export async function loadWorkspaceUseCase(): Promise<WorkspaceSnapshot> {
  if (!hasDatabaseUrl()) {
    return emptyWorkspaceSnapshot
  }

  const db = getDb()
  const rows = await getWorkspaceRows(db)

  const userProgramsByUserId = groupBy(
    rows.userProgramRows,
    (membership) => membership.userId,
  )
  const peopleById = new Map(rows.personRows.map((person) => [person.id, person]))
  const intakeByCaseId = new Map(rows.intakeRows.map((intake) => [intake.caseId, intake]))
  const assignmentsByEnrollmentId = groupBy(
    rows.assignmentRows,
    (assignment) => assignment.programEnrollmentId,
  )
  const enrollmentsByCaseId = groupBy(
    rows.enrollmentRows,
    (enrollment) => enrollment.caseId,
  )
  const relationshipsBySourcePersonId = groupBy(
    rows.relationshipRows,
    (relationship) => relationship.sourcePersonId,
  )

  const workspaceCases: ClientCase[] = rows.caseRows.map((caseRecord) => {
    const person = peopleById.get(caseRecord.primaryPersonId)
    const intake = intakeByCaseId.get(caseRecord.id)
    const fieldValues = intake?.fieldValues ?? {}

    return {
      id: caseRecord.id,
      personId: caseRecord.primaryPersonId,
      displayName: person ? fullName(person) : caseRecord.householdName ?? String(caseRecord.id),
      pronouns: person?.pronouns ?? undefined,
      age: Number(person?.approximateAge ?? 0),
      status: caseStatusFromDb[caseRecord.status],
      opened: toDateString(caseRecord.openedAt),
      lastContact: toDateString(caseRecord.lastContactAt) || toDateString(caseRecord.openedAt),
      risk:
        caseRecord.risk === 'high'
          ? 'High'
          : caseRecord.risk === 'medium'
            ? 'Medium'
            : 'Low',
      county: person?.county ?? String(fieldValues.county ?? 'Unknown'),
      intake: {
        intakeDate: toDateString(intake?.intakeDate),
        referralSource: intake?.referralSource ?? undefined,
        county: String(fieldValues.county ?? person?.county ?? ''),
        phone: String(fieldValues.phone ?? person?.phone ?? ''),
        email: String(fieldValues.email ?? person?.email ?? ''),
        householdIncome: intake?.householdIncome ?? undefined,
        housing: intake?.housing ?? undefined,
        strengths: intake?.familyStrengths ?? undefined,
        needs: intake?.presentingNeeds ?? undefined,
      },
      enrollments: (enrollmentsByCaseId.get(caseRecord.id) ?? []).map(
        (enrollment) => ({
          id: enrollment.id,
          programId: enrollment.programId,
          caseworkers: (assignmentsByEnrollmentId.get(enrollment.id) ?? []).map(
            (assignment) => ({
              staffId: assignment.caseworkerId,
              isPrimary: assignment.isPrimary,
            }),
          ),
          supervisorId: enrollment.supervisorId ?? undefined,
          status: programStatusFromDb[enrollment.status],
          opened: toDateString(enrollment.startDate),
          target: toDateString(enrollment.targetDate),
          goal: enrollment.goalSummary ?? '',
        }),
      ),
      relatedPeople: (relationshipsBySourcePersonId.get(caseRecord.primaryPersonId) ?? [])
        .map((relationship) => {
          const relatedPerson = peopleById.get(relationship.relatedPersonId)

          return {
            id: relationship.relatedPersonId,
            name: relatedPerson ? fullName(relatedPerson) : String(relationship.relatedPersonId),
            relationship: relationship.relationship,
            age: Number(relatedPerson?.approximateAge ?? 0),
            linkedCaseId: relationship.relatedCaseId ?? undefined,
            inHousehold: relationship.livesInHousehold,
          }
        }),
    }
  })

  return {
    frcs: rows.frcRows.map((frc) => ({
      id: frc.id,
      name: frc.name,
      legalName: frc.legalName ?? undefined,
      county: frc.county ?? undefined,
      state: frc.state ?? undefined,
    })),
    programs: rows.programRows.map((program) => ({
      id: program.id,
      frcId: program.frcId,
      code: program.code,
      name: program.name,
      grantor: program.grantor ?? 'Unspecified',
      color: program.color ?? '#1C5380',
      supervisorId: program.supervisorId ?? undefined,
    })),
    staff: rows.userRows.map((user) => ({
      id: user.id,
      frcId: user.frcId,
      role: roleFromDb[user.role],
      name: user.name,
      programs: (userProgramsByUserId.get(user.id) ?? []).map(
        (membership) => membership.programId,
      ),
    })),
    people: rows.personRows.map<Person>((person) => ({
      id: person.id,
      frcId: person.frcId,
      role: person.personRole,
      firstName: person.firstName ?? undefined,
      middleName: person.middleName ?? undefined,
      lastName: person.lastName ?? undefined,
      preferredName: person.preferredName ?? undefined,
      pronouns: person.pronouns ?? undefined,
      approximateAge: person.approximateAge ?? undefined,
      dateOfBirth: toDateString(person.dateOfBirth) || undefined,
      phone: person.phone ?? undefined,
      email: person.email ?? undefined,
      addressLine1: person.addressLine1 ?? undefined,
      addressLine2: person.addressLine2 ?? undefined,
      city: person.city ?? undefined,
      state: person.state ?? undefined,
      postalCode: person.postalCode ?? undefined,
      county: person.county ?? undefined,
    })),
    cases: workspaceCases,
    intakeSubmissions: rows.intakeSubmissionRows.map((submission) => ({
      id: submission.id,
      status:
        submission.status === 'converted_to_case'
          ? 'Converted to Case'
          : submission.status === 'duplicate_review'
            ? 'Duplicate Review'
            : submission.status === 'rejected'
              ? 'Rejected'
              : 'Draft',
      createdById: submission.createdById,
      convertedById: submission.convertedById ?? undefined,
      caseId: submission.caseId ?? undefined,
      startedAt: toDateTimeString(submission.startedAt) ?? '',
      savedAt: toDateTimeString(submission.savedAt),
      duplicateWarnings: submission.duplicateWarnings ?? [],
      duplicateOverrideReason: submission.duplicateOverrideReason ?? undefined,
      client: submission.clientSnapshot as IntakeSubmission['client'],
      demographics:
        submission.demographicSnapshot as IntakeSubmission['demographics'],
      address: submission.addressSnapshot as IntakeSubmission['address'],
      incomeSources:
        (submission.incomeSources as IntakeSubmission['incomeSources']) ?? [],
      benefits: (submission.benefits as IntakeSubmission['benefits']) ?? [],
      relevantContacts:
        (submission.relevantContacts as IntakeSubmission['relevantContacts']) ??
        [],
      legal: submission.legalSnapshot as IntakeSubmission['legal'],
      housing: submission.housingSnapshot as IntakeSubmission['housing'],
    })),
    notes: rows.noteRows.map((note) => ({
      id: note.id,
      caseId: note.caseId,
      enrollmentId: note.programEnrollmentId ?? undefined,
      authorId: note.authorId,
      date: toDateString(note.noteDate),
      contactType: note.contactType ?? '',
      summary: note.summary ?? '',
      body: note.body,
      isSession: note.isSession,
      sessionHours: note.sessionHours ?? undefined,
    })),
    services: rows.serviceRows.map((service) => ({
      id: service.id,
      caseId: service.caseId,
      enrollmentId: service.programEnrollmentId ?? undefined,
      date: toDateString(service.serviceDate),
      category: service.category,
      description: service.description,
      amount: service.amount,
      grantor: service.grantor ?? 'Unspecified',
    })),
  }
}

export async function updateCaseStatusUseCase(input: {
  caseId: number
  status: CaseStatus
}) {
  if (!hasDatabaseUrl()) {
    return
  }

  await updateCaseStatusRow(getDb(), input.caseId, caseStatusToDb[input.status])
}

export async function updateEnrollmentUseCase(input: {
  enrollmentId: number
  patch: Partial<{
    status: ProgramStatus
    opened: string
    target: string
    goal: string
  }>
}) {
  if (!hasDatabaseUrl()) {
    return
  }

  const values: Partial<Parameters<typeof updateEnrollmentRow>[2]> = {}

  if (input.patch.status) {
    values.status = programStatusToDb[input.patch.status]
  }

  if (input.patch.opened !== undefined) {
    values.startDate = input.patch.opened
  }

  if (input.patch.target !== undefined) {
    values.targetDate = input.patch.target
  }

  if (input.patch.goal !== undefined) {
    values.goalSummary = input.patch.goal
  }

  await updateEnrollmentRow(getDb(), input.enrollmentId, values)
}

export async function addCaseworkerAssignmentUseCase(input: {
  enrollmentId: number
  staffId: number
  isFirstAssignment: boolean
}) {
  if (!hasDatabaseUrl()) {
    return
  }

  await addCaseworkerAssignmentRow(getDb(), {
    programEnrollmentId: input.enrollmentId,
    caseworkerId: input.staffId,
    isPrimary: input.isFirstAssignment,
  })
}

export async function createEnrollmentUseCase(input: CreateEnrollmentInput) {
  if (!hasDatabaseUrl()) {
    return undefined
  }

  return insertEnrollmentRow(getDb(), {
    caseId: input.caseId,
    programId: input.programId,
    supervisorId: input.supervisorId,
    status: programStatusToDb[input.status],
    startDate: input.opened,
    targetDate: input.target,
    goalSummary: input.goal,
  })
}

export async function removeCaseworkerAssignmentUseCase(input: {
  enrollmentId: number
  staffId: number
}) {
  if (!hasDatabaseUrl()) {
    return
  }

  await removeCaseworkerAssignmentRow(getDb(), input.enrollmentId, input.staffId)
}

export async function setPrimaryCaseworkerUseCase(input: {
  enrollmentId: number
  staffId: number
}) {
  if (!hasDatabaseUrl()) {
    return
  }

  const db = getDb()
  await clearPrimaryCaseworkerRows(db, input.enrollmentId)
  await setPrimaryCaseworkerRow(db, input.enrollmentId, input.staffId)
}

export async function updateIntakeFieldUseCase(input: {
  caseId: number
  field: string
  value: string
}) {
  if (!hasDatabaseUrl()) {
    return
  }

  const db = getDb()
  const columnPatch: Parameters<typeof updatePrimaryIntakeRow>[2] = {}

  if (input.field === 'referralSource') {
    columnPatch.referralSource = input.value
  } else if (input.field === 'householdIncome') {
    columnPatch.householdIncome = input.value
  } else if (input.field === 'housing') {
    columnPatch.housing = input.value
  } else if (input.field === 'strengths') {
    columnPatch.familyStrengths = input.value
  } else if (input.field === 'needs') {
    columnPatch.presentingNeeds = input.value
  }

  if (Object.keys(columnPatch).length > 0) {
    await updatePrimaryIntakeRow(db, input.caseId, columnPatch)
    return
  }

  await updatePrimaryIntakeJsonField(db, input.caseId, input.field, input.value)
}

export async function addNoteUseCase(input: {
  caseId: number
  currentStaffId: number
  note: AddNoteInput
}) {
  if (!hasDatabaseUrl() || !input.note.body.trim()) {
    return
  }

  return insertNoteRow(getDb(), {
    caseId: input.caseId,
    programEnrollmentId: input.note.enrollmentId,
    authorId: input.currentStaffId,
    noteDate: today(),
    contactType: input.note.contactType,
    summary: input.note.summary.trim() || 'Case note',
    body: input.note.body.trim(),
    isSession: input.note.isSession,
    sessionHours: input.note.sessionHours,
  })
}

export async function editNoteUseCase(input: {
  noteId: number
  note: AddNoteInput
}) {
  if (!hasDatabaseUrl() || !input.note.body.trim()) {
    return
  }

  await updateNoteRow(getDb(), input.noteId, {
    programEnrollmentId: input.note.enrollmentId,
    contactType: input.note.contactType,
    summary: input.note.summary.trim() || 'Case note',
    body: input.note.body.trim(),
    isSession: input.note.isSession,
    sessionHours: input.note.sessionHours,
  })
}

export async function addConcreteServiceUseCase(input: {
  caseId: number
  currentStaffId: number
  service: AddServiceInput
}) {
  if (
    !hasDatabaseUrl() ||
    !input.service.description.trim() ||
    input.service.amount <= 0
  ) {
    return
  }

  const workspace = await loadWorkspaceUseCase()
  const caseRecord = workspace.cases.find((item) => item.id === input.caseId)
  const enrollment = caseRecord?.enrollments.find(
    (item) => item.id === input.service.enrollmentId,
  )
  const program = workspace.programs.find(
    (item) => item.id === enrollment?.programId,
  )

  return insertConcreteServiceRow(getDb(), {
    caseId: input.caseId,
    programEnrollmentId: input.service.enrollmentId,
    providedById: input.currentStaffId,
    serviceDate: today(),
    category: input.service.category,
    description: input.service.description.trim(),
    amount: input.service.amount,
    grantor: program?.grantor ?? 'Unspecified',
  })
}

async function resolveFrcId(currentStaffId: number) {
  const db = getDb()
  const user = await getUserById(db, currentStaffId)
  if (user) {
    return user.frcId
  }

  const frc = await getFirstFrc(db)
  if (frc) {
    return frc.id
  }

  throw new Error('Create at least one FRC row before creating casework data.')
}

export async function createCaseFromIntakeUseCase(input: {
  intake: IntakeSubmissionInput
  currentStaffId: number
  existingPersonId?: number
  existingCaseId?: number
  mode?: 'new_case' | 'reintake'
}) {
  if (!hasDatabaseUrl()) {
    return undefined
  }

  const db = getDb()
  const frcId = await resolveFrcId(input.currentStaffId)
  const createdDate = input.intake.savedAt?.slice(0, 10) ?? today()
  const hasHighDuplicate = input.intake.duplicateWarnings.some((warning) =>
    warning.includes('High confidence'),
  )

  const primaryIntakeValues = {
    completedById: input.currentStaffId,
    intakeDate: createdDate,
    referralSource:
      input.mode === 'reintake' ? 'Re-intake workflow' : 'New intake workflow',
    familyStrengths: input.intake.demographics.primaryLanguage
      ? `Primary language: ${input.intake.demographics.primaryLanguage}`
      : undefined,
    presentingNeeds: [
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
    householdIncome: input.intake.incomeSources
      .map((source) => `${source.type}: ${source.amount} ${source.frequency}`)
      .join('; '),
    housing: input.intake.housing.status,
    fieldValues: {
      county: input.intake.address.county,
      email: input.intake.client.email,
      phone: input.intake.client.phone,
    },
  } satisfies Omit<Parameters<typeof insertPrimaryIntakeRow>[1], 'caseId'>

  const personId =
    input.existingPersonId ??
    (await insertPersonRow(db, {
      frcId,
      personRole: 'client',
      firstName: input.intake.client.firstName,
      middleName: input.intake.client.middleName,
      lastName: input.intake.client.lastName,
      preferredName: input.intake.client.preferredName,
      approximateAge: input.intake.client.approximateAge,
      dateOfBirth: input.intake.client.dateOfBirth,
      phone: input.intake.client.phone,
      email: input.intake.client.email,
      addressLine1: input.intake.address.line1,
      addressLine2: input.intake.address.line2,
      city: input.intake.address.city,
      state: input.intake.address.state,
      postalCode: input.intake.address.postalCode,
      county:
        input.intake.address.county ||
        input.intake.housing.currentLocation ||
        'Unknown',
    }))

  const caseId =
    input.mode === 'reintake' && input.existingCaseId
      ? input.existingCaseId
      : await insertCaseRow(db, {
          frcId,
          primaryPersonId: personId,
          status: 'open',
          risk: hasHighDuplicate ? 'medium' : 'low',
          openedAt: createdDate,
          lastContactAt: createdDate,
          householdName:
            `${input.intake.client.firstName} ${input.intake.client.lastName}`.trim(),
        })

  if (input.mode === 'reintake' && input.existingCaseId) {
    await updateCaseStatusRow(db, input.existingCaseId, 'open')
    await updatePrimaryIntakeRow(db, input.existingCaseId, primaryIntakeValues)
  } else {
    await insertPrimaryIntakeRow(db, {
      caseId,
      ...primaryIntakeValues,
    })
  }

  for (const contact of input.intake.relevantContacts) {
    const [firstName = '', ...lastNameParts] = contact.name.split(' ')
    const relatedPersonId = await insertPersonRow(db, {
      frcId,
      personRole: 'collateral_contact',
      firstName,
      lastName: lastNameParts.join(' '),
      phone: contact.phone,
      email: contact.email,
      county: input.intake.address.county,
    })

    await insertPersonRelationshipRow(db, {
      sourcePersonId: personId,
      relatedPersonId,
      relationship: contact.relationship,
      livesInHousehold: false,
    })
  }

  await insertIntakeSubmissionRow(db, {
    frcId,
    caseId,
    createdById: input.intake.createdById,
    convertedById: input.currentStaffId,
    status: 'converted_to_case',
    startedAt: new Date(input.intake.startedAt),
    savedAt: new Date(`${createdDate}T10:30:00`),
    duplicateWarnings: input.intake.duplicateWarnings,
    duplicateOverrideReason: input.intake.duplicateOverrideReason,
    clientSnapshot: input.intake.client,
    demographicSnapshot: input.intake.demographics,
    addressSnapshot: input.intake.address,
    incomeSources: input.intake.incomeSources,
    benefits: input.intake.benefits,
    relevantContacts: input.intake.relevantContacts,
    legalSnapshot: input.intake.legal,
    housingSnapshot: input.intake.housing,
  })

  return caseId
}
