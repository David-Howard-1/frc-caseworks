import { Box, Text } from "@mantine/core";

export function StatusTile({
	label,
	value,
}: {
	label: string;
	value: string;
}) {
	return (
		<Box className='rounded-md border border-slate-200 p-3'>
			<Text c='dimmed' fw={700} size='sm' tt='uppercase'>
				{label}
			</Text>
			<Text fw={700} mt={6}>
				{value}
			</Text>
		</Box>
	);
}
