import type {
	CaseNote,
	ConcreteService,
	Program,
} from "~/domain/workspace";

export type EnrollmentOption = {
	value: string;
	label: string;
};

export type EnrollmentPrograms = Record<number, Program | undefined>;

export type NoteDraft = {
	enrollmentId: number | "";
	contactType: string;
	summary: string;
	body: string;
	isSession: boolean;
	sessionHours: number | "";
};

export type ServiceDraft = {
	enrollmentId: number | "";
	category: string;
	description: string;
	amount: number | "";
};

export type ProgramNote = CaseNote;

export type ProgramService = Pick<
	ConcreteService,
	"id" | "enrollmentId" | "date" | "category" | "description" | "amount"
>;

export function createEmptyNoteDraft(enrollmentId: number | "" = ""): NoteDraft {
	return {
		enrollmentId,
		contactType: "Phone",
		summary: "",
		body: "",
		isSession: true,
		sessionHours: "",
	};
}
