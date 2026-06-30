import {
	Badge,
	Box,
	Button,
	Group,
	Modal,
	Select,
	Stack,
	Text,
	Textarea,
	Title,
} from "@mantine/core";
import type {
	CaseProgramEnrollment,
	ProgramStatus,
	Staff,
} from "~/domain/workspace";
import { programStatusOptions } from "./constants";
import type { EnrollmentOption } from "./types";

export function EnrollmentEditorModal({
	assignedCaseworkers,
	availableCaseworkers,
	caseworkerToAdd,
	enrollment,
	onAddCaseworker,
	onCaseworkerToAddChange,
	onClose,
	onGoalChange,
	onMakePrimary,
	onRemoveCaseworker,
	onStatusChange,
	opened,
}: {
	assignedCaseworkers: Array<{
		assignment: CaseProgramEnrollment["caseworkers"][number];
		staff: Staff | undefined;
	}>;
	availableCaseworkers: EnrollmentOption[];
	caseworkerToAdd: string | null;
	enrollment: CaseProgramEnrollment | undefined;
	onAddCaseworker: () => void;
	onCaseworkerToAddChange: (value: string | null) => void;
	onClose: () => void;
	onGoalChange: (goal: string) => void;
	onMakePrimary: (staffId: number) => void;
	onRemoveCaseworker: (staffId: number) => void;
	onStatusChange: (status: ProgramStatus) => void;
	opened: boolean;
}) {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			size='lg'
			title='Edit enrollment/program status'
		>
			{enrollment ? (
				<Stack gap='md'>
					<Select
						allowDeselect={false}
						data={programStatusOptions}
						label='Program status'
						onChange={(value) =>
							value ? onStatusChange(value as ProgramStatus) : undefined
						}
						value={enrollment.status}
					/>
					<Textarea
						autosize
						label='Program goal'
						minRows={3}
						value={enrollment.goal}
						onChange={(event) =>
							onGoalChange(event.currentTarget.value)
						}
					/>
					<Box className='rounded-md border border-slate-200 p-4'>
						<Group align='flex-end' justify='space-between'>
							<Box>
								<Title order={3} size='h5'>
									Assigned caseworkers
								</Title>
								<Text c='dimmed' size='sm'>
									Multiple workers can support this program;
									one is primary.
								</Text>
							</Box>
							<Group align='flex-end' gap='sm'>
								<Select
									data={availableCaseworkers}
									label='Add caseworker'
									onChange={onCaseworkerToAddChange}
									placeholder='Select worker'
									value={caseworkerToAdd}
									w={220}
								/>
								<Button
									disabled={!caseworkerToAdd}
									onClick={onAddCaseworker}
									radius={6}
								>
									Add
								</Button>
							</Group>
						</Group>

						<Stack gap='xs' mt='md'>
							{assignedCaseworkers.map(
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
														onMakePrimary(
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
													enrollment.caseworkers
														.length === 1
												}
												onClick={() =>
													onRemoveCaseworker(
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
	);
}
