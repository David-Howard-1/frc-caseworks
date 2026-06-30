import {
	Box,
	Button,
	Group,
	NumberInput,
	Select,
	SimpleGrid,
	Stack,
	Table,
	TextInput,
} from "@mantine/core";
import { DollarSign } from "lucide-react";
import { formatDate, formatExactCurrency } from "~/domain/workspace";
import { EmptyState, ProgramBadge } from "../CaseworkUI";
import { serviceCategories } from "./constants";
import type {
	EnrollmentOption,
	EnrollmentPrograms,
	ProgramService,
	ServiceDraft,
} from "./types";

export function ConcreteServicesPortal({
	enrollmentOptions,
	enrollmentPrograms,
	isProgramFiltered,
	onAdd,
	onDraftChange,
	serviceDraft,
	services,
}: {
	enrollmentOptions: EnrollmentOption[];
	enrollmentPrograms: EnrollmentPrograms;
	isProgramFiltered: boolean;
	onAdd: () => void;
	onDraftChange: (draft: ServiceDraft) => void;
	serviceDraft: ServiceDraft;
	services: ProgramService[];
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
								enrollmentId: value ? Number(value) : "",
							})
						}
						value={
							serviceDraft.enrollmentId
								? String(serviceDraft.enrollmentId)
								: null
						}
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
													service.enrollmentId ?? 0
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
