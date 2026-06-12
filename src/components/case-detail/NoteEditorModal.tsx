import {
	Box,
	Button,
	Checkbox,
	Group,
	Modal,
	NumberInput,
	Select,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	Textarea,
} from "@mantine/core";
import { Save } from "lucide-react";
import type { ChangeEvent } from "react";
import { quickNoteOptions } from "./constants";
import type { EnrollmentOption, NoteDraft } from "./types";

export function NoteEditorModal({
	disabledProgramSelect,
	draft,
	enrollmentOptions,
	error,
	isEditing,
	onBodyChange,
	onCancel,
	onClose,
	onContactTypeChange,
	onEnrollmentChange,
	onInsertQuickNote,
	onSave,
	onSessionChange,
	onSessionHoursBlur,
	onSessionHoursChange,
	onSummaryChange,
	opened,
}: {
	disabledProgramSelect: boolean;
	draft: NoteDraft;
	enrollmentOptions: EnrollmentOption[];
	error: string;
	isEditing: boolean;
	onBodyChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	onCancel: () => void;
	onClose: () => void;
	onContactTypeChange: (value: string | null) => void;
	onEnrollmentChange: (value: string | null) => void;
	onInsertQuickNote: (text: string) => void;
	onSave: () => void;
	onSessionChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onSessionHoursBlur: () => void;
	onSessionHoursChange: (value: string | number) => void;
	onSummaryChange: (event: ChangeEvent<HTMLInputElement>) => void;
	opened: boolean;
}) {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			size='lg'
			title={isEditing ? "Edit note" : "Add note"}
		>
			<Stack gap='md'>
				<SimpleGrid cols={{ base: 1, md: 2 }}>
					<Select
						allowDeselect={false}
						data={enrollmentOptions}
						disabled={disabledProgramSelect}
						error={
							error === "Program is required."
								? "Program is required"
								: undefined
						}
						label='Program'
						onChange={onEnrollmentChange}
						required
						value={draft.enrollmentId}
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
						onChange={onContactTypeChange}
						value={draft.contactType}
					/>
				</SimpleGrid>

				<TextInput
					label='Summary'
					value={draft.summary}
					onChange={onSummaryChange}
				/>

				<Stack>
					<Checkbox
						checked={draft.isSession}
						label='Session?'
						onChange={onSessionChange}
					/>
					<NumberInput
						decimalScale={2}
						disabled={!draft.isSession}
						error={
							error === "Hours are required for session notes."
								? "Required for sessions"
								: undefined
						}
						fixedDecimalScale
						label='Hours'
						min={0.25}
						onBlur={onSessionHoursBlur}
						onChange={onSessionHoursChange}
						required={draft.isSession}
						step={0.25}
						value={draft.sessionHours}
						w={140}
					/>
				</Stack>

				<Box>
					<Text c='dimmed' fw={700} size='sm' mb={6} tt='uppercase'>
						Quick notes
					</Text>
					<Group gap='xs'>
						{quickNoteOptions.map((option) => (
							<Button
								key={option}
								onClick={() => onInsertQuickNote(option)}
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
						error === "Note body is required."
							? "Note body is required"
							: undefined
					}
					label='Note'
					minRows={5}
					onChange={onBodyChange}
					required
					value={draft.body}
				/>

				{error &&
				![
					"Program is required.",
					"Note body is required.",
					"Hours are required for session notes.",
				].includes(error) ? (
					<Text c='red' size='sm'>
						{error}
					</Text>
				) : null}

				<Group justify='flex-end'>
					<Button onClick={onCancel} radius={6} variant='subtle'>
						Cancel
					</Button>
					<Button
						leftSection={<Save size={17} />}
						onClick={onSave}
						radius={6}
					>
						Save note
					</Button>
				</Group>
			</Stack>
		</Modal>
	);
}
