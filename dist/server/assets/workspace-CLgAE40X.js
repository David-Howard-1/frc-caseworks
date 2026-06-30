import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "../server.js";
import { _ as CreateEnrollmentSchema, b as UpdateEnrollmentSchema, f as AddCaseworkerAssignmentSchema, g as CreateCaseFromIntakeSchema, h as AssignmentByStaffSchema, m as AddNoteRecordSchema, p as AddConcreteServiceRecordSchema, r as emptyWorkspaceSnapshot, v as EditNoteRecordSchema, x as UpdateIntakeFieldSchema, y as UpdateCaseStatusSchema } from "./workspace-DnvJ3Qsu.js";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { and, asc, eq, sql } from "drizzle-orm";
import { bigint, boolean, date, decimal, index, json, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
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
//#region src/db/client.ts
var db = null;
function hasDatabaseUrl() {
	return Boolean(process.env.DATABASE_URL);
}
function getDb() {
	if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for MySQL persistence.");
	if (!db) db = drizzle({ client: createPool(process.env.DATABASE_URL) });
	return db;
}
//#endregion
//#region src/db/schema.ts
var serialId = (name = "id") => bigint(name, {
	mode: "number",
	unsigned: true
}).autoincrement().primaryKey();
var foreignId = (name) => bigint(name, {
	mode: "number",
	unsigned: true
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
	id: serialId(),
	name: varchar("name", { length: 191 }).notNull(),
	legalName: varchar("legal_name", { length: 191 }),
	county: varchar("county", { length: 120 }),
	state: varchar("state", { length: 2 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
});
var users = mysqlTable("users", {
	id: serialId(),
	frcId: foreignId("frc_id").notNull().references(() => frcs.id),
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
	id: serialId(),
	frcId: foreignId("frc_id").notNull().references(() => frcs.id),
	code: varchar("code", { length: 48 }).notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	grantor: varchar("grantor", { length: 120 }),
	reportingType: varchar("reporting_type", { length: 80 }),
	color: varchar("color", { length: 24 }),
	supervisorId: foreignId("supervisor_id").references(() => users.id),
	isActive: boolean("is_active").default(true).notNull()
}, (table) => ({
	frcCodeIdx: index("programs_frc_code_idx").on(table.frcId, table.code),
	grantorIdx: index("programs_grantor_idx").on(table.grantor)
}));
var userPrograms = mysqlTable("user_programs", {
	id: serialId(),
	userId: foreignId("user_id").notNull().references(() => users.id),
	programId: foreignId("program_id").notNull().references(() => programs.id)
}, (table) => ({ userProgramUnique: uniqueIndex("user_programs_user_program_unique").on(table.userId, table.programId) }));
var people = mysqlTable("people", {
	id: serialId(),
	frcId: foreignId("frc_id").notNull().references(() => frcs.id),
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
	id: serialId(),
	frcId: foreignId("frc_id").notNull().references(() => frcs.id),
	primaryPersonId: foreignId("primary_person_id").notNull().references(() => people.id),
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
	id: serialId(),
	caseId: foreignId("case_id").notNull().references(() => cases.id),
	completedById: foreignId("completed_by_id").references(() => users.id),
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
	id: serialId(),
	frcId: foreignId("frc_id").notNull().references(() => frcs.id),
	caseId: foreignId("case_id").references(() => cases.id),
	createdById: foreignId("created_by_id").notNull().references(() => users.id),
	convertedById: foreignId("converted_by_id").references(() => users.id),
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
	id: serialId(),
	caseId: foreignId("case_id").notNull().references(() => cases.id),
	programId: foreignId("program_id").notNull().references(() => programs.id),
	supervisorId: foreignId("supervisor_id").references(() => users.id),
	status: programEnrollmentStatusEnum.default("pending").notNull(),
	startDate: date("start_date", { mode: "string" }),
	targetDate: date("target_date", { mode: "string" }),
	endDate: date("end_date", { mode: "string" }),
	goalSummary: text("goal_summary"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
}, (table) => ({ caseProgramIdx: index("case_program_enrollments_case_program_idx").on(table.caseId, table.programId) }));
var caseProgramCaseworkers = mysqlTable("case_program_caseworkers", {
	id: serialId(),
	programEnrollmentId: foreignId("program_enrollment_id").notNull().references(() => caseProgramEnrollments.id),
	caseworkerId: foreignId("caseworker_id").notNull().references(() => users.id),
	isPrimary: boolean("is_primary").default(false).notNull(),
	assignedAt: timestamp("assigned_at").defaultNow().notNull()
}, (table) => ({
	enrollmentCaseworkerUnique: uniqueIndex("case_program_caseworkers_enrollment_caseworker_unique").on(table.programEnrollmentId, table.caseworkerId),
	caseworkerIdx: index("case_program_caseworkers_caseworker_idx").on(table.caseworkerId, table.isPrimary),
	enrollmentPrimaryIdx: index("case_program_caseworkers_enrollment_primary_idx").on(table.programEnrollmentId, table.isPrimary)
}));
var caseNotes = mysqlTable("case_notes", {
	id: serialId(),
	caseId: foreignId("case_id").notNull().references(() => cases.id),
	programEnrollmentId: foreignId("program_enrollment_id").references(() => caseProgramEnrollments.id),
	authorId: foreignId("author_id").notNull().references(() => users.id),
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
	id: serialId(),
	caseId: foreignId("case_id").notNull().references(() => cases.id),
	programEnrollmentId: foreignId("program_enrollment_id").references(() => caseProgramEnrollments.id),
	providedById: foreignId("provided_by_id").references(() => users.id),
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
	id: serialId(),
	sourcePersonId: foreignId("source_person_id").notNull().references(() => people.id),
	relatedPersonId: foreignId("related_person_id").notNull().references(() => people.id),
	relationship: varchar("relationship", { length: 80 }).notNull(),
	livesInHousehold: boolean("lives_in_household").default(true).notNull(),
	relatedCaseId: foreignId("related_case_id").references(() => cases.id),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
	sourceIdx: index("person_relationships_source_idx").on(table.sourcePersonId),
	relatedCaseIdx: index("person_relationships_related_case_idx").on(table.relatedCaseId)
}));
mysqlTable("saved_reports", {
	id: serialId(),
	frcId: foreignId("frc_id").notNull().references(() => frcs.id),
	name: varchar("name", { length: 191 }).notNull(),
	grantor: varchar("grantor", { length: 120 }).notNull(),
	periodStart: date("period_start", { mode: "string" }).notNull(),
	periodEnd: date("period_end", { mode: "string" }).notNull(),
	generatedById: foreignId("generated_by_id").references(() => users.id),
	metrics: json("metrics").$type(),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({ frcGrantorIdx: index("saved_reports_frc_grantor_idx").on(table.frcId, table.grantor) }));
//#endregion
//#region src/data-access/workspace.ts
async function getWorkspaceRows(db) {
	const [frcRows, userRows, programRows, userProgramRows, caseRows, personRows, intakeRows, enrollmentRows, assignmentRows, noteRows, serviceRows, relationshipRows, intakeSubmissionRows] = await Promise.all([
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
		db.select().from(intakeSubmissions)
	]);
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
		intakeSubmissionRows
	};
}
async function getUserById(db, userId) {
	const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
	return user;
}
async function getFirstFrc(db) {
	const [frc] = await db.select().from(frcs).orderBy(asc(frcs.id)).limit(1);
	return frc;
}
async function updateCaseStatusRow(db, caseId, status) {
	await db.update(cases).set({
		status,
		lastContactAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
	}).where(eq(cases.id, caseId));
}
async function updateEnrollmentRow(db, enrollmentId, values) {
	await db.update(caseProgramEnrollments).set(values).where(eq(caseProgramEnrollments.id, enrollmentId));
}
async function updatePrimaryIntakeRow(db, caseId, values) {
	await db.update(primaryIntakes).set(values).where(eq(primaryIntakes.caseId, caseId));
}
async function updatePrimaryIntakeJsonField(db, caseId, field, value) {
	await db.update(primaryIntakes).set({ fieldValues: sql`json_set(coalesce(${primaryIntakes.fieldValues}, json_object()), ${`$.${field}`}, ${value})` }).where(eq(primaryIntakes.caseId, caseId));
}
async function addCaseworkerAssignmentRow(db, values) {
	await db.insert(caseProgramCaseworkers).values(values).onDuplicateKeyUpdate({ set: { isPrimary: values.isPrimary } });
}
async function removeCaseworkerAssignmentRow(db, enrollmentId, staffId) {
	await db.delete(caseProgramCaseworkers).where(and(eq(caseProgramCaseworkers.programEnrollmentId, enrollmentId), eq(caseProgramCaseworkers.caseworkerId, staffId)));
}
async function clearPrimaryCaseworkerRows(db, enrollmentId) {
	await db.update(caseProgramCaseworkers).set({ isPrimary: false }).where(eq(caseProgramCaseworkers.programEnrollmentId, enrollmentId));
}
async function setPrimaryCaseworkerRow(db, enrollmentId, staffId) {
	await db.update(caseProgramCaseworkers).set({ isPrimary: true }).where(and(eq(caseProgramCaseworkers.programEnrollmentId, enrollmentId), eq(caseProgramCaseworkers.caseworkerId, staffId)));
}
async function insertNoteRow(db, values) {
	const [row] = await db.insert(caseNotes).values(values).$returningId();
	return row.id;
}
async function updateNoteRow(db, noteId, values) {
	await db.update(caseNotes).set(values).where(eq(caseNotes.id, noteId));
}
async function insertConcreteServiceRow(db, values) {
	const [row] = await db.insert(concreteServices).values(values).$returningId();
	return row.id;
}
async function insertPersonRow(db, values) {
	const [row] = await db.insert(people).values(values).$returningId();
	return row.id;
}
async function insertCaseRow(db, values) {
	const [row] = await db.insert(cases).values(values).$returningId();
	return row.id;
}
async function insertPrimaryIntakeRow(db, values) {
	const [row] = await db.insert(primaryIntakes).values(values).$returningId();
	return row.id;
}
async function insertEnrollmentRow(db, values) {
	const [row] = await db.insert(caseProgramEnrollments).values(values).$returningId();
	return row.id;
}
async function insertIntakeSubmissionRow(db, values) {
	const [row] = await db.insert(intakeSubmissions).values(values).$returningId();
	return row.id;
}
async function insertPersonRelationshipRow(db, values) {
	const [row] = await db.insert(personRelationships).values(values).$returningId();
	return row.id;
}
//#endregion
//#region src/use-cases/workspace.ts
var today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var roleFromDb = {
	caseworker: "Caseworker",
	executive_director: "Executive Director",
	program_supervisor: "Program Supervisor"
};
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
async function loadWorkspaceUseCase() {
	if (!hasDatabaseUrl()) return emptyWorkspaceSnapshot;
	const rows = await getWorkspaceRows(getDb());
	const userProgramsByUserId = groupBy(rows.userProgramRows, (membership) => membership.userId);
	const peopleById = new Map(rows.personRows.map((person) => [person.id, person]));
	const intakeByCaseId = new Map(rows.intakeRows.map((intake) => [intake.caseId, intake]));
	const assignmentsByEnrollmentId = groupBy(rows.assignmentRows, (assignment) => assignment.programEnrollmentId);
	const enrollmentsByCaseId = groupBy(rows.enrollmentRows, (enrollment) => enrollment.caseId);
	const relationshipsBySourcePersonId = groupBy(rows.relationshipRows, (relationship) => relationship.sourcePersonId);
	const workspaceCases = rows.caseRows.map((caseRecord) => {
		const person = peopleById.get(caseRecord.primaryPersonId);
		const intake = intakeByCaseId.get(caseRecord.id);
		const fieldValues = intake?.fieldValues ?? {};
		return {
			id: caseRecord.id,
			personId: caseRecord.primaryPersonId,
			displayName: person ? fullName(person) : caseRecord.householdName ?? String(caseRecord.id),
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
				supervisorId: enrollment.supervisorId ?? void 0,
				status: programStatusFromDb[enrollment.status],
				opened: toDateString(enrollment.startDate),
				target: toDateString(enrollment.targetDate),
				goal: enrollment.goalSummary ?? ""
			})),
			relatedPeople: (relationshipsBySourcePersonId.get(caseRecord.primaryPersonId) ?? []).map((relationship) => {
				const relatedPerson = peopleById.get(relationship.relatedPersonId);
				return {
					id: relationship.relatedPersonId,
					name: relatedPerson ? fullName(relatedPerson) : String(relationship.relatedPersonId),
					relationship: relationship.relationship,
					age: Number(relatedPerson?.approximateAge ?? 0),
					linkedCaseId: relationship.relatedCaseId ?? void 0,
					inHousehold: relationship.livesInHousehold
				};
			})
		};
	});
	return {
		frcs: rows.frcRows.map((frc) => ({
			id: frc.id,
			name: frc.name,
			legalName: frc.legalName ?? void 0,
			county: frc.county ?? void 0,
			state: frc.state ?? void 0
		})),
		programs: rows.programRows.map((program) => ({
			id: program.id,
			frcId: program.frcId,
			code: program.code,
			name: program.name,
			grantor: program.grantor ?? "Unspecified",
			color: program.color ?? "#1C5380",
			supervisorId: program.supervisorId ?? void 0
		})),
		staff: rows.userRows.map((user) => ({
			id: user.id,
			frcId: user.frcId,
			role: roleFromDb[user.role],
			name: user.name,
			programs: (userProgramsByUserId.get(user.id) ?? []).map((membership) => membership.programId)
		})),
		people: rows.personRows.map((person) => ({
			id: person.id,
			frcId: person.frcId,
			role: person.personRole,
			firstName: person.firstName ?? void 0,
			middleName: person.middleName ?? void 0,
			lastName: person.lastName ?? void 0,
			preferredName: person.preferredName ?? void 0,
			pronouns: person.pronouns ?? void 0,
			approximateAge: person.approximateAge ?? void 0,
			dateOfBirth: toDateString(person.dateOfBirth) || void 0,
			phone: person.phone ?? void 0,
			email: person.email ?? void 0,
			addressLine1: person.addressLine1 ?? void 0,
			addressLine2: person.addressLine2 ?? void 0,
			city: person.city ?? void 0,
			state: person.state ?? void 0,
			postalCode: person.postalCode ?? void 0,
			county: person.county ?? void 0
		})),
		cases: workspaceCases,
		intakeSubmissions: rows.intakeSubmissionRows.map((submission) => ({
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
		notes: rows.noteRows.map((note) => ({
			id: note.id,
			caseId: note.caseId,
			enrollmentId: note.programEnrollmentId ?? void 0,
			authorId: note.authorId,
			date: toDateString(note.noteDate),
			contactType: note.contactType ?? "",
			summary: note.summary ?? "",
			body: note.body,
			isSession: note.isSession,
			sessionHours: note.sessionHours ?? void 0
		})),
		services: rows.serviceRows.map((service) => ({
			id: service.id,
			caseId: service.caseId,
			enrollmentId: service.programEnrollmentId ?? void 0,
			date: toDateString(service.serviceDate),
			category: service.category,
			description: service.description,
			amount: service.amount,
			grantor: service.grantor ?? "Unspecified"
		}))
	};
}
async function updateCaseStatusUseCase(input) {
	if (!hasDatabaseUrl()) return;
	await updateCaseStatusRow(getDb(), input.caseId, caseStatusToDb[input.status]);
}
async function updateEnrollmentUseCase(input) {
	if (!hasDatabaseUrl()) return;
	const values = {};
	if (input.patch.status) values.status = programStatusToDb[input.patch.status];
	if (input.patch.opened !== void 0) values.startDate = input.patch.opened;
	if (input.patch.target !== void 0) values.targetDate = input.patch.target;
	if (input.patch.goal !== void 0) values.goalSummary = input.patch.goal;
	await updateEnrollmentRow(getDb(), input.enrollmentId, values);
}
async function addCaseworkerAssignmentUseCase(input) {
	if (!hasDatabaseUrl()) return;
	await addCaseworkerAssignmentRow(getDb(), {
		programEnrollmentId: input.enrollmentId,
		caseworkerId: input.staffId,
		isPrimary: input.isFirstAssignment
	});
}
async function createEnrollmentUseCase(input) {
	if (!hasDatabaseUrl()) return;
	return insertEnrollmentRow(getDb(), {
		caseId: input.caseId,
		programId: input.programId,
		supervisorId: input.supervisorId,
		status: programStatusToDb[input.status],
		startDate: input.opened,
		targetDate: input.target,
		goalSummary: input.goal
	});
}
async function removeCaseworkerAssignmentUseCase(input) {
	if (!hasDatabaseUrl()) return;
	await removeCaseworkerAssignmentRow(getDb(), input.enrollmentId, input.staffId);
}
async function setPrimaryCaseworkerUseCase(input) {
	if (!hasDatabaseUrl()) return;
	const db = getDb();
	await clearPrimaryCaseworkerRows(db, input.enrollmentId);
	await setPrimaryCaseworkerRow(db, input.enrollmentId, input.staffId);
}
async function updateIntakeFieldUseCase(input) {
	if (!hasDatabaseUrl()) return;
	const db = getDb();
	const columnPatch = {};
	if (input.field === "referralSource") columnPatch.referralSource = input.value;
	else if (input.field === "householdIncome") columnPatch.householdIncome = input.value;
	else if (input.field === "housing") columnPatch.housing = input.value;
	else if (input.field === "strengths") columnPatch.familyStrengths = input.value;
	else if (input.field === "needs") columnPatch.presentingNeeds = input.value;
	if (Object.keys(columnPatch).length > 0) {
		await updatePrimaryIntakeRow(db, input.caseId, columnPatch);
		return;
	}
	await updatePrimaryIntakeJsonField(db, input.caseId, input.field, input.value);
}
async function addNoteUseCase(input) {
	if (!hasDatabaseUrl() || !input.note.body.trim()) return;
	return insertNoteRow(getDb(), {
		caseId: input.caseId,
		programEnrollmentId: input.note.enrollmentId,
		authorId: input.currentStaffId,
		noteDate: today(),
		contactType: input.note.contactType,
		summary: input.note.summary.trim() || "Case note",
		body: input.note.body.trim(),
		isSession: input.note.isSession,
		sessionHours: input.note.sessionHours
	});
}
async function editNoteUseCase(input) {
	if (!hasDatabaseUrl() || !input.note.body.trim()) return;
	await updateNoteRow(getDb(), input.noteId, {
		programEnrollmentId: input.note.enrollmentId,
		contactType: input.note.contactType,
		summary: input.note.summary.trim() || "Case note",
		body: input.note.body.trim(),
		isSession: input.note.isSession,
		sessionHours: input.note.sessionHours
	});
}
async function addConcreteServiceUseCase(input) {
	if (!hasDatabaseUrl() || !input.service.description.trim() || input.service.amount <= 0) return;
	const workspace = await loadWorkspaceUseCase();
	const enrollment = workspace.cases.find((item) => item.id === input.caseId)?.enrollments.find((item) => item.id === input.service.enrollmentId);
	const program = workspace.programs.find((item) => item.id === enrollment?.programId);
	return insertConcreteServiceRow(getDb(), {
		caseId: input.caseId,
		programEnrollmentId: input.service.enrollmentId,
		providedById: input.currentStaffId,
		serviceDate: today(),
		category: input.service.category,
		description: input.service.description.trim(),
		amount: input.service.amount,
		grantor: program?.grantor ?? "Unspecified"
	});
}
async function resolveFrcId(currentStaffId) {
	const db = getDb();
	const user = await getUserById(db, currentStaffId);
	if (user) return user.frcId;
	const frc = await getFirstFrc(db);
	if (frc) return frc.id;
	throw new Error("Create at least one FRC row before creating casework data.");
}
async function createCaseFromIntakeUseCase(input) {
	if (!hasDatabaseUrl()) return;
	const db = getDb();
	const frcId = await resolveFrcId(input.currentStaffId);
	const createdDate = input.intake.savedAt?.slice(0, 10) ?? today();
	const hasHighDuplicate = input.intake.duplicateWarnings.some((warning) => warning.includes("High confidence"));
	const primaryIntakeValues = {
		completedById: input.currentStaffId,
		intakeDate: createdDate,
		referralSource: input.mode === "reintake" ? "Re-intake workflow" : "New intake workflow",
		familyStrengths: input.intake.demographics.primaryLanguage ? `Primary language: ${input.intake.demographics.primaryLanguage}` : void 0,
		presentingNeeds: [
			input.intake.legal.hasCourtInvolvement ? `Legal: ${input.intake.legal.matterType || "court involvement"}` : void 0,
			input.intake.benefits.length > 0 ? `Benefits: ${input.intake.benefits.map((benefit) => benefit.type).join(", ")}` : void 0,
			input.intake.housing.notes
		].filter(Boolean).join("; "),
		householdIncome: input.intake.incomeSources.map((source) => `${source.type}: ${source.amount} ${source.frequency}`).join("; "),
		housing: input.intake.housing.status,
		fieldValues: {
			county: input.intake.address.county,
			email: input.intake.client.email,
			phone: input.intake.client.phone
		}
	};
	const personId = input.existingPersonId ?? await insertPersonRow(db, {
		frcId,
		personRole: "client",
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
		county: input.intake.address.county || input.intake.housing.currentLocation || "Unknown"
	});
	const caseId = input.mode === "reintake" && input.existingCaseId ? input.existingCaseId : await insertCaseRow(db, {
		frcId,
		primaryPersonId: personId,
		status: "open",
		risk: hasHighDuplicate ? "medium" : "low",
		openedAt: createdDate,
		lastContactAt: createdDate,
		householdName: `${input.intake.client.firstName} ${input.intake.client.lastName}`.trim()
	});
	if (input.mode === "reintake" && input.existingCaseId) {
		await updateCaseStatusRow(db, input.existingCaseId, "open");
		await updatePrimaryIntakeRow(db, input.existingCaseId, primaryIntakeValues);
	} else await insertPrimaryIntakeRow(db, {
		caseId,
		...primaryIntakeValues
	});
	for (const contact of input.intake.relevantContacts) {
		const [firstName = "", ...lastNameParts] = contact.name.split(" ");
		await insertPersonRelationshipRow(db, {
			sourcePersonId: personId,
			relatedPersonId: await insertPersonRow(db, {
				frcId,
				personRole: "collateral_contact",
				firstName,
				lastName: lastNameParts.join(" "),
				phone: contact.phone,
				email: contact.email,
				county: input.intake.address.county
			}),
			relationship: contact.relationship,
			livesInHousehold: false
		});
	}
	await insertIntakeSubmissionRow(db, {
		frcId,
		caseId,
		createdById: input.intake.createdById,
		convertedById: input.currentStaffId,
		status: "converted_to_case",
		startedAt: new Date(input.intake.startedAt),
		savedAt: /* @__PURE__ */ new Date(`${createdDate}T10:30:00`),
		duplicateWarnings: input.intake.duplicateWarnings,
		duplicateOverrideReason: input.intake.duplicateOverrideReason,
		clientSnapshot: input.intake.client,
		demographicSnapshot: input.intake.demographics,
		addressSnapshot: input.intake.address,
		incomeSources: input.intake.incomeSources,
		benefits: input.intake.benefits,
		relevantContacts: input.intake.relevantContacts,
		legalSnapshot: input.intake.legal,
		housingSnapshot: input.intake.housing
	});
	return caseId;
}
//#endregion
//#region src/fns/workspace.ts?tss-serverfn-split
var loadWorkspaceFn_createServerFn_handler = createServerRpc({
	id: "6730d51c9ac496760d97e83dfbebdeb3105ab75ef2e3cceefbe2ff38942170d0",
	name: "loadWorkspaceFn",
	filename: "src/fns/workspace.ts"
}, (opts) => loadWorkspaceFn.__executeServer(opts));
var loadWorkspaceFn = createServerFn({ method: "GET" }).handler(loadWorkspaceFn_createServerFn_handler, () => loadWorkspaceUseCase());
var updateCaseStatusFn_createServerFn_handler = createServerRpc({
	id: "b62a7345f5295a436067386205c27babec3b5ff9d822c21d9e527d6b7ee2c577",
	name: "updateCaseStatusFn",
	filename: "src/fns/workspace.ts"
}, (opts) => updateCaseStatusFn.__executeServer(opts));
var updateCaseStatusFn = createServerFn({ method: "POST" }).validator((input) => UpdateCaseStatusSchema.parse(input)).handler(updateCaseStatusFn_createServerFn_handler, ({ data }) => updateCaseStatusUseCase(data));
var updateEnrollmentFn_createServerFn_handler = createServerRpc({
	id: "9aa7f3fae4ee3d25dc6f1294ecd91487430904ac52b761f1b57d678aa391144d",
	name: "updateEnrollmentFn",
	filename: "src/fns/workspace.ts"
}, (opts) => updateEnrollmentFn.__executeServer(opts));
var updateEnrollmentFn = createServerFn({ method: "POST" }).validator((input) => UpdateEnrollmentSchema.parse(input)).handler(updateEnrollmentFn_createServerFn_handler, ({ data }) => updateEnrollmentUseCase(data));
var addCaseworkerAssignmentFn_createServerFn_handler = createServerRpc({
	id: "61c08573a3051e28ca0f34f3b695aa91de0199916e956b8d19cb9b0f765153b8",
	name: "addCaseworkerAssignmentFn",
	filename: "src/fns/workspace.ts"
}, (opts) => addCaseworkerAssignmentFn.__executeServer(opts));
var addCaseworkerAssignmentFn = createServerFn({ method: "POST" }).validator((input) => AddCaseworkerAssignmentSchema.parse(input)).handler(addCaseworkerAssignmentFn_createServerFn_handler, ({ data }) => addCaseworkerAssignmentUseCase(data));
var createEnrollmentFn_createServerFn_handler = createServerRpc({
	id: "0595ebad747dfd91d0d7ad6de0e45ec0a094fafa75cd046b832c9e9e5d146187",
	name: "createEnrollmentFn",
	filename: "src/fns/workspace.ts"
}, (opts) => createEnrollmentFn.__executeServer(opts));
var createEnrollmentFn = createServerFn({ method: "POST" }).validator((input) => CreateEnrollmentSchema.parse(input)).handler(createEnrollmentFn_createServerFn_handler, ({ data }) => createEnrollmentUseCase(data));
var removeCaseworkerAssignmentFn_createServerFn_handler = createServerRpc({
	id: "54b1cbe51673a785cd9510adda0ba2c70c32f71511477d51e9fc66bffb693cde",
	name: "removeCaseworkerAssignmentFn",
	filename: "src/fns/workspace.ts"
}, (opts) => removeCaseworkerAssignmentFn.__executeServer(opts));
var removeCaseworkerAssignmentFn = createServerFn({ method: "POST" }).validator((input) => AssignmentByStaffSchema.parse(input)).handler(removeCaseworkerAssignmentFn_createServerFn_handler, ({ data }) => removeCaseworkerAssignmentUseCase(data));
var setPrimaryCaseworkerFn_createServerFn_handler = createServerRpc({
	id: "8893be4a641ce0bb80843bde3941a481dae5de97b9aaceb4ccee2bd45d239b1f",
	name: "setPrimaryCaseworkerFn",
	filename: "src/fns/workspace.ts"
}, (opts) => setPrimaryCaseworkerFn.__executeServer(opts));
var setPrimaryCaseworkerFn = createServerFn({ method: "POST" }).validator((input) => AssignmentByStaffSchema.parse(input)).handler(setPrimaryCaseworkerFn_createServerFn_handler, ({ data }) => setPrimaryCaseworkerUseCase(data));
var updateIntakeFieldFn_createServerFn_handler = createServerRpc({
	id: "ec223ff61e50d5b7b3af8782df898724474bfd828bcc1884ef00cc4d54480d5f",
	name: "updateIntakeFieldFn",
	filename: "src/fns/workspace.ts"
}, (opts) => updateIntakeFieldFn.__executeServer(opts));
var updateIntakeFieldFn = createServerFn({ method: "POST" }).validator((input) => UpdateIntakeFieldSchema.parse(input)).handler(updateIntakeFieldFn_createServerFn_handler, ({ data }) => updateIntakeFieldUseCase(data));
var addNoteFn_createServerFn_handler = createServerRpc({
	id: "a0e1e6277bc1cf03f192087085b1f1170465d350fb9671773e546042419b8ec5",
	name: "addNoteFn",
	filename: "src/fns/workspace.ts"
}, (opts) => addNoteFn.__executeServer(opts));
var addNoteFn = createServerFn({ method: "POST" }).validator((input) => AddNoteRecordSchema.parse(input)).handler(addNoteFn_createServerFn_handler, ({ data }) => addNoteUseCase(data));
var editNoteFn_createServerFn_handler = createServerRpc({
	id: "15425a3643c2d4efd85116d103cf5d6b77d1065c0ff5813527526ad6cb1b70f1",
	name: "editNoteFn",
	filename: "src/fns/workspace.ts"
}, (opts) => editNoteFn.__executeServer(opts));
var editNoteFn = createServerFn({ method: "POST" }).validator((input) => EditNoteRecordSchema.parse(input)).handler(editNoteFn_createServerFn_handler, ({ data }) => editNoteUseCase(data));
var addConcreteServiceFn_createServerFn_handler = createServerRpc({
	id: "201edf323e0e20530e2d2a39864177726e7d18e8d047078b2fa4f80a58f4602e",
	name: "addConcreteServiceFn",
	filename: "src/fns/workspace.ts"
}, (opts) => addConcreteServiceFn.__executeServer(opts));
var addConcreteServiceFn = createServerFn({ method: "POST" }).validator((input) => AddConcreteServiceRecordSchema.parse(input)).handler(addConcreteServiceFn_createServerFn_handler, ({ data }) => addConcreteServiceUseCase(data));
var createCaseFromIntakeFn_createServerFn_handler = createServerRpc({
	id: "e3ddf4cf675e5e5c98e167da44b4f15a21fe12519b6b5cf3519bd6a5dc484a8e",
	name: "createCaseFromIntakeFn",
	filename: "src/fns/workspace.ts"
}, (opts) => createCaseFromIntakeFn.__executeServer(opts));
var createCaseFromIntakeFn = createServerFn({ method: "POST" }).validator((input) => CreateCaseFromIntakeSchema.parse(input)).handler(createCaseFromIntakeFn_createServerFn_handler, ({ data }) => createCaseFromIntakeUseCase(data));
//#endregion
export { addCaseworkerAssignmentFn_createServerFn_handler, addConcreteServiceFn_createServerFn_handler, addNoteFn_createServerFn_handler, createCaseFromIntakeFn_createServerFn_handler, createEnrollmentFn_createServerFn_handler, editNoteFn_createServerFn_handler, loadWorkspaceFn_createServerFn_handler, removeCaseworkerAssignmentFn_createServerFn_handler, setPrimaryCaseworkerFn_createServerFn_handler, updateCaseStatusFn_createServerFn_handler, updateEnrollmentFn_createServerFn_handler, updateIntakeFieldFn_createServerFn_handler };
