import {
	Avatar,
	Box,
	Button,
	Group,
	Select,
	SimpleGrid,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	CalendarDays,
	Clock3,
	DollarSign,
	UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import type { CaseStatus, ClientCase } from "~/domain/demo-data";
import { formatDate, formatExactCurrency } from "~/domain/demo-data";
import { RiskBadge } from "../CaseworkUI";
import { caseStatusOptions } from "./constants";

export function CaseHeader({
	caseRecord,
	concreteServicesTotal,
	onOpenClientInfo,
	onStatusChange,
}: {
	caseRecord: ClientCase;
	concreteServicesTotal: number;
	onOpenClientInfo: () => void;
	onStatusChange: (status: CaseStatus) => void;
}) {
	const initials = caseRecord.displayName
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<Stack gap='sm'>
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
			<Box className='rounded-md border border-slate-200 bg-white p-5 shadow-sm'>
				<Group align='flex-start' gap='lg' justify='space-between'>
					<Group align='flex-start' gap='md' className='min-w-0'>
						<Avatar
							color='frcBlue'
							radius={10}
							size={64}
							variant='light'
						>
							{initials}
						</Avatar>
						<Stack gap={8} className='min-w-0'>
							<Group gap='xs'>
								<Title order={1} size='h2'>
									{caseRecord.displayName}
								</Title>
								<RiskBadge risk={caseRecord.risk} />
							</Group>
							<Group c='dimmed' gap='sm'>
								<Text size='sm'>Case #: {caseRecord.id}</Text>
								<Text aria-hidden='true' size='sm'>
									|
								</Text>
								<Text size='sm'>County: {caseRecord.county}</Text>
							</Group>
						</Stack>
					</Group>

					<Group align='flex-start' gap='sm'>
						<Select
							allowDeselect={false}
							data={caseStatusOptions}
							label='Case status'
							onChange={(value) =>
								value
									? onStatusChange(value as CaseStatus)
									: undefined
							}
							radius={6}
							size='sm'
							value={caseRecord.status}
							w={160}
						/>
						<Button
							leftSection={<UserRound size={17} />}
							onClick={onOpenClientInfo}
							radius={6}
							variant='light'
						>
							Client info
						</Button>
					</Group>
				</Group>

				<SimpleGrid cols={{ base: 1, sm: 3 }} mt='lg' spacing='sm'>
					<HeaderMetric
						icon={<CalendarDays size={16} />}
						label='Opened'
						value={formatDate(caseRecord.opened)}
					/>
					<HeaderMetric
						icon={<Clock3 size={16} />}
						label='Last contact'
						value={formatDate(caseRecord.lastContact)}
					/>
					<HeaderMetric
						icon={<DollarSign size={16} />}
						label='Concrete services'
						value={formatExactCurrency(concreteServicesTotal)}
					/>
				</SimpleGrid>
			</Box>
		</Stack>
	);
}

function HeaderMetric({
	icon,
	label,
	value,
}: {
	icon: ReactNode;
	label: string;
	value: string;
}) {
	return (
		<Box className='rounded-md border border-slate-200 bg-slate-50 px-3 py-2'>
			<Group c='dimmed' gap={6}>
				{icon}
				<Text fw={700} size='xs' tt='uppercase'>
					{label}
				</Text>
			</Group>
			<Text fw={700} mt={4} size='sm'>
				{value}
			</Text>
		</Box>
	);
}
