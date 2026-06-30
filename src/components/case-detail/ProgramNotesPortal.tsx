import { ActionIcon, Badge, Box, Button, Group, Stack, Text, Title, Tooltip } from "@mantine/core";
import { FileText, Pencil, Plus } from "lucide-react";
import type { Staff } from "~/domain/workspace";
import { formatDate, getStaff } from "~/domain/workspace";
import { EmptyState, ProgramBadge } from "../CaseworkUI";
import type { EnrollmentPrograms, ProgramNote } from "./types";

export function ProgramNotesPortal({
	enrollmentPrograms,
	notes,
	onAddNote,
	onEditNote,
	staff,
}: {
	enrollmentPrograms: EnrollmentPrograms;
	notes: ProgramNote[];
	onAddNote: () => void;
	onEditNote: (note: ProgramNote) => void;
	staff: Staff[];
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
											note.enrollmentId
												? enrollmentPrograms[note.enrollmentId]
												: undefined
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
									{getStaff(staff, note.authorId)?.name}
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
