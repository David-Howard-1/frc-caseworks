import { Box, Select, SimpleGrid, Title, Group } from "@mantine/core";
import type { CaseStatus, ClientCase } from "~/domain/workspace";
import { formatDate, formatExactCurrency } from "~/domain/workspace";
import { RiskBadge } from "../CaseworkUI";
import { caseStatusOptions } from "./constants";
import { StatusTile } from "./StatusTile";

export function CaseStatusPanel({
	caseRecord,
	concreteServicesTotal,
	onStatusChange,
}: {
	caseRecord: ClientCase;
	concreteServicesTotal: number;
	onStatusChange: (status: CaseStatus) => void;
}) {
	return (
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
							value ? onStatusChange(value as CaseStatus) : undefined
						}
						value={caseRecord.status}
					/>
				</Box>
				<StatusTile label='Opened' value={formatDate(caseRecord.opened)} />
				<StatusTile
					label='Last contact'
					value={formatDate(caseRecord.lastContact)}
				/>
				<StatusTile
					label='Concrete services'
					value={formatExactCurrency(concreteServicesTotal)}
				/>
			</SimpleGrid>
		</Box>
	);
}
