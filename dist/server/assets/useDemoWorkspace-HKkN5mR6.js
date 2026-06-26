import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "../server.js";
import { c as getProgram, g as visibleCasesForRole, h as staff, n as calculateMetrics, p as initialWorkspaceSnapshot } from "./demo-data-BsOXExLV.js";
import * as React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isRedirect, useRouter } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
//#region node_modules/.pnpm/@tanstack+react-start@1.168_5bc4bb272586c6f46ac6b8ca6ef9135f/node_modules/@tanstack/react-start/dist/esm/useServerFn.js
function useServerFn(serverFn) {
	const router = useRouter();
	return React.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
//#endregion
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
//#region src/use-cases/workspaceServerFns.ts
var loadWorkspaceFn = createServerFn({ method: "GET" }).handler(createSsrRpc("b64422fd99df7ca444097916df9212b4f27a5202131063ccafb4de124a8e6325"));
var updateCaseStatusFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e8c88b6594bea7184bf006577c6a9dd5d7beffa5473ec5e34f8de086b0df3ecf"));
var updateEnrollmentFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("03267021997fe8b81778897ed57018438567f388aa36548b9760419a1b27bba8"));
var addCaseworkerAssignmentFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("0f0e386ebc16799934abdd675f0cef8b81c184541d3f9717ad099feaa227ac71"));
var removeCaseworkerAssignmentFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("43f95cfa997fdcb3a90fdd6294a5d1e9a6b7f636a06f04d4aff88769d5aed5cb"));
var setPrimaryCaseworkerFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("1ffbb6f5a833872a182ca20f9e4125a50d2a009599e7e9ea2b5c8cc4676bb3c7"));
var updateIntakeFieldFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("a26945d43bdbc8df6e4f7021151a52b1797575133c243584ed9c61481939ed8d"));
var addNoteFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("3e25d0d70b2beb7f08c20406aae45d51e18c27f4aca2f3b9a594bb6b3a9864bb"));
var editNoteFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("3a459a481b7ab66e402f438e1afa46262cfae7798ac7a113a8c8f9455a2dbd65"));
var addConcreteServiceFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("4cf149594f1f4f229810c3b7e475b235adb431a211a213ab6816cad471b968b8"));
var createCaseFromIntakeFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("c654da9399de90f4e64cc1048c973787ed8ebc98935346ca79f049407b24770a"));
//#endregion
//#region src/context/DemoWorkspaceContext.tsx
var TODAY = "2026-06-10";
var roleDefaults = {
	Caseworker: "u-1",
	"Program Supervisor": "u-2",
	"Executive Director": "u-5"
};
var normalize = (value) => value?.trim().toLowerCase() ?? "";
var normalizePhone = (value) => value?.replace(/\D/g, "") ?? "";
var normalizeSsn = (value) => value?.replace(/\D/g, "") ?? "";
var DemoWorkspaceContext = createContext(null);
function DemoWorkspaceProvider({ children, initialSnapshot = initialWorkspaceSnapshot }) {
	const loadWorkspace = useServerFn(loadWorkspaceFn);
	const persistUpdateCaseStatus = useServerFn(updateCaseStatusFn);
	const persistUpdateEnrollment = useServerFn(updateEnrollmentFn);
	const persistAddCaseworkerAssignment = useServerFn(addCaseworkerAssignmentFn);
	const persistRemoveCaseworkerAssignment = useServerFn(removeCaseworkerAssignmentFn);
	const persistSetPrimaryCaseworker = useServerFn(setPrimaryCaseworkerFn);
	const persistUpdateIntakeField = useServerFn(updateIntakeFieldFn);
	const persistAddNote = useServerFn(addNoteFn);
	const persistEditNote = useServerFn(editNoteFn);
	const persistAddConcreteService = useServerFn(addConcreteServiceFn);
	const persistCreateCaseFromIntake = useServerFn(createCaseFromIntakeFn);
	const [cases, setCases] = useState(initialSnapshot.cases);
	const [intakeSubmissions, setIntakeSubmissions] = useState(initialSnapshot.intakeSubmissions);
	const [notes, setNotes] = useState(initialSnapshot.notes);
	const [services, setServices] = useState(initialSnapshot.services);
	const [role, setRole] = useState("Caseworker");
	const [currentStaffId, setCurrentStaffId] = useState(roleDefaults.Caseworker);
	useEffect(() => {
		setCurrentStaffId(roleDefaults[role]);
	}, [role]);
	useEffect(() => {
		loadWorkspace().then((snapshot) => {
			setCases(snapshot.cases);
			setIntakeSubmissions(snapshot.intakeSubmissions);
			setNotes(snapshot.notes);
			setServices(snapshot.services);
		}).catch((error) => {
			console.error("Unable to load persisted workspace.", error);
		});
	}, [loadWorkspace]);
	const staffChoices = useMemo(() => staff.filter((person) => person.role === role), [role]);
	const visibleCases = useMemo(() => visibleCasesForRole(cases, role, currentStaffId), [
		cases,
		currentStaffId,
		role
	]);
	const visibleCaseIds = useMemo(() => new Set(visibleCases.map((caseRecord) => caseRecord.id)), [visibleCases]);
	const visibleNotes = useMemo(() => notes.filter((note) => visibleCaseIds.has(note.caseId)), [notes, visibleCaseIds]);
	const visibleServices = useMemo(() => services.filter((service) => visibleCaseIds.has(service.caseId)), [services, visibleCaseIds]);
	const metrics = useMemo(() => calculateMetrics(visibleCases, visibleNotes, visibleServices), [
		visibleCases,
		visibleNotes,
		visibleServices
	]);
	function updateCaseStatus(caseId, status) {
		setCases((currentCases) => currentCases.map((caseRecord) => caseRecord.id === caseId ? {
			...caseRecord,
			status,
			lastContact: TODAY
		} : caseRecord));
		persistUpdateCaseStatus({ data: {
			caseId,
			status
		} }).catch((error) => {
			console.error("Unable to persist case status.", error);
		});
	}
	function updateEnrollment(caseId, enrollmentId, patch) {
		setCases((currentCases) => currentCases.map((caseRecord) => caseRecord.id === caseId ? {
			...caseRecord,
			status: patch.status === "Active" && caseRecord.status === "Pending" ? "Open" : caseRecord.status,
			enrollments: caseRecord.enrollments.map((enrollment) => enrollment.id === enrollmentId ? {
				...enrollment,
				...patch
			} : enrollment)
		} : caseRecord));
		persistUpdateEnrollment({ data: {
			enrollmentId,
			patch
		} }).catch((error) => {
			console.error("Unable to persist enrollment update.", error);
		});
	}
	function addCaseworkerAssignment(caseId, enrollmentId, staffId) {
		const enrollment = cases.find((item) => item.id === caseId)?.enrollments.find((item) => item.id === enrollmentId);
		setCases((currentCases) => currentCases.map((caseRecord) => caseRecord.id === caseId ? {
			...caseRecord,
			enrollments: caseRecord.enrollments.map((enrollment) => {
				if (enrollment.id !== enrollmentId || enrollment.caseworkers.some((assignment) => assignment.staffId === staffId)) return enrollment;
				return {
					...enrollment,
					caseworkers: [...enrollment.caseworkers, {
						staffId,
						isPrimary: enrollment.caseworkers.length === 0
					}]
				};
			})
		} : caseRecord));
		if (enrollment) persistAddCaseworkerAssignment({ data: {
			enrollment,
			staffId
		} }).catch((error) => {
			console.error("Unable to persist caseworker assignment.", error);
		});
	}
	function removeCaseworkerAssignment(caseId, enrollmentId, staffId) {
		setCases((currentCases) => currentCases.map((caseRecord) => caseRecord.id === caseId ? {
			...caseRecord,
			enrollments: caseRecord.enrollments.map((enrollment) => {
				if (enrollment.id !== enrollmentId) return enrollment;
				const remaining = enrollment.caseworkers.filter((assignment) => assignment.staffId !== staffId);
				const hasPrimary = remaining.some((assignment) => assignment.isPrimary);
				return {
					...enrollment,
					caseworkers: remaining.map((assignment, index) => ({
						...assignment,
						isPrimary: hasPrimary ? assignment.isPrimary : index === 0
					}))
				};
			})
		} : caseRecord));
		persistRemoveCaseworkerAssignment({ data: {
			enrollmentId,
			staffId
		} }).catch((error) => {
			console.error("Unable to persist caseworker removal.", error);
		});
	}
	function setPrimaryCaseworker(caseId, enrollmentId, staffId) {
		setCases((currentCases) => currentCases.map((caseRecord) => caseRecord.id === caseId ? {
			...caseRecord,
			enrollments: caseRecord.enrollments.map((enrollment) => enrollment.id === enrollmentId ? {
				...enrollment,
				caseworkers: enrollment.caseworkers.map((assignment) => ({
					...assignment,
					isPrimary: assignment.staffId === staffId
				}))
			} : enrollment)
		} : caseRecord));
		persistSetPrimaryCaseworker({ data: {
			enrollmentId,
			staffId
		} }).catch((error) => {
			console.error("Unable to persist primary caseworker.", error);
		});
	}
	function updateIntakeField(caseId, field, value) {
		setCases((currentCases) => currentCases.map((caseRecord) => caseRecord.id === caseId ? {
			...caseRecord,
			intake: {
				...caseRecord.intake,
				[field]: value
			},
			lastContact: TODAY
		} : caseRecord));
		persistUpdateIntakeField({ data: {
			caseId,
			field,
			value
		} }).catch((error) => {
			console.error("Unable to persist intake field.", error);
		});
	}
	function findIntakeMatches(input) {
		const firstName = normalize(input.firstName);
		const lastName = normalize(input.lastName);
		const phone = normalizePhone(input.phone);
		const email = normalize(input.email);
		const ssn = normalizeSsn(input.ssn);
		if (!firstName && !lastName && !phone && !email && !input.dateOfBirth && !ssn) return [];
		const caseMatches = cases.reduce((matches, caseRecord) => {
			const [caseFirstName = "", ...rest] = caseRecord.displayName.split(" ");
			const caseLastName = rest.at(-1) ?? "";
			const intake = caseRecord.intake;
			const nameScore = firstName && normalize(caseFirstName).startsWith(firstName) || lastName && normalize(caseLastName).startsWith(lastName);
			const exactContact = phone && normalizePhone(intake.phone) === phone || email && normalize(intake.email) === email;
			if (!nameScore && !exactContact) return matches;
			const strength = exactContact ? "High confidence" : firstName && lastName && nameScore ? "Medium confidence" : "Low confidence";
			const firstEnrollment = caseRecord.enrollments[0];
			const program = firstEnrollment ? getProgram(firstEnrollment.programId) : void 0;
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
				assignedStaff: primaryStaffId ? staff.find((person) => person.id === primaryStaffId)?.name : void 0,
				strength
			});
			return matches;
		}, []);
		const intakeMatches = intakeSubmissions.filter((submission) => submission.status !== "Converted to Case").reduce((matches, submission) => {
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
				assignedStaff: staff.find((person) => person.id === submission.createdById)?.name,
				strength: exactContact || exactSsn ? "High confidence" : "Medium confidence"
			});
			return matches;
		}, []);
		return [...caseMatches, ...intakeMatches];
	}
	function createCaseFromIntake(input) {
		const timestamp = Date.now();
		const newCaseId = `case-${timestamp}`;
		const newPersonId = `person-${timestamp}`;
		const newIntakeId = `intake-${timestamp}`;
		const displayName = `${input.client.firstName.trim()} ${input.client.lastName.trim()}`;
		const age = Number(input.client.approximateAge) || 0;
		const hasHighDuplicate = input.duplicateWarnings.some((warning) => warning.includes("High confidence"));
		const caseRecord = {
			id: newCaseId,
			personId: newPersonId,
			displayName,
			pronouns: void 0,
			age,
			status: "Open",
			opened: input.savedAt?.slice(0, 10) ?? TODAY,
			lastContact: input.savedAt?.slice(0, 10) ?? TODAY,
			risk: hasHighDuplicate ? "Medium" : "Low",
			county: input.address.county || input.housing.currentLocation || "Unknown",
			intake: {
				intakeDate: input.savedAt?.slice(0, 10) ?? TODAY,
				referralSource: "New intake workflow",
				county: input.address.county,
				phone: input.client.phone,
				email: input.client.email,
				householdIncome: input.incomeSources.map((source) => `${source.type}: ${source.amount} ${source.frequency}`).join("; "),
				housing: input.housing.status,
				strengths: input.demographics.primaryLanguage ? `Primary language: ${input.demographics.primaryLanguage}` : void 0,
				needs: [
					input.legal.hasCourtInvolvement ? `Legal: ${input.legal.matterType || "court involvement"}` : void 0,
					input.benefits.length > 0 ? `Benefits: ${input.benefits.map((benefit) => benefit.type).join(", ")}` : void 0,
					input.housing.notes
				].filter(Boolean).join("; ")
			},
			enrollments: [],
			relatedPeople: input.relevantContacts.map((contact) => ({
				id: contact.id,
				name: contact.name,
				relationship: contact.relationship,
				age: 0,
				inHousehold: false
			}))
		};
		setCases((currentCases) => [caseRecord, ...currentCases]);
		setIntakeSubmissions((currentSubmissions) => [{
			...input,
			id: newIntakeId,
			status: "Converted to Case",
			caseId: newCaseId,
			convertedById: currentStaffId,
			savedAt: `${TODAY}T10:30:00`
		}, ...currentSubmissions]);
		persistCreateCaseFromIntake({ data: {
			intake: input,
			currentStaffId,
			caseId: newCaseId,
			intakeId: newIntakeId,
			personId: newPersonId
		} }).catch((error) => {
			console.error("Unable to persist intake conversion.", error);
		});
		return newCaseId;
	}
	function addNote(caseId, input) {
		if (!input.enrollmentId || !input.body.trim()) return;
		const noteId = `note-${Date.now()}`;
		setNotes((currentNotes) => [{
			id: noteId,
			caseId,
			enrollmentId: input.enrollmentId,
			authorId: currentStaffId,
			date: TODAY,
			contactType: input.contactType,
			summary: input.summary.trim() || "Case note",
			body: input.body.trim(),
			isSession: input.isSession,
			sessionHours: input.isSession ? input.sessionHours : void 0
		}, ...currentNotes]);
		setCases((currentCases) => currentCases.map((caseRecord) => caseRecord.id === caseId ? {
			...caseRecord,
			lastContact: TODAY
		} : caseRecord));
		persistAddNote({ data: {
			caseId,
			currentStaffId,
			note: input,
			noteId
		} }).catch((error) => {
			console.error("Unable to persist case note.", error);
		});
	}
	function editNote(noteId, input) {
		if (!input.enrollmentId || !input.body.trim()) return;
		setNotes((currentNotes) => currentNotes.map((note) => note.id === noteId ? {
			...note,
			enrollmentId: input.enrollmentId,
			contactType: input.contactType,
			summary: input.summary.trim() || "Case note",
			body: input.body.trim(),
			isSession: input.isSession,
			sessionHours: input.isSession ? input.sessionHours : void 0
		} : note));
		persistEditNote({ data: {
			noteId,
			note: input
		} }).catch((error) => {
			console.error("Unable to persist note edit.", error);
		});
	}
	function addConcreteService(caseId, input) {
		if (!input.enrollmentId || !input.description.trim() || input.amount <= 0) return;
		const caseRecord = cases.find((item) => item.id === caseId);
		if (!caseRecord) return;
		const enrollment = caseRecord?.enrollments.find((item) => item.id === input.enrollmentId);
		const program = enrollment ? getProgram(enrollment.programId) : void 0;
		const serviceId = `svc-${Date.now()}`;
		setServices((currentServices) => [{
			id: serviceId,
			caseId,
			enrollmentId: input.enrollmentId,
			date: TODAY,
			category: input.category,
			description: input.description.trim(),
			amount: input.amount,
			grantor: program?.grantor ?? "Private Foundation"
		}, ...currentServices]);
		persistAddConcreteService({ data: {
			caseRecord,
			currentStaffId,
			service: input,
			serviceId
		} }).catch((error) => {
			console.error("Unable to persist concrete service.", error);
		});
	}
	const value = useMemo(() => ({
		cases,
		notes,
		services,
		role,
		currentStaffId,
		staffChoices,
		visibleCases,
		intakeSubmissions,
		metrics,
		setRole,
		setCurrentStaffId,
		updateCaseStatus,
		updateEnrollment,
		addCaseworkerAssignment,
		removeCaseworkerAssignment,
		setPrimaryCaseworker,
		updateIntakeField,
		findIntakeMatches,
		createCaseFromIntake,
		addNote,
		editNote,
		addConcreteService
	}), [
		cases,
		currentStaffId,
		intakeSubmissions,
		metrics,
		notes,
		role,
		services,
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
