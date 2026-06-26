import { t as useDemoWorkspace } from "./useDemoWorkspace-HKkN5mR6.js";
import { a as formatExactCurrency, c as getProgram, h as staff, i as formatDate, l as getStaff, o as getAssignedCaseworkers, s as getPrimaryCaseworker } from "./demo-data-BsOXExLV.js";
import { t as Route } from "./_caseId-DIC-Qiut.js";
import { a as ProgramStatusBadge, i as ProgramBadge, n as EmptyState, o as RiskBadge } from "./CaseworkUI-CJDE9kkn.js";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ActionIcon, Avatar, Badge, Box, Button, Checkbox, Group, Modal, NumberInput, Select, SimpleGrid, Stack, Table, Tabs, Text, TextInput, Textarea, Title, Tooltip } from "@mantine/core";
import { ArrowLeft, CalendarDays, ClipboardList, Clock3, DollarSign, FileText, Pencil, Plus, Save, UserRound, UsersRound } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
//#region src/lib/util.ts
function roundToNearestQuarter(value) {
	return Math.round(value * 4) / 4;
}
//#endregion
//#region src/components/case-detail/constants.ts
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
//#endregion
//#region src/components/case-detail/CaseHeader.tsx
function CaseHeader({ caseRecord, concreteServicesTotal, onOpenClientInfo, onStatusChange }) {
	const initials = caseRecord.displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
	return /* @__PURE__ */ jsxs(Stack, {
		gap: "sm",
		children: [/* @__PURE__ */ jsx(Button, {
			component: Link,
			leftSection: /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
			radius: 6,
			to: "/cases",
			variant: "subtle",
			w: "fit-content",
			children: "Cases"
		}), /* @__PURE__ */ jsxs(Box, {
			className: "rounded-md border border-slate-200 bg-white p-5 shadow-sm",
			children: [/* @__PURE__ */ jsxs(Group, {
				align: "flex-start",
				gap: "lg",
				justify: "space-between",
				children: [/* @__PURE__ */ jsxs(Group, {
					align: "flex-start",
					gap: "md",
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx(Avatar, {
						color: "frcBlue",
						radius: 10,
						size: 64,
						variant: "light",
						children: initials
					}), /* @__PURE__ */ jsxs(Stack, {
						gap: 8,
						className: "min-w-0",
						children: [/* @__PURE__ */ jsxs(Group, {
							gap: "xs",
							children: [/* @__PURE__ */ jsx(Title, {
								order: 1,
								size: "h2",
								children: caseRecord.displayName
							}), /* @__PURE__ */ jsx(RiskBadge, { risk: caseRecord.risk })]
						}), /* @__PURE__ */ jsxs(Group, {
							c: "dimmed",
							gap: "sm",
							children: [
								/* @__PURE__ */ jsxs(Text, {
									size: "sm",
									children: ["Case #: ", caseRecord.id]
								}),
								/* @__PURE__ */ jsx(Text, {
									"aria-hidden": "true",
									size: "sm",
									children: "|"
								}),
								/* @__PURE__ */ jsxs(Text, {
									size: "sm",
									children: ["County: ", caseRecord.county]
								})
							]
						})]
					})]
				}), /* @__PURE__ */ jsxs(Group, {
					align: "flex-start",
					gap: "sm",
					children: [/* @__PURE__ */ jsx(Select, {
						allowDeselect: false,
						data: caseStatusOptions,
						label: "Case status",
						onChange: (value) => value ? onStatusChange(value) : void 0,
						radius: 6,
						size: "sm",
						value: caseRecord.status,
						w: 160
					}), /* @__PURE__ */ jsx(Button, {
						leftSection: /* @__PURE__ */ jsx(UserRound, { size: 17 }),
						onClick: onOpenClientInfo,
						radius: 6,
						variant: "light",
						children: "Client info"
					})]
				})]
			}), /* @__PURE__ */ jsxs(SimpleGrid, {
				cols: {
					base: 1,
					sm: 3
				},
				mt: "lg",
				spacing: "sm",
				children: [
					/* @__PURE__ */ jsx(HeaderMetric, {
						icon: /* @__PURE__ */ jsx(CalendarDays, { size: 16 }),
						label: "Opened",
						value: formatDate(caseRecord.opened)
					}),
					/* @__PURE__ */ jsx(HeaderMetric, {
						icon: /* @__PURE__ */ jsx(Clock3, { size: 16 }),
						label: "Last contact",
						value: formatDate(caseRecord.lastContact)
					}),
					/* @__PURE__ */ jsx(HeaderMetric, {
						icon: /* @__PURE__ */ jsx(DollarSign, { size: 16 }),
						label: "Concrete services",
						value: formatExactCurrency(concreteServicesTotal)
					})
				]
			})]
		})]
	});
}
function HeaderMetric({ icon, label, value }) {
	return /* @__PURE__ */ jsxs(Box, {
		className: "rounded-md border border-slate-200 bg-slate-50 px-3 py-2",
		children: [/* @__PURE__ */ jsxs(Group, {
			c: "dimmed",
			gap: 6,
			children: [icon, /* @__PURE__ */ jsx(Text, {
				fw: 700,
				size: "xs",
				tt: "uppercase",
				children: label
			})]
		}), /* @__PURE__ */ jsx(Text, {
			fw: 700,
			mt: 4,
			size: "sm",
			children: value
		})]
	});
}
//#endregion
//#region src/components/case-detail/InfoLine.tsx
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
//#region src/components/case-detail/ClientInfoModal.tsx
function ClientInfoModal({ caseRecord, onClose, opened }) {
	return /* @__PURE__ */ jsx(Modal, {
		opened,
		onClose,
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
	});
}
//#endregion
//#region src/components/case-detail/EnrollmentEditorModal.tsx
function EnrollmentEditorModal({ assignedCaseworkers, availableCaseworkers, caseworkerToAdd, enrollment, onAddCaseworker, onCaseworkerToAddChange, onClose, onGoalChange, onMakePrimary, onRemoveCaseworker, onStatusChange, opened }) {
	return /* @__PURE__ */ jsx(Modal, {
		opened,
		onClose,
		size: "lg",
		title: "Edit enrollment/program status",
		children: enrollment ? /* @__PURE__ */ jsxs(Stack, {
			gap: "md",
			children: [
				/* @__PURE__ */ jsx(Select, {
					allowDeselect: false,
					data: programStatusOptions,
					label: "Program status",
					onChange: (value) => value ? onStatusChange(value) : void 0,
					value: enrollment.status
				}),
				/* @__PURE__ */ jsx(Textarea, {
					autosize: true,
					label: "Program goal",
					minRows: 3,
					value: enrollment.goal,
					onChange: (event) => onGoalChange(event.currentTarget.value)
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
								onChange: onCaseworkerToAddChange,
								placeholder: "Select worker",
								value: caseworkerToAdd,
								w: 220
							}), /* @__PURE__ */ jsx(Button, {
								disabled: !caseworkerToAdd,
								onClick: onAddCaseworker,
								radius: 6,
								children: "Add"
							})]
						})]
					}), /* @__PURE__ */ jsx(Stack, {
						gap: "xs",
						mt: "md",
						children: assignedCaseworkers.map(({ assignment, staff: assignedStaff }) => /* @__PURE__ */ jsxs(Group, {
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
									onClick: () => onMakePrimary(assignment.staffId),
									radius: 6,
									size: "xs",
									variant: "light",
									children: "Make primary"
								}) : null, /* @__PURE__ */ jsx(Button, {
									color: "red",
									disabled: enrollment.caseworkers.length === 1,
									onClick: () => onRemoveCaseworker(assignment.staffId),
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
	});
}
//#endregion
//#region src/components/case-detail/NoteEditorModal.tsx
function NoteEditorModal({ disabledProgramSelect, draft, enrollmentOptions, error, isEditing, onBodyChange, onCancel, onClose, onContactTypeChange, onEnrollmentChange, onInsertQuickNote, onSave, onSessionChange, onSessionHoursBlur, onSessionHoursChange, onSummaryChange, opened }) {
	return /* @__PURE__ */ jsx(Modal, {
		opened,
		onClose,
		size: "lg",
		title: isEditing ? "Edit note" : "Add note",
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
						disabled: disabledProgramSelect,
						error: error === "Program is required." ? "Program is required" : void 0,
						label: "Program",
						onChange: onEnrollmentChange,
						required: true,
						value: draft.enrollmentId
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
						onChange: onContactTypeChange,
						value: draft.contactType
					})]
				}),
				/* @__PURE__ */ jsx(TextInput, {
					label: "Summary",
					value: draft.summary,
					onChange: onSummaryChange
				}),
				/* @__PURE__ */ jsxs(Stack, { children: [/* @__PURE__ */ jsx(Checkbox, {
					checked: draft.isSession,
					label: "Session?",
					onChange: onSessionChange
				}), /* @__PURE__ */ jsx(NumberInput, {
					decimalScale: 2,
					disabled: !draft.isSession,
					error: error === "Hours are required for session notes." ? "Required for sessions" : void 0,
					fixedDecimalScale: true,
					label: "Hours",
					min: .25,
					onBlur: onSessionHoursBlur,
					onChange: onSessionHoursChange,
					required: draft.isSession,
					step: .25,
					value: draft.sessionHours,
					w: 140
				})] }),
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
						onClick: () => onInsertQuickNote(option),
						radius: 6,
						size: "xs",
						variant: "light",
						children: option
					}, option))
				})] }),
				/* @__PURE__ */ jsx(Textarea, {
					autosize: true,
					error: error === "Note body is required." ? "Note body is required" : void 0,
					label: "Note",
					minRows: 5,
					onChange: onBodyChange,
					required: true,
					value: draft.body
				}),
				error && ![
					"Program is required.",
					"Note body is required.",
					"Hours are required for session notes."
				].includes(error) ? /* @__PURE__ */ jsx(Text, {
					c: "red",
					size: "sm",
					children: error
				}) : null,
				/* @__PURE__ */ jsxs(Group, {
					justify: "flex-end",
					children: [/* @__PURE__ */ jsx(Button, {
						onClick: onCancel,
						radius: 6,
						variant: "subtle",
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						leftSection: /* @__PURE__ */ jsx(Save, { size: 17 }),
						onClick: onSave,
						radius: 6,
						children: "Save note"
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/components/case-detail/ConcreteServicesPortal.tsx
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
//#endregion
//#region src/components/case-detail/ProgramNotesPortal.tsx
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
						" -",
						" ",
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
//#endregion
//#region src/components/case-detail/ProgramScopePanel.tsx
function ProgramScopePanel({ caseRecord, enrollmentOptions, enrollmentPrograms, isProgramFiltered, onAddNote, onAddService, onDraftChange, onEditEnrollment, onEditNote, onProgramFilterChange, programId, programNotes, programServices, selectedEnrollment, selectedProgram, serviceDraft }) {
	return /* @__PURE__ */ jsxs(Box, {
		className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
		children: [/* @__PURE__ */ jsxs(Group, {
			align: "flex-start",
			justify: "space-between",
			children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx(Title, {
				order: 2,
				size: "h4",
				children: "Program Enrollments"
			}), /* @__PURE__ */ jsx(Text, {
				c: "dimmed",
				size: "sm",
				children: "All programs the client is enrolled in."
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
						onClick: onEditEnrollment,
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
		}), caseRecord.enrollments.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Stack, {
			className: "overflow-hidden rounded-md border border-slate-200",
			gap: 0,
			mt: "md",
			children: caseRecord.enrollments.map((enrollment) => /* @__PURE__ */ jsx(ProgramEnrollmentRow, {
				enrollment,
				onProgramFilterChange,
				selected: enrollment.programId === programId
			}, enrollment.id))
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
						onAddNote,
						onEditNote
					})
				}),
				/* @__PURE__ */ jsx(Tabs.Panel, {
					value: "services",
					children: /* @__PURE__ */ jsx(ConcreteServicesPortal, {
						enrollmentOptions,
						enrollmentPrograms,
						isProgramFiltered,
						onAdd: onAddService,
						onDraftChange,
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
	});
}
function ProgramEnrollmentRow({ enrollment, onProgramFilterChange, selected }) {
	const program = getProgram(enrollment.programId);
	const primaryCaseworker = getPrimaryCaseworker(enrollment);
	return /* @__PURE__ */ jsx("button", {
		className: ["relative w-full border-0 border-b border-slate-200 bg-white px-4 py-3 text-left transition last:border-b-0", selected ? "bg-[#1C5380]/5 shadow-[inset_4px_0_0_#1C5380]" : "hover:bg-slate-50"].join(" "),
		onClick: () => onProgramFilterChange(enrollment.programId),
		type: "button",
		children: /* @__PURE__ */ jsxs(Group, {
			align: "center",
			justify: "space-between",
			wrap: "wrap",
			children: [/* @__PURE__ */ jsxs(Group, {
				className: "min-w-0 flex-1",
				gap: "md",
				wrap: "nowrap",
				children: [/* @__PURE__ */ jsx(ProgramBadge, { program }), /* @__PURE__ */ jsxs(Box, {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx(Text, {
						fw: 700,
						truncate: true,
						children: program?.name ?? "Program"
					}), /* @__PURE__ */ jsxs(Text, {
						c: "dimmed",
						size: "sm",
						children: ["Enrolled: ", formatDate(enrollment.opened)]
					})]
				})]
			}), /* @__PURE__ */ jsxs(Group, {
				gap: "lg",
				wrap: "wrap",
				children: [
					/* @__PURE__ */ jsx(ProgramStatusBadge, { status: enrollment.status }),
					/* @__PURE__ */ jsxs(Box, {
						className: "min-w-36",
						children: [/* @__PURE__ */ jsx(Text, {
							c: "dimmed",
							size: "xs",
							children: "Primary caseworker"
						}), /* @__PURE__ */ jsx(Text, {
							fw: 700,
							size: "sm",
							children: primaryCaseworker?.name ?? "Unassigned"
						})]
					}),
					/* @__PURE__ */ jsxs(Box, {
						className: "min-w-24",
						children: [/* @__PURE__ */ jsx(Text, {
							c: "dimmed",
							size: "xs",
							children: "Assigned"
						}), /* @__PURE__ */ jsxs(Text, {
							fw: 700,
							size: "sm",
							children: [
								enrollment.caseworkers.length,
								" worker",
								enrollment.caseworkers.length === 1 ? "" : "s"
							]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/components/case-detail/RelatedPeoplePanel.tsx
function RelatedPeoplePanel({ caseRecord, onNavigateToCase }) {
	return /* @__PURE__ */ jsxs(Box, {
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
						onClick: () => onNavigateToCase(person.linkedCaseId),
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
	});
}
//#endregion
//#region src/components/case-detail/types.ts
function createEmptyNoteDraft(enrollmentId = "") {
	return {
		enrollmentId,
		contactType: "Phone",
		summary: "",
		body: "",
		isSession: true,
		sessionHours: ""
	};
}
//#endregion
//#region src/components/CaseDetail.tsx
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
	const currentCase = caseRecord;
	function openAddNote() {
		const defaultEnrollmentId = selectedEnrollment?.id ?? "";
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
	function handleNoteEnrollmentChange(value) {
		setNoteDraft((current) => ({
			...current,
			enrollmentId: value ?? ""
		}));
	}
	function handleNoteContactTypeChange(value) {
		setNoteDraft((current) => ({
			...current,
			contactType: value ?? "Phone"
		}));
	}
	function handleNoteSummaryChange(event) {
		const { value } = event.currentTarget;
		setNoteDraft((current) => ({
			...current,
			summary: value
		}));
	}
	function handleNoteSessionChange(event) {
		const { checked } = event.currentTarget;
		setNoteDraft((current) => ({
			...current,
			isSession: checked,
			sessionHours: checked ? current.sessionHours || 1 : ""
		}));
	}
	function handleNoteSessionHoursBlur() {
		setNoteDraft((current) => ({
			...current,
			sessionHours: typeof current.sessionHours === "number" ? roundToNearestQuarter(current.sessionHours) : current.sessionHours
		}));
	}
	function handleNoteSessionHoursChange(value) {
		setNoteDraft((current) => ({
			...current,
			sessionHours: typeof value === "number" ? value : ""
		}));
	}
	function handleNoteBodyChange(event) {
		const { value } = event.currentTarget;
		setNoteDraft((current) => ({
			...current,
			body: value
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
		else addNote(currentCase.id, input);
		setEditingNoteId(null);
		setNoteError("");
		noteModalHandlers.close();
	}
	function handleAddService() {
		if (!serviceDraft.enrollmentId || serviceDraft.amount === "") return;
		addConcreteService(currentCase.id, {
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
	function handleAddCaseworker() {
		if (!selectedEnrollment || !caseworkerToAdd) return;
		addCaseworkerAssignment(currentCase.id, selectedEnrollment.id, caseworkerToAdd);
		setCaseworkerToAdd(null);
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(ClientInfoModal, {
			caseRecord: currentCase,
			onClose: clientInfoHandlers.close,
			opened: clientInfoOpen
		}),
		/* @__PURE__ */ jsx(EnrollmentEditorModal, {
			assignedCaseworkers: selectedAssignedCaseworkers,
			availableCaseworkers,
			caseworkerToAdd,
			enrollment: selectedEnrollment,
			onAddCaseworker: handleAddCaseworker,
			onCaseworkerToAddChange: setCaseworkerToAdd,
			onClose: enrollmentModalHandlers.close,
			onGoalChange: (goal) => selectedEnrollment ? updateEnrollment(currentCase.id, selectedEnrollment.id, { goal }) : void 0,
			onMakePrimary: (staffId) => selectedEnrollment ? setPrimaryCaseworker(currentCase.id, selectedEnrollment.id, staffId) : void 0,
			onRemoveCaseworker: (staffId) => selectedEnrollment ? removeCaseworkerAssignment(currentCase.id, selectedEnrollment.id, staffId) : void 0,
			onStatusChange: (status) => selectedEnrollment ? updateEnrollment(currentCase.id, selectedEnrollment.id, { status }) : void 0,
			opened: enrollmentModalOpen
		}),
		/* @__PURE__ */ jsx(NoteEditorModal, {
			disabledProgramSelect: Boolean(selectedEnrollment),
			draft: noteDraft,
			enrollmentOptions,
			error: noteError,
			isEditing: Boolean(editingNoteId),
			onBodyChange: handleNoteBodyChange,
			onCancel: noteModalHandlers.close,
			onClose: noteModalHandlers.close,
			onContactTypeChange: handleNoteContactTypeChange,
			onEnrollmentChange: handleNoteEnrollmentChange,
			onInsertQuickNote: insertQuickNote,
			onSave: handleSaveNote,
			onSessionChange: handleNoteSessionChange,
			onSessionHoursBlur: handleNoteSessionHoursBlur,
			onSessionHoursChange: handleNoteSessionHoursChange,
			onSummaryChange: handleNoteSummaryChange,
			opened: noteModalOpen
		}),
		/* @__PURE__ */ jsxs(Stack, {
			gap: "lg",
			children: [
				/* @__PURE__ */ jsx(CaseHeader, {
					caseRecord: currentCase,
					concreteServicesTotal: caseServicesTotal,
					onOpenClientInfo: clientInfoHandlers.open,
					onStatusChange: (status) => updateCaseStatus(currentCase.id, status)
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
				/* @__PURE__ */ jsx(ProgramScopePanel, {
					caseRecord: currentCase,
					enrollmentOptions,
					enrollmentPrograms,
					isProgramFiltered: Boolean(selectedEnrollment),
					onAddNote: openAddNote,
					onAddService: handleAddService,
					onDraftChange: setServiceDraft,
					onEditEnrollment: enrollmentModalHandlers.open,
					onEditNote: openEditNote,
					onProgramFilterChange,
					programId,
					programNotes,
					programServices,
					selectedEnrollment,
					selectedProgram,
					serviceDraft
				}),
				/* @__PURE__ */ jsx(RelatedPeoplePanel, {
					caseRecord: currentCase,
					onNavigateToCase: (linkedCaseId) => navigate({
						to: "/cases/$caseId",
						params: { caseId: linkedCaseId }
					})
				})
			]
		})
	] });
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
