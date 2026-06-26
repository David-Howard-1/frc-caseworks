import { sql } from 'drizzle-orm'
import {
  initialCases,
  initialNotes,
  initialServices,
  programs as demoPrograms,
  staff,
} from '~/domain/demo-data'
import type {
  CaseStatus,
  ProgramStatus,
  UserRole,
} from '~/domain/demo-data'
import { getDb } from './client'
import {
  caseNotes,
  caseProgramCaseworkers,
  caseProgramEnrollments,
  cases,
  concreteServices,
  frcs,
  people,
  personRelationships,
  primaryIntakes,
  programs,
  userPrograms,
  users,
} from './schema'

const DEMO_FRC_ID = 'frc-demo'

const roleToDb: Record<UserRole, 'caseworker' | 'program_supervisor' | 'executive_director'> = {
  Caseworker: 'caseworker',
  'Executive Director': 'executive_director',
  'Program Supervisor': 'program_supervisor',
}

const caseStatusToDb: Record<CaseStatus, 'open' | 'pending' | 'closed'> = {
  Closed: 'closed',
  Open: 'open',
  Pending: 'pending',
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

const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' ') || parts[0] || '',
  }
}

export async function ensureSeedData() {
  const db = getDb()
  const existing = await db.select({ id: frcs.id }).from(frcs).limit(1)

  if (existing.length > 0) {
    return
  }

  await db.insert(frcs).values({
    id: DEMO_FRC_ID,
    name: 'Bluegrass Family Resource Center',
    legalName: 'Bluegrass Family Resource Center',
    county: 'Jefferson',
    state: 'KY',
  })

  await db.insert(users).values(
    staff.map((person) => ({
      id: person.id,
      frcId: DEMO_FRC_ID,
      role: roleToDb[person.role],
      name: person.name,
      email: `${person.id}@frccaseworks.local`,
    })),
  )

  await db.insert(programs).values(
    demoPrograms.map((program) => ({
      id: program.id,
      frcId: DEMO_FRC_ID,
      code: program.code,
      name: program.name,
      grantor: program.grantor,
      color: program.color,
      supervisorId: program.supervisorId,
    })),
  )

  await db.insert(userPrograms).values(
    staff.flatMap((person) =>
      person.programs.map((programId) => ({
        userId: person.id,
        programId,
      })),
    ),
  )

  const primaryPeople = initialCases.map((caseRecord) => {
    const name = splitName(caseRecord.displayName)
    return {
      id: caseRecord.personId,
      frcId: DEMO_FRC_ID,
      personRole: 'client' as const,
      firstName: name.firstName,
      lastName: name.lastName,
      pronouns: caseRecord.pronouns,
      approximateAge: String(caseRecord.age),
      phone: caseRecord.intake.phone,
      email: caseRecord.intake.email,
      county: caseRecord.county,
    }
  })

  const relatedPeople = initialCases.flatMap((caseRecord) =>
    caseRecord.relatedPeople.map((person) => {
      const name = splitName(person.name)
      return {
        id: person.id,
        frcId: DEMO_FRC_ID,
        personRole: 'household_member' as const,
        firstName: name.firstName,
        lastName: name.lastName,
        approximateAge: String(person.age),
        county: caseRecord.county,
      }
    }),
  )

  await db.insert(people).values([...primaryPeople, ...relatedPeople])

  await db.insert(cases).values(
    initialCases.map((caseRecord) => ({
      id: caseRecord.id,
      frcId: DEMO_FRC_ID,
      primaryPersonId: caseRecord.personId,
      status: caseStatusToDb[caseRecord.status],
      risk: caseRecord.risk.toLowerCase() as 'low' | 'medium' | 'high',
      openedAt: caseRecord.opened,
      lastContactAt: caseRecord.lastContact,
    })),
  )

  await db.insert(primaryIntakes).values(
    initialCases.map((caseRecord) => ({
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
    })),
  )

  await db.insert(caseProgramEnrollments).values(
    initialCases.flatMap((caseRecord) =>
      caseRecord.enrollments.map((enrollment) => ({
        id: enrollment.id,
        caseId: caseRecord.id,
        programId: enrollment.programId,
        supervisorId: enrollment.supervisorId,
        status: programStatusToDb[enrollment.status],
        startDate: enrollment.opened,
        targetDate: enrollment.target,
        goalSummary: enrollment.goal,
      })),
    ),
  )

  await db.insert(caseProgramCaseworkers).values(
    initialCases.flatMap((caseRecord) =>
      caseRecord.enrollments.flatMap((enrollment) =>
        enrollment.caseworkers.map((assignment) => ({
          programEnrollmentId: enrollment.id,
          caseworkerId: assignment.staffId,
          isPrimary: assignment.isPrimary,
        })),
      ),
    ),
  )

  await db.insert(caseNotes).values(
    initialNotes.map((note) => ({
      id: note.id,
      caseId: note.caseId,
      programEnrollmentId: note.enrollmentId,
      authorId: note.authorId,
      noteDate: note.date,
      contactType: note.contactType,
      summary: note.summary,
      body: note.body,
      isSession: note.isSession,
      sessionHours: note.sessionHours,
    })),
  )

  await db.insert(concreteServices).values(
    initialServices.map((service) => ({
      id: service.id,
      caseId: service.caseId,
      programEnrollmentId: service.enrollmentId,
      serviceDate: service.date,
      category: service.category,
      description: service.description,
      amount: service.amount,
      grantor: service.grantor,
    })),
  )

  const relationships = initialCases.flatMap((caseRecord) =>
    caseRecord.relatedPeople.map((person) => ({
      id: `${caseRecord.id}-${person.id}`,
      sourcePersonId: caseRecord.personId,
      relatedPersonId: person.id,
      relationship: person.relationship,
      livesInHousehold: person.inHousehold,
      relatedCaseId: person.linkedCaseId,
    })),
  )

  if (relationships.length > 0) {
    await db.insert(personRelationships).values(relationships)
  }

  await db.execute(sql`select 1`)
}

