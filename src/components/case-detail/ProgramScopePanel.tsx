import { Badge, Box, Button, Group, SimpleGrid, Tabs, Text, Title } from "@mantine/core";
import { ClipboardList, DollarSign, FileText } from "lucide-react";
import type {
	CaseProgramEnrollment,
	ClientCase,
	Program,
} from "~/domain/demo-data";
import { getPrimaryCaseworker, getProgram } from "~/domain/demo-data";
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
						Program scope
					</Title>
					<Text c='dimmed' size='sm'>
						Notes and concrete services follow the selected program.
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
					<SimpleGrid cols={{ base: 1, lg: 3 }} mt='md'>
						{caseRecord.enrollments.map((enrollment) => (
							<ProgramEnrollmentCard
								enrollment={enrollment}
								key={enrollment.id}
								onProgramFilterChange={onProgramFilterChange}
								selected={enrollment.programId === programId}
							/>
						))}
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

function ProgramEnrollmentCard({
	enrollment,
	onProgramFilterChange,
	selected,
}: {
	enrollment: CaseProgramEnrollment;
	onProgramFilterChange: (programId?: string) => void;
	selected: boolean;
}) {
	const program = getProgram(enrollment.programId);

	return (
		<button
			className={[
				"rounded-md border bg-white p-3 text-left transition",
				selected
					? "border-[#1C5380] ring-2 ring-[#1C5380]/15"
					: "border-slate-200 hover:border-slate-300",
			].join(" ")}
			onClick={() => onProgramFilterChange(enrollment.programId)}
			type='button'
		>
			<Group justify='space-between'>
				<ProgramBadge program={program} />
				<ProgramStatusBadge status={enrollment.status} />
			</Group>
			<Text fw={700} mt='sm'>
				{program?.name}
			</Text>
			<Text c='dimmed' size='sm'>
				Primary: {getPrimaryCaseworker(enrollment)?.name ?? "Unassigned"}
			</Text>
			<Text c='dimmed' size='sm'>
				{enrollment.caseworkers.length} assigned caseworker
				{enrollment.caseworkers.length === 1 ? "" : "s"}
			</Text>
		</button>
	);
}
