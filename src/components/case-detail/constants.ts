import type { CaseStatus, ProgramStatus } from "~/domain/demo-data";

export const caseStatusOptions: CaseStatus[] = ["Open", "Pending", "Closed"];

export const programStatusOptions: ProgramStatus[] = [
	"Active",
	"Pending",
	"Completed",
	"Inactive",
	"Waitlisted",
];

export const serviceCategories = [
	"Family supplies",
	"Medication",
	"Training",
	"Work supports",
	"Transportation",
	"Housing",
];

export const quickNoteOptions = [
	"Left Voicemail",
	"Text Sent",
	"Unable to Contact",
];
