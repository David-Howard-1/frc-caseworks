import { Badge, Box, Button, Group, Table, Text, Title } from "@mantine/core";
import { UsersRound } from "lucide-react";
import type { ClientCase } from "~/domain/demo-data";

export function RelatedPeoplePanel({
	caseRecord,
	onNavigateToCase,
}: {
	caseRecord: ClientCase;
	onNavigateToCase: (caseId: string) => void;
}) {
	return (
		<Box className='rounded-md border border-slate-200 bg-white p-4 shadow-sm'>
			<Group justify='space-between'>
				<Title order={2} size='h4'>
					Related people
				</Title>
				<Badge leftSection={<UsersRound size={14} />} variant='light'>
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
								<Table.Td fw={700}>{person.name}</Table.Td>
								<Table.Td>{person.relationship}</Table.Td>
								<Table.Td>{person.age}</Table.Td>
								<Table.Td>
									{person.inHousehold ? "Yes" : "No"}
								</Table.Td>
								<Table.Td>
									{person.linkedCaseId ? (
										<Button
											onClick={() =>
												onNavigateToCase(
													person.linkedCaseId!,
												)
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
	);
}
