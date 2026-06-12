import { relations } from 'drizzle-orm'
import {
  boolean,
  date,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core'

export const caseStatusEnum = mysqlEnum('case_status', [
  'open',
  'pending',
  'closed',
])

export const programEnrollmentStatusEnum = mysqlEnum(
  'program_enrollment_status',
  ['active', 'pending', 'completed', 'inactive', 'waitlisted'],
)

export const intakeStatusEnum = mysqlEnum('intake_status', [
  'draft',
  'duplicate_review',
  'rejected',
  'converted_to_case',
])

export const userRoleEnum = mysqlEnum('user_role', [
  'caseworker',
  'program_supervisor',
  'executive_director',
])

export const peopleRoleEnum = mysqlEnum('person_role', [
  'client',
  'caregiver',
  'child',
  'household_member',
  'collateral_contact',
])

export const frcs = mysqlTable('frcs', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 191 }).notNull(),
  legalName: varchar('legal_name', { length: 191 }),
  county: varchar('county', { length: 120 }),
  state: varchar('state', { length: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const users = mysqlTable(
  'users',
  {
    id: serial('id').primaryKey(),
    frcId: int('frc_id')
      .notNull()
      .references(() => frcs.id),
    role: userRoleEnum.notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    email: varchar('email', { length: 191 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    frcRoleIdx: index('users_frc_role_idx').on(table.frcId, table.role),
    emailIdx: index('users_email_idx').on(table.email),
  }),
)

export const programs = mysqlTable(
  'programs',
  {
    id: serial('id').primaryKey(),
    frcId: int('frc_id')
      .notNull()
      .references(() => frcs.id),
    code: varchar('code', { length: 48 }).notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    grantor: varchar('grantor', { length: 120 }),
    reportingType: varchar('reporting_type', { length: 80 }),
    supervisorId: int('supervisor_id').references(() => users.id),
    isActive: boolean('is_active').default(true).notNull(),
  },
  (table) => ({
    frcCodeIdx: index('programs_frc_code_idx').on(table.frcId, table.code),
    grantorIdx: index('programs_grantor_idx').on(table.grantor),
  }),
)

export const people = mysqlTable(
  'people',
  {
    id: serial('id').primaryKey(),
    frcId: int('frc_id')
      .notNull()
      .references(() => frcs.id),
    personRole: peopleRoleEnum.default('client').notNull(),
    firstName: varchar('first_name', { length: 120 }),
    middleName: varchar('middle_name', { length: 120 }),
    lastName: varchar('last_name', { length: 120 }),
    preferredName: varchar('preferred_name', { length: 120 }),
    dateOfBirth: date('date_of_birth'),
    phone: varchar('phone', { length: 40 }),
    email: varchar('email', { length: 191 }),
    addressLine1: varchar('address_line_1', { length: 191 }),
    addressLine2: varchar('address_line_2', { length: 191 }),
    city: varchar('city', { length: 120 }),
    state: varchar('state', { length: 2 }),
    postalCode: varchar('postal_code', { length: 20 }),
    county: varchar('county', { length: 120 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    frcNameIdx: index('people_frc_name_idx').on(
      table.frcId,
      table.lastName,
      table.firstName,
    ),
  }),
)

export const cases = mysqlTable(
  'cases',
  {
    id: serial('id').primaryKey(),
    frcId: int('frc_id')
      .notNull()
      .references(() => frcs.id),
    primaryPersonId: int('primary_person_id')
      .notNull()
      .references(() => people.id),
    status: caseStatusEnum.default('pending').notNull(),
    openedAt: date('opened_at'),
    closedAt: date('closed_at'),
    closureReason: varchar('closure_reason', { length: 191 }),
    householdName: varchar('household_name', { length: 191 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    frcStatusIdx: index('cases_frc_status_idx').on(table.frcId, table.status),
    primaryPersonIdx: index('cases_primary_person_idx').on(
      table.primaryPersonId,
    ),
  }),
)

export const primaryIntakes = mysqlTable(
  'primary_intakes',
  {
    id: serial('id').primaryKey(),
    caseId: int('case_id')
      .notNull()
      .references(() => cases.id),
    completedById: int('completed_by_id').references(() => users.id),
    intakeDate: date('intake_date'),
    referralSource: varchar('referral_source', { length: 191 }),
    familyStrengths: text('family_strengths'),
    presentingNeeds: text('presenting_needs'),
    safetyConcerns: text('safety_concerns'),
    householdIncome: decimal('household_income', {
      precision: 10,
      scale: 2,
      mode: 'number',
    }),
    fieldValues: json('field_values').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    caseIdx: index('primary_intakes_case_idx').on(table.caseId),
  }),
)

export const intakeSubmissions = mysqlTable(
  'intake_submissions',
  {
    id: serial('id').primaryKey(),
    frcId: int('frc_id')
      .notNull()
      .references(() => frcs.id),
    caseId: int('case_id').references(() => cases.id),
    createdById: int('created_by_id')
      .notNull()
      .references(() => users.id),
    convertedById: int('converted_by_id').references(() => users.id),
    status: intakeStatusEnum.default('draft').notNull(),
    intakeDate: date('intake_date'),
    savedAt: timestamp('saved_at'),
    duplicateWarnings: json('duplicate_warnings')
      .$type<
        Array<{
          recordType: 'case' | 'intake' | 'person'
          recordId: number | string
          strength: 'high' | 'medium' | 'low'
          reason: string
        }>
      >(),
    duplicateOverrideReason: text('duplicate_override_reason'),
    clientSnapshot: json('client_snapshot').$type<Record<string, unknown>>(),
    demographicSnapshot: json('demographic_snapshot').$type<
      Record<string, unknown>
    >(),
    incomeSources: json('income_sources')
      .$type<Array<Record<string, unknown>>>(),
    benefits: json('benefits')
      .$type<Array<Record<string, unknown>>>(),
    relevantContacts: json('relevant_contacts')
      .$type<Array<Record<string, unknown>>>(),
    legalSnapshot: json('legal_snapshot').$type<Record<string, unknown>>(),
    housingSnapshot: json('housing_snapshot').$type<Record<string, unknown>>(),
    fieldValues: json('field_values').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    frcStatusIdx: index('intake_submissions_frc_status_idx').on(
      table.frcId,
      table.status,
    ),
    caseIdx: index('intake_submissions_case_idx').on(table.caseId),
    createdByIdx: index('intake_submissions_created_by_idx').on(
      table.createdById,
    ),
  }),
)

export const caseProgramEnrollments = mysqlTable(
  'case_program_enrollments',
  {
    id: serial('id').primaryKey(),
    caseId: int('case_id')
      .notNull()
      .references(() => cases.id),
    programId: int('program_id')
      .notNull()
      .references(() => programs.id),
    supervisorId: int('supervisor_id').references(() => users.id),
    status: programEnrollmentStatusEnum.default('pending').notNull(),
    startDate: date('start_date'),
    endDate: date('end_date'),
    goalSummary: text('goal_summary'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    caseProgramIdx: index('case_program_enrollments_case_program_idx').on(
      table.caseId,
      table.programId,
    ),
  }),
)

export const caseProgramCaseworkers = mysqlTable(
  'case_program_caseworkers',
  {
    programEnrollmentId: int('program_enrollment_id')
      .notNull()
      .references(() => caseProgramEnrollments.id),
    caseworkerId: int('caseworker_id')
      .notNull()
      .references(() => users.id),
    isPrimary: boolean('is_primary').default(false).notNull(),
    assignedAt: timestamp('assigned_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.programEnrollmentId, table.caseworkerId],
    }),
    caseworkerIdx: index('case_program_caseworkers_caseworker_idx').on(
      table.caseworkerId,
      table.isPrimary,
    ),
    enrollmentPrimaryIdx: index(
      'case_program_caseworkers_enrollment_primary_idx',
    ).on(table.programEnrollmentId, table.isPrimary),
  }),
)

export const caseNotes = mysqlTable(
  'case_notes',
  {
    id: serial('id').primaryKey(),
    caseId: int('case_id')
      .notNull()
      .references(() => cases.id),
    programEnrollmentId: int('program_enrollment_id').references(
      () => caseProgramEnrollments.id,
    ),
    authorId: int('author_id')
      .notNull()
      .references(() => users.id),
    noteDate: date('note_date').notNull(),
    contactType: varchar('contact_type', { length: 80 }),
    summary: varchar('summary', { length: 191 }),
    body: text('body').notNull(),
    isSession: boolean('is_session').default(true).notNull(),
    sessionHours: decimal('session_hours', {
      precision: 5,
      scale: 2,
      mode: 'number',
    }),
    isPrivate: boolean('is_private').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    caseDateIdx: index('case_notes_case_date_idx').on(
      table.caseId,
      table.noteDate,
    ),
    enrollmentIdx: index('case_notes_program_enrollment_idx').on(
      table.programEnrollmentId,
    ),
  }),
)

export const concreteServices = mysqlTable(
  'concrete_services',
  {
    id: serial('id').primaryKey(),
    caseId: int('case_id')
      .notNull()
      .references(() => cases.id),
    programEnrollmentId: int('program_enrollment_id').references(
      () => caseProgramEnrollments.id,
    ),
    providedById: int('provided_by_id').references(() => users.id),
    serviceDate: date('service_date').notNull(),
    category: varchar('category', { length: 120 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    amount: decimal('amount', {
      precision: 10,
      scale: 2,
      mode: 'number',
    })
      .default(0)
      .notNull(),
    grantCode: varchar('grant_code', { length: 80 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    caseDateIdx: index('concrete_services_case_date_idx').on(
      table.caseId,
      table.serviceDate,
    ),
    grantDateIdx: index('concrete_services_grant_date_idx').on(
      table.grantCode,
      table.serviceDate,
    ),
  }),
)

export const personRelationships = mysqlTable(
  'person_relationships',
  {
    sourcePersonId: int('source_person_id')
      .notNull()
      .references(() => people.id),
    relatedPersonId: int('related_person_id')
      .notNull()
      .references(() => people.id),
    relationship: varchar('relationship', { length: 80 }).notNull(),
    livesInHousehold: boolean('lives_in_household').default(true).notNull(),
    relatedCaseId: int('related_case_id').references(() => cases.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.sourcePersonId, table.relatedPersonId, table.relationship],
    }),
    relatedCaseIdx: index('person_relationships_related_case_idx').on(
      table.relatedCaseId,
    ),
  }),
)

export const savedReports = mysqlTable(
  'saved_reports',
  {
    id: serial('id').primaryKey(),
    frcId: int('frc_id')
      .notNull()
      .references(() => frcs.id),
    name: varchar('name', { length: 191 }).notNull(),
    grantor: varchar('grantor', { length: 120 }).notNull(),
    periodStart: date('period_start').notNull(),
    periodEnd: date('period_end').notNull(),
    generatedById: int('generated_by_id').references(() => users.id),
    metrics: json('metrics').$type<Record<string, number | string>>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    frcGrantorIdx: index('saved_reports_frc_grantor_idx').on(
      table.frcId,
      table.grantor,
    ),
  }),
)

export const frcsRelations = relations(frcs, ({ many }) => ({
  users: many(users),
  programs: many(programs),
  people: many(people),
  cases: many(cases),
  intakeSubmissions: many(intakeSubmissions),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  frc: one(frcs, {
    fields: [users.frcId],
    references: [frcs.id],
  }),
  supervisedPrograms: many(programs, { relationName: 'programSupervisor' }),
  caseworkerAssignments: many(caseProgramCaseworkers, {
    relationName: 'caseProgramCaseworkerUser',
  }),
  supervisorAssignments: many(caseProgramEnrollments, {
    relationName: 'enrollmentSupervisor',
  }),
  notes: many(caseNotes),
  createdIntakes: many(intakeSubmissions, { relationName: 'intakeCreator' }),
  convertedIntakes: many(intakeSubmissions, {
    relationName: 'intakeConverter',
  }),
}))

export const programsRelations = relations(programs, ({ one, many }) => ({
  frc: one(frcs, {
    fields: [programs.frcId],
    references: [frcs.id],
  }),
  supervisor: one(users, {
    fields: [programs.supervisorId],
    references: [users.id],
    relationName: 'programSupervisor',
  }),
  enrollments: many(caseProgramEnrollments),
}))

export const peopleRelations = relations(people, ({ one, many }) => ({
  frc: one(frcs, {
    fields: [people.frcId],
    references: [frcs.id],
  }),
  cases: many(cases),
}))

export const casesRelations = relations(cases, ({ one, many }) => ({
  frc: one(frcs, {
    fields: [cases.frcId],
    references: [frcs.id],
  }),
  primaryPerson: one(people, {
    fields: [cases.primaryPersonId],
    references: [people.id],
  }),
  primaryIntakes: many(primaryIntakes),
  intakeSubmissions: many(intakeSubmissions),
  programEnrollments: many(caseProgramEnrollments),
  notes: many(caseNotes),
  concreteServices: many(concreteServices),
}))

export const intakeSubmissionsRelations = relations(
  intakeSubmissions,
  ({ one }) => ({
    frc: one(frcs, {
      fields: [intakeSubmissions.frcId],
      references: [frcs.id],
    }),
    case: one(cases, {
      fields: [intakeSubmissions.caseId],
      references: [cases.id],
    }),
    createdBy: one(users, {
      fields: [intakeSubmissions.createdById],
      references: [users.id],
      relationName: 'intakeCreator',
    }),
    convertedBy: one(users, {
      fields: [intakeSubmissions.convertedById],
      references: [users.id],
      relationName: 'intakeConverter',
    }),
  }),
)

export const caseProgramEnrollmentsRelations = relations(
  caseProgramEnrollments,
  ({ one, many }) => ({
    case: one(cases, {
      fields: [caseProgramEnrollments.caseId],
      references: [cases.id],
    }),
    program: one(programs, {
      fields: [caseProgramEnrollments.programId],
      references: [programs.id],
    }),
    supervisor: one(users, {
      fields: [caseProgramEnrollments.supervisorId],
      references: [users.id],
      relationName: 'enrollmentSupervisor',
    }),
    assignedCaseworkers: many(caseProgramCaseworkers),
    notes: many(caseNotes),
    concreteServices: many(concreteServices),
  }),
)

export const caseProgramCaseworkersRelations = relations(
  caseProgramCaseworkers,
  ({ one }) => ({
    programEnrollment: one(caseProgramEnrollments, {
      fields: [caseProgramCaseworkers.programEnrollmentId],
      references: [caseProgramEnrollments.id],
    }),
    caseworker: one(users, {
      fields: [caseProgramCaseworkers.caseworkerId],
      references: [users.id],
      relationName: 'caseProgramCaseworkerUser',
    }),
  }),
)
