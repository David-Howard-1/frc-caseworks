import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "../server.js";
import { c as getProgram, d as initialNotes, f as initialServices, h as staff, m as programs$1, p as initialWorkspaceSnapshot, u as initialCases } from "./demo-data-BsOXExLV.js";
import { and, asc, eq, relations, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { boolean, date, decimal, index, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.14/node_modules/@tanstack/start-server-core/dist/esm/createServerRpc.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/db/schema.ts
var schema_exports = /* @__PURE__ */ __exportAll({
	caseNotes: () => caseNotes,
	caseProgramCaseworkers: () => caseProgramCaseworkers,
	caseProgramEnrollments: () => caseProgramEnrollments,
	caseRiskEnum: () => caseRiskEnum,
	caseStatusEnum: () => caseStatusEnum,
	cases: () => cases,
	casesRelations: () => casesRelations,
	concreteServices: () => concreteServices,
	frcs: () => frcs,
	frcsRelations: () => frcsRelations,
	intakeStatusEnum: () => intakeStatusEnum,
	intakeSubmissions: () => intakeSubmissions,
	people: () => people,
	peopleRelations: () => peopleRelations,
	peopleRoleEnum: () => peopleRoleEnum,
	personRelationships: () => personRelationships,
	primaryIntakes: () => primaryIntakes,
	programEnrollmentStatusEnum: () => programEnrollmentStatusEnum,
	programs: () => programs,
	programsRelations: () => programsRelations,
	savedReports: () => savedReports,
	userPrograms: () => userPrograms,
	userProgramsRelations: () => userProgramsRelations,
	userRoleEnum: () => userRoleEnum,
	users: () => users,
	usersRelations: () => usersRelations
});
var caseStatusEnum = mysqlEnum("case_status", [
	"open",
	"pending",
	"closed"
]);
var caseRiskEnum = mysqlEnum("case_risk", [
	"low",
	"medium",
	"high"
]);
var programEnrollmentStatusEnum = mysqlEnum("program_enrollment_status", [
	"active",
	"pending",
	"completed",
	"inactive",
	"waitlisted"
]);
var intakeStatusEnum = mysqlEnum("intake_status", [
	"draft",
	"duplicate_review",
	"rejected",
	"converted_to_case"
]);
var userRoleEnum = mysqlEnum("user_role", [
	"caseworker",
	"program_supervisor",
	"executive_director"
]);
var peopleRoleEnum = mysqlEnum("person_role", [
	"client",
	"caregiver",
	"child",
	"household_member",
	"collateral_contact"
]);
var frcs = mysqlTable("frcs", {
	id: varchar("id", { length: 64 }).primaryKey(),
	name: varchar("name", { length: 191 }).notNull(),
	legalName: varchar("legal_name", { length: 191 }),
	county: varchar("county", { length: 120 }),
	state: varchar("state", { length: 2 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
});
var users = mysqlTable("users", {
	id: varchar("id", { length: 64 }).primaryKey(),
	frcId: varchar("frc_id", { length: 64 }).notNull().references(() => frcs.id),
	role: userRoleEnum.notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	email: varchar("email", { length: 191 }).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
	frcRoleIdx: index("users_frc_role_idx").on(table.frcId, table.role),
	emailIdx: index("users_email_idx").on(table.email)
}));
var programs = mysqlTable("programs", {
	id: varchar("id", { length: 64 }).primaryKey(),
	frcId: varchar("frc_id", { length: 64 }).notNull().references(() => frcs.id),
	code: varchar("code", { length: 48 }).notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	grantor: varchar("grantor", { length: 120 }),
	reportingType: varchar("reporting_type", { length: 80 }),
	color: varchar("color", { length: 24 }),
	supervisorId: varchar("supervisor_id", { length: 64 }).references(() => users.id),
	isActive: boolean("is_active").default(true).notNull()
}, (table) => ({
	frcCodeIdx: index("programs_frc_code_idx").on(table.frcId, table.code),
	grantorIdx: index("programs_grantor_idx").on(table.grantor)
}));
var userPrograms = mysqlTable("user_programs", {
	userId: varchar("user_id", { length: 64 }).notNull().references(() => users.id),
	programId: varchar("program_id", { length: 64 }).notNull().references(() => programs.id)
}, (table) => ({ pk: primaryKey({ columns: [table.userId, table.programId] }) }));
var people = mysqlTable("people", {
	id: varchar("id", { length: 64 }).primaryKey(),
	frcId: varchar("frc_id", { length: 64 }).notNull().references(() => frcs.id),
	personRole: peopleRoleEnum.default("client").notNull(),
	firstName: varchar("first_name", { length: 120 }),
	middleName: varchar("middle_name", { length: 120 }),
	lastName: varchar("last_name", { length: 120 }),
	preferredName: varchar("preferred_name", { length: 120 }),
	pronouns: varchar("pronouns", { length: 40 }),
	approximateAge: varchar("approximate_age", { length: 16 }),
	dateOfBirth: date("date_of_birth", { mode: "string" }),
	phone: varchar("phone", { length: 40 }),
	email: varchar("email", { length: 191 }),
	addressLine1: varchar("address_line_1", { length: 191 }),
	addressLine2: varchar("address_line_2", { length: 191 }),
	city: varchar("city", { length: 120 }),
	state: varchar("state", { length: 2 }),
	postalCode: varchar("postal_code", { length: 20 }),
	county: varchar("county", { length: 120 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
}, (table) => ({ frcNameIdx: index("people_frc_name_idx").on(table.frcId, table.lastName, table.firstName) }));
var cases = mysqlTable("cases", {
	id: varchar("id", { length: 64 }).primaryKey(),
	frcId: varchar("frc_id", { length: 64 }).notNull().references(() => frcs.id),
	primaryPersonId: varchar("primary_person_id", { length: 64 }).notNull().references(() => people.id),
	status: caseStatusEnum.default("pending").notNull(),
	risk: caseRiskEnum.default("low").notNull(),
	openedAt: date("opened_at", { mode: "string" }),
	lastContactAt: date("last_contact_at", { mode: "string" }),
	closedAt: date("closed_at", { mode: "string" }),
	closureReason: varchar("closure_reason", { length: 191 }),
	householdName: varchar("household_name", { length: 191 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
}, (table) => ({
	frcStatusIdx: index("cases_frc_status_idx").on(table.frcId, table.status),
	primaryPersonIdx: index("cases_primary_person_idx").on(table.primaryPersonId)
}));
var primaryIntakes = mysqlTable("primary_intakes", {
	id: varchar("id", { length: 64 }).primaryKey(),
	caseId: varchar("case_id", { length: 64 }).notNull().references(() => cases.id),
	completedById: varchar("completed_by_id", { length: 64 }).references(() => users.id),
	intakeDate: date("intake_date", { mode: "string" }),
	referralSource: varchar("referral_source", { length: 191 }),
	familyStrengths: text("family_strengths"),
	presentingNeeds: text("presenting_needs"),
	safetyConcerns: text("safety_concerns"),
	householdIncome: varchar("household_income", { length: 120 }),
	housing: varchar("housing", { length: 191 }),
	fieldValues: json("field_values").$type(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
}, (table) => ({ caseIdx: index("primary_intakes_case_idx").on(table.caseId) }));
var intakeSubmissions = mysqlTable("intake_submissions", {
	id: varchar("id", { length: 64 }).primaryKey(),
	frcId: varchar("frc_id", { length: 64 }).notNull().references(() => frcs.id),
	caseId: varchar("case_id", { length: 64 }).references(() => cases.id),
	createdById: varchar("created_by_id", { length: 64 }).notNull().references(() => users.id),
	convertedById: varchar("converted_by_id", { length: 64 }).references(() => users.id),
	status: intakeStatusEnum.default("draft").notNull(),
	startedAt: timestamp("started_at").notNull(),
	savedAt: timestamp("saved_at"),
	duplicateWarnings: json("duplicate_warnings").$type(),
	duplicateOverrideReason: text("duplicate_override_reason"),
	clientSnapshot: json("client_snapshot").$type(),
	demographicSnapshot: json("demographic_snapshot").$type(),
	addressSnapshot: json("address_snapshot").$type(),
	incomeSources: json("income_sources").$type(),
	benefits: json("benefits").$type(),
	relevantContacts: json("relevant_contacts").$type(),
	legalSnapshot: json("legal_snapshot").$type(),
	housingSnapshot: json("housing_snapshot").$type(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
}, (table) => ({
	frcStatusIdx: index("intake_submissions_frc_status_idx").on(table.frcId, table.status),
	caseIdx: index("intake_submissions_case_idx").on(table.caseId),
	createdByIdx: index("intake_submissions_created_by_idx").on(table.createdById)
}));
var caseProgramEnrollments = mysqlTable("case_program_enrollments", {
	id: varchar("id", { length: 64 }).primaryKey(),
	caseId: varchar("case_id", { length: 64 }).notNull().references(() => cases.id),
	programId: varchar("program_id", { length: 64 }).notNull().references(() => programs.id),
	supervisorId: varchar("supervisor_id", { length: 64 }).references(() => users.id),
	status: programEnrollmentStatusEnum.default("pending").notNull(),
	startDate: date("start_date", { mode: "string" }),
	targetDate: date("target_date", { mode: "string" }),
	endDate: date("end_date", { mode: "string" }),
	goalSummary: text("goal_summary"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
}, (table) => ({ caseProgramIdx: index("case_program_enrollments_case_program_idx").on(table.caseId, table.programId) }));
var caseProgramCaseworkers = mysqlTable("case_program_caseworkers", {
	programEnrollmentId: varchar("program_enrollment_id", { length: 64 }).notNull().references(() => caseProgramEnrollments.id),
	caseworkerId: varchar("caseworker_id", { length: 64 }).notNull().references(() => users.id),
	isPrimary: boolean("is_primary").default(false).notNull(),
	assignedAt: timestamp("assigned_at").defaultNow().notNull()
}, (table) => ({
	pk: primaryKey({ columns: [table.programEnrollmentId, table.caseworkerId] }),
	caseworkerIdx: index("case_program_caseworkers_caseworker_idx").on(table.caseworkerId, table.isPrimary),
	enrollmentPrimaryIdx: index("case_program_caseworkers_enrollment_primary_idx").on(table.programEnrollmentId, table.isPrimary)
}));
var caseNotes = mysqlTable("case_notes", {
	id: varchar("id", { length: 64 }).primaryKey(),
	caseId: varchar("case_id", { length: 64 }).notNull().references(() => cases.id),
	programEnrollmentId: varchar("program_enrollment_id", { length: 64 }).references(() => caseProgramEnrollments.id),
	authorId: varchar("author_id", { length: 64 }).notNull().references(() => users.id),
	noteDate: date("note_date", { mode: "string" }).notNull(),
	contactType: varchar("contact_type", { length: 80 }),
	summary: varchar("summary", { length: 191 }),
	body: text("body").notNull(),
	isSession: boolean("is_session").default(true).notNull(),
	sessionHours: decimal("session_hours", {
		precision: 5,
		scale: 2,
		mode: "number"
	}),
	isPrivate: boolean("is_private").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
}, (table) => ({
	caseDateIdx: index("case_notes_case_date_idx").on(table.caseId, table.noteDate),
	enrollmentIdx: index("case_notes_program_enrollment_idx").on(table.programEnrollmentId)
}));
var concreteServices = mysqlTable("concrete_services", {
	id: varchar("id", { length: 64 }).primaryKey(),
	caseId: varchar("case_id", { length: 64 }).notNull().references(() => cases.id),
	programEnrollmentId: varchar("program_enrollment_id", { length: 64 }).references(() => caseProgramEnrollments.id),
	providedById: varchar("provided_by_id", { length: 64 }).references(() => users.id),
	serviceDate: date("service_date", { mode: "string" }).notNull(),
	category: varchar("category", { length: 120 }).notNull(),
	description: varchar("description", { length: 255 }).notNull(),
	amount: decimal("amount", {
		precision: 10,
		scale: 2,
		mode: "number"
	}).default(0).notNull(),
	grantCode: varchar("grant_code", { length: 80 }),
	grantor: varchar("grantor", { length: 120 }),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
	caseDateIdx: index("concrete_services_case_date_idx").on(table.caseId, table.serviceDate),
	grantDateIdx: index("concrete_services_grant_date_idx").on(table.grantCode, table.serviceDate)
}));
var personRelationships = mysqlTable("person_relationships", {
	id: varchar("id", { length: 64 }).primaryKey(),
	sourcePersonId: varchar("source_person_id", { length: 64 }).notNull().references(() => people.id),
	relatedPersonId: varchar("related_person_id", { length: 64 }).notNull().references(() => people.id),
	relationship: varchar("relationship", { length: 80 }).notNull(),
	livesInHousehold: boolean("lives_in_household").default(true).notNull(),
	relatedCaseId: varchar("related_case_id", { length: 64 }).references(() => cases.id),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
	sourceIdx: index("person_relationships_source_idx").on(table.sourcePersonId),
	relatedCaseIdx: index("person_relationships_related_case_idx").on(table.relatedCaseId)
}));
var savedReports = mysqlTable("saved_reports", {
	id: varchar("id", { length: 64 }).primaryKey(),
	frcId: varchar("frc_id", { length: 64 }).notNull().references(() => frcs.id),
	name: varchar("name", { length: 191 }).notNull(),
	grantor: varchar("grantor", { length: 120 }).notNull(),
	periodStart: date("period_start", { mode: "string" }).notNull(),
	periodEnd: date("period_end", { mode: "string" }).notNull(),
	generatedById: varchar("generated_by_id", { length: 64 }).references(() => users.id),
	metrics: json("metrics").$type(),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({ frcGrantorIdx: index("saved_reports_frc_grantor_idx").on(table.frcId, table.grantor) }));
var frcsRelations = relations(frcs, ({ many }) => ({
	users: many(users),
	programs: many(programs),
	people: many(people),
	cases: many(cases),
	intakeSubmissions: many(intakeSubmissions)
}));
var usersRelations = relations(users, ({ one, many }) => ({
	frc: one(frcs, {
		fields: [users.frcId],
		references: [frcs.id]
	}),
	supervisedPrograms: many(programs, { relationName: "programSupervisor" }),
	programMemberships: many(userPrograms),
	caseworkerAssignments: many(caseProgramCaseworkers, { relationName: "caseProgramCaseworkerUser" }),
	notes: many(caseNotes)
}));
var programsRelations = relations(programs, ({ one, many }) => ({
	frc: one(frcs, {
		fields: [programs.frcId],
		references: [frcs.id]
	}),
	supervisor: one(users, {
		fields: [programs.supervisorId],
		references: [users.id],
		relationName: "programSupervisor"
	}),
	memberships: many(userPrograms),
	enrollments: many(caseProgramEnrollments)
}));
var userProgramsRelations = relations(userPrograms, ({ one }) => ({
	user: one(users, {
		fields: [userPrograms.userId],
		references: [users.id]
	}),
	program: one(programs, {
		fields: [userPrograms.programId],
		references: [programs.id]
	})
}));
var peopleRelations = relations(people, ({ one, many }) => ({
	frc: one(frcs, {
		fields: [people.frcId],
		references: [frcs.id]
	}),
	cases: many(cases),
	relationships: many(personRelationships, { relationName: "sourcePerson" })
}));
var casesRelations = relations(cases, ({ one, many }) => ({
	frc: one(frcs, {
		fields: [cases.frcId],
		references: [frcs.id]
	}),
	primaryPerson: one(people, {
		fields: [cases.primaryPersonId],
		references: [people.id]
	}),
	primaryIntakes: many(primaryIntakes),
	intakeSubmissions: many(intakeSubmissions),
	programEnrollments: many(caseProgramEnrollments),
	notes: many(caseNotes),
	concreteServices: many(concreteServices)
}));
//#endregion
//#region src/db/client.ts
var db = null;
function hasDatabaseUrl() {
	return Boolean(process.env.DATABASE_URL);
}
function getDb() {
	if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for MySQL persistence.");
	if (!db) db = drizzle(createPool(process.env.DATABASE_URL), {
		mode: "default",
		schema: schema_exports
	});
	return db;
}
//#endregion
//#region src/db/seed.ts
var DEMO_FRC_ID = "frc-demo";
var roleToDb = {
	Caseworker: "caseworker",
	"Executive Director": "executive_director",
	"Program Supervisor": "program_supervisor"
};
var caseStatusToDb$1 = {
	Closed: "closed",
	Open: "open",
	Pending: "pending"
};
var programStatusToDb$1 = {
	Active: "active",
	Completed: "completed",
	Inactive: "inactive",
	Pending: "pending",
	Waitlisted: "waitlisted"
};
var splitName = (name) => {
	const parts = name.trim().split(/\s+/);
	return {
		firstName: parts[0] ?? "",
		lastName: parts.slice(1).join(" ") || parts[0] || ""
	};
};
async function ensureSeedData() {
	const db = getDb();
	if ((await db.select({ id: frcs.id }).from(frcs).limit(1)).length > 0) return;
	await db.insert(frcs).values({
		id: DEMO_FRC_ID,
		name: "Bluegrass Family Resource Center",
		legalName: "Bluegrass Family Resource Center",
		county: "Jefferson",
		state: "KY"
	});
	await db.insert(users).values(staff.map((person) => ({
		id: person.id,
		frcId: DEMO_FRC_ID,
		role: roleToDb[person.role],
		name: person.name,
		email: `${person.id}@frccaseworks.local`
	})));
	await db.insert(programs).values(programs$1.map((program) => ({
		id: program.id,
		frcId: DEMO_FRC_ID,
		code: program.code,
		name: program.name,
		grantor: program.grantor,
		color: program.color,
		supervisorId: program.supervisorId
	})));
	await db.insert(userPrograms).values(staff.flatMap((person) => person.programs.map((programId) => ({
		userId: person.id,
		programId
	}))));
	const primaryPeople = initialCases.map((caseRecord) => {
		const name = splitName(caseRecord.displayName);
		return {
			id: caseRecord.personId,
			frcId: DEMO_FRC_ID,
			personRole: "client",
			firstName: name.firstName,
			lastName: name.lastName,
			pronouns: caseRecord.pronouns,
			approximateAge: String(caseRecord.age),
			phone: caseRecord.intake.phone,
			email: caseRecord.intake.email,
			county: caseRecord.county
		};
	});
	const relatedPeople = initialCases.flatMap((caseRecord) => caseRecord.relatedPeople.map((person) => {
		const name = splitName(person.name);
		return {
			id: person.id,
			frcId: DEMO_FRC_ID,
			personRole: "household_member",
			firstName: name.firstName,
			lastName: name.lastName,
			approximateAge: String(person.age),
			county: caseRecord.county
		};
	}));
	await db.insert(people).values([...primaryPeople, ...relatedPeople]);
	await db.insert(cases).values(initialCases.map((caseRecord) => ({
		id: caseRecord.id,
		frcId: DEMO_FRC_ID,
		primaryPersonId: caseRecord.personId,
		status: caseStatusToDb$1[caseRecord.status],
		risk: caseRecord.risk.toLowerCase(),
		openedAt: caseRecord.opened,
		lastContactAt: caseRecord.lastContact
	})));
	await db.insert(primaryIntakes).values(initialCases.map((caseRecord) => ({
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
			phone: caseRecord.intake.phone
		}
	})));
	await db.insert(caseProgramEnrollments).values(initialCases.flatMap((caseRecord) => caseRecord.enrollments.map((enrollment) => ({
		id: enrollment.id,
		caseId: caseRecord.id,
		programId: enrollment.programId,
		supervisorId: enrollment.supervisorId,
		status: programStatusToDb$1[enrollment.status],
		startDate: enrollment.opened,
		targetDate: enrollment.target,
		goalSummary: enrollment.goal
	}))));
	await db.insert(caseProgramCaseworkers).values(initialCases.flatMap((caseRecord) => caseRecord.enrollments.flatMap((enrollment) => enrollment.caseworkers.map((assignment) => ({
		programEnrollmentId: enrollment.id,
		caseworkerId: assignment.staffId,
		isPrimary: assignment.isPrimary
	})))));
	await db.insert(caseNotes).values(initialNotes.map((note) => ({
		id: note.id,
		caseId: note.caseId,
		programEnrollmentId: note.enrollmentId,
		authorId: note.authorId,
		noteDate: note.date,
		contactType: note.contactType,
		summary: note.summary,
		body: note.body,
		isSession: note.isSession,
		sessionHours: note.sessionHours
	})));
	await db.insert(concreteServices).values(initialServices.map((service) => ({
		id: service.id,
		caseId: service.caseId,
		programEnrollmentId: service.enrollmentId,
		serviceDate: service.date,
		category: service.category,
		description: service.description,
		amount: service.amount,
		grantor: service.grantor
	})));
	const relationships = initialCases.flatMap((caseRecord) => caseRecord.relatedPeople.map((person) => ({
		id: `${caseRecord.id}-${person.id}`,
		sourcePersonId: caseRecord.personId,
		relatedPersonId: person.id,
		relationship: person.relationship,
		livesInHousehold: person.inHousehold,
		relatedCaseId: person.linkedCaseId
	})));
	if (relationships.length > 0) await db.insert(personRelationships).values(relationships);
	await db.execute(sql`select 1`);
}
//#endregion
//#region src/repositories/workspaceRepository.ts
var caseStatusFromDb = {
	closed: "Closed",
	open: "Open",
	pending: "Pending"
};
var caseStatusToDb = {
	Closed: "closed",
	Open: "open",
	Pending: "pending"
};
var programStatusFromDb = {
	active: "Active",
	completed: "Completed",
	inactive: "Inactive",
	pending: "Pending",
	waitlisted: "Waitlisted"
};
var programStatusToDb = {
	Active: "active",
	Completed: "completed",
	Inactive: "inactive",
	Pending: "pending",
	Waitlisted: "waitlisted"
};
var toDateString = (value) => {
	if (!value) return "";
	return value instanceof Date ? value.toISOString().slice(0, 10) : value.slice(0, 10);
};
var toDateTimeString = (value) => {
	if (!value) return;
	return value instanceof Date ? value.toISOString() : value;
};
var fullName = (person) => [person.firstName, person.lastName].filter(Boolean).join(" ");
function groupBy(items, getKey) {
	return items.reduce((groups, item) => {
		const key = getKey(item);
		groups.set(key, [...groups.get(key) ?? [], item]);
		return groups;
	}, /* @__PURE__ */ new Map());
}
async function getWorkspaceSnapshot() {
	if (!hasDatabaseUrl()) return initialWorkspaceSnapshot;
	await ensureSeedData();
	const db = getDb();
	const [caseRows, personRows, intakeRows, enrollmentRows, assignmentRows, noteRows, serviceRows, relationshipRows, intakeSubmissionRows] = await Promise.all([
		db.select().from(cases).orderBy(asc(cases.openedAt)),
		db.select().from(people),
		db.select().from(primaryIntakes),
		db.select().from(caseProgramEnrollments),
		db.select().from(caseProgramCaseworkers),
		db.select().from(caseNotes).orderBy(asc(caseNotes.noteDate)),
		db.select().from(concreteServices).orderBy(asc(concreteServices.serviceDate)),
		db.select().from(personRelationships),
		db.select().from(intakeSubmissions)
	]);
	const peopleById = new Map(personRows.map((person) => [person.id, person]));
	const intakeByCaseId = new Map(intakeRows.map((intake) => [intake.caseId, intake]));
	const assignmentsByEnrollmentId = groupBy(assignmentRows, (assignment) => assignment.programEnrollmentId);
	const enrollmentsByCaseId = groupBy(enrollmentRows, (enrollment) => enrollment.caseId);
	const relationshipsBySourcePersonId = groupBy(relationshipRows, (relationship) => relationship.sourcePersonId);
	return {
		cases: caseRows.map((caseRecord) => {
			const person = peopleById.get(caseRecord.primaryPersonId);
			const intake = intakeByCaseId.get(caseRecord.id);
			const fieldValues = intake?.fieldValues ?? {};
			return {
				id: caseRecord.id,
				personId: caseRecord.primaryPersonId,
				displayName: person ? fullName(person) : caseRecord.householdName ?? caseRecord.id,
				pronouns: person?.pronouns ?? void 0,
				age: Number(person?.approximateAge ?? 0),
				status: caseStatusFromDb[caseRecord.status],
				opened: toDateString(caseRecord.openedAt),
				lastContact: toDateString(caseRecord.lastContactAt) || toDateString(caseRecord.openedAt),
				risk: caseRecord.risk === "high" ? "High" : caseRecord.risk === "medium" ? "Medium" : "Low",
				county: person?.county ?? String(fieldValues.county ?? "Unknown"),
				intake: {
					intakeDate: toDateString(intake?.intakeDate),
					referralSource: intake?.referralSource ?? void 0,
					county: String(fieldValues.county ?? person?.county ?? ""),
					phone: String(fieldValues.phone ?? person?.phone ?? ""),
					email: String(fieldValues.email ?? person?.email ?? ""),
					householdIncome: intake?.householdIncome ?? void 0,
					housing: intake?.housing ?? void 0,
					strengths: intake?.familyStrengths ?? void 0,
					needs: intake?.presentingNeeds ?? void 0
				},
				enrollments: (enrollmentsByCaseId.get(caseRecord.id) ?? []).map((enrollment) => ({
					id: enrollment.id,
					programId: enrollment.programId,
					caseworkers: (assignmentsByEnrollmentId.get(enrollment.id) ?? []).map((assignment) => ({
						staffId: assignment.caseworkerId,
						isPrimary: assignment.isPrimary
					})),
					supervisorId: enrollment.supervisorId ?? "",
					status: programStatusFromDb[enrollment.status],
					opened: toDateString(enrollment.startDate),
					target: toDateString(enrollment.targetDate),
					goal: enrollment.goalSummary ?? ""
				})),
				relatedPeople: (relationshipsBySourcePersonId.get(caseRecord.primaryPersonId) ?? []).map((relationship) => {
					const relatedPerson = peopleById.get(relationship.relatedPersonId);
					return {
						id: relationship.relatedPersonId,
						name: relatedPerson ? fullName(relatedPerson) : relationship.relatedPersonId,
						relationship: relationship.relationship,
						age: Number(relatedPerson?.approximateAge ?? 0),
						linkedCaseId: relationship.relatedCaseId ?? void 0,
						inHousehold: relationship.livesInHousehold
					};
				})
			};
		}),
		intakeSubmissions: intakeSubmissionRows.map((submission) => ({
			id: submission.id,
			status: submission.status === "converted_to_case" ? "Converted to Case" : submission.status === "duplicate_review" ? "Duplicate Review" : submission.status === "rejected" ? "Rejected" : "Draft",
			createdById: submission.createdById,
			convertedById: submission.convertedById ?? void 0,
			caseId: submission.caseId ?? void 0,
			startedAt: toDateTimeString(submission.startedAt) ?? "",
			savedAt: toDateTimeString(submission.savedAt),
			duplicateWarnings: submission.duplicateWarnings ?? [],
			duplicateOverrideReason: submission.duplicateOverrideReason ?? void 0,
			client: submission.clientSnapshot,
			demographics: submission.demographicSnapshot,
			address: submission.addressSnapshot,
			incomeSources: submission.incomeSources ?? [],
			benefits: submission.benefits ?? [],
			relevantContacts: submission.relevantContacts ?? [],
			legal: submission.legalSnapshot,
			housing: submission.housingSnapshot
		})),
		notes: noteRows.map((note) => ({
			id: note.id,
			caseId: note.caseId,
			enrollmentId: note.programEnrollmentId ?? "",
			authorId: note.authorId,
			date: toDateString(note.noteDate),
			contactType: note.contactType ?? "",
			summary: note.summary ?? "",
			body: note.body,
			isSession: note.isSession,
			sessionHours: note.sessionHours ?? void 0
		})),
		services: serviceRows.map((service) => ({
			id: service.id,
			caseId: service.caseId,
			enrollmentId: service.programEnrollmentId ?? "",
			date: toDateString(service.serviceDate),
			category: service.category,
			description: service.description,
			amount: service.amount,
			grantor: service.grantor ?? "Private Foundation"
		}))
	};
}
async function updateCaseStatusRecord(caseId, status) {
	if (!hasDatabaseUrl()) return;
	await getDb().update(cases).set({
		status: caseStatusToDb[status],
		lastContactAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
	}).where(eq(cases.id, caseId));
}
async function updateEnrollmentRecord(enrollmentId, patch) {
	if (!hasDatabaseUrl()) return;
	const values = {};
	if (patch.status) values.status = programStatusToDb[patch.status];
	if (patch.opened !== void 0) values.startDate = patch.opened;
	if (patch.target !== void 0) values.targetDate = patch.target;
	if (patch.goal !== void 0) values.goalSummary = patch.goal;
	await getDb().update(caseProgramEnrollments).set(values).where(eq(caseProgramEnrollments.id, enrollmentId));
}
async function updateIntakeFieldRecord(caseId, field, value) {
	if (!hasDatabaseUrl()) return;
	const columnPatch = {};
	if (field === "referralSource") columnPatch.referralSource = value;
	else if (field === "householdIncome") columnPatch.householdIncome = value;
	else if (field === "housing") columnPatch.housing = value;
	else if (field === "strengths") columnPatch.familyStrengths = value;
	else if (field === "needs") columnPatch.presentingNeeds = value;
	if (Object.keys(columnPatch).length > 0) {
		await getDb().update(primaryIntakes).set(columnPatch).where(eq(primaryIntakes.caseId, caseId));
		return;
	}
	await getDb().update(primaryIntakes).set({ fieldValues: sql`json_set(coalesce(${primaryIntakes.fieldValues}, json_object()), ${`$.${field}`}, ${value})` }).where(eq(primaryIntakes.caseId, caseId));
}
async function addCaseworkerAssignmentRecord(enrollmentId, staffId, isPrimary) {
	if (!hasDatabaseUrl()) return;
	await getDb().insert(caseProgramCaseworkers).values({
		programEnrollmentId: enrollmentId,
		caseworkerId: staffId,
		isPrimary
	}).onDuplicateKeyUpdate({ set: { isPrimary } });
}
async function removeCaseworkerAssignmentRecord(enrollmentId, staffId) {
	if (!hasDatabaseUrl()) return;
	await getDb().delete(caseProgramCaseworkers).where(and(eq(caseProgramCaseworkers.programEnrollmentId, enrollmentId), eq(caseProgramCaseworkers.caseworkerId, staffId)));
}
async function setPrimaryCaseworkerRecord(enrollmentId, staffId) {
	if (!hasDatabaseUrl()) return;
	const db = getDb();
	await db.update(caseProgramCaseworkers).set({ isPrimary: false }).where(eq(caseProgramCaseworkers.programEnrollmentId, enrollmentId));
	await db.update(caseProgramCaseworkers).set({ isPrimary: true }).where(and(eq(caseProgramCaseworkers.programEnrollmentId, enrollmentId), eq(caseProgramCaseworkers.caseworkerId, staffId)));
}
async function addNoteRecord(input) {
	if (!hasDatabaseUrl()) return;
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
		sessionHours: input.sessionHours
	});
}
async function editNoteRecord(noteId, input) {
	if (!hasDatabaseUrl()) return;
	await getDb().update(caseNotes).set({
		programEnrollmentId: input.enrollmentId,
		contactType: input.contactType,
		summary: input.summary,
		body: input.body,
		isSession: input.isSession,
		sessionHours: input.sessionHours
	}).where(eq(caseNotes.id, noteId));
}
async function addConcreteServiceRecord(input) {
	if (!hasDatabaseUrl()) return;
	await getDb().insert(concreteServices).values({
		id: input.id,
		caseId: input.caseId,
		programEnrollmentId: input.enrollmentId,
		providedById: input.providedById,
		serviceDate: input.date,
		category: input.category,
		description: input.description,
		amount: input.amount,
		grantor: input.grantor
	});
}
async function createCaseFromIntakeRecord(caseRecord, submission) {
	if (!hasDatabaseUrl()) return;
	const db = getDb();
	const [firstName = "", ...lastNameParts] = caseRecord.displayName.split(" ");
	await db.insert(people).values({
		id: caseRecord.personId,
		frcId: "frc-demo",
		personRole: "client",
		firstName,
		lastName: lastNameParts.join(" "),
		approximateAge: String(caseRecord.age),
		phone: caseRecord.intake.phone,
		email: caseRecord.intake.email,
		county: caseRecord.county
	});
	await db.insert(cases).values({
		id: caseRecord.id,
		frcId: "frc-demo",
		primaryPersonId: caseRecord.personId,
		status: caseStatusToDb[caseRecord.status],
		risk: caseRecord.risk.toLowerCase(),
		openedAt: caseRecord.opened,
		lastContactAt: caseRecord.lastContact
	});
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
			phone: caseRecord.intake.phone
		}
	});
	if (caseRecord.relatedPeople.length > 0) {
		await db.insert(people).values(caseRecord.relatedPeople.map((person) => {
			const [relatedFirstName = "", ...relatedLastNameParts] = person.name.split(" ");
			return {
				id: person.id,
				frcId: "frc-demo",
				personRole: "household_member",
				firstName: relatedFirstName,
				lastName: relatedLastNameParts.join(" "),
				approximateAge: String(person.age),
				county: caseRecord.county
			};
		}));
		await db.insert(personRelationships).values(caseRecord.relatedPeople.map((person) => ({
			id: `${caseRecord.id}-${person.id}`,
			sourcePersonId: caseRecord.personId,
			relatedPersonId: person.id,
			relationship: person.relationship,
			livesInHousehold: person.inHousehold,
			relatedCaseId: person.linkedCaseId
		})));
	}
	await db.insert(intakeSubmissions).values({
		id: submission.id,
		frcId: "frc-demo",
		caseId: submission.caseId,
		createdById: submission.createdById,
		convertedById: submission.convertedById,
		status: "converted_to_case",
		startedAt: new Date(submission.startedAt),
		savedAt: submission.savedAt ? new Date(submission.savedAt) : void 0,
		duplicateWarnings: submission.duplicateWarnings,
		duplicateOverrideReason: submission.duplicateOverrideReason,
		clientSnapshot: submission.client,
		demographicSnapshot: submission.demographics,
		addressSnapshot: submission.address,
		incomeSources: submission.incomeSources,
		benefits: submission.benefits,
		relevantContacts: submission.relevantContacts,
		legalSnapshot: submission.legal,
		housingSnapshot: submission.housing
	});
}
//#endregion
//#region src/use-cases/workspace.ts
var today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var nowId = (prefix) => `${prefix}-${Date.now()}`;
async function loadWorkspace() {
	return getWorkspaceSnapshot();
}
async function updateCaseStatus(input) {
	await updateCaseStatusRecord(input.caseId, input.status);
}
async function updateEnrollment(input) {
	await updateEnrollmentRecord(input.enrollmentId, {
		goal: input.patch.goal,
		opened: input.patch.opened,
		status: input.patch.status,
		target: input.patch.target
	});
}
async function addCaseworkerAssignment(input) {
	await addCaseworkerAssignmentRecord(input.enrollment.id, input.staffId, input.enrollment.caseworkers.length === 0);
}
async function removeCaseworkerAssignment(input) {
	await removeCaseworkerAssignmentRecord(input.enrollmentId, input.staffId);
}
async function setPrimaryCaseworker(input) {
	await setPrimaryCaseworkerRecord(input.enrollmentId, input.staffId);
}
async function updateIntakeField(input) {
	await updateIntakeFieldRecord(input.caseId, input.field, input.value);
}
async function addNote(input) {
	if (!input.note.enrollmentId || !input.note.body.trim()) return;
	await addNoteRecord({
		id: input.noteId ?? nowId("note"),
		caseId: input.caseId,
		enrollmentId: input.note.enrollmentId,
		authorId: input.currentStaffId,
		date: today(),
		contactType: input.note.contactType,
		summary: input.note.summary.trim() || "Case note",
		body: input.note.body.trim(),
		isSession: input.note.isSession,
		sessionHours: input.note.isSession ? input.note.sessionHours : void 0
	});
}
async function editNote(input) {
	if (!input.note.enrollmentId || !input.note.body.trim()) return;
	await editNoteRecord(input.noteId, {
		enrollmentId: input.note.enrollmentId,
		contactType: input.note.contactType,
		summary: input.note.summary.trim() || "Case note",
		body: input.note.body.trim(),
		isSession: input.note.isSession,
		sessionHours: input.note.isSession ? input.note.sessionHours : void 0
	});
}
async function addConcreteService(input) {
	if (!input.service.enrollmentId || !input.service.description.trim() || input.service.amount <= 0) return;
	const enrollment = input.caseRecord.enrollments.find((item) => item.id === input.service.enrollmentId);
	const program = enrollment ? getProgram(enrollment.programId) : void 0;
	await addConcreteServiceRecord({
		id: input.serviceId ?? nowId("svc"),
		caseId: input.caseRecord.id,
		enrollmentId: input.service.enrollmentId,
		providedById: input.currentStaffId,
		date: today(),
		category: input.service.category,
		description: input.service.description.trim(),
		amount: input.service.amount,
		grantor: program?.grantor ?? "Private Foundation"
	});
}
async function createCaseFromIntake(input) {
	const newCaseId = input.caseId ?? nowId("case");
	const newPersonId = input.personId ?? nowId("person");
	const displayName = `${input.intake.client.firstName.trim()} ${input.intake.client.lastName.trim()}`.trim();
	const age = Number(input.intake.client.approximateAge) || 0;
	const hasHighDuplicate = input.intake.duplicateWarnings.some((warning) => warning.includes("High confidence"));
	const createdDate = input.intake.savedAt?.slice(0, 10) ?? today();
	await createCaseFromIntakeRecord({
		id: newCaseId,
		personId: newPersonId,
		displayName,
		pronouns: void 0,
		age,
		status: "Open",
		opened: createdDate,
		lastContact: createdDate,
		risk: hasHighDuplicate ? "Medium" : "Low",
		county: input.intake.address.county || input.intake.housing.currentLocation || "Unknown",
		intake: {
			intakeDate: createdDate,
			referralSource: "New intake workflow",
			county: input.intake.address.county,
			phone: input.intake.client.phone,
			email: input.intake.client.email,
			householdIncome: input.intake.incomeSources.map((source) => `${source.type}: ${source.amount} ${source.frequency}`).join("; "),
			housing: input.intake.housing.status,
			strengths: input.intake.demographics.primaryLanguage ? `Primary language: ${input.intake.demographics.primaryLanguage}` : void 0,
			needs: [
				input.intake.legal.hasCourtInvolvement ? `Legal: ${input.intake.legal.matterType || "court involvement"}` : void 0,
				input.intake.benefits.length > 0 ? `Benefits: ${input.intake.benefits.map((benefit) => benefit.type).join(", ")}` : void 0,
				input.intake.housing.notes
			].filter(Boolean).join("; ")
		},
		enrollments: [],
		relatedPeople: input.intake.relevantContacts.map((contact) => ({
			id: contact.id,
			name: contact.name,
			relationship: contact.relationship,
			age: 0,
			inHousehold: false
		}))
	}, {
		...input.intake,
		id: input.intakeId ?? nowId("intake"),
		status: "Converted to Case",
		caseId: newCaseId,
		convertedById: input.currentStaffId,
		savedAt: `${createdDate}T10:30:00`
	});
	return newCaseId;
}
//#endregion
//#region src/use-cases/workspaceServerFns.ts?tss-serverfn-split
var loadWorkspaceFn_createServerFn_handler = createServerRpc({
	id: "b64422fd99df7ca444097916df9212b4f27a5202131063ccafb4de124a8e6325",
	name: "loadWorkspaceFn",
	filename: "src/use-cases/workspaceServerFns.ts"
}, (opts) => loadWorkspaceFn.__executeServer(opts));
var loadWorkspaceFn = createServerFn({ method: "GET" }).handler(loadWorkspaceFn_createServerFn_handler, () => loadWorkspace());
var updateCaseStatusFn_createServerFn_handler = createServerRpc({
	id: "e8c88b6594bea7184bf006577c6a9dd5d7beffa5473ec5e34f8de086b0df3ecf",
	name: "updateCaseStatusFn",
	filename: "src/use-cases/workspaceServerFns.ts"
}, (opts) => updateCaseStatusFn.__executeServer(opts));
var updateCaseStatusFn = createServerFn({ method: "POST" }).validator((input) => input).handler(updateCaseStatusFn_createServerFn_handler, ({ data }) => updateCaseStatus(data));
var updateEnrollmentFn_createServerFn_handler = createServerRpc({
	id: "03267021997fe8b81778897ed57018438567f388aa36548b9760419a1b27bba8",
	name: "updateEnrollmentFn",
	filename: "src/use-cases/workspaceServerFns.ts"
}, (opts) => updateEnrollmentFn.__executeServer(opts));
var updateEnrollmentFn = createServerFn({ method: "POST" }).validator((input) => input).handler(updateEnrollmentFn_createServerFn_handler, ({ data }) => updateEnrollment(data));
var addCaseworkerAssignmentFn_createServerFn_handler = createServerRpc({
	id: "0f0e386ebc16799934abdd675f0cef8b81c184541d3f9717ad099feaa227ac71",
	name: "addCaseworkerAssignmentFn",
	filename: "src/use-cases/workspaceServerFns.ts"
}, (opts) => addCaseworkerAssignmentFn.__executeServer(opts));
var addCaseworkerAssignmentFn = createServerFn({ method: "POST" }).validator((input) => input).handler(addCaseworkerAssignmentFn_createServerFn_handler, ({ data }) => addCaseworkerAssignment(data));
var removeCaseworkerAssignmentFn_createServerFn_handler = createServerRpc({
	id: "43f95cfa997fdcb3a90fdd6294a5d1e9a6b7f636a06f04d4aff88769d5aed5cb",
	name: "removeCaseworkerAssignmentFn",
	filename: "src/use-cases/workspaceServerFns.ts"
}, (opts) => removeCaseworkerAssignmentFn.__executeServer(opts));
var removeCaseworkerAssignmentFn = createServerFn({ method: "POST" }).validator((input) => input).handler(removeCaseworkerAssignmentFn_createServerFn_handler, ({ data }) => removeCaseworkerAssignment(data));
var setPrimaryCaseworkerFn_createServerFn_handler = createServerRpc({
	id: "1ffbb6f5a833872a182ca20f9e4125a50d2a009599e7e9ea2b5c8cc4676bb3c7",
	name: "setPrimaryCaseworkerFn",
	filename: "src/use-cases/workspaceServerFns.ts"
}, (opts) => setPrimaryCaseworkerFn.__executeServer(opts));
var setPrimaryCaseworkerFn = createServerFn({ method: "POST" }).validator((input) => input).handler(setPrimaryCaseworkerFn_createServerFn_handler, ({ data }) => setPrimaryCaseworker(data));
var updateIntakeFieldFn_createServerFn_handler = createServerRpc({
	id: "a26945d43bdbc8df6e4f7021151a52b1797575133c243584ed9c61481939ed8d",
	name: "updateIntakeFieldFn",
	filename: "src/use-cases/workspaceServerFns.ts"
}, (opts) => updateIntakeFieldFn.__executeServer(opts));
var updateIntakeFieldFn = createServerFn({ method: "POST" }).validator((input) => input).handler(updateIntakeFieldFn_createServerFn_handler, ({ data }) => updateIntakeField(data));
var addNoteFn_createServerFn_handler = createServerRpc({
	id: "3e25d0d70b2beb7f08c20406aae45d51e18c27f4aca2f3b9a594bb6b3a9864bb",
	name: "addNoteFn",
	filename: "src/use-cases/workspaceServerFns.ts"
}, (opts) => addNoteFn.__executeServer(opts));
var addNoteFn = createServerFn({ method: "POST" }).validator((input) => input).handler(addNoteFn_createServerFn_handler, ({ data }) => addNote(data));
var editNoteFn_createServerFn_handler = createServerRpc({
	id: "3a459a481b7ab66e402f438e1afa46262cfae7798ac7a113a8c8f9455a2dbd65",
	name: "editNoteFn",
	filename: "src/use-cases/workspaceServerFns.ts"
}, (opts) => editNoteFn.__executeServer(opts));
var editNoteFn = createServerFn({ method: "POST" }).validator((input) => input).handler(editNoteFn_createServerFn_handler, ({ data }) => editNote(data));
var addConcreteServiceFn_createServerFn_handler = createServerRpc({
	id: "4cf149594f1f4f229810c3b7e475b235adb431a211a213ab6816cad471b968b8",
	name: "addConcreteServiceFn",
	filename: "src/use-cases/workspaceServerFns.ts"
}, (opts) => addConcreteServiceFn.__executeServer(opts));
var addConcreteServiceFn = createServerFn({ method: "POST" }).validator((input) => input).handler(addConcreteServiceFn_createServerFn_handler, ({ data }) => addConcreteService(data));
var createCaseFromIntakeFn_createServerFn_handler = createServerRpc({
	id: "c654da9399de90f4e64cc1048c973787ed8ebc98935346ca79f049407b24770a",
	name: "createCaseFromIntakeFn",
	filename: "src/use-cases/workspaceServerFns.ts"
}, (opts) => createCaseFromIntakeFn.__executeServer(opts));
var createCaseFromIntakeFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createCaseFromIntakeFn_createServerFn_handler, ({ data }) => createCaseFromIntake(data));
//#endregion
export { addCaseworkerAssignmentFn_createServerFn_handler, addConcreteServiceFn_createServerFn_handler, addNoteFn_createServerFn_handler, createCaseFromIntakeFn_createServerFn_handler, editNoteFn_createServerFn_handler, loadWorkspaceFn_createServerFn_handler, removeCaseworkerAssignmentFn_createServerFn_handler, setPrimaryCaseworkerFn_createServerFn_handler, updateCaseStatusFn_createServerFn_handler, updateEnrollmentFn_createServerFn_handler, updateIntakeFieldFn_createServerFn_handler };
