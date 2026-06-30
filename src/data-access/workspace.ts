import { and, asc, eq, sql } from 'drizzle-orm'
import type { Database } from '~/db/client'
import {
  caseNotes,
  caseProgramCaseworkers,
  caseProgramEnrollments,
  cases,
  concreteServices,
  frcs,
  intakeSubmissions,
  people,
  personRelationships,
  primaryIntakes,
  programs,
  userPrograms,
  users,
} from '~/db/schema'

export async function getWorkspaceRows(db: Database) {
  const [
    frcRows,
    userRows,
    programRows,
    userProgramRows,
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
    db.select().from(frcs).orderBy(asc(frcs.id)),
    db.select().from(users).orderBy(asc(users.name)),
    db.select().from(programs).orderBy(asc(programs.name)),
    db.select().from(userPrograms),
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

  return {
    frcRows,
    userRows,
    programRows,
    userProgramRows,
    caseRows,
    personRows,
    intakeRows,
    enrollmentRows,
    assignmentRows,
    noteRows,
    serviceRows,
    relationshipRows,
    intakeSubmissionRows,
  }
}

export async function getUserById(db: Database, userId: number) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  return user
}

export async function getFirstFrc(db: Database) {
  const [frc] = await db.select().from(frcs).orderBy(asc(frcs.id)).limit(1)
  return frc
}

export async function updateCaseStatusRow(
  db: Database,
  caseId: number,
  status: typeof cases.$inferInsert.status,
) {
  await db
    .update(cases)
    .set({
      status,
      lastContactAt: new Date().toISOString().slice(0, 10),
    })
    .where(eq(cases.id, caseId))
}

export async function updateEnrollmentRow(
  db: Database,
  enrollmentId: number,
  values: Partial<typeof caseProgramEnrollments.$inferInsert>,
) {
  await db
    .update(caseProgramEnrollments)
    .set(values)
    .where(eq(caseProgramEnrollments.id, enrollmentId))
}

export async function updatePrimaryIntakeRow(
  db: Database,
  caseId: number,
  values: Partial<typeof primaryIntakes.$inferInsert>,
) {
  await db
    .update(primaryIntakes)
    .set(values)
    .where(eq(primaryIntakes.caseId, caseId))
}

export async function updatePrimaryIntakeJsonField(
  db: Database,
  caseId: number,
  field: string,
  value: string,
) {
  await db
    .update(primaryIntakes)
    .set({
      fieldValues: sql`json_set(coalesce(${primaryIntakes.fieldValues}, json_object()), ${`$.${field}`}, ${value})`,
    })
    .where(eq(primaryIntakes.caseId, caseId))
}

export async function addCaseworkerAssignmentRow(
  db: Database,
  values: typeof caseProgramCaseworkers.$inferInsert,
) {
  await db
    .insert(caseProgramCaseworkers)
    .values(values)
    .onDuplicateKeyUpdate({
      set: { isPrimary: values.isPrimary },
    })
}

export async function removeCaseworkerAssignmentRow(
  db: Database,
  enrollmentId: number,
  staffId: number,
) {
  await db
    .delete(caseProgramCaseworkers)
    .where(
      and(
        eq(caseProgramCaseworkers.programEnrollmentId, enrollmentId),
        eq(caseProgramCaseworkers.caseworkerId, staffId),
      ),
    )
}

export async function clearPrimaryCaseworkerRows(
  db: Database,
  enrollmentId: number,
) {
  await db
    .update(caseProgramCaseworkers)
    .set({ isPrimary: false })
    .where(eq(caseProgramCaseworkers.programEnrollmentId, enrollmentId))
}

export async function setPrimaryCaseworkerRow(
  db: Database,
  enrollmentId: number,
  staffId: number,
) {
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

export async function insertNoteRow(
  db: Database,
  values: typeof caseNotes.$inferInsert,
) {
  const [row] = await db.insert(caseNotes).values(values).$returningId()
  return row.id
}

export async function updateNoteRow(
  db: Database,
  noteId: number,
  values: Partial<typeof caseNotes.$inferInsert>,
) {
  await db.update(caseNotes).set(values).where(eq(caseNotes.id, noteId))
}

export async function insertConcreteServiceRow(
  db: Database,
  values: typeof concreteServices.$inferInsert,
) {
  const [row] = await db.insert(concreteServices).values(values).$returningId()
  return row.id
}

export async function insertPersonRow(
  db: Database,
  values: typeof people.$inferInsert,
) {
  const [row] = await db.insert(people).values(values).$returningId()
  return row.id
}

export async function insertCaseRow(
  db: Database,
  values: typeof cases.$inferInsert,
) {
  const [row] = await db.insert(cases).values(values).$returningId()
  return row.id
}

export async function insertPrimaryIntakeRow(
  db: Database,
  values: typeof primaryIntakes.$inferInsert,
) {
  const [row] = await db.insert(primaryIntakes).values(values).$returningId()
  return row.id
}

export async function insertEnrollmentRow(
  db: Database,
  values: typeof caseProgramEnrollments.$inferInsert,
) {
  const [row] = await db.insert(caseProgramEnrollments).values(values).$returningId()
  return row.id
}

export async function insertIntakeSubmissionRow(
  db: Database,
  values: typeof intakeSubmissions.$inferInsert,
) {
  const [row] = await db.insert(intakeSubmissions).values(values).$returningId()
  return row.id
}

export async function insertPersonRelationshipRow(
  db: Database,
  values: typeof personRelationships.$inferInsert,
) {
  const [row] = await db.insert(personRelationships).values(values).$returningId()
  return row.id
}
