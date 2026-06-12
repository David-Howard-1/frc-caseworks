import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, UserRound } from "lucide-react";
import type { ClientCase } from "~/domain/demo-data";
import { formatDate } from "~/domain/demo-data";
import { CaseStatusBadge } from "../CaseworkUI";

export function CaseHeader({
	caseRecord,
	onOpenClientInfo,
}: {
	caseRecord: ClientCase;
	onOpenClientInfo: () => void;
}) {
	return (
		<Group align='flex-start' justify='space-between'>
			<Stack gap={6}>
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
				<Group gap='xs'>
					<Title order={1} size='h2'>
						{caseRecord.displayName}
					</Title>
					<CaseStatusBadge status={caseRecord.status} />
				</Group>
				<Text c='dimmed'>
					{caseRecord.id} - Last contact{" "}
					{formatDate(caseRecord.lastContact)}
				</Text>
			</Stack>
			<Button
				leftSection={<UserRound size={17} />}
				onClick={onOpenClientInfo}
				radius={6}
				variant='light'
			>
				Client info
			</Button>
		</Group>
	);
}
