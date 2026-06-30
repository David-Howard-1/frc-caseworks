import { z } from "zod";
import dayjs from "dayjs";
//#region src/schema/workspace.ts
var EntityIdSchema = z.number().int().positive();
var CaseStatusSchema = z.enum([
	"Open",
	"Pending",
	"Closed"
]);
var ProgramStatusSchema = z.enum([
	"Active",
	"Pending",
	"Completed",
	"Inactive",
	"Waitlisted"
]);
var IntakeFieldSchema = z.enum([
	"intakeDate",
	"referralSource",
	"county",
	"phone",
	"email",
	"householdIncome",
	"housing",
	"strengths",
	"needs"
]);
var AddNoteSchema = z.object({
	enrollmentId: EntityIdSchema,
	contactType: z.string(),
	summary: z.string(),
	body: z.string().min(1),
	isSession: z.boolean(),
	sessionHours: z.number().positive().optional()
});
var AddServiceSchema = z.object({
	enrollmentId: EntityIdSchema,
	category: z.string().min(1),
	description: z.string().min(1),
	amount: z.number().positive()
});
var CreateEnrollmentSchema = z.object({
	caseId: EntityIdSchema,
	programId: EntityIdSchema,
	supervisorId: EntityIdSchema.optional(),
	status: ProgramStatusSchema.default("Active"),
	opened: z.string(),
	target: z.string().optional(),
	goal: z.string().optional()
});
var IntakeClientSchema = z.object({
	firstName: z.string().min(1),
	middleName: z.string().optional(),
	lastName: z.string().min(1),
	preferredName: z.string().optional(),
	dateOfBirth: z.string().optional(),
	ssn: z.string().optional(),
	approximateAge: z.string().optional(),
	phone: z.string().optional(),
	alternatePhone: z.string().optional(),
	email: z.string().optional(),
	preferredContactMethod: z.string().optional(),
	safeToCall: z.boolean(),
	safeToText: z.boolean(),
	safeToEmail: z.boolean(),
	contactRestrictions: z.string().optional()
});
var IntakeDemographicsSchema = z.object({
	gender: z.string().optional(),
	race: z.string().optional(),
	ethnicity: z.string().optional(),
	primaryLanguage: z.string().optional(),
	interpreterNeeded: z.boolean(),
	veteranStatus: z.string().optional(),
	disabilityStatus: z.string().optional(),
	householdSize: z.string().optional(),
	dependents: z.string().optional(),
	maritalStatus: z.string().optional()
});
var IntakeAddressSchema = z.object({
	line1: z.string().optional(),
	line2: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	postalCode: z.string().optional(),
	county: z.string().optional()
});
var IntakeIncomeSourceSchema = z.object({
	id: z.string(),
	type: z.string(),
	sourceName: z.string(),
	amount: z.string(),
	frequency: z.string(),
	notes: z.string().optional()
});
var IntakeBenefitSchema = z.object({
	id: z.string(),
	type: z.string(),
	isReceiving: z.boolean(),
	monthlyAmount: z.string().optional(),
	caseNumber: z.string().optional(),
	agency: z.string().optional(),
	notes: z.string().optional()
});
var IntakeContactSchema = z.object({
	id: z.string(),
	name: z.string(),
	relationship: z.string(),
	organization: z.string().optional(),
	role: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().optional(),
	permissionToContact: z.boolean(),
	notes: z.string().optional()
});
var IntakeLegalSchema = z.object({
	hasCourtInvolvement: z.boolean(),
	matterType: z.string().optional(),
	courtName: z.string().optional(),
	county: z.string().optional(),
	caseNumber: z.string().optional(),
	judge: z.string().optional(),
	attorney: z.string().optional(),
	officer: z.string().optional(),
	nextCourtDate: z.string().optional(),
	courtTime: z.string().optional(),
	legalStatus: z.string().optional(),
	warrantsKnown: z.boolean(),
	notes: z.string().optional()
});
var IntakeHousingSchema = z.object({
	status: z.string(),
	currentLocation: z.string().optional(),
	lengthOfStay: z.string().optional(),
	safeHousing: z.boolean(),
	atRisk: z.boolean(),
	evictionPending: z.boolean(),
	livingWithFamily: z.boolean(),
	notes: z.string().optional()
});
var IntakeSubmissionInputSchema = z.object({
	status: z.enum([
		"Draft",
		"Duplicate Review",
		"Rejected",
		"Converted to Case"
	]),
	createdById: EntityIdSchema,
	convertedById: EntityIdSchema.optional(),
	caseId: EntityIdSchema.optional(),
	startedAt: z.string(),
	savedAt: z.string().optional(),
	duplicateWarnings: z.array(z.string()),
	duplicateOverrideReason: z.string().optional(),
	client: IntakeClientSchema,
	demographics: IntakeDemographicsSchema,
	address: IntakeAddressSchema,
	incomeSources: z.array(IntakeIncomeSourceSchema),
	benefits: z.array(IntakeBenefitSchema),
	relevantContacts: z.array(IntakeContactSchema),
	legal: IntakeLegalSchema,
	housing: IntakeHousingSchema
});
var UpdateCaseStatusSchema = z.object({
	caseId: EntityIdSchema,
	status: CaseStatusSchema
});
var UpdateEnrollmentSchema = z.object({
	enrollmentId: EntityIdSchema,
	patch: z.object({
		status: ProgramStatusSchema.optional(),
		opened: z.string().optional(),
		target: z.string().optional(),
		goal: z.string().optional()
	})
});
var AddCaseworkerAssignmentSchema = z.object({
	enrollmentId: EntityIdSchema,
	isFirstAssignment: z.boolean(),
	staffId: EntityIdSchema
});
var AssignmentByStaffSchema = z.object({
	enrollmentId: EntityIdSchema,
	staffId: EntityIdSchema
});
var UpdateIntakeFieldSchema = z.object({
	caseId: EntityIdSchema,
	field: IntakeFieldSchema,
	value: z.string()
});
var AddNoteRecordSchema = z.object({
	caseId: EntityIdSchema,
	currentStaffId: EntityIdSchema,
	note: AddNoteSchema
});
var EditNoteRecordSchema = z.object({
	noteId: EntityIdSchema,
	note: AddNoteSchema
});
var AddConcreteServiceRecordSchema = z.object({
	caseId: EntityIdSchema,
	currentStaffId: EntityIdSchema,
	service: AddServiceSchema
});
var CreateCaseFromIntakeSchema = z.object({
	intake: IntakeSubmissionInputSchema,
	currentStaffId: EntityIdSchema
});
//#endregion
//#region src/domain/workspace.ts
var emptyWorkspaceSnapshot = {
	frcs: [],
	programs: [],
	staff: [],
	cases: [],
	intakeSubmissions: [],
	notes: [],
	services: []
};
var formatCurrency = (value) => new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0
}).format(value);
var formatExactCurrency = (value) => new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD"
}).format(value);
var formatDate = (value) => value ? dayjs(value).format("MMM D, YYYY") : "Not recorded";
function getProgram(programs, programId) {
	return programs.find((program) => program.id === programId);
}
function getStaff(staff, staffId) {
	return staff.find((person) => person.id === staffId);
}
function getAssignedCaseworkers(staff, enrollment) {
	return enrollment.caseworkers.map((assignment) => ({
		assignment,
		staff: getStaff(staff, assignment.staffId)
	})).filter((item) => item.staff);
}
function getPrimaryCaseworker(staff, enrollment) {
	const primaryAssignment = enrollment.caseworkers.find((assignment) => assignment.isPrimary) ?? enrollment.caseworkers[0];
	return primaryAssignment ? getStaff(staff, primaryAssignment.staffId) : void 0;
}
function visibleCasesForRole(cases, role, staffId) {
	if (role === "Executive Director") return cases;
	if (!staffId) return [];
	if (role === "Program Supervisor") return cases.filter((caseRecord) => caseRecord.enrollments.some((enrollment) => enrollment.supervisorId === staffId));
	return cases.filter((caseRecord) => caseRecord.enrollments.some((enrollment) => enrollment.caseworkers.some((assignment) => assignment.staffId === staffId)));
}
function calculateMetrics(cases, notes, services) {
	const openCases = cases.filter((caseRecord) => caseRecord.status === "Open");
	const pendingCases = cases.filter((caseRecord) => caseRecord.status === "Pending");
	const activeEnrollments = cases.flatMap((caseRecord) => caseRecord.enrollments.filter((enrollment) => enrollment.status === "Active"));
	const serviceSpend = services.reduce((sum, service) => sum + service.amount, 0);
	const currentMonth = dayjs().format("YYYY-MM");
	return {
		openCases: openCases.length,
		pendingCases: pendingCases.length,
		activeEnrollments: activeEnrollments.length,
		serviceSpend,
		notesThisMonth: notes.filter((note) => note.date.startsWith(currentMonth)).length
	};
}
function buildGrantReport(programs, cases, notes, services, grantor) {
	const programIds = programs.filter((program) => program.grantor === grantor).map((program) => program.id);
	const enrollments = cases.flatMap((caseRecord) => caseRecord.enrollments.filter((enrollment) => programIds.includes(enrollment.programId)).map((enrollment) => ({
		caseRecord,
		enrollment
	})));
	const enrollmentIds = enrollments.map(({ enrollment }) => enrollment.id);
	const grantServices = services.filter((service) => service.grantor === grantor);
	const grantNotes = notes.filter((note) => note.enrollmentId ? enrollmentIds.includes(note.enrollmentId) : false);
	return {
		activeClients: new Set(enrollments.filter(({ enrollment }) => enrollment.status === "Active").map(({ caseRecord }) => caseRecord.id)).size,
		totalEnrollments: enrollments.length,
		servicesProvided: grantServices.length,
		dollarsSpent: grantServices.reduce((sum, service) => sum + service.amount, 0),
		caseNotes: grantNotes.length
	};
}
//#endregion
export { CreateEnrollmentSchema as _, formatDate as a, UpdateEnrollmentSchema as b, getPrimaryCaseworker as c, visibleCasesForRole as d, AddCaseworkerAssignmentSchema as f, CreateCaseFromIntakeSchema as g, AssignmentByStaffSchema as h, formatCurrency as i, getProgram as l, AddNoteRecordSchema as m, calculateMetrics as n, formatExactCurrency as o, AddConcreteServiceRecordSchema as p, emptyWorkspaceSnapshot as r, getAssignedCaseworkers as s, buildGrantReport as t, getStaff as u, EditNoteRecordSchema as v, UpdateIntakeFieldSchema as x, UpdateCaseStatusSchema as y };
