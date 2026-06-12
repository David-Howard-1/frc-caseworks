import type {
	CaseNote,
	ConcreteService,
	Program,
} from "~/domain/demo-data";

export type EnrollmentOption = {
	value: string;
	label: string;
};

export type EnrollmentPrograms = Record<string, Program | undefined>;

export type NoteDraft = {
	enrollmentId: string;
	contactType: string;
	summary: string;
	body: string;
	isSession: boolean;
	sessionHours: number | "";
};

export type ServiceDraft = {
	enrollmentId: string;
	category: string;
	description: string;
	amount: number | "";
};

export type ProgramNote = CaseNote;

export type ProgramService = Pick<
	ConcreteService,
	"id" | "enrollmentId" | "date" | "category" | "description" | "amount"
>;

export function createEmptyNoteDraft(enrollmentId = ""): NoteDraft {
	return {
		enrollmentId,
		contactType: "Phone",
		summary: "",
		body: "",
		isSession: true,
		sessionHours: "",
	};
}
