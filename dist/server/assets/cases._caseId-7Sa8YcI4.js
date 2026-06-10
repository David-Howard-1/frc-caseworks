import { a as formatExactCurrency, l as staff, o as getProgram, s as getStaff, t as useDemoWorkspace } from "./useDemoWorkspace-BjowWMof.js";
import { t as Route } from "./cases._caseId-Y-YiEW3S.js";
import { a as ProgramStatusBadge, i as ProgramBadge, n as EmptyState, o as RiskBadge, t as CaseStatusBadge } from "./CaseworkUI-CJDE9kkn.js";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Badge, Box, Button, Group, Modal, NumberInput, Select, SimpleGrid, Stack, Table, Tabs, Text, TextInput, Textarea, Title } from "@mantine/core";
import { ArrowLeft, ClipboardList, DollarSign, FileText, Save, UserRound, UsersRound } from "lucide-react";
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
function CaseDetail({ caseId }) {
	const { addConcreteService, addNote, cases, notes, services, updateCaseStatus, updateEnrollment, visibleCases } = useDemoWorkspace();
	const navigate = useNavigate();
	const [clientInfoOpen, clientInfoHandlers] = useDisclosure(false);
	const caseRecord = cases.find((item) => item.id === caseId);
	const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(caseRecord?.enrollments[0]?.id ?? "");
	const [noteDraft, setNoteDraft] = useState({
		contactType: "Phone",
		summary: "",
		body: ""
	});
	const [serviceDraft, setServiceDraft] = useState({
		category: "Family supplies",
		description: "",
		amount: ""
	});
	useEffect(() => {
		if (!caseRecord) return;
		if (!caseRecord.enrollments.some((enrollment) => enrollment.id === selectedEnrollmentId)) setSelectedEnrollmentId(caseRecord.enrollments[0]?.id ?? "");
	}, [caseRecord, selectedEnrollmentId]);
	const canViewCase = visibleCases.some((item) => item.id === caseRecord?.id);
	const selectedEnrollment = caseRecord?.enrollments.find((enrollment) => enrollment.id === selectedEnrollmentId);
	const selectedProgram = selectedEnrollment ? getProgram(selectedEnrollment.programId) : void 0;
	const programNotes = notes.filter((note) => note.caseId === caseRecord?.id && note.enrollmentId === selectedEnrollmentId).sort((a, b) => b.date.localeCompare(a.date));
	const programServices = services.filter((service) => service.caseId === caseRecord?.id && service.enrollmentId === selectedEnrollmentId).sort((a, b) => b.date.localeCompare(a.date));
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
	function handleSaveNote() {
		if (!selectedEnrollmentId) return;
		addNote(caseRecord.id, {
			enrollmentId: selectedEnrollmentId,
			contactType: noteDraft.contactType,
			summary: noteDraft.summary,
			body: noteDraft.body
		});
		setNoteDraft((current) => ({
			...current,
			summary: "",
			body: ""
		}));
	}
	function handleAddService() {
		if (!selectedEnrollmentId || serviceDraft.amount === "") return;
		addConcreteService(caseRecord.id, {
			enrollmentId: selectedEnrollmentId,
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Modal, {
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
	}), /* @__PURE__ */ jsxs(Stack, {
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
								caseRecord.lastContact
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
							value: caseRecord.opened
						}),
						/* @__PURE__ */ jsx(StatusTile, {
							label: "Last contact",
							value: caseRecord.lastContact
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
					})] }), selectedProgram ? /* @__PURE__ */ jsx(ProgramBadge, { program: selectedProgram }) : null]
				}), caseRecord.enrollments.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsx(SimpleGrid, {
						cols: {
							base: 1,
							lg: 3
						},
						mt: "md",
						children: caseRecord.enrollments.map((enrollment) => {
							const program = getProgram(enrollment.programId);
							return /* @__PURE__ */ jsxs("button", {
								className: ["rounded-md border bg-white p-3 text-left transition", enrollment.id === selectedEnrollmentId ? "border-[#1C5380] ring-2 ring-[#1C5380]/15" : "border-slate-200 hover:border-slate-300"].join(" "),
								onClick: () => setSelectedEnrollmentId(enrollment.id),
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
									/* @__PURE__ */ jsx(Text, {
										c: "dimmed",
										size: "sm",
										children: getStaff(enrollment.caseworkerId)?.name
									})
								]
							}, enrollment.id);
						})
					}),
					selectedEnrollment ? /* @__PURE__ */ jsxs(Box, {
						className: "mt-4 rounded-md border border-slate-200 p-4",
						children: [/* @__PURE__ */ jsxs(SimpleGrid, {
							cols: {
								base: 1,
								md: 3
							},
							children: [
								/* @__PURE__ */ jsx(Select, {
									allowDeselect: false,
									data: programStatusOptions,
									label: "Program status",
									onChange: (value) => value ? updateEnrollment(caseRecord.id, selectedEnrollment.id, { status: value }) : void 0,
									value: selectedEnrollment.status
								}),
								/* @__PURE__ */ jsx(Select, {
									allowDeselect: false,
									data: staff.filter((person) => person.role === "Caseworker" && person.programs.includes(selectedEnrollment.programId)).map((person) => ({
										value: person.id,
										label: person.name
									})),
									label: "Caseworker",
									onChange: (value) => value ? updateEnrollment(caseRecord.id, selectedEnrollment.id, { caseworkerId: value }) : void 0,
									value: selectedEnrollment.caseworkerId
								}),
								/* @__PURE__ */ jsx(TextInput, {
									label: "Target date",
									value: selectedEnrollment.target,
									onChange: (event) => updateEnrollment(caseRecord.id, selectedEnrollment.id, { target: event.currentTarget.value })
								})
							]
						}), /* @__PURE__ */ jsx(Textarea, {
							autosize: true,
							label: "Program goal",
							minRows: 2,
							mt: "md",
							value: selectedEnrollment.goal,
							onChange: (event) => updateEnrollment(caseRecord.id, selectedEnrollment.id, { goal: event.currentTarget.value })
						})]
					}) : null,
					/* @__PURE__ */ jsxs(Tabs, {
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
									notes: programNotes,
									noteDraft,
									onDraftChange: setNoteDraft,
									onSave: handleSaveNote
								})
							}),
							/* @__PURE__ */ jsx(Tabs.Panel, {
								value: "services",
								children: /* @__PURE__ */ jsx(ConcreteServicesPortal, {
									onAdd: handleAddService,
									onDraftChange: setServiceDraft,
									serviceDraft,
									services: programServices
								})
							})
						]
					})
				] }) : /* @__PURE__ */ jsx(Box, {
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
	})] });
}
function ProgramNotesPortal({ noteDraft, notes, onDraftChange, onSave }) {
	return /* @__PURE__ */ jsxs(Stack, {
		gap: "md",
		mt: "md",
		children: [/* @__PURE__ */ jsxs(Box, {
			className: "rounded-md border border-slate-200 p-4",
			children: [
				/* @__PURE__ */ jsxs(SimpleGrid, {
					cols: {
						base: 1,
						md: 3
					},
					children: [/* @__PURE__ */ jsx(Select, {
						allowDeselect: false,
						data: [
							"Phone",
							"Home visit",
							"Office visit",
							"Service coordination",
							"Closure"
						],
						label: "Contact",
						onChange: (value) => onDraftChange({
							...noteDraft,
							contactType: value ?? "Phone"
						}),
						value: noteDraft.contactType
					}), /* @__PURE__ */ jsx(TextInput, {
						className: "md:col-span-2",
						label: "Summary",
						value: noteDraft.summary,
						onChange: (event) => onDraftChange({
							...noteDraft,
							summary: event.currentTarget.value
						})
					})]
				}),
				/* @__PURE__ */ jsx(Textarea, {
					autosize: true,
					label: "Note",
					minRows: 4,
					mt: "md",
					value: noteDraft.body,
					onChange: (event) => onDraftChange({
						...noteDraft,
						body: event.currentTarget.value
					})
				}),
				/* @__PURE__ */ jsx(Group, {
					justify: "flex-end",
					mt: "md",
					children: /* @__PURE__ */ jsx(Button, {
						leftSection: /* @__PURE__ */ jsx(Save, { size: 17 }),
						onClick: onSave,
						radius: 6,
						children: "Save note"
					})
				})
			]
		}), notes.length > 0 ? notes.map((note) => /* @__PURE__ */ jsxs(Box, {
			className: "rounded-md border border-slate-200 p-4",
			children: [
				/* @__PURE__ */ jsxs(Group, {
					justify: "space-between",
					children: [/* @__PURE__ */ jsx(Text, {
						fw: 700,
						children: note.summary
					}), /* @__PURE__ */ jsx(Text, {
						c: "dimmed",
						size: "sm",
						children: note.date
					})]
				}),
				/* @__PURE__ */ jsxs(Text, {
					c: "dimmed",
					mt: 4,
					size: "sm",
					children: [
						note.contactType,
						" - ",
						getStaff(note.authorId)?.name
					]
				}),
				/* @__PURE__ */ jsx(Text, {
					mt: "sm",
					children: note.body
				})
			]
		}, note.id)) : /* @__PURE__ */ jsx(EmptyState, {
			icon: FileText,
			title: "No notes for this program"
		})]
	});
}
function ConcreteServicesPortal({ onAdd, onDraftChange, serviceDraft, services }) {
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
						data: serviceCategories,
						label: "Category",
						onChange: (value) => onDraftChange({
							...serviceDraft,
							category: value ?? "Family supplies"
						}),
						value: serviceDraft.category
					}),
					/* @__PURE__ */ jsx(TextInput, {
						className: "md:col-span-2",
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
			minWidth: 680,
			children: /* @__PURE__ */ jsxs(Table, {
				verticalSpacing: "sm",
				children: [/* @__PURE__ */ jsx(Table.Thead, { children: /* @__PURE__ */ jsxs(Table.Tr, { children: [
					/* @__PURE__ */ jsx(Table.Th, { children: "Date" }),
					/* @__PURE__ */ jsx(Table.Th, { children: "Category" }),
					/* @__PURE__ */ jsx(Table.Th, { children: "Description" }),
					/* @__PURE__ */ jsx(Table.Th, {
						ta: "right",
						children: "Amount"
					})
				] }) }), /* @__PURE__ */ jsx(Table.Tbody, { children: services.map((service) => /* @__PURE__ */ jsxs(Table.Tr, { children: [
					/* @__PURE__ */ jsx(Table.Td, { children: service.date }),
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
//#region src/routes/cases.$caseId.tsx?tsr-split=component
function CaseDetailRoute() {
	const { caseId } = Route.useParams();
	return /* @__PURE__ */ jsx(CaseDetail, { caseId });
}
//#endregion
export { CaseDetailRoute as component };
