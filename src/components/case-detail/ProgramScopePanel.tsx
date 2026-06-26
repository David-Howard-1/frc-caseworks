import {
	Badge,
	Box,
	Button,
	Group,
	Stack,
	Tabs,
	Text,
	Title,
} from "@mantine/core";
import { ClipboardList, DollarSign, FileText } from "lucide-react";
import type {
	CaseProgramEnrollment,
	ClientCase,
	Program,
} from "~/domain/demo-data";
import {
	formatDate,
	getPrimaryCaseworker,
	getProgram,
} from "~/domain/demo-data";
import {
	EmptyState,
	ProgramBadge,
	ProgramStatusBadge,
} from "../CaseworkUI";
import { ConcreteServicesPortal } from "./ConcreteServicesPortal";
import { ProgramNotesPortal } from "./ProgramNotesPortal";
import type {
	EnrollmentOption,
	EnrollmentPrograms,
	ProgramNote,
	ProgramService,
	ServiceDraft,
} from "./types";

export function ProgramScopePanel({
	caseRecord,
	enrollmentOptions,
	enrollmentPrograms,
	isProgramFiltered,
	onAddNote,
	onAddService,
	onDraftChange,
	onEditEnrollment,
	onEditNote,
	onProgramFilterChange,
	programId,
	programNotes,
	programServices,
	selectedEnrollment,
	selectedProgram,
	serviceDraft,
}: {
	caseRecord: ClientCase;
	enrollmentOptions: EnrollmentOption[];
	enrollmentPrograms: EnrollmentPrograms;
	isProgramFiltered: boolean;
	onAddNote: () => void;
	onAddService: () => void;
	onDraftChange: (draft: ServiceDraft) => void;
	onEditEnrollment: () => void;
	onEditNote: (note: ProgramNote) => void;
	onProgramFilterChange: (programId?: string) => void;
	programId?: string;
	programNotes: ProgramNote[];
	programServices: ProgramService[];
	selectedEnrollment: CaseProgramEnrollment | undefined;
	selectedProgram: Program | undefined;
	serviceDraft: ServiceDraft;
}) {
	return (
		<Box className='rounded-md border border-slate-200 bg-white p-4 shadow-sm'>
			<Group align='flex-start' justify='space-between'>
				<Box>
					<Title order={2} size='h4'>
						Program Enrollments
					</Title>
					<Text c='dimmed' size='sm'>
						All programs the client is enrolled in.
					</Text>
				</Box>
				<Group gap='xs'>
					{selectedProgram ? (
						<>
							<ProgramBadge program={selectedProgram} />
							<Button
								onClick={() => onProgramFilterChange(undefined)}
								radius={6}
								size='xs'
								variant='subtle'
							>
								Clear selected program
							</Button>
							<Button
								onClick={onEditEnrollment}
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
					<Stack
						className='overflow-hidden rounded-md border border-slate-200'
						gap={0}
						mt='md'
					>
						{caseRecord.enrollments.map((enrollment) => (
							<ProgramEnrollmentRow
								enrollment={enrollment}
								key={enrollment.id}
								onProgramFilterChange={onProgramFilterChange}
								selected={enrollment.programId === programId}
							/>
						))}
					</Stack>

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
								onAddNote={onAddNote}
								onEditNote={onEditNote}
							/>
						</Tabs.Panel>

						<Tabs.Panel value='services'>
							<ConcreteServicesPortal
								enrollmentOptions={enrollmentOptions}
								enrollmentPrograms={enrollmentPrograms}
								isProgramFiltered={isProgramFiltered}
								onAdd={onAddService}
								onDraftChange={onDraftChange}
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
	);
}

function ProgramEnrollmentRow({
	enrollment,
	onProgramFilterChange,
	selected,
}: {
	enrollment: CaseProgramEnrollment;
	onProgramFilterChange: (programId?: string) => void;
	selected: boolean;
}) {
	const program = getProgram(enrollment.programId);
	const primaryCaseworker = getPrimaryCaseworker(enrollment);

	return (
		<button
			className={[
				"relative w-full border-0 border-b border-slate-200 bg-white px-4 py-3 text-left transition last:border-b-0",
				selected
					? "bg-[#1C5380]/5 shadow-[inset_4px_0_0_#1C5380]"
					: "hover:bg-slate-50",
			].join(" ")}
			onClick={() => onProgramFilterChange(enrollment.programId)}
			type='button'
		>
			<Group align='center' justify='space-between' wrap='wrap'>
				<Group className='min-w-0 flex-1' gap='md' wrap='nowrap'>
					<ProgramBadge program={program} />
					<Box className='min-w-0'>
						<Text fw={700} truncate>
							{program?.name ?? "Program"}
						</Text>
						<Text c='dimmed' size='sm'>
							Enrolled: {formatDate(enrollment.opened)}
						</Text>
					</Box>
				</Group>

				<Group gap='lg' wrap='wrap'>
					<ProgramStatusBadge status={enrollment.status} />
					<Box className='min-w-36'>
						<Text c='dimmed' size='xs'>
							Primary caseworker
						</Text>
						<Text fw={700} size='sm'>
							{primaryCaseworker?.name ?? "Unassigned"}
						</Text>
					</Box>
					<Box className='min-w-24'>
						<Text c='dimmed' size='xs'>
							Assigned
						</Text>
						<Text fw={700} size='sm'>
							{enrollment.caseworkers.length} worker
							{enrollment.caseworkers.length === 1 ? "" : "s"}
						</Text>
					</Box>
				</Group>
			</Group>
		</button>
	);
}
