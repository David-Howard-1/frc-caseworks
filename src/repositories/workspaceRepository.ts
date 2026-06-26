import { and, asc, eq, sql } from 'drizzle-orm'
import {
  initialWorkspaceSnapshot,
  type CaseStatus,
  type ClientCase,
  type Grantor,
  type Intake,
  type IntakeSubmission,
  type ProgramStatus,
  type WorkspaceSnapshot,
} from '~/domain/demo-data'
import { getDb, hasDatabaseUrl } from '~/db/client'
import { ensureSeedData } from '~/db/seed'
import {
  caseNotes,
  caseProgramCaseworkers,
  caseProgramEnrollments,
  cases,
  concreteServices,
  intakeSubmissions,
  people,
  personRelationships,
  primaryIntakes,
} from '~/db/schema'

export type AddNoteRecord = {
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

export type AddServiceRecord = {
  id: string
  caseId: string
  enrollmentId: string
  providedById?: string
  date: string
  category: string
  description: string
  amount: number
  grantor: Grantor
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

function groupBy<T, K extends string>(items: T[], getKey: (item: T) => K) {
  return items.reduce<Map<K, T[]>>((groups, item) => {
    const key = getKey(item)
    groups.set(key, [...(groups.get(key) ?? []), item])
    return groups
  }, new Map<K, T[]>())
}

export function canUsePersistentWorkspace() {
  return hasDatabaseUrl()
}

export async function getWorkspaceSnapshot(): Promise<WorkspaceSnapshot> {
  if (!hasDatabaseUrl()) {
    return initialWorkspaceSnapshot
  }

  await ensureSeedData()

  const db = getDb()
  const [
    caseRows,
    personRows,
    intakeRows,
    enrollmentRows,
    assignmentRows,
    noteRows,
    serviceRows,
    relationshipRows,
    intakeSubmissionRows,
  ] = await Promise.all([
    db.select().from(cases).orderBy(asc(cases.openedAt)),
    db.select().from(people),
    db.select().from(primaryIntakes),
    db.select().from(caseProgramEnrollments),
    db.select().from(caseProgramCaseworkers),
    db.select().from(caseNotes).orderBy(asc(caseNotes.noteDate)),
    db.select().from(concreteServices).orderBy(asc(concreteServices.serviceDate)),
    db.select().from(personRelationships),
    db.select().from(intakeSubmissions),
  ])

  const peopleById = new Map(personRows.map((person) => [person.id, person]))
  const intakeByCaseId = new Map(intakeRows.map((intake) => [intake.caseId, intake]))
  const assignmentsByEnrollmentId = groupBy(
    assignmentRows,
    (assignment) => assignment.programEnrollmentId,
  )
  const enrollmentsByCaseId = groupBy(
    enrollmentRows,
    (enrollment) => enrollment.caseId,
  )
  const relationshipsBySourcePersonId = groupBy(
    relationshipRows,
    (relationship) => relationship.sourcePersonId,
  )

  const workspaceCases: ClientCase[] = caseRows.map((caseRecord) => {
    const person = peopleById.get(caseRecord.primaryPersonId)
    const intake = intakeByCaseId.get(caseRecord.id)
    const fieldValues = intake?.fieldValues ?? {}

    return {
      id: caseRecord.id,
      personId: caseRecord.primaryPersonId,
      displayName: person ? fullName(person) : caseRecord.householdName ?? caseRecord.id,
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
          supervisorId: enrollment.supervisorId ?? '',
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
            name: relatedPerson ? fullName(relatedPerson) : relationship.relatedPersonId,
            relationship: relationship.relationship,
            age: Number(relatedPerson?.approximateAge ?? 0),
            linkedCaseId: relationship.relatedCaseId ?? undefined,
            inHousehold: relationship.livesInHousehold,
          }
        }),
    }
  })

  return {
    cases: workspaceCases,
    intakeSubmissions: intakeSubmissionRows.map((submission) => ({
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
    notes: noteRows.map((note) => ({
      id: note.id,
      caseId: note.caseId,
      enrollmentId: note.programEnrollmentId ?? '',
      authorId: note.authorId,
      date: toDateString(note.noteDate),
      contactType: note.contactType ?? '',
      summary: note.summary ?? '',
      body: note.body,
      isSession: note.isSession,
      sessionHours: note.sessionHours ?? undefined,
    })),
    services: serviceRows.map((service) => ({
      id: service.id,
      caseId: service.caseId,
      enrollmentId: service.programEnrollmentId ?? '',
      date: toDateString(service.serviceDate),
      category: service.category,
      description: service.description,
      amount: service.amount,
      grantor: (service.grantor ?? 'Private Foundation') as Grantor,
    })),
  }
}

export async function updateCaseStatusRecord(caseId: string, status: CaseStatus) {
  if (!hasDatabaseUrl()) {
    return
  }

  await getDb()
    .update(cases)
    .set({
      status: caseStatusToDb[status],
      lastContactAt: new Date().toISOString().slice(0, 10),
    })
    .where(eq(cases.id, caseId))
}

export async function updateEnrollmentRecord(
  enrollmentId: string,
  patch: Partial<{
    status: ProgramStatus
    opened: string
    target: string
    goal: string
  }>,
) {
  if (!hasDatabaseUrl()) {
    return
  }

  const values: Partial<typeof caseProgramEnrollments.$inferInsert> = {}

  if (patch.status) {
    values.status = programStatusToDb[patch.status]
  }

  if (patch.opened !== undefined) {
    values.startDate = patch.opened
  }

  if (patch.target !== undefined) {
    values.targetDate = patch.target
  }

  if (patch.goal !== undefined) {
    values.goalSummary = patch.goal
  }

  await getDb()
    .update(caseProgramEnrollments)
    .set(values)
    .where(eq(caseProgramEnrollments.id, enrollmentId))
}

export async function updateIntakeFieldRecord(
  caseId: string,
  field: keyof Intake,
  value: string,
) {
  if (!hasDatabaseUrl()) {
    return
  }

  const columnPatch: Partial<typeof primaryIntakes.$inferInsert> = {}

  if (field === 'referralSource') {
    columnPatch.referralSource = value
  } else if (field === 'householdIncome') {
    columnPatch.householdIncome = value
  } else if (field === 'housing') {
    columnPatch.housing = value
  } else if (field === 'strengths') {
    columnPatch.familyStrengths = value
  } else if (field === 'needs') {
    columnPatch.presentingNeeds = value
  }

  if (Object.keys(columnPatch).length > 0) {
    await getDb()
      .update(primaryIntakes)
      .set(columnPatch)
      .where(eq(primaryIntakes.caseId, caseId))
    return
  }

  await getDb()
    .update(primaryIntakes)
    .set({
      fieldValues: sql`json_set(coalesce(${primaryIntakes.fieldValues}, json_object()), ${`$.${field}`}, ${value})`,
    })
    .where(eq(primaryIntakes.caseId, caseId))
}

export async function addCaseworkerAssignmentRecord(
  enrollmentId: string,
  staffId: string,
  isPrimary: boolean,
) {
  if (!hasDatabaseUrl()) {
    return
  }

  await getDb()
    .insert(caseProgramCaseworkers)
    .values({
      programEnrollmentId: enrollmentId,
      caseworkerId: staffId,
      isPrimary,
    })
    .onDuplicateKeyUpdate({
      set: { isPrimary },
    })
}

export async function removeCaseworkerAssignmentRecord(
  enrollmentId: string,
  staffId: string,
) {
  if (!hasDatabaseUrl()) {
    return
  }

  await getDb()
    .delete(caseProgramCaseworkers)
    .where(
      and(
        eq(caseProgramCaseworkers.programEnrollmentId, enrollmentId),
        eq(caseProgramCaseworkers.caseworkerId, staffId),
      ),
    )
}

export async function setPrimaryCaseworkerRecord(
  enrollmentId: string,
  staffId: string,
) {
  if (!hasDatabaseUrl()) {
    return
  }

  const db = getDb()
  await db
    .update(caseProgramCaseworkers)
    .set({ isPrimary: false })
    .where(eq(caseProgramCaseworkers.programEnrollmentId, enrollmentId))
  await db
    .update(caseProgramCaseworkers)
    .set({ isPrimary: true })
    .where(
      and(
        eq(caseProgramCaseworkers.programEnrollmentId, enrollmentId),
        eq(caseProgramCaseworkers.caseworkerId, staffId),
      ),
    )
}

export async function addNoteRecord(input: AddNoteRecord) {
  if (!hasDatabaseUrl()) {
    return
  }

  await getDb().insert(caseNotes).values({
    id: input.id,
    caseId: input.caseId,
    programEnrollmentId: input.enrollmentId,
    authorId: input.authorId,
    noteDate: input.date,
    contactType: input.contactType,
    summary: input.summary,
    body: input.body,
    isSession: input.isSession,
    sessionHours: input.sessionHours,
  })
}

export async function editNoteRecord(
  noteId: string,
  input: Omit<AddNoteRecord, 'id' | 'caseId' | 'authorId' | 'date'>,
) {
  if (!hasDatabaseUrl()) {
    return
  }

  await getDb()
    .update(caseNotes)
    .set({
      programEnrollmentId: input.enrollmentId,
      contactType: input.contactType,
      summary: input.summary,
      body: input.body,
      isSession: input.isSession,
      sessionHours: input.sessionHours,
    })
    .where(eq(caseNotes.id, noteId))
}

export async function addConcreteServiceRecord(input: AddServiceRecord) {
  if (!hasDatabaseUrl()) {
    return
  }

  await getDb().insert(concreteServices).values({
    id: input.id,
    caseId: input.caseId,
    programEnrollmentId: input.enrollmentId,
    providedById: input.providedById,
    serviceDate: input.date,
    category: input.category,
    description: input.description,
    amount: input.amount,
    grantor: input.grantor,
  })
}

export async function createCaseFromIntakeRecord(
  caseRecord: ClientCase,
  submission: IntakeSubmission,
) {
  if (!hasDatabaseUrl()) {
    return
  }

  const db = getDb()
  const [firstName = '', ...lastNameParts] = caseRecord.displayName.split(' ')

  await db.insert(people).values({
    id: caseRecord.personId,
    frcId: 'frc-demo',
    personRole: 'client',
    firstName,
    lastName: lastNameParts.join(' '),
    approximateAge: String(caseRecord.age),
    phone: caseRecord.intake.phone,
    email: caseRecord.intake.email,
    county: caseRecord.county,
  })

  await db.insert(cases).values({
    id: caseRecord.id,
    frcId: 'frc-demo',
    primaryPersonId: caseRecord.personId,
    status: caseStatusToDb[caseRecord.status],
    risk: caseRecord.risk.toLowerCase() as 'low' | 'medium' | 'high',
    openedAt: caseRecord.opened,
    lastContactAt: caseRecord.lastContact,
  })

  await db.insert(primaryIntakes).values({
    id: `intake-${caseRecord.id}`,
    caseId: caseRecord.id,
    intakeDate: caseRecord.intake.intakeDate,
    referralSource: caseRecord.intake.referralSource,
    familyStrengths: caseRecord.intake.strengths,
    presentingNeeds: caseRecord.intake.needs,
    householdIncome: caseRecord.intake.householdIncome,
    housing: caseRecord.intake.housing,
    fieldValues: {
      county: caseRecord.intake.county,
      email: caseRecord.intake.email,
      phone: caseRecord.intake.phone,
    },
  })

  if (caseRecord.relatedPeople.length > 0) {
    await db.insert(people).values(
      caseRecord.relatedPeople.map((person) => {
        const [relatedFirstName = '', ...relatedLastNameParts] =
          person.name.split(' ')

        return {
          id: person.id,
          frcId: 'frc-demo',
          personRole: 'household_member' as const,
          firstName: relatedFirstName,
          lastName: relatedLastNameParts.join(' '),
          approximateAge: String(person.age),
          county: caseRecord.county,
        }
      }),
    )

    await db.insert(personRelationships).values(
      caseRecord.relatedPeople.map((person) => ({
        id: `${caseRecord.id}-${person.id}`,
        sourcePersonId: caseRecord.personId,
        relatedPersonId: person.id,
        relationship: person.relationship,
        livesInHousehold: person.inHousehold,
        relatedCaseId: person.linkedCaseId,
      })),
    )
  }

  await db.insert(intakeSubmissions).values({
    id: submission.id,
    frcId: 'frc-demo',
    caseId: submission.caseId,
    createdById: submission.createdById,
    convertedById: submission.convertedById,
    status: 'converted_to_case',
    startedAt: new Date(submission.startedAt),
    savedAt: submission.savedAt ? new Date(submission.savedAt) : undefined,
    duplicateWarnings: submission.duplicateWarnings,
    duplicateOverrideReason: submission.duplicateOverrideReason,
    clientSnapshot: submission.client,
    demographicSnapshot: submission.demographics,
    addressSnapshot: submission.address,
    incomeSources: submission.incomeSources,
    benefits: submission.benefits,
    relevantContacts: submission.relevantContacts,
    legalSnapshot: submission.legal,
    housingSnapshot: submission.housing,
  })
}
