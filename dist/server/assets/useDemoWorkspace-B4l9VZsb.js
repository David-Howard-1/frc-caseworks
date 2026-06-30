import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "../server.js";
import { _ as CreateEnrollmentSchema, b as UpdateEnrollmentSchema, d as visibleCasesForRole, f as AddCaseworkerAssignmentSchema, g as CreateCaseFromIntakeSchema, h as AssignmentByStaffSchema, l as getProgram, m as AddNoteRecordSchema, n as calculateMetrics, p as AddConcreteServiceRecordSchema, r as emptyWorkspaceSnapshot, v as EditNoteRecordSchema, x as UpdateIntakeFieldSchema, y as UpdateCaseStatusSchema } from "./workspace-D2K6phsh.js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jsx } from "react/jsx-runtime";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.14/node_modules/@tanstack/start-server-core/dist/esm/createSsrRpc.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/fns/workspace.ts
var loadWorkspaceFn = createServerFn({ method: "GET" }).handler(createSsrRpc("6730d51c9ac496760d97e83dfbebdeb3105ab75ef2e3cceefbe2ff38942170d0"));
var updateCaseStatusFn = createServerFn({ method: "POST" }).validator((input) => UpdateCaseStatusSchema.parse(input)).handler(createSsrRpc("b62a7345f5295a436067386205c27babec3b5ff9d822c21d9e527d6b7ee2c577"));
var updateEnrollmentFn = createServerFn({ method: "POST" }).validator((input) => UpdateEnrollmentSchema.parse(input)).handler(createSsrRpc("9aa7f3fae4ee3d25dc6f1294ecd91487430904ac52b761f1b57d678aa391144d"));
var addCaseworkerAssignmentFn = createServerFn({ method: "POST" }).validator((input) => AddCaseworkerAssignmentSchema.parse(input)).handler(createSsrRpc("61c08573a3051e28ca0f34f3b695aa91de0199916e956b8d19cb9b0f765153b8"));
var createEnrollmentFn = createServerFn({ method: "POST" }).validator((input) => CreateEnrollmentSchema.parse(input)).handler(createSsrRpc("0595ebad747dfd91d0d7ad6de0e45ec0a094fafa75cd046b832c9e9e5d146187"));
var removeCaseworkerAssignmentFn = createServerFn({ method: "POST" }).validator((input) => AssignmentByStaffSchema.parse(input)).handler(createSsrRpc("54b1cbe51673a785cd9510adda0ba2c70c32f71511477d51e9fc66bffb693cde"));
var setPrimaryCaseworkerFn = createServerFn({ method: "POST" }).validator((input) => AssignmentByStaffSchema.parse(input)).handler(createSsrRpc("8893be4a641ce0bb80843bde3941a481dae5de97b9aaceb4ccee2bd45d239b1f"));
var updateIntakeFieldFn = createServerFn({ method: "POST" }).validator((input) => UpdateIntakeFieldSchema.parse(input)).handler(createSsrRpc("ec223ff61e50d5b7b3af8782df898724474bfd828bcc1884ef00cc4d54480d5f"));
var addNoteFn = createServerFn({ method: "POST" }).validator((input) => AddNoteRecordSchema.parse(input)).handler(createSsrRpc("a0e1e6277bc1cf03f192087085b1f1170465d350fb9671773e546042419b8ec5"));
var editNoteFn = createServerFn({ method: "POST" }).validator((input) => EditNoteRecordSchema.parse(input)).handler(createSsrRpc("15425a3643c2d4efd85116d103cf5d6b77d1065c0ff5813527526ad6cb1b70f1"));
var addConcreteServiceFn = createServerFn({ method: "POST" }).validator((input) => AddConcreteServiceRecordSchema.parse(input)).handler(createSsrRpc("201edf323e0e20530e2d2a39864177726e7d18e8d047078b2fa4f80a58f4602e"));
var createCaseFromIntakeFn = createServerFn({ method: "POST" }).validator((input) => CreateCaseFromIntakeSchema.parse(input)).handler(createSsrRpc("e3ddf4cf675e5e5c98e167da44b4f15a21fe12519b6b5cf3519bd6a5dc484a8e"));
//#endregion
//#region src/queries/workspace.ts
var WorkspaceQueries = {
	all: () => ["workspace"],
	snapshot: () => [...WorkspaceQueries.all(), "snapshot"]
};
function workspaceSnapshotQueryOptions() {
	return queryOptions({
		queryKey: WorkspaceQueries.snapshot(),
		queryFn: () => loadWorkspaceFn(),
		staleTime: 15e3
	});
}
//#endregion
//#region src/hooks/useWorkspaceMutations.ts
function useInvalidateWorkspace() {
	const queryClient = useQueryClient();
	return () => queryClient.invalidateQueries({ queryKey: WorkspaceQueries.all() });
}
function useUpdateCaseStatusMutation() {
	return useMutation({
		mutationFn: (variables) => updateCaseStatusFn({ data: variables }),
		onSettled: useInvalidateWorkspace()
	});
}
function useUpdateEnrollmentMutation() {
	return useMutation({
		mutationFn: (variables) => updateEnrollmentFn({ data: variables }),
		onSettled: useInvalidateWorkspace()
	});
}
function useAddCaseworkerAssignmentMutation() {
	return useMutation({
		mutationFn: (variables) => addCaseworkerAssignmentFn({ data: variables }),
		onSettled: useInvalidateWorkspace()
	});
}
function useCreateEnrollmentMutation() {
	return useMutation({
		mutationFn: (variables) => createEnrollmentFn({ data: variables }),
		onSettled: useInvalidateWorkspace()
	});
}
function useRemoveCaseworkerAssignmentMutation() {
	return useMutation({
		mutationFn: (variables) => removeCaseworkerAssignmentFn({ data: variables }),
		onSettled: useInvalidateWorkspace()
	});
}
function useSetPrimaryCaseworkerMutation() {
	return useMutation({
		mutationFn: (variables) => setPrimaryCaseworkerFn({ data: variables }),
		onSettled: useInvalidateWorkspace()
	});
}
function useUpdateIntakeFieldMutation() {
	return useMutation({
		mutationFn: (variables) => updateIntakeFieldFn({ data: variables }),
		onSettled: useInvalidateWorkspace()
	});
}
function useAddNoteMutation() {
	return useMutation({
		mutationFn: (variables) => addNoteFn({ data: variables }),
		onSettled: useInvalidateWorkspace()
	});
}
function useEditNoteMutation() {
	return useMutation({
		mutationFn: (variables) => editNoteFn({ data: variables }),
		onSettled: useInvalidateWorkspace()
	});
}
function useAddConcreteServiceMutation() {
	return useMutation({
		mutationFn: (variables) => addConcreteServiceFn({ data: variables }),
		onSettled: useInvalidateWorkspace()
	});
}
function useCreateCaseFromIntakeMutation() {
	return useMutation({
		mutationFn: (variables) => createCaseFromIntakeFn({ data: variables }),
		onSettled: useInvalidateWorkspace()
	});
}
//#endregion
//#region src/context/DemoWorkspaceContext.tsx
var DemoWorkspaceContext = createContext(null);
var normalize = (value) => value?.trim().toLowerCase() ?? "";
var normalizePhone = (value) => value?.replace(/\D/g, "") ?? "";
var normalizeSsn = (value) => value?.replace(/\D/g, "") ?? "";
function DemoWorkspaceProvider({ children }) {
	const { data = emptyWorkspaceSnapshot } = useQuery(workspaceSnapshotQueryOptions());
	const [role, setRole] = useState("Caseworker");
	const [currentStaffId, setCurrentStaffId] = useState();
	const updateCaseStatusMutation = useUpdateCaseStatusMutation();
	const updateEnrollmentMutation = useUpdateEnrollmentMutation();
	const addCaseworkerAssignmentMutation = useAddCaseworkerAssignmentMutation();
	const createEnrollmentMutation = useCreateEnrollmentMutation();
	const removeCaseworkerAssignmentMutation = useRemoveCaseworkerAssignmentMutation();
	const setPrimaryCaseworkerMutation = useSetPrimaryCaseworkerMutation();
	const updateIntakeFieldMutation = useUpdateIntakeFieldMutation();
	const addNoteMutation = useAddNoteMutation();
	const editNoteMutation = useEditNoteMutation();
	const addConcreteServiceMutation = useAddConcreteServiceMutation();
	const createCaseFromIntakeMutation = useCreateCaseFromIntakeMutation();
	const staffChoices = useMemo(() => data.staff.filter((person) => person.role === role), [data.staff, role]);
	useEffect(() => {
		if (currentStaffId && staffChoices.some((person) => person.id === currentStaffId)) return;
		setCurrentStaffId(staffChoices[0]?.id);
	}, [currentStaffId, staffChoices]);
	const visibleCases = useMemo(() => visibleCasesForRole(data.cases, role, currentStaffId), [
		currentStaffId,
		data.cases,
		role
	]);
	const visibleCaseIds = useMemo(() => new Set(visibleCases.map((caseRecord) => caseRecord.id)), [visibleCases]);
	const visibleNotes = useMemo(() => data.notes.filter((note) => visibleCaseIds.has(note.caseId)), [data.notes, visibleCaseIds]);
	const visibleServices = useMemo(() => data.services.filter((service) => visibleCaseIds.has(service.caseId)), [data.services, visibleCaseIds]);
	const metrics = useMemo(() => calculateMetrics(visibleCases, visibleNotes, visibleServices), [
		visibleCases,
		visibleNotes,
		visibleServices
	]);
	function updateCaseStatus(caseId, status) {
		updateCaseStatusMutation.mutate({
			caseId,
			status
		});
	}
	function updateEnrollment(_caseId, enrollmentId, patch) {
		updateEnrollmentMutation.mutate({
			enrollmentId,
			patch: {
				goal: patch.goal,
				opened: patch.opened,
				status: patch.status,
				target: patch.target
			}
		});
	}
	function addCaseworkerAssignment(caseId, enrollmentId, staffId) {
		const enrollment = data.cases.find((item) => item.id === caseId)?.enrollments.find((item) => item.id === enrollmentId);
		addCaseworkerAssignmentMutation.mutate({
			enrollmentId,
			staffId,
			isFirstAssignment: (enrollment?.caseworkers.length ?? 0) === 0
		});
	}
	function createEnrollment(input) {
		createEnrollmentMutation.mutate(input);
	}
	function removeCaseworkerAssignment(_caseId, enrollmentId, staffId) {
		removeCaseworkerAssignmentMutation.mutate({
			enrollmentId,
			staffId
		});
	}
	function setPrimaryCaseworker(_caseId, enrollmentId, staffId) {
		setPrimaryCaseworkerMutation.mutate({
			enrollmentId,
			staffId
		});
	}
	function updateIntakeField(caseId, field, value) {
		updateIntakeFieldMutation.mutate({
			caseId,
			field,
			value
		});
	}
	function findIntakeMatches(input) {
		const firstName = normalize(input.firstName);
		const lastName = normalize(input.lastName);
		const phone = normalizePhone(input.phone);
		const email = normalize(input.email);
		const ssn = normalizeSsn(input.ssn);
		if (!firstName && !lastName && !phone && !email && !input.dateOfBirth && !ssn) return [];
		const caseMatches = data.cases.reduce((matches, caseRecord) => {
			const [caseFirstName = "", ...rest] = caseRecord.displayName.split(" ");
			const caseLastName = rest.at(-1) ?? "";
			const intake = caseRecord.intake;
			const nameScore = firstName && normalize(caseFirstName).startsWith(firstName) || lastName && normalize(caseLastName).startsWith(lastName);
			const exactContact = phone && normalizePhone(intake.phone) === phone || email && normalize(intake.email) === email;
			if (!nameScore && !exactContact) return matches;
			const strength = exactContact ? "High confidence" : firstName && lastName && nameScore ? "Medium confidence" : "Low confidence";
			const firstEnrollment = caseRecord.enrollments[0];
			const program = firstEnrollment ? getProgram(data.programs, firstEnrollment.programId) : void 0;
			const primaryStaffId = firstEnrollment?.caseworkers.find((assignment) => assignment.isPrimary)?.staffId;
			matches.push({
				id: caseRecord.id,
				recordType: "Case",
				clientName: caseRecord.displayName,
				phone: intake.phone,
				email: intake.email,
				caseStatus: caseRecord.status,
				programArea: program?.name ?? "No program assigned",
				lastUpdated: caseRecord.lastContact,
				assignedStaff: primaryStaffId ? data.staff.find((person) => person.id === primaryStaffId)?.name : void 0,
				strength
			});
			return matches;
		}, []);
		const intakeMatches = data.intakeSubmissions.filter((submission) => submission.status !== "Converted to Case").reduce((matches, submission) => {
			const exactContact = phone && normalizePhone(submission.client.phone) === phone || email && normalize(submission.client.email) === email;
			const exactSsn = ssn && normalizeSsn(submission.client.ssn) === ssn;
			const exactIdentity = input.dateOfBirth && submission.client.dateOfBirth === input.dateOfBirth || exactSsn;
			if (!(firstName && normalize(submission.client.firstName).startsWith(firstName) || lastName && normalize(submission.client.lastName).startsWith(lastName)) && !exactContact && !exactIdentity) return matches;
			matches.push({
				id: submission.id,
				recordType: "Intake",
				clientName: `${submission.client.firstName} ${submission.client.lastName}`,
				dateOfBirth: submission.client.dateOfBirth,
				phone: submission.client.phone,
				email: submission.client.email,
				programArea: "Draft intake",
				lastUpdated: submission.savedAt ?? submission.startedAt,
				assignedStaff: data.staff.find((person) => person.id === submission.createdById)?.name,
				strength: exactContact || exactSsn ? "High confidence" : "Medium confidence"
			});
			return matches;
		}, []);
		return [...caseMatches, ...intakeMatches];
	}
	async function createCaseFromIntake(input) {
		if (!currentStaffId) return;
		return createCaseFromIntakeMutation.mutateAsync({
			intake: input,
			currentStaffId
		});
	}
	function addNote(caseId, input) {
		if (!currentStaffId) return;
		addNoteMutation.mutate({
			caseId,
			currentStaffId,
			note: input
		});
	}
	function editNote(noteId, input) {
		editNoteMutation.mutate({
			noteId,
			note: input
		});
	}
	function addConcreteService(caseId, input) {
		if (!currentStaffId) return;
		addConcreteServiceMutation.mutate({
			caseId,
			currentStaffId,
			service: input
		});
	}
	const value = useMemo(() => ({
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
		addConcreteService
	}), [
		currentStaffId,
		data,
		metrics,
		role,
		staffChoices,
		visibleCases
	]);
	return /* @__PURE__ */ jsx(DemoWorkspaceContext.Provider, {
		value,
		children
	});
}
//#endregion
//#region src/hooks/useDemoWorkspace.ts
function useDemoWorkspace() {
	const context = useContext(DemoWorkspaceContext);
	if (!context) throw new Error("useDemoWorkspace must be used inside DemoWorkspaceProvider");
	return context;
}
//#endregion
export { DemoWorkspaceProvider as n, useDemoWorkspace as t };
