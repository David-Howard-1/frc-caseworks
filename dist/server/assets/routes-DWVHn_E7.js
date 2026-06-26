import { t as useDemoWorkspace } from "./useDemoWorkspace-HKkN5mR6.js";
import { c as getProgram, i as formatDate, m as programs, r as formatCurrency } from "./demo-data-BsOXExLV.js";
import { i as ProgramBadge, r as MetricTile, t as CaseStatusBadge } from "./CaseworkUI-CJDE9kkn.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Box, Group, SimpleGrid, Stack, Table, Text, Title } from "@mantine/core";
import { BriefcaseBusiness, Building2, ClipboardList, DollarSign } from "lucide-react";
//#region src/components/DashboardOverview.tsx
var caseStatuses = [
	"Open",
	"Pending",
	"Closed"
];
function DashboardOverview() {
	const { metrics, role, services, visibleCases } = useDemoWorkspace();
	const visibleCaseIds = new Set(visibleCases.map((caseRecord) => caseRecord.id));
	const visibleServices = services.filter((service) => visibleCaseIds.has(service.caseId));
	const programRows = programs.map((program) => {
		const enrollments = visibleCases.flatMap((caseRecord) => caseRecord.enrollments.filter((enrollment) => enrollment.programId === program.id));
		return {
			program,
			enrollments,
			active: enrollments.filter((enrollment) => enrollment.status === "Active").length
		};
	});
	return /* @__PURE__ */ jsxs(Stack, {
		gap: "lg",
		children: [
			/* @__PURE__ */ jsx(Group, {
				align: "flex-start",
				justify: "space-between",
				children: /* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx(Text, {
					c: "dimmed",
					fw: 700,
					size: "sm",
					tt: "uppercase",
					children: "Dashboard"
				}), /* @__PURE__ */ jsxs(Title, {
					order: 1,
					size: "h2",
					children: [role, " overview"]
				})] })
			}),
			/* @__PURE__ */ jsxs(SimpleGrid, {
				cols: {
					base: 1,
					sm: 2,
					lg: 4
				},
				children: [
					/* @__PURE__ */ jsx(MetricTile, {
						helper: "Active in at least one program",
						icon: BriefcaseBusiness,
						label: "Open cases",
						value: metrics.openCases
					}),
					/* @__PURE__ */ jsx(MetricTile, {
						helper: "Intake completed, no program assigned",
						icon: ClipboardList,
						label: "Pending intakes",
						value: metrics.pendingCases
					}),
					/* @__PURE__ */ jsx(MetricTile, {
						helper: "Visible program-level assignments",
						icon: Building2,
						label: "Active enrollments",
						value: metrics.activeEnrollments
					}),
					/* @__PURE__ */ jsx(MetricTile, {
						helper: "Visible concrete services",
						icon: DollarSign,
						label: "Service spend",
						value: formatCurrency(metrics.serviceSpend)
					})
				]
			}),
			/* @__PURE__ */ jsxs(Box, {
				className: "grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]",
				children: [/* @__PURE__ */ jsxs(Box, {
					className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
					children: [/* @__PURE__ */ jsx(Title, {
						order: 2,
						size: "h4",
						children: "Program activity"
					}), /* @__PURE__ */ jsx(Table.ScrollContainer, {
						minWidth: 620,
						mt: "md",
						children: /* @__PURE__ */ jsxs(Table, {
							verticalSpacing: "sm",
							children: [/* @__PURE__ */ jsx(Table.Thead, { children: /* @__PURE__ */ jsxs(Table.Tr, { children: [
								/* @__PURE__ */ jsx(Table.Th, { children: "Program" }),
								/* @__PURE__ */ jsx(Table.Th, { children: "Grantor" }),
								/* @__PURE__ */ jsx(Table.Th, {
									ta: "right",
									children: "Enrollments"
								}),
								/* @__PURE__ */ jsx(Table.Th, {
									ta: "right",
									children: "Active"
								})
							] }) }), /* @__PURE__ */ jsx(Table.Tbody, { children: programRows.map(({ active, enrollments, program }) => /* @__PURE__ */ jsxs(Table.Tr, { children: [
								/* @__PURE__ */ jsxs(Table.Td, { children: [/* @__PURE__ */ jsx(ProgramBadge, { program }), /* @__PURE__ */ jsx(Text, {
									fw: 700,
									mt: 4,
									children: program.name
								})] }),
								/* @__PURE__ */ jsx(Table.Td, { children: program.grantor }),
								/* @__PURE__ */ jsx(Table.Td, {
									ta: "right",
									children: enrollments.length
								}),
								/* @__PURE__ */ jsx(Table.Td, {
									ta: "right",
									children: active
								})
							] }, program.id)) })]
						})
					})]
				}), /* @__PURE__ */ jsxs(Box, {
					className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
					children: [/* @__PURE__ */ jsx(Title, {
						order: 2,
						size: "h4",
						children: "Case status"
					}), /* @__PURE__ */ jsx(Stack, {
						gap: "sm",
						mt: "md",
						children: caseStatuses.map((status) => /* @__PURE__ */ jsxs(Group, {
							className: "rounded-md border border-slate-200 p-3",
							justify: "space-between",
							children: [/* @__PURE__ */ jsx(CaseStatusBadge, { status }), /* @__PURE__ */ jsx(Text, {
								fw: 700,
								children: visibleCases.filter((caseRecord) => caseRecord.status === status).length
							})]
						}, status))
					})]
				})]
			}),
			/* @__PURE__ */ jsxs(Box, {
				className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
				children: [/* @__PURE__ */ jsx(Title, {
					order: 2,
					size: "h4",
					children: "Recent concrete services"
				}), /* @__PURE__ */ jsx(Table.ScrollContainer, {
					minWidth: 700,
					mt: "md",
					children: /* @__PURE__ */ jsxs(Table, {
						verticalSpacing: "sm",
						children: [/* @__PURE__ */ jsx(Table.Thead, { children: /* @__PURE__ */ jsxs(Table.Tr, { children: [
							/* @__PURE__ */ jsx(Table.Th, { children: "Date" }),
							/* @__PURE__ */ jsx(Table.Th, { children: "Program" }),
							/* @__PURE__ */ jsx(Table.Th, { children: "Description" }),
							/* @__PURE__ */ jsx(Table.Th, {
								ta: "right",
								children: "Amount"
							})
						] }) }), /* @__PURE__ */ jsx(Table.Tbody, { children: visibleServices.slice(0, 5).map((service) => {
							const enrollment = visibleCases.find((item) => item.id === service.caseId)?.enrollments.find((item) => item.id === service.enrollmentId);
							const program = enrollment ? getProgram(enrollment.programId) : void 0;
							return /* @__PURE__ */ jsxs(Table.Tr, { children: [
								/* @__PURE__ */ jsx(Table.Td, { children: formatDate(service.date) }),
								/* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsx(ProgramBadge, { program }) }),
								/* @__PURE__ */ jsx(Table.Td, { children: service.description }),
								/* @__PURE__ */ jsx(Table.Td, {
									ta: "right",
									children: formatCurrency(service.amount)
								})
							] }, service.id);
						}) })]
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var SplitComponent = DashboardOverview;
//#endregion
export { SplitComponent as component };
