import {
	ActionIcon,
	Badge,
	Box,
	Button,
	Checkbox,
	Group,
	Modal,
	NumberInput,
	Select,
	SimpleGrid,
	Stack,
	Table,
	Tabs,
	Text,
	TextInput,
	Textarea,
	Title,
	Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	ClipboardList,
	DollarSign,
	FileText,
	Pencil,
	Plus,
	Save,
	UserRound,
	UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import type { CaseStatus, Program, ProgramStatus } from "~/domain/demo-data";
import {
	formatDate,
	formatExactCurrency,
	getAssignedCaseworkers,
	getPrimaryCaseworker,
	getProgram,
	getStaff,
	staff,
} from "~/domain/demo-data";
import { useDemoWorkspace } from "~/hooks/useDemoWorkspace";
import {
	CaseStatusBadge,
	EmptyState,
	ProgramBadge,
	ProgramStatusBadge,
	RiskBadge,
} from "./CaseworkUI";
import { roundToNearestQuarter } from "~/lib/util";

const caseStatusOptions: CaseStatus[] = ["Open", "Pending", "Closed"];
const programStatusOptions: ProgramStatus[] = [
	"Active",
	"Pending",
	"Completed",
	"Inactive",
	"Waitlisted",
];
const serviceCategories = [
	"Family supplies",
	"Medication",
	"Training",
	"Work supports",
	"Transportation",
	"Housing",
];

const quickNoteOptions = ["Left Voicemail", "Text Sent", "Unable to Contact"];

type NoteDraft = {
	enrollmentId: string;
	contactType: string;
	summary: string;
	body: string;
	isSession: boolean;
	sessionHours: number | "";
};

function createEmptyNoteDraft(enrollmentId = ""): NoteDraft {
	return {
		enrollmentId,
		contactType: "Phone",
		summary: "",
		body: "",
		isSession: true,
		sessionHours: "",
	};
}

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
	const [serviceDraft, setServiceDraft] = useState<{
		enrollmentId: string;
		category: string;
		description: string;
		amount: number | "";
	}>({
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
			addNote(caseRecord!.id, input);
		}

		setEditingNoteId(null);
		setNoteError("");
		noteModalHandlers.close();
	}

	function handleAddService() {
		if (!serviceDraft.enrollmentId || serviceDraft.amount === "") {
			return;
		}

		addConcreteService(caseRecord!.id, {
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

	return (
		<>
			<Modal
				opened={clientInfoOpen}
				onClose={clientInfoHandlers.close}
				title='Client information'
			>
				<Stack gap='sm'>
					<InfoLine label='Name' value={caseRecord.displayName} />
					<InfoLine
						label='Pronouns'
						value={caseRecord.pronouns ?? "Not set"}
					/>
					<InfoLine label='Age' value={caseRecord.age.toString()} />
					<InfoLine label='County' value={caseRecord.county} />
					<InfoLine
						label='Phone'
						value={caseRecord.intake.phone ?? "Not set"}
					/>
					<InfoLine
						label='Email'
						value={caseRecord.intake.email ?? "Not set"}
					/>
					<InfoLine
						label='Referral source'
						value={caseRecord.intake.referralSource ?? "Not set"}
					/>
					<InfoLine
						label='Household income'
						value={caseRecord.intake.householdIncome ?? "Not set"}
					/>
					<InfoLine
						label='Housing'
						value={caseRecord.intake.housing ?? "Not set"}
					/>
				</Stack>
			</Modal>

			<Modal
				opened={enrollmentModalOpen}
				onClose={enrollmentModalHandlers.close}
				size='lg'
				title='Edit enrollment/program status'
			>
				{selectedEnrollment ? (
					<Stack gap='md'>
						<Select
							allowDeselect={false}
							data={programStatusOptions}
							label='Program status'
							onChange={(value) =>
								value
									? updateEnrollment(
											caseRecord.id,
											selectedEnrollment.id,
											{
												status: value as ProgramStatus,
											},
										)
									: undefined
							}
							value={selectedEnrollment.status}
						/>
						<Textarea
							autosize
							label='Program goal'
							minRows={3}
							value={selectedEnrollment.goal}
							onChange={(event) =>
								updateEnrollment(
									caseRecord.id,
									selectedEnrollment.id,
									{
										goal: event.currentTarget.value,
									},
								)
							}
						/>
						<Box className='rounded-md border border-slate-200 p-4'>
							<Group align='flex-end' justify='space-between'>
								<Box>
									<Title order={3} size='h5'>
										Assigned caseworkers
									</Title>
									<Text c='dimmed' size='sm'>
										Multiple workers can support this
										program; one is primary.
									</Text>
								</Box>
								<Group align='flex-end' gap='sm'>
									<Select
										data={availableCaseworkers}
										label='Add caseworker'
										onChange={setCaseworkerToAdd}
										placeholder='Select worker'
										value={caseworkerToAdd}
										w={220}
									/>
									<Button
										disabled={!caseworkerToAdd}
										onClick={() => {
											if (!caseworkerToAdd) {
												return;
											}
											addCaseworkerAssignment(
												caseRecord.id,
												selectedEnrollment.id,
												caseworkerToAdd,
											);
											setCaseworkerToAdd(null);
										}}
										radius={6}
									>
										Add
									</Button>
								</Group>
							</Group>

							<Stack gap='xs' mt='md'>
								{selectedAssignedCaseworkers.map(
									({ assignment, staff: assignedStaff }) => (
										<Group
											className='rounded-md border border-slate-200 p-3'
											justify='space-between'
											key={assignment.staffId}
										>
											<Box>
												<Group gap='xs'>
													<Text fw={700}>
														{assignedStaff?.name ??
															assignment.staffId}
													</Text>
													{assignment.isPrimary ? (
														<Badge color='frcBlue'>
															Primary
														</Badge>
													) : null}
												</Group>
												<Text c='dimmed' size='sm'>
													Caseworker
												</Text>
											</Box>
											<Group gap='xs'>
												{!assignment.isPrimary ? (
													<Button
														onClick={() =>
															setPrimaryCaseworker(
																caseRecord.id,
																selectedEnrollment.id,
																assignment.staffId,
															)
														}
														radius={6}
														size='xs'
														variant='light'
													>
														Make primary
													</Button>
												) : null}
												<Button
													color='red'
													disabled={
														selectedEnrollment
															.caseworkers
															.length === 1
													}
													onClick={() =>
														removeCaseworkerAssignment(
															caseRecord.id,
															selectedEnrollment.id,
															assignment.staffId,
														)
													}
													radius={6}
													size='xs'
													variant='subtle'
												>
													Remove
												</Button>
											</Group>
										</Group>
									),
								)}
							</Stack>
						</Box>
					</Stack>
				) : null}
			</Modal>

			<Modal
				opened={noteModalOpen}
				onClose={noteModalHandlers.close}
				size='lg'
				title={editingNoteId ? "Edit note" : "Add note"}
			>
				<Stack gap='md'>
					<SimpleGrid cols={{ base: 1, md: 2 }}>
						<Select
							allowDeselect={false}
							data={enrollmentOptions}
							disabled={Boolean(selectedEnrollment)}
							error={
								noteError === "Program is required."
									? "Program is required"
									: undefined
							}
							label='Program'
							onChange={handleNoteEnrollmentChange}
							required
							value={noteDraft.enrollmentId}
						/>
						<Select
							allowDeselect={false}
							data={[
								"Phone",
								"Home visit",
								"Office visit",
								"Service coordination",
								"Closure",
							]}
							label='Contact'
							onChange={handleNoteContactTypeChange}
							value={noteDraft.contactType}
						/>
					</SimpleGrid>

					<TextInput
						label='Summary'
						value={noteDraft.summary}
						onChange={handleNoteSummaryChange}
					/>

					<Stack>
						<Checkbox
							checked={noteDraft.isSession}
							label='Session?'
							onChange={handleNoteSessionChange}
						/>
						<NumberInput
							decimalScale={2}
							disabled={!noteDraft.isSession}
							error={
								noteError ===
								"Hours are required for session notes."
									? "Required for sessions"
									: undefined
							}
							fixedDecimalScale
							label='Hours'
							min={0.25}
							onBlur={handleNoteSessionHoursBlur}
							onChange={handleNoteSessionHoursChange}
							required={noteDraft.isSession}
							step={0.25}
							value={noteDraft.sessionHours}
							w={140}
						/>
					</Stack>

					<Box>
						<Text
							c='dimmed'
							fw={700}
							size='sm'
							mb={6}
							tt='uppercase'
						>
							Quick notes
						</Text>
						<Group gap='xs'>
							{quickNoteOptions.map((option) => (
								<Button
									key={option}
									onClick={() => insertQuickNote(option)}
									radius={6}
									size='xs'
									variant='light'
								>
									{option}
								</Button>
							))}
						</Group>
					</Box>

					<Textarea
						autosize
						error={
							noteError === "Note body is required."
								? "Note body is required"
								: undefined
						}
						label='Note'
						minRows={5}
						onChange={handleNoteBodyChange}
						required
						value={noteDraft.body}
					/>

					{noteError &&
					![
						"Program is required.",
						"Note body is required.",
						"Hours are required for session notes.",
					].includes(noteError) ? (
						<Text c='red' size='sm'>
							{noteError}
						</Text>
					) : null}

					<Group justify='flex-end'>
						<Button
							onClick={noteModalHandlers.close}
							radius={6}
							variant='subtle'
						>
							Cancel
						</Button>
						<Button
							leftSection={<Save size={17} />}
							onClick={handleSaveNote}
							radius={6}
						>
							Save note
						</Button>
					</Group>
				</Stack>
			</Modal>

			<Stack gap='lg'>
				<Group align='flex-start' justify='space-between'>
					<Stack gap={6}>
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
						<Group gap='xs'>
							<Title order={1} size='h2'>
								{caseRecord.displayName}
							</Title>
							<CaseStatusBadge status={caseRecord.status} />
						</Group>
						<Text c='dimmed'>
							{caseRecord.id} - Last contact{" "}
							{formatDate(caseRecord.lastContact)}
						</Text>
					</Stack>
					<Button
						leftSection={<UserRound size={17} />}
						onClick={clientInfoHandlers.open}
						radius={6}
						variant='light'
					>
						Client info
					</Button>
				</Group>

				{!canViewCase ? (
					<Box className='rounded-md border border-yellow-200 bg-yellow-50 p-3'>
						<Text c='yellow' fw={700} size='sm'>
							This case is outside the current role scope.
						</Text>
					</Box>
				) : null}

				<Box className='rounded-md border border-slate-200 bg-white p-4 shadow-sm'>
					<Group align='center' justify='space-between'>
						<Title order={2} size='h4'>
							Case status
						</Title>
						<RiskBadge risk={caseRecord.risk} />
					</Group>
					<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mt='md'>
						<Box className='rounded-md border border-slate-200 p-3'>
							<Select
								allowDeselect={false}
								data={caseStatusOptions}
								label='Overall status'
								onChange={(value) =>
									value
										? updateCaseStatus(
												caseRecord.id,
												value as CaseStatus,
											)
										: undefined
								}
								value={caseRecord.status}
							/>
						</Box>
						<StatusTile
							label='Opened'
							value={formatDate(caseRecord.opened)}
						/>
						<StatusTile
							label='Last contact'
							value={formatDate(caseRecord.lastContact)}
						/>
						<StatusTile
							label='Concrete services'
							value={formatExactCurrency(caseServicesTotal)}
						/>
					</SimpleGrid>
				</Box>

				<Box className='rounded-md border border-slate-200 bg-white p-4 shadow-sm'>
					<Group align='flex-start' justify='space-between'>
						<Box>
							<Title order={2} size='h4'>
								Program scope
							</Title>
							<Text c='dimmed' size='sm'>
								Notes and concrete services follow the selected
								program.
							</Text>
						</Box>
						<Group gap='xs'>
							{selectedProgram ? (
								<>
									<ProgramBadge program={selectedProgram} />
									<Button
										onClick={() =>
											onProgramFilterChange(undefined)
										}
										radius={6}
										size='xs'
										variant='subtle'
									>
										Clear selected program
									</Button>
									<Button
										onClick={enrollmentModalHandlers.open}
										radius={6}
										size='xs'
										variant='light'
									>
										Edit enrollment
									</Button>
								</>
							) : (
								<Badge color='gray' variant='light'>
									All programs
								</Badge>
							)}
						</Group>
					</Group>

					{caseRecord.enrollments.length > 0 ? (
						<>
							<SimpleGrid cols={{ base: 1, lg: 3 }} mt='md'>
								{caseRecord.enrollments.map((enrollment) => {
									const program = getProgram(
										enrollment.programId,
									);
									const selected =
										enrollment.programId === programId;

									return (
										<button
											className={[
												"rounded-md border bg-white p-3 text-left transition",
												selected
													? "border-[#1C5380] ring-2 ring-[#1C5380]/15"
													: "border-slate-200 hover:border-slate-300",
											].join(" ")}
											key={enrollment.id}
											onClick={() =>
												onProgramFilterChange(
													enrollment.programId,
												)
											}
											type='button'
										>
											<Group justify='space-between'>
												<ProgramBadge
													program={program}
												/>
												<ProgramStatusBadge
													status={enrollment.status}
												/>
											</Group>
											<Text fw={700} mt='sm'>
												{program?.name}
											</Text>
											<Text c='dimmed' size='sm'>
												Primary:{" "}
												{getPrimaryCaseworker(
													enrollment,
												)?.name ?? "Unassigned"}
											</Text>
											<Text c='dimmed' size='sm'>
												{enrollment.caseworkers.length}{" "}
												assigned caseworker
												{enrollment.caseworkers
													.length === 1
													? ""
													: "s"}
											</Text>
										</button>
									);
								})}
							</SimpleGrid>

							<Tabs
								color='frcBlue'
								defaultValue='notes'
								keepMounted={false}
								mt='lg'
							>
								<Tabs.List>
									<Tabs.Tab
										leftSection={<FileText size={16} />}
										value='notes'
									>
										Notes
									</Tabs.Tab>
									<Tabs.Tab
										leftSection={<DollarSign size={16} />}
										value='services'
									>
										Concrete services
									</Tabs.Tab>
								</Tabs.List>

								<Tabs.Panel value='notes'>
									<ProgramNotesPortal
										enrollmentPrograms={enrollmentPrograms}
										notes={programNotes}
										onAddNote={openAddNote}
										onEditNote={openEditNote}
									/>
								</Tabs.Panel>

								<Tabs.Panel value='services'>
									<ConcreteServicesPortal
										enrollmentOptions={enrollmentOptions}
										enrollmentPrograms={enrollmentPrograms}
										isProgramFiltered={Boolean(
											selectedEnrollment,
										)}
										onAdd={handleAddService}
										onDraftChange={setServiceDraft}
										serviceDraft={serviceDraft}
										services={programServices}
									/>
								</Tabs.Panel>
							</Tabs>
						</>
					) : (
						<Box mt='md'>
							<EmptyState
								icon={ClipboardList}
								title='No programs assigned to this case'
							/>
						</Box>
					)}
				</Box>

				<Box className='rounded-md border border-slate-200 bg-white p-4 shadow-sm'>
					<Group justify='space-between'>
						<Title order={2} size='h4'>
							Related people
						</Title>
						<Badge
							leftSection={<UsersRound size={14} />}
							variant='light'
						>
							{caseRecord.relatedPeople.length}
						</Badge>
					</Group>
					<Table.ScrollContainer minWidth={620} mt='md'>
						<Table verticalSpacing='sm'>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Name</Table.Th>
									<Table.Th>Relationship</Table.Th>
									<Table.Th>Age</Table.Th>
									<Table.Th>Household</Table.Th>
									<Table.Th>Linked case</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{caseRecord.relatedPeople.map((person) => (
									<Table.Tr key={person.id}>
										<Table.Td fw={700}>
											{person.name}
										</Table.Td>
										<Table.Td>
											{person.relationship}
										</Table.Td>
										<Table.Td>{person.age}</Table.Td>
										<Table.Td>
											{person.inHousehold ? "Yes" : "No"}
										</Table.Td>
										<Table.Td>
											{person.linkedCaseId ? (
												<Button
													onClick={() =>
														navigate({
															to: "/cases/$caseId",
															params: {
																caseId: person.linkedCaseId!,
															},
														})
													}
													radius={6}
													size='xs'
													variant='light'
												>
													{person.linkedCaseId}
												</Button>
											) : (
												<Text c='dimmed' size='sm'>
													None
												</Text>
											)}
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</Table.ScrollContainer>
				</Box>
			</Stack>
		</>
	);
}

type ProgramNotesPortalNote = {
	id: string;
	caseId: string;
	enrollmentId: string;
	authorId: string;
	contactType: string;
	date: string;
	summary: string;
	body: string;
	isSession: boolean;
	sessionHours?: number;
};

function ProgramNotesPortal({
	enrollmentPrograms,
	notes,
	onAddNote,
	onEditNote,
}: {
	enrollmentPrograms: Record<string, Program | undefined>;
	notes: ProgramNotesPortalNote[];
	onAddNote: () => void;
	onEditNote: (note: ProgramNotesPortalNote) => void;
}) {
	return (
		<Stack gap='md' mt='md'>
			<Group justify='space-between'>
				<Box>
					<Title order={3} size='h5'>
						Case notes
					</Title>
					<Text c='dimmed' size='sm'>
						Notes can be filtered by program scope.
					</Text>
				</Box>
				<Button
					leftSection={<Plus size={17} />}
					onClick={onAddNote}
					radius={6}
				>
					Add note
				</Button>
			</Group>

			{notes.length > 0 ? (
				notes.map((note) => (
					<Box
						className='rounded-md border border-slate-200 p-4'
						key={note.id}
					>
						<Group align='flex-start' justify='space-between'>
							<Box>
								<Group gap='xs'>
									<ProgramBadge
										program={
											enrollmentPrograms[
												note.enrollmentId
											]
										}
									/>
									<Text fw={700}>{note.summary}</Text>
									{note.isSession ? (
										<Badge color='green' variant='light'>
											Session {note.sessionHours ?? 0} hr
										</Badge>
									) : (
										<Badge color='gray' variant='light'>
											Non-session
										</Badge>
									)}
								</Group>
								<Text c='dimmed' mt={4} size='sm'>
									{note.contactType} -{" "}
									{getStaff(note.authorId)?.name}
								</Text>
							</Box>
							<Group gap='xs' wrap='nowrap'>
								<Text c='dimmed' size='sm'>
									{formatDate(note.date)}
								</Text>
								<Tooltip label='Edit note'>
									<ActionIcon
										aria-label='Edit note'
										onClick={() => onEditNote(note)}
										radius={6}
										variant='subtle'
									>
										<Pencil size={16} />
									</ActionIcon>
								</Tooltip>
							</Group>
						</Group>
						<Text mt='sm'>{note.body}</Text>
					</Box>
				))
			) : (
				<EmptyState icon={FileText} title='No notes for this program' />
			)}
		</Stack>
	);
}

function ConcreteServicesPortal({
	enrollmentOptions,
	enrollmentPrograms,
	isProgramFiltered,
	onAdd,
	onDraftChange,
	serviceDraft,
	services,
}: {
	enrollmentOptions: Array<{ value: string; label: string }>;
	enrollmentPrograms: Record<string, Program | undefined>;
	isProgramFiltered: boolean;
	onAdd: () => void;
	onDraftChange: (draft: {
		enrollmentId: string;
		category: string;
		description: string;
		amount: number | "";
	}) => void;
	serviceDraft: {
		enrollmentId: string;
		category: string;
		description: string;
		amount: number | "";
	};
	services: Array<{
		id: string;
		enrollmentId: string;
		date: string;
		category: string;
		description: string;
		amount: number;
	}>;
}) {
	return (
		<Stack gap='md' mt='md'>
			<Box className='rounded-md border border-slate-200 p-4'>
				<SimpleGrid cols={{ base: 1, md: 4 }}>
					<Select
						allowDeselect={false}
						data={enrollmentOptions}
						disabled={isProgramFiltered}
						label='Program'
						onChange={(value) =>
							onDraftChange({
								...serviceDraft,
								enrollmentId: value ?? "",
							})
						}
						value={serviceDraft.enrollmentId}
					/>
					<Select
						allowDeselect={false}
						data={serviceCategories}
						label='Category'
						onChange={(value) =>
							onDraftChange({
								...serviceDraft,
								category: value ?? "Family supplies",
							})
						}
						value={serviceDraft.category}
					/>
					<TextInput
						label='Description'
						value={serviceDraft.description}
						onChange={(event) =>
							onDraftChange({
								...serviceDraft,
								description: event.currentTarget.value,
							})
						}
					/>
					<NumberInput
						decimalScale={2}
						fixedDecimalScale
						label='Amount'
						min={0}
						prefix='$'
						value={serviceDraft.amount}
						onChange={(value) =>
							onDraftChange({
								...serviceDraft,
								amount: typeof value === "number" ? value : "",
							})
						}
					/>
				</SimpleGrid>
				<Group justify='flex-end' mt='md'>
					<Button
						leftSection={<DollarSign size={17} />}
						onClick={onAdd}
						radius={6}
					>
						Add service
					</Button>
				</Group>
			</Box>

			{services.length > 0 ? (
				<Table.ScrollContainer minWidth={760}>
					<Table verticalSpacing='sm'>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Date</Table.Th>
								<Table.Th>Program</Table.Th>
								<Table.Th>Category</Table.Th>
								<Table.Th>Description</Table.Th>
								<Table.Th ta='right'>Amount</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{services.map((service) => (
								<Table.Tr key={service.id}>
									<Table.Td>
										{formatDate(service.date)}
									</Table.Td>
									<Table.Td>
										<ProgramBadge
											program={
												enrollmentPrograms[
													service.enrollmentId
												]
											}
										/>
									</Table.Td>
									<Table.Td>{service.category}</Table.Td>
									<Table.Td>{service.description}</Table.Td>
									<Table.Td ta='right'>
										{formatExactCurrency(service.amount)}
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Table.ScrollContainer>
			) : (
				<EmptyState
					icon={DollarSign}
					title='No concrete services for this program'
				/>
			)}
		</Stack>
	);
}

function StatusTile({ label, value }: { label: string; value: string }) {
	return (
		<Box className='rounded-md border border-slate-200 p-3'>
			<Text c='dimmed' fw={700} size='sm' tt='uppercase'>
				{label}
			</Text>
			<Text fw={700} mt={6}>
				{value}
			</Text>
		</Box>
	);
}

function InfoLine({ label, value }: { label: string; value: string }) {
	return (
		<Group justify='space-between' wrap='nowrap'>
			<Text c='dimmed' size='sm'>
				{label}
			</Text>
			<Text fw={700} ta='right'>
				{value}
			</Text>
		</Group>
	);
}
