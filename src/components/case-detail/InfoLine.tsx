import { Group, Text } from "@mantine/core";

export function InfoLine({ label, value }: { label: string; value: string }) {
	return (
		<Group justify='space-between' wrap='nowrap'>
			<Text c='dimmed' size='sm'>
				{label}
			</Text>
			<Text fw={700} ta='right'>
				{value}
			</Text>
		</Group>
	);
}
