import { Box, Button, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import type { CaseStatus, Program } from "~/domain/demo-data";
import {
	getAssignedCaseworkers,
	getProgram,
	staff,
} from "~/domain/demo-data";
import { useDemoWorkspace } from "~/hooks/useDemoWorkspace";
import { roundToNearestQuarter } from "~/lib/util";
import { EmptyState } from "./CaseworkUI";
import { CaseHeader } from "./case-detail/CaseHeader";
import { ClientInfoModal } from "./case-detail/ClientInfoModal";
import { EnrollmentEditorModal } from "./case-detail/EnrollmentEditorModal";
import { NoteEditorModal } from "./case-detail/NoteEditorModal";
import { ProgramScopePanel } from "./case-detail/ProgramScopePanel";
import { RelatedPeoplePanel } from "./case-detail/RelatedPeoplePanel";
import {
	createEmptyNoteDraft,
	type NoteDraft,
	type ServiceDraft,
} from "./case-detail/types";

export function CaseDetail({
	caseId,
	onProgramFilterChange,
	programId,
}: {
	caseId: string;
	onProgramFilterChange: (programId?: string) => void;
	programId?: string;
}) {
	const {
		addCaseworkerAssignment,
		addConcreteService,
		addNote,
		cases,
		editNote,
		removeCaseworkerAssignment,
		notes,
		setPrimaryCaseworker,
		services,
		updateCaseStatus,
		updateEnrollment,
		visibleCases,
	} = useDemoWorkspace();
	const navigate = useNavigate();
	const [clientInfoOpen, clientInfoHandlers] = useDisclosure(false);
	const [enrollmentModalOpen, enrollmentModalHandlers] = useDisclosure(false);
	const [noteModalOpen, noteModalHandlers] = useDisclosure(false);
	const caseRecord = cases.find((item) => item.id === caseId);
	const [caseworkerToAdd, setCaseworkerToAdd] = useState<string | null>(null);
	const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
	const [noteError, setNoteError] = useState("");
	const [noteDraft, setNoteDraft] = useState<NoteDraft>(
		createEmptyNoteDraft(),
	);
	const [serviceDraft, setServiceDraft] = useState<ServiceDraft>({
		enrollmentId: "",
		category: "Family supplies",
		description: "",
		amount: "",
	});

	useEffect(() => {
		if (!caseRecord) {
			return;
		}

		const filteredEnrollment = caseRecord.enrollments.find(
			(enrollment) => enrollment.programId === programId,
		);
		const fallbackEnrollmentId =
			filteredEnrollment?.id ?? caseRecord.enrollments[0]?.id ?? "";

		setNoteDraft((current) =>
			editingNoteId || current.enrollmentId === fallbackEnrollmentId
				? current
				: { ...current, enrollmentId: fallbackEnrollmentId },
		);
		setServiceDraft((current) =>
			current.enrollmentId === fallbackEnrollmentId
				? current
				: { ...current, enrollmentId: fallbackEnrollmentId },
		);
		setCaseworkerToAdd(null);
	}, [caseRecord, editingNoteId, programId]);

	const canViewCase = visibleCases.some((item) => item.id === caseRecord?.id);
	const selectedEnrollment = caseRecord?.enrollments.find(
		(enrollment) => enrollment.programId === programId,
	);
	const selectedProgram = selectedEnrollment
		? getProgram(selectedEnrollment.programId)
		: undefined;
	const selectedAssignedCaseworkers = selectedEnrollment
		? getAssignedCaseworkers(selectedEnrollment)
		: [];
	const availableCaseworkers = selectedEnrollment
		? staff
				.filter(
					(person) =>
						person.role === "Caseworker" &&
						person.programs.includes(
							selectedEnrollment.programId,
						) &&
						!selectedEnrollment.caseworkers.some(
							(assignment) => assignment.staffId === person.id,
						),
				)
				.map((person) => ({
					value: person.id,
					label: person.name,
				}))
		: [];
	const enrollmentOptions =
		caseRecord?.enrollments.map((enrollment) => {
			const program = getProgram(enrollment.programId);
			return {
				value: enrollment.id,
				label: program?.name ?? enrollment.programId,
			};
		}) ?? [];
	const enrollmentPrograms =
		caseRecord?.enrollments.reduce<Record<string, Program | undefined>>(
			(result, enrollment) => ({
				...result,
				[enrollment.id]: getProgram(enrollment.programId),
			}),
			{},
		) ?? {};
	const programNotes = notes
		.filter(
			(note) =>
				note.caseId === caseRecord?.id &&
				(!selectedEnrollment ||
					note.enrollmentId === selectedEnrollment.id),
		)
		.sort((a, b) => b.date.localeCompare(a.date));
	const programServices = services
		.filter(
			(service) =>
				service.caseId === caseRecord?.id &&
				(!selectedEnrollment ||
					service.enrollmentId === selectedEnrollment.id),
		)
		.sort((a, b) => b.date.localeCompare(a.date));
	const caseServicesTotal = useMemo(
		() =>
			services
				.filter((service) => service.caseId === caseRecord?.id)
				.reduce((sum, service) => sum + service.amount, 0),
		[caseRecord?.id, services],
	);

	if (!caseRecord) {
		return (
			<Stack gap='md'>
				<Button
					component={Link}
					leftSection={<ArrowLeft size={16} />}
					radius={6}
					to='/cases'
					variant='subtle'
					w='fit-content'
				>
					Cases
				</Button>
				<EmptyState icon={ClipboardList} title='Case not found' />
			</Stack>
		);
	}

	const currentCase = caseRecord;

	function openAddNote() {
		const defaultEnrollmentId = selectedEnrollment?.id ?? "";

		setEditingNoteId(null);
		setNoteError("");
		setNoteDraft(createEmptyNoteDraft(defaultEnrollmentId));
		noteModalHandlers.open();
	}

	function openEditNote(note: (typeof notes)[number]) {
		setEditingNoteId(note.id);
		setNoteError("");
		setNoteDraft({
			enrollmentId: note.enrollmentId,
			contactType: note.contactType,
			summary: note.summary,
			body: note.body,
			isSession: note.isSession,
			sessionHours: note.sessionHours ?? 1,
		});
		noteModalHandlers.open();
	}

	function insertQuickNote(text: string) {
		setNoteDraft((current) => ({
			...current,
			body: current.body.trim()
				? `${current.body.trim()}\n${text}`
				: text,
			summary: current.summary || text,
		}));
	}

	function handleNoteEnrollmentChange(value: string | null) {
		setNoteDraft((current) => ({
			...current,
			enrollmentId: value ?? "",
		}));
	}

	function handleNoteContactTypeChange(value: string | null) {
		setNoteDraft((current) => ({
			...current,
			contactType: value ?? "Phone",
		}));
	}

	function handleNoteSummaryChange(event: ChangeEvent<HTMLInputElement>) {
		const { value } = event.currentTarget;

		setNoteDraft((current) => ({
			...current,
			summary: value,
		}));
	}

	function handleNoteSessionChange(event: ChangeEvent<HTMLInputElement>) {
		const { checked } = event.currentTarget;

		setNoteDraft((current) => ({
			...current,
			isSession: checked,
			sessionHours: checked ? current.sessionHours || 1 : "",
		}));
	}

	function handleNoteSessionHoursBlur() {
		setNoteDraft((current) => ({
			...current,
			sessionHours:
				typeof current.sessionHours === "number"
					? roundToNearestQuarter(current.sessionHours)
					: current.sessionHours,
		}));
	}

	function handleNoteSessionHoursChange(value: string | number) {
		setNoteDraft((current) => ({
			...current,
			sessionHours: typeof value === "number" ? value : "",
		}));
	}

	function handleNoteBodyChange(event: ChangeEvent<HTMLTextAreaElement>) {
		const { value } = event.currentTarget;

		setNoteDraft((current) => ({
			...current,
			body: value,
		}));
	}

	function handleSaveNote() {
		if (!noteDraft.enrollmentId) {
			setNoteError("Program is required.");
			return;
		}

		if (!noteDraft.body.trim()) {
			setNoteError("Note body is required.");
			return;
		}

		const sessionHours =
			typeof noteDraft.sessionHours === "number"
				? roundToNearestQuarter(noteDraft.sessionHours)
				: 0;

		if (noteDraft.isSession && sessionHours <= 0) {
			setNoteError("Hours are required for session notes.");
			return;
		}

		const input = {
			enrollmentId: noteDraft.enrollmentId,
			contactType: noteDraft.contactType,
			summary: noteDraft.summary,
			body: noteDraft.body,
			isSession: noteDraft.isSession,
			sessionHours: noteDraft.isSession ? sessionHours : undefined,
		};

		if (editingNoteId) {
			editNote(editingNoteId, input);
		} else {
			addNote(currentCase.id, input);
		}

		setEditingNoteId(null);
		setNoteError("");
		noteModalHandlers.close();
	}

	function handleAddService() {
		if (!serviceDraft.enrollmentId || serviceDraft.amount === "") {
			return;
		}

		addConcreteService(currentCase.id, {
			enrollmentId: serviceDraft.enrollmentId,
			category: serviceDraft.category,
			description: serviceDraft.description,
			amount: Number(serviceDraft.amount),
		});
		setServiceDraft((current) => ({
			...current,
			description: "",
			amount: "",
		}));
	}

	function handleAddCaseworker() {
		if (!selectedEnrollment || !caseworkerToAdd) {
			return;
		}

		addCaseworkerAssignment(
			currentCase.id,
			selectedEnrollment.id,
			caseworkerToAdd,
		);
		setCaseworkerToAdd(null);
	}

	return (
		<>
			<ClientInfoModal
				caseRecord={currentCase}
				onClose={clientInfoHandlers.close}
				opened={clientInfoOpen}
			/>

			<EnrollmentEditorModal
				assignedCaseworkers={selectedAssignedCaseworkers}
				availableCaseworkers={availableCaseworkers}
				caseworkerToAdd={caseworkerToAdd}
				enrollment={selectedEnrollment}
				onAddCaseworker={handleAddCaseworker}
				onCaseworkerToAddChange={setCaseworkerToAdd}
				onClose={enrollmentModalHandlers.close}
				onGoalChange={(goal) =>
					selectedEnrollment
						? updateEnrollment(currentCase.id, selectedEnrollment.id, {
								goal,
							})
						: undefined
				}
				onMakePrimary={(staffId) =>
					selectedEnrollment
						? setPrimaryCaseworker(
								currentCase.id,
								selectedEnrollment.id,
								staffId,
							)
						: undefined
				}
				onRemoveCaseworker={(staffId) =>
					selectedEnrollment
						? removeCaseworkerAssignment(
								currentCase.id,
								selectedEnrollment.id,
								staffId,
							)
						: undefined
				}
				onStatusChange={(status) =>
					selectedEnrollment
						? updateEnrollment(currentCase.id, selectedEnrollment.id, {
								status,
							})
						: undefined
				}
				opened={enrollmentModalOpen}
			/>

			<NoteEditorModal
				disabledProgramSelect={Boolean(selectedEnrollment)}
				draft={noteDraft}
				enrollmentOptions={enrollmentOptions}
				error={noteError}
				isEditing={Boolean(editingNoteId)}
				onBodyChange={handleNoteBodyChange}
				onCancel={noteModalHandlers.close}
				onClose={noteModalHandlers.close}
				onContactTypeChange={handleNoteContactTypeChange}
				onEnrollmentChange={handleNoteEnrollmentChange}
				onInsertQuickNote={insertQuickNote}
				onSave={handleSaveNote}
				onSessionChange={handleNoteSessionChange}
				onSessionHoursBlur={handleNoteSessionHoursBlur}
				onSessionHoursChange={handleNoteSessionHoursChange}
				onSummaryChange={handleNoteSummaryChange}
				opened={noteModalOpen}
			/>

			<Stack gap='lg'>
				<CaseHeader
					caseRecord={currentCase}
					concreteServicesTotal={caseServicesTotal}
					onOpenClientInfo={clientInfoHandlers.open}
					onStatusChange={(status: CaseStatus) =>
						updateCaseStatus(currentCase.id, status)
					}
				/>

				{!canViewCase ? (
					<Box className='rounded-md border border-yellow-200 bg-yellow-50 p-3'>
						<Text c='yellow' fw={700} size='sm'>
							This case is outside the current role scope.
						</Text>
					</Box>
				) : null}

				<ProgramScopePanel
					caseRecord={currentCase}
					enrollmentOptions={enrollmentOptions}
					enrollmentPrograms={enrollmentPrograms}
					isProgramFiltered={Boolean(selectedEnrollment)}
					onAddNote={openAddNote}
					onAddService={handleAddService}
					onDraftChange={setServiceDraft}
					onEditEnrollment={enrollmentModalHandlers.open}
					onEditNote={openEditNote}
					onProgramFilterChange={onProgramFilterChange}
					programId={programId}
					programNotes={programNotes}
					programServices={programServices}
					selectedEnrollment={selectedEnrollment}
					selectedProgram={selectedProgram}
					serviceDraft={serviceDraft}
				/>

				<RelatedPeoplePanel
					caseRecord={currentCase}
					onNavigateToCase={(linkedCaseId) =>
						navigate({
							to: "/cases/$caseId",
							params: { caseId: linkedCaseId },
						})
					}
				/>
			</Stack>
		</>
	);
}
