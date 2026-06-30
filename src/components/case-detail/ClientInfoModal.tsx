import { Modal, Stack } from "@mantine/core";
import type { ClientCase } from "~/domain/workspace";
import { InfoLine } from "./InfoLine";

export function ClientInfoModal({
	caseRecord,
	onClose,
	opened,
}: {
	caseRecord: ClientCase;
	onClose: () => void;
	opened: boolean;
}) {
	return (
		<Modal opened={opened} onClose={onClose} title='Client information'>
			<Stack gap='sm'>
				<InfoLine label='Name' value={caseRecord.displayName} />
				<InfoLine
					label='Pronouns'
					value={caseRecord.pronouns ?? "Not set"}
				/>
				<InfoLine label='Age' value={caseRecord.age.toString()} />
				<InfoLine label='County' value={caseRecord.county} />
				<InfoLine
					label='Phone'
					value={caseRecord.intake.phone ?? "Not set"}
				/>
				<InfoLine
					label='Email'
					value={caseRecord.intake.email ?? "Not set"}
				/>
				<InfoLine
					label='Referral source'
					value={caseRecord.intake.referralSource ?? "Not set"}
				/>
				<InfoLine
					label='Household income'
					value={caseRecord.intake.householdIncome ?? "Not set"}
				/>
				<InfoLine
					label='Housing'
					value={caseRecord.intake.housing ?? "Not set"}
				/>
			</Stack>
		</Modal>
	);
}
