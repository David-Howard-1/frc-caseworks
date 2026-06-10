import { a as formatDate, c as getPrimaryCaseworker, f as staff, l as getProgram, o as formatExactCurrency, s as getAssignedCaseworkers, t as useDemoWorkspace, u as getStaff } from "./useDemoWorkspace-xnVl1622.js";
import { t as Route } from "./_caseId-DkNVV6vA.js";
import { a as ProgramStatusBadge, i as ProgramBadge, n as EmptyState, o as RiskBadge, t as CaseStatusBadge } from "./CaseworkUI-CJDE9kkn.js";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ActionIcon, Badge, Box, Button, Checkbox, Group, Modal, NumberInput, Select, SimpleGrid, Stack, Table, Tabs, Text, TextInput, Textarea, Title, Tooltip } from "@mantine/core";
import { ArrowLeft, ClipboardList, DollarSign, FileText, Pencil, Plus, Save, UserRound, UsersRound } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
//#region src/components/CaseDetail.tsx
var caseStatusOptions = [
	"Open",
	"Pending",
	"Closed"
];
var programStatusOptions = [
	"Active",
	"Pending",
	"Completed",
	"Inactive",
	"Waitlisted"
];
var serviceCategories = [
	"Family supplies",
	"Medication",
	"Training",
	"Work supports",
	"Transportation",
	"Housing"
];
var quickNoteOptions = [
	"Left Voicemail",
	"Text Sent",
	"Unable to Contact"
];
function createEmptyNoteDraft(enrollmentId = "") {
	return {
		enrollmentId,
		contactType: "Phone",
		summary: "",
		body: "",
		isSession: true,
		sessionHours: 1
	};
}
function roundToNearestQuarter(value) {
	return Math.round(value * 4) / 4;
}
function CaseDetail({ caseId, onProgramFilterChange, programId }) {
	const { addCaseworkerAssignment, addConcreteService, addNote, cases, editNote, removeCaseworkerAssignment, notes, setPrimaryCaseworker, services, updateCaseStatus, updateEnrollment, visibleCases } = useDemoWorkspace();
	const navigate = useNavigate();
	const [clientInfoOpen, clientInfoHandlers] = useDisclosure(false);
	const [enrollmentModalOpen, enrollmentModalHandlers] = useDisclosure(false);
	const [noteModalOpen, noteModalHandlers] = useDisclosure(false);
	const caseRecord = cases.find((item) => item.id === caseId);
	const [caseworkerToAdd, setCaseworkerToAdd] = useState(null);
	const [editingNoteId, setEditingNoteId] = useState(null);
	const [noteError, setNoteError] = useState("");
	const [noteDraft, setNoteDraft] = useState(createEmptyNoteDraft());
	const [serviceDraft, setServiceDraft] = useState({
		enrollmentId: "",
		category: "Family supplies",
		description: "",
		amount: ""
	});
	useEffect(() => {
		if (!caseRecord) return;
		const fallbackEnrollmentId = caseRecord.enrollments.find((enrollment) => enrollment.programId === programId)?.id ?? caseRecord.enrollments[0]?.id ?? "";
		setNoteDraft((current) => editingNoteId || current.enrollmentId === fallbackEnrollmentId ? current : {
			...current,
			enrollmentId: fallbackEnrollmentId
		});
		setServiceDraft((current) => current.enrollmentId === fallbackEnrollmentId ? current : {
			...current,
			enrollmentId: fallbackEnrollmentId
		});
		setCaseworkerToAdd(null);
	}, [
		caseRecord,
		editingNoteId,
		programId
	]);
	const canViewCase = visibleCases.some((item) => item.id === caseRecord?.id);
	const selectedEnrollment = caseRecord?.enrollments.find((enrollment) => enrollment.programId === programId);
	const selectedProgram = selectedEnrollment ? getProgram(selectedEnrollment.programId) : void 0;
	const selectedAssignedCaseworkers = selectedEnrollment ? getAssignedCaseworkers(selectedEnrollment) : [];
	const availableCaseworkers = selectedEnrollment ? staff.filter((person) => person.role === "Caseworker" && person.programs.includes(selectedEnrollment.programId) && !selectedEnrollment.caseworkers.some((assignment) => assignment.staffId === person.id)).map((person) => ({
		value: person.id,
		label: person.name
	})) : [];
	const enrollmentOptions = caseRecord?.enrollments.map((enrollment) => {
		const program = getProgram(enrollment.programId);
		return {
			value: enrollment.id,
			label: program?.name ?? enrollment.programId
		};
	}) ?? [];
	const enrollmentPrograms = caseRecord?.enrollments.reduce((result, enrollment) => ({
		...result,
		[enrollment.id]: getProgram(enrollment.programId)
	}), {}) ?? {};
	const programNotes = notes.filter((note) => note.caseId === caseRecord?.id && (!selectedEnrollment || note.enrollmentId === selectedEnrollment.id)).sort((a, b) => b.date.localeCompare(a.date));
	const programServices = services.filter((service) => service.caseId === caseRecord?.id && (!selectedEnrollment || service.enrollmentId === selectedEnrollment.id)).sort((a, b) => b.date.localeCompare(a.date));
	const caseServicesTotal = useMemo(() => services.filter((service) => service.caseId === caseRecord?.id).reduce((sum, service) => sum + service.amount, 0), [caseRecord?.id, services]);
	if (!caseRecord) return /* @__PURE__ */ jsxs(Stack, {
		gap: "md",
		children: [/* @__PURE__ */ jsx(Button, {
			component: Link,
			leftSection: /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
			radius: 6,
			to: "/cases",
			variant: "subtle",
			w: "fit-content",
			children: "Cases"
		}), /* @__PURE__ */ jsx(EmptyState, {
			icon: ClipboardList,
			title: "Case not found"
		})]
	});
	function openAddNote() {
		const defaultEnrollmentId = selectedEnrollment?.id ?? caseRecord?.enrollments[0]?.id ?? "";
		setEditingNoteId(null);
		setNoteError("");
		setNoteDraft(createEmptyNoteDraft(defaultEnrollmentId));
		noteModalHandlers.open();
	}
	function openEditNote(note) {
		setEditingNoteId(note.id);
		setNoteError("");
		setNoteDraft({
			enrollmentId: note.enrollmentId,
			contactType: note.contactType,
			summary: note.summary,
			body: note.body,
			isSession: note.isSession,
			sessionHours: note.sessionHours ?? 1
		});
		noteModalHandlers.open();
	}
	function insertQuickNote(text) {
		setNoteDraft((current) => ({
			...current,
			body: current.body.trim() ? `${current.body.trim()}\n${text}` : text,
			summary: current.summary || text
		}));
	}
	function handleSaveNote() {
		if (!noteDraft.enrollmentId) {
			setNoteError("Program is required.");
			return;
		}
		if (!noteDraft.body.trim()) {
			setNoteError("Note body is required.");
			return;
		}
		const sessionHours = typeof noteDraft.sessionHours === "number" ? roundToNearestQuarter(noteDraft.sessionHours) : 0;
		if (noteDraft.isSession && sessionHours <= 0) {
			setNoteError("Hours are required for session notes.");
			return;
		}
		const input = {
			enrollmentId: noteDraft.enrollmentId,
			contactType: noteDraft.contactType,
			summary: noteDraft.summary,
			body: noteDraft.body,
			isSession: noteDraft.isSession,
			sessionHours: noteDraft.isSession ? sessionHours : void 0
		};
		if (editingNoteId) editNote(editingNoteId, input);
		else addNote(caseRecord.id, input);
		setEditingNoteId(null);
		setNoteError("");
		noteModalHandlers.close();
	}
	function handleAddService() {
		if (!serviceDraft.enrollmentId || serviceDraft.amount === "") return;
		addConcreteService(caseRecord.id, {
			enrollmentId: serviceDraft.enrollmentId,
			category: serviceDraft.category,
			description: serviceDraft.description,
			amount: Number(serviceDraft.amount)
		});
		setServiceDraft((current) => ({
			...current,
			description: "",
			amount: ""
		}));
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Modal, {
			opened: clientInfoOpen,
			onClose: clientInfoHandlers.close,
			title: "Client information",
			children: /* @__PURE__ */ jsxs(Stack, {
				gap: "sm",
				children: [
					/* @__PURE__ */ jsx(InfoLine, {
						label: "Name",
						value: caseRecord.displayName
					}),
					/* @__PURE__ */ jsx(InfoLine, {
						label: "Pronouns",
						value: caseRecord.pronouns ?? "Not set"
					}),
					/* @__PURE__ */ jsx(InfoLine, {
						label: "Age",
						value: caseRecord.age.toString()
					}),
					/* @__PURE__ */ jsx(InfoLine, {
						label: "County",
						value: caseRecord.county
					}),
					/* @__PURE__ */ jsx(InfoLine, {
						label: "Phone",
						value: caseRecord.intake.phone ?? "Not set"
					}),
					/* @__PURE__ */ jsx(InfoLine, {
						label: "Email",
						value: caseRecord.intake.email ?? "Not set"
					}),
					/* @__PURE__ */ jsx(InfoLine, {
						label: "Referral source",
						value: caseRecord.intake.referralSource ?? "Not set"
					}),
					/* @__PURE__ */ jsx(InfoLine, {
						label: "Household income",
						value: caseRecord.intake.householdIncome ?? "Not set"
					}),
					/* @__PURE__ */ jsx(InfoLine, {
						label: "Housing",
						value: caseRecord.intake.housing ?? "Not set"
					})
				]
			})
		}),
		/* @__PURE__ */ jsx(Modal, {
			opened: enrollmentModalOpen,
			onClose: enrollmentModalHandlers.close,
			size: "lg",
			title: "Edit enrollment/program status",
			children: selectedEnrollment ? /* @__PURE__ */ jsxs(Stack, {
				gap: "md",
				children: [
					/* @__PURE__ */ jsx(Select, {
						allowDeselect: false,
						data: programStatusOptions,
						label: "Program status",
						onChange: (value) => value ? updateEnrollment(caseRecord.id, selectedEnrollment.id, { status: value }) : void 0,
						value: selectedEnrollment.status
					}),
					/* @__PURE__ */ jsx(Textarea, {
						autosize: true,
						label: "Program goal",
						minRows: 3,
						value: selectedEnrollment.goal,
						onChange: (event) => updateEnrollment(caseRecord.id, selectedEnrollment.id, { goal: event.currentTarget.value })
					}),
					/* @__PURE__ */ jsxs(Box, {
						className: "rounded-md border border-slate-200 p-4",
						children: [/* @__PURE__ */ jsxs(Group, {
							align: "flex-end",
							justify: "space-between",
							children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx(Title, {
								order: 3,
								size: "h5",
								children: "Assigned caseworkers"
							}), /* @__PURE__ */ jsx(Text, {
								c: "dimmed",
								size: "sm",
								children: "Multiple workers can support this program; one is primary."
							})] }), /* @__PURE__ */ jsxs(Group, {
								align: "flex-end",
								gap: "sm",
								children: [/* @__PURE__ */ jsx(Select, {
									data: availableCaseworkers,
									label: "Add caseworker",
									onChange: setCaseworkerToAdd,
									placeholder: "Select worker",
									value: caseworkerToAdd,
									w: 220
								}), /* @__PURE__ */ jsx(Button, {
									disabled: !caseworkerToAdd,
									onClick: () => {
										if (!caseworkerToAdd) return;
										addCaseworkerAssignment(caseRecord.id, selectedEnrollment.id, caseworkerToAdd);
										setCaseworkerToAdd(null);
									},
									radius: 6,
									children: "Add"
								})]
							})]
						}), /* @__PURE__ */ jsx(Stack, {
							gap: "xs",
							mt: "md",
							children: selectedAssignedCaseworkers.map(({ assignment, staff: assignedStaff }) => /* @__PURE__ */ jsxs(Group, {
								className: "rounded-md border border-slate-200 p-3",
								justify: "space-between",
								children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsxs(Group, {
									gap: "xs",
									children: [/* @__PURE__ */ jsx(Text, {
										fw: 700,
										children: assignedStaff?.name ?? assignment.staffId
									}), assignment.isPrimary ? /* @__PURE__ */ jsx(Badge, {
										color: "frcBlue",
										children: "Primary"
									}) : null]
								}), /* @__PURE__ */ jsx(Text, {
									c: "dimmed",
									size: "sm",
									children: "Caseworker"
								})] }), /* @__PURE__ */ jsxs(Group, {
									gap: "xs",
									children: [!assignment.isPrimary ? /* @__PURE__ */ jsx(Button, {
										onClick: () => setPrimaryCaseworker(caseRecord.id, selectedEnrollment.id, assignment.staffId),
										radius: 6,
										size: "xs",
										variant: "light",
										children: "Make primary"
									}) : null, /* @__PURE__ */ jsx(Button, {
										color: "red",
										disabled: selectedEnrollment.caseworkers.length === 1,
										onClick: () => removeCaseworkerAssignment(caseRecord.id, selectedEnrollment.id, assignment.staffId),
										radius: 6,
										size: "xs",
										variant: "subtle",
										children: "Remove"
									})]
								})]
							}, assignment.staffId))
						})]
					})
				]
			}) : null
		}),
		/* @__PURE__ */ jsx(Modal, {
			opened: noteModalOpen,
			onClose: noteModalHandlers.close,
			size: "lg",
			title: editingNoteId ? "Edit note" : "Add note",
			children: /* @__PURE__ */ jsxs(Stack, {
				gap: "md",
				children: [
					/* @__PURE__ */ jsxs(SimpleGrid, {
						cols: {
							base: 1,
							md: 2
						},
						children: [/* @__PURE__ */ jsx(Select, {
							allowDeselect: false,
							data: enrollmentOptions,
							disabled: Boolean(selectedEnrollment),
							error: noteError === "Program is required." ? "Program is required" : void 0,
							label: "Program",
							onChange: (value) => setNoteDraft((current) => ({
								...current,
								enrollmentId: value ?? ""
							})),
							required: true,
							value: noteDraft.enrollmentId
						}), /* @__PURE__ */ jsx(Select, {
							allowDeselect: false,
							data: [
								"Phone",
								"Home visit",
								"Office visit",
								"Service coordination",
								"Closure"
							],
							label: "Contact",
							onChange: (value) => setNoteDraft((current) => ({
								...current,
								contactType: value ?? "Phone"
							})),
							value: noteDraft.contactType
						})]
					}),
					/* @__PURE__ */ jsx(TextInput, {
						label: "Summary",
						value: noteDraft.summary,
						onChange: (event) => setNoteDraft((current) => ({
							...current,
							summary: event.currentTarget.value
						}))
					}),
					/* @__PURE__ */ jsxs(Group, {
						align: "flex-end",
						children: [/* @__PURE__ */ jsx(Checkbox, {
							checked: noteDraft.isSession,
							label: "Session?",
							onChange: (event) => setNoteDraft((current) => ({
								...current,
								isSession: event.currentTarget.checked,
								sessionHours: event.currentTarget.checked ? current.sessionHours || 1 : ""
							}))
						}), /* @__PURE__ */ jsx(NumberInput, {
							decimalScale: 2,
							disabled: !noteDraft.isSession,
							error: noteError === "Hours are required for session notes." ? "Required for sessions" : void 0,
							fixedDecimalScale: true,
							label: "Hours",
							min: .25,
							onBlur: () => setNoteDraft((current) => ({
								...current,
								sessionHours: typeof current.sessionHours === "number" ? roundToNearestQuarter(current.sessionHours) : current.sessionHours
							})),
							onChange: (value) => setNoteDraft((current) => ({
								...current,
								sessionHours: typeof value === "number" ? value : ""
							})),
							required: noteDraft.isSession,
							step: .25,
							value: noteDraft.sessionHours,
							w: 140
						})]
					}),
					/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx(Text, {
						c: "dimmed",
						fw: 700,
						size: "sm",
						mb: 6,
						tt: "uppercase",
						children: "Quick notes"
					}), /* @__PURE__ */ jsx(Group, {
						gap: "xs",
						children: quickNoteOptions.map((option) => /* @__PURE__ */ jsx(Button, {
							onClick: () => insertQuickNote(option),
							radius: 6,
							size: "xs",
							variant: "light",
							children: option
						}, option))
					})] }),
					/* @__PURE__ */ jsx(Textarea, {
						autosize: true,
						error: noteError === "Note body is required." ? "Note body is required" : void 0,
						label: "Note",
						minRows: 5,
						onChange: (event) => setNoteDraft((current) => ({
							...current,
							body: event.currentTarget.value
						})),
						required: true,
						value: noteDraft.body
					}),
					noteError && ![
						"Program is required.",
						"Note body is required.",
						"Hours are required for session notes."
					].includes(noteError) ? /* @__PURE__ */ jsx(Text, {
						c: "red",
						size: "sm",
						children: noteError
					}) : null,
					/* @__PURE__ */ jsxs(Group, {
						justify: "flex-end",
						children: [/* @__PURE__ */ jsx(Button, {
							onClick: noteModalHandlers.close,
							radius: 6,
							variant: "subtle",
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							leftSection: /* @__PURE__ */ jsx(Save, { size: 17 }),
							onClick: handleSaveNote,
							radius: 6,
							children: "Save note"
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ jsxs(Stack, {
			gap: "lg",
			children: [
				/* @__PURE__ */ jsxs(Group, {
					align: "flex-start",
					justify: "space-between",
					children: [/* @__PURE__ */ jsxs(Stack, {
						gap: 6,
						children: [
							/* @__PURE__ */ jsx(Button, {
								component: Link,
								leftSection: /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
								radius: 6,
								to: "/cases",
								variant: "subtle",
								w: "fit-content",
								children: "Cases"
							}),
							/* @__PURE__ */ jsxs(Group, {
								gap: "xs",
								children: [/* @__PURE__ */ jsx(Title, {
									order: 1,
									size: "h2",
									children: caseRecord.displayName
								}), /* @__PURE__ */ jsx(CaseStatusBadge, { status: caseRecord.status })]
							}),
							/* @__PURE__ */ jsxs(Text, {
								c: "dimmed",
								children: [
									caseRecord.id,
									" - Last contact ",
									formatDate(caseRecord.lastContact)
								]
							})
						]
					}), /* @__PURE__ */ jsx(Button, {
						leftSection: /* @__PURE__ */ jsx(UserRound, { size: 17 }),
						onClick: clientInfoHandlers.open,
						radius: 6,
						variant: "light",
						children: "Client info"
					})]
				}),
				!canViewCase ? /* @__PURE__ */ jsx(Box, {
					className: "rounded-md border border-yellow-200 bg-yellow-50 p-3",
					children: /* @__PURE__ */ jsx(Text, {
						c: "yellow",
						fw: 700,
						size: "sm",
						children: "This case is outside the current role scope."
					})
				}) : null,
				/* @__PURE__ */ jsxs(Box, {
					className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
					children: [/* @__PURE__ */ jsxs(Group, {
						align: "center",
						justify: "space-between",
						children: [/* @__PURE__ */ jsx(Title, {
							order: 2,
							size: "h4",
							children: "Case status"
						}), /* @__PURE__ */ jsx(RiskBadge, { risk: caseRecord.risk })]
					}), /* @__PURE__ */ jsxs(SimpleGrid, {
						cols: {
							base: 1,
							sm: 2,
							lg: 4
						},
						mt: "md",
						children: [
							/* @__PURE__ */ jsx(Box, {
								className: "rounded-md border border-slate-200 p-3",
								children: /* @__PURE__ */ jsx(Select, {
									allowDeselect: false,
									data: caseStatusOptions,
									label: "Overall status",
									onChange: (value) => value ? updateCaseStatus(caseRecord.id, value) : void 0,
									value: caseRecord.status
								})
							}),
							/* @__PURE__ */ jsx(StatusTile, {
								label: "Opened",
								value: formatDate(caseRecord.opened)
							}),
							/* @__PURE__ */ jsx(StatusTile, {
								label: "Last contact",
								value: formatDate(caseRecord.lastContact)
							}),
							/* @__PURE__ */ jsx(StatusTile, {
								label: "Concrete services",
								value: formatExactCurrency(caseServicesTotal)
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs(Box, {
					className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
					children: [/* @__PURE__ */ jsxs(Group, {
						align: "flex-start",
						justify: "space-between",
						children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx(Title, {
							order: 2,
							size: "h4",
							children: "Program scope"
						}), /* @__PURE__ */ jsx(Text, {
							c: "dimmed",
							size: "sm",
							children: "Notes and concrete services follow the selected program."
						})] }), /* @__PURE__ */ jsx(Group, {
							gap: "xs",
							children: selectedProgram ? /* @__PURE__ */ jsxs(Fragment, { children: [
								/* @__PURE__ */ jsx(ProgramBadge, { program: selectedProgram }),
								/* @__PURE__ */ jsx(Button, {
									onClick: () => onProgramFilterChange(void 0),
									radius: 6,
									size: "xs",
									variant: "subtle",
									children: "Clear selected program"
								}),
								/* @__PURE__ */ jsx(Button, {
									onClick: enrollmentModalHandlers.open,
									radius: 6,
									size: "xs",
									variant: "light",
									children: "Edit enrollment"
								})
							] }) : /* @__PURE__ */ jsx(Badge, {
								color: "gray",
								variant: "light",
								children: "All programs"
							})
						})]
					}), caseRecord.enrollments.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SimpleGrid, {
						cols: {
							base: 1,
							lg: 3
						},
						mt: "md",
						children: caseRecord.enrollments.map((enrollment) => {
							const program = getProgram(enrollment.programId);
							return /* @__PURE__ */ jsxs("button", {
								className: ["rounded-md border bg-white p-3 text-left transition", enrollment.programId === programId ? "border-[#1C5380] ring-2 ring-[#1C5380]/15" : "border-slate-200 hover:border-slate-300"].join(" "),
								onClick: () => onProgramFilterChange(enrollment.programId),
								type: "button",
								children: [
									/* @__PURE__ */ jsxs(Group, {
										justify: "space-between",
										children: [/* @__PURE__ */ jsx(ProgramBadge, { program }), /* @__PURE__ */ jsx(ProgramStatusBadge, { status: enrollment.status })]
									}),
									/* @__PURE__ */ jsx(Text, {
										fw: 700,
										mt: "sm",
										children: program?.name
									}),
									/* @__PURE__ */ jsxs(Text, {
										c: "dimmed",
										size: "sm",
										children: ["Primary: ", getPrimaryCaseworker(enrollment)?.name ?? "Unassigned"]
									}),
									/* @__PURE__ */ jsxs(Text, {
										c: "dimmed",
										size: "sm",
										children: [
											enrollment.caseworkers.length,
											" assigned caseworker",
											enrollment.caseworkers.length === 1 ? "" : "s"
										]
									})
								]
							}, enrollment.id);
						})
					}), /* @__PURE__ */ jsxs(Tabs, {
						color: "frcBlue",
						defaultValue: "notes",
						keepMounted: false,
						mt: "lg",
						children: [
							/* @__PURE__ */ jsxs(Tabs.List, { children: [/* @__PURE__ */ jsx(Tabs.Tab, {
								leftSection: /* @__PURE__ */ jsx(FileText, { size: 16 }),
								value: "notes",
								children: "Notes"
							}), /* @__PURE__ */ jsx(Tabs.Tab, {
								leftSection: /* @__PURE__ */ jsx(DollarSign, { size: 16 }),
								value: "services",
								children: "Concrete services"
							})] }),
							/* @__PURE__ */ jsx(Tabs.Panel, {
								value: "notes",
								children: /* @__PURE__ */ jsx(ProgramNotesPortal, {
									enrollmentPrograms,
									notes: programNotes,
									onAddNote: openAddNote,
									onEditNote: openEditNote
								})
							}),
							/* @__PURE__ */ jsx(Tabs.Panel, {
								value: "services",
								children: /* @__PURE__ */ jsx(ConcreteServicesPortal, {
									enrollmentOptions,
									enrollmentPrograms,
									isProgramFiltered: Boolean(selectedEnrollment),
									onAdd: handleAddService,
									onDraftChange: setServiceDraft,
									serviceDraft,
									services: programServices
								})
							})
						]
					})] }) : /* @__PURE__ */ jsx(Box, {
						mt: "md",
						children: /* @__PURE__ */ jsx(EmptyState, {
							icon: ClipboardList,
							title: "No programs assigned to this case"
						})
					})]
				}),
				/* @__PURE__ */ jsxs(Box, {
					className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
					children: [/* @__PURE__ */ jsxs(Group, {
						justify: "space-between",
						children: [/* @__PURE__ */ jsx(Title, {
							order: 2,
							size: "h4",
							children: "Related people"
						}), /* @__PURE__ */ jsx(Badge, {
							leftSection: /* @__PURE__ */ jsx(UsersRound, { size: 14 }),
							variant: "light",
							children: caseRecord.relatedPeople.length
						})]
					}), /* @__PURE__ */ jsx(Table.ScrollContainer, {
						minWidth: 620,
						mt: "md",
						children: /* @__PURE__ */ jsxs(Table, {
							verticalSpacing: "sm",
							children: [/* @__PURE__ */ jsx(Table.Thead, { children: /* @__PURE__ */ jsxs(Table.Tr, { children: [
								/* @__PURE__ */ jsx(Table.Th, { children: "Name" }),
								/* @__PURE__ */ jsx(Table.Th, { children: "Relationship" }),
								/* @__PURE__ */ jsx(Table.Th, { children: "Age" }),
								/* @__PURE__ */ jsx(Table.Th, { children: "Household" }),
								/* @__PURE__ */ jsx(Table.Th, { children: "Linked case" })
							] }) }), /* @__PURE__ */ jsx(Table.Tbody, { children: caseRecord.relatedPeople.map((person) => /* @__PURE__ */ jsxs(Table.Tr, { children: [
								/* @__PURE__ */ jsx(Table.Td, {
									fw: 700,
									children: person.name
								}),
								/* @__PURE__ */ jsx(Table.Td, { children: person.relationship }),
								/* @__PURE__ */ jsx(Table.Td, { children: person.age }),
								/* @__PURE__ */ jsx(Table.Td, { children: person.inHousehold ? "Yes" : "No" }),
								/* @__PURE__ */ jsx(Table.Td, { children: person.linkedCaseId ? /* @__PURE__ */ jsx(Button, {
									onClick: () => navigate({
										to: "/cases/$caseId",
										params: { caseId: person.linkedCaseId }
									}),
									radius: 6,
									size: "xs",
									variant: "light",
									children: person.linkedCaseId
								}) : /* @__PURE__ */ jsx(Text, {
									c: "dimmed",
									size: "sm",
									children: "None"
								}) })
							] }, person.id)) })]
						})
					})]
				})
			]
		})
	] });
}
function ProgramNotesPortal({ enrollmentPrograms, notes, onAddNote, onEditNote }) {
	return /* @__PURE__ */ jsxs(Stack, {
		gap: "md",
		mt: "md",
		children: [/* @__PURE__ */ jsxs(Group, {
			justify: "space-between",
			children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx(Title, {
				order: 3,
				size: "h5",
				children: "Case notes"
			}), /* @__PURE__ */ jsx(Text, {
				c: "dimmed",
				size: "sm",
				children: "Notes can be filtered by program scope."
			})] }), /* @__PURE__ */ jsx(Button, {
				leftSection: /* @__PURE__ */ jsx(Plus, { size: 17 }),
				onClick: onAddNote,
				radius: 6,
				children: "Add note"
			})]
		}), notes.length > 0 ? notes.map((note) => /* @__PURE__ */ jsxs(Box, {
			className: "rounded-md border border-slate-200 p-4",
			children: [/* @__PURE__ */ jsxs(Group, {
				align: "flex-start",
				justify: "space-between",
				children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsxs(Group, {
					gap: "xs",
					children: [
						/* @__PURE__ */ jsx(ProgramBadge, { program: enrollmentPrograms[note.enrollmentId] }),
						/* @__PURE__ */ jsx(Text, {
							fw: 700,
							children: note.summary
						}),
						note.isSession ? /* @__PURE__ */ jsxs(Badge, {
							color: "green",
							variant: "light",
							children: [
								"Session ",
								note.sessionHours ?? 0,
								" hr"
							]
						}) : /* @__PURE__ */ jsx(Badge, {
							color: "gray",
							variant: "light",
							children: "Non-session"
						})
					]
				}), /* @__PURE__ */ jsxs(Text, {
					c: "dimmed",
					mt: 4,
					size: "sm",
					children: [
						note.contactType,
						" - ",
						getStaff(note.authorId)?.name
					]
				})] }), /* @__PURE__ */ jsxs(Group, {
					gap: "xs",
					wrap: "nowrap",
					children: [/* @__PURE__ */ jsx(Text, {
						c: "dimmed",
						size: "sm",
						children: formatDate(note.date)
					}), /* @__PURE__ */ jsx(Tooltip, {
						label: "Edit note",
						children: /* @__PURE__ */ jsx(ActionIcon, {
							"aria-label": "Edit note",
							onClick: () => onEditNote(note),
							radius: 6,
							variant: "subtle",
							children: /* @__PURE__ */ jsx(Pencil, { size: 16 })
						})
					})]
				})]
			}), /* @__PURE__ */ jsx(Text, {
				mt: "sm",
				children: note.body
			})]
		}, note.id)) : /* @__PURE__ */ jsx(EmptyState, {
			icon: FileText,
			title: "No notes for this program"
		})]
	});
}
function ConcreteServicesPortal({ enrollmentOptions, enrollmentPrograms, isProgramFiltered, onAdd, onDraftChange, serviceDraft, services }) {
	return /* @__PURE__ */ jsxs(Stack, {
		gap: "md",
		mt: "md",
		children: [/* @__PURE__ */ jsxs(Box, {
			className: "rounded-md border border-slate-200 p-4",
			children: [/* @__PURE__ */ jsxs(SimpleGrid, {
				cols: {
					base: 1,
					md: 4
				},
				children: [
					/* @__PURE__ */ jsx(Select, {
						allowDeselect: false,
						data: enrollmentOptions,
						disabled: isProgramFiltered,
						label: "Program",
						onChange: (value) => onDraftChange({
							...serviceDraft,
							enrollmentId: value ?? ""
						}),
						value: serviceDraft.enrollmentId
					}),
					/* @__PURE__ */ jsx(Select, {
						allowDeselect: false,
						data: serviceCategories,
						label: "Category",
						onChange: (value) => onDraftChange({
							...serviceDraft,
							category: value ?? "Family supplies"
						}),
						value: serviceDraft.category
					}),
					/* @__PURE__ */ jsx(TextInput, {
						label: "Description",
						value: serviceDraft.description,
						onChange: (event) => onDraftChange({
							...serviceDraft,
							description: event.currentTarget.value
						})
					}),
					/* @__PURE__ */ jsx(NumberInput, {
						decimalScale: 2,
						fixedDecimalScale: true,
						label: "Amount",
						min: 0,
						prefix: "$",
						value: serviceDraft.amount,
						onChange: (value) => onDraftChange({
							...serviceDraft,
							amount: typeof value === "number" ? value : ""
						})
					})
				]
			}), /* @__PURE__ */ jsx(Group, {
				justify: "flex-end",
				mt: "md",
				children: /* @__PURE__ */ jsx(Button, {
					leftSection: /* @__PURE__ */ jsx(DollarSign, { size: 17 }),
					onClick: onAdd,
					radius: 6,
					children: "Add service"
				})
			})]
		}), services.length > 0 ? /* @__PURE__ */ jsx(Table.ScrollContainer, {
			minWidth: 760,
			children: /* @__PURE__ */ jsxs(Table, {
				verticalSpacing: "sm",
				children: [/* @__PURE__ */ jsx(Table.Thead, { children: /* @__PURE__ */ jsxs(Table.Tr, { children: [
					/* @__PURE__ */ jsx(Table.Th, { children: "Date" }),
					/* @__PURE__ */ jsx(Table.Th, { children: "Program" }),
					/* @__PURE__ */ jsx(Table.Th, { children: "Category" }),
					/* @__PURE__ */ jsx(Table.Th, { children: "Description" }),
					/* @__PURE__ */ jsx(Table.Th, {
						ta: "right",
						children: "Amount"
					})
				] }) }), /* @__PURE__ */ jsx(Table.Tbody, { children: services.map((service) => /* @__PURE__ */ jsxs(Table.Tr, { children: [
					/* @__PURE__ */ jsx(Table.Td, { children: formatDate(service.date) }),
					/* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsx(ProgramBadge, { program: enrollmentPrograms[service.enrollmentId] }) }),
					/* @__PURE__ */ jsx(Table.Td, { children: service.category }),
					/* @__PURE__ */ jsx(Table.Td, { children: service.description }),
					/* @__PURE__ */ jsx(Table.Td, {
						ta: "right",
						children: formatExactCurrency(service.amount)
					})
				] }, service.id)) })]
			})
		}) : /* @__PURE__ */ jsx(EmptyState, {
			icon: DollarSign,
			title: "No concrete services for this program"
		})]
	});
}
function StatusTile({ label, value }) {
	return /* @__PURE__ */ jsxs(Box, {
		className: "rounded-md border border-slate-200 p-3",
		children: [/* @__PURE__ */ jsx(Text, {
			c: "dimmed",
			fw: 700,
			size: "sm",
			tt: "uppercase",
			children: label
		}), /* @__PURE__ */ jsx(Text, {
			fw: 700,
			mt: 6,
			children: value
		})]
	});
}
function InfoLine({ label, value }) {
	return /* @__PURE__ */ jsxs(Group, {
		justify: "space-between",
		wrap: "nowrap",
		children: [/* @__PURE__ */ jsx(Text, {
			c: "dimmed",
			size: "sm",
			children: label
		}), /* @__PURE__ */ jsx(Text, {
			fw: 700,
			ta: "right",
			children: value
		})]
	});
}
//#endregion
//#region src/routes/cases/$caseId.tsx?tsr-split=component
function CaseDetailRoute() {
	const { caseId } = Route.useParams();
	const { programId } = Route.useSearch();
	const navigate = Route.useNavigate();
	return /* @__PURE__ */ jsx(CaseDetail, {
		caseId,
		onProgramFilterChange: (nextProgramId) => navigate({
			search: nextProgramId ? { programId: nextProgramId } : {},
			resetScroll: false
		}),
		programId
	});
}
//#endregion
export { CaseDetailRoute as component };
