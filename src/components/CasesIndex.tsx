import {
	Box,
	Group,
	Pagination,
	Select,
	Stack,
	Table,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CaseStatus } from "~/domain/workspace";
import {
	formatDate,
	getProgram,
} from "~/domain/workspace";
import { useDemoWorkspace } from "~/hooks/useDemoWorkspace";
import {
	CaseStatusBadge,
	EmptyState,
	ProgramBadge,
	RiskBadge,
} from "./CaseworkUI";

const PAGE_SIZE = 20;
const caseStatusOptions: Array<"All" | CaseStatus> = [
	"All",
	"Open",
	"Pending",
	"Closed",
];

export function CasesIndex() {
	const { cases, currentStaffId, programs, role, visibleCases } = useDemoWorkspace();
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"All" | CaseStatus>("All");
	const [page, setPage] = useState(1);
	const [programId, setProgramId] = useState<number | null>(null);

	const supervisorPrograms = useMemo(
		() =>
			programs.filter(
				(program) => program.supervisorId === currentStaffId,
			),
		[currentStaffId],
	);

	useEffect(() => {
		if (role !== "Program Supervisor") {
			setProgramId(null);
			return;
		}

		if (
			supervisorPrograms.length > 0 &&
			!supervisorPrograms.some((program) => program.id === programId)
		) {
			setProgramId(supervisorPrograms[0].id);
		}
	}, [programId, role, supervisorPrograms]);

	const scopedCases = useMemo(() => {
		if (role !== "Program Supervisor" || !programId) {
			return visibleCases;
		}

		return cases.filter((caseRecord) =>
			caseRecord.enrollments.some(
				(enrollment) =>
					enrollment.programId === programId &&
					enrollment.supervisorId === currentStaffId,
			),
		);
	}, [cases, currentStaffId, programId, role, visibleCases]);

	const filteredCases = useMemo(() => {
		const loweredQuery = query.trim().toLowerCase();

		return scopedCases.filter((caseRecord) => {
			const matchesStatus =
				statusFilter === "All" || caseRecord.status === statusFilter;
			const matchesQuery =
				!loweredQuery ||
				caseRecord.displayName.toLowerCase().includes(loweredQuery) ||
				String(caseRecord.id).toLowerCase().includes(loweredQuery) ||
				caseRecord.county.toLowerCase().includes(loweredQuery);

			return matchesStatus && matchesQuery;
		});
	}, [query, scopedCases, statusFilter]);

	useEffect(() => {
		setPage(1);
	}, [programId, query, statusFilter]);

	const totalPages = Math.max(1, Math.ceil(filteredCases.length / PAGE_SIZE));
	const pageCases = filteredCases.slice(
		(page - 1) * PAGE_SIZE,
		page * PAGE_SIZE,
	);
	const activeProgram = programId ? getProgram(programs, programId) : undefined;

	return (
		<Stack gap='lg'>
			<Group align='flex-start' justify='space-between'>
				<Box>
					<Text c='dimmed' fw={700} size='sm' tt='uppercase'>
						Cases
					</Text>
					<Title order={1} size='h2'>
						{role === "Caseworker"
							? "Assigned cases"
							: role === "Program Supervisor"
								? (activeProgram?.name ?? "Program cases")
								: "All cases"}
					</Title>
					<Text c='dimmed' mt={4}>
						{filteredCases.length} case
						{filteredCases.length === 1 ? "" : "s"} - 20 per page
					</Text>
				</Box>
			</Group>

			<Box className='rounded-md border border-slate-200 bg-white p-4 shadow-sm'>
				<Group align='flex-end' gap='sm'>
					<TextInput
						className='min-w-60 flex-1'
						leftSection={<Search size={16} />}
						label='Search'
						placeholder='Name, case ID, county'
						value={query}
						onChange={(event) =>
							setQuery(event.currentTarget.value)
						}
					/>
					<Select
						allowDeselect={false}
						data={caseStatusOptions}
						label='Status'
						onChange={(value) =>
							setStatusFilter(
								(value ?? "All") as "All" | CaseStatus,
							)
						}
						value={statusFilter}
						w={150}
					/>
					{role === "Program Supervisor" ? (
						<Select
							allowDeselect={false}
							data={supervisorPrograms.map((program) => ({
				value: String(program.id),
				label: program.name,
			}))}
							label='Program'
							onChange={(value) =>
								setProgramId(value ? Number(value) : null)
							}
							value={programId ? String(programId) : null}
							w={260}
						/>
					) : null}
				</Group>

				{pageCases.length > 0 ? (
					<>
						<Table.ScrollContainer minWidth={780} mt='md'>
							<Table highlightOnHover verticalSpacing='sm'>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Client</Table.Th>
										<Table.Th>Status</Table.Th>
										<Table.Th>Programs</Table.Th>
										<Table.Th>Last contact</Table.Th>
										<Table.Th>Risk</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{pageCases.map((caseRecord) => (
										<Table.Tr
											className='cursor-pointer'
											key={caseRecord.id}
											onClick={() =>
												navigate({
													to: "/cases/$caseId",
													params: {
														caseId: String(caseRecord.id),
													},
												})
											}
											role='link'
											tabIndex={0}
											onKeyDown={(event) => {
												if (
													event.key === "Enter" ||
													event.key === " "
												) {
													event.preventDefault();
													navigate({
														to: "/cases/$caseId",
														params: {
															caseId: String(caseRecord.id),
														},
													});
												}
											}}
										>
											<Table.Td>
												<Text fw={700}>
													{caseRecord.displayName}
												</Text>
												<Text c='dimmed' size='sm'>
													{caseRecord.id} -{" "}
													{caseRecord.county} County
												</Text>
											</Table.Td>
											<Table.Td>
												<CaseStatusBadge
													status={caseRecord.status}
												/>
											</Table.Td>
											<Table.Td>
												<Group gap={6}>
													{caseRecord.enrollments
														.length > 0 ? (
														caseRecord.enrollments.map(
															(enrollment) => {
																const program =
																	getProgram(
																		programs,
																		enrollment.programId,
																	);
																return (
																	<ProgramBadge
																		key={
																			enrollment.id
																		}
																		program={
																			program
																		}
																	/>
																);
															},
														)
													) : (
														<Text
															c='dimmed'
															size='sm'
														>
															None
														</Text>
													)}
												</Group>
											</Table.Td>
											<Table.Td>
												{formatDate(
													caseRecord.lastContact,
												)}
											</Table.Td>
											<Table.Td>
												<RiskBadge
													risk={caseRecord.risk}
												/>
											</Table.Td>
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
						</Table.ScrollContainer>
						<Group justify='space-between' mt='md'>
							<Text c='dimmed' size='sm'>
								Page {page} of {totalPages}
							</Text>
							<Pagination
								onChange={setPage}
								total={totalPages}
								value={page}
							/>
						</Group>
					</>
				) : (
					<Box mt='md'>
						<EmptyState
							icon={Search}
							title='No cases match these filters'
						/>
					</Box>
				)}
			</Box>
		</Stack>
	);
}
