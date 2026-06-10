import { c as programs, o as getProgram, s as getStaff, t as useDemoWorkspace } from "./useDemoWorkspace-BjowWMof.js";
import { a as ProgramStatusBadge, i as ProgramBadge, n as EmptyState, o as RiskBadge, t as CaseStatusBadge } from "./CaseworkUI-CJDE9kkn.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Box, Group, Pagination, Select, Stack, Table, Text, TextInput, Title } from "@mantine/core";
import { Search } from "lucide-react";
//#region src/components/CasesIndex.tsx
var PAGE_SIZE = 20;
var caseStatusOptions = [
	"All",
	"Open",
	"Pending",
	"Closed"
];
function CasesIndex() {
	const { cases, currentStaffId, role, visibleCases } = useDemoWorkspace();
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [page, setPage] = useState(1);
	const [programId, setProgramId] = useState(null);
	const supervisorPrograms = useMemo(() => programs.filter((program) => program.supervisorId === currentStaffId), [currentStaffId]);
	useEffect(() => {
		if (role !== "Program Supervisor") {
			setProgramId(null);
			return;
		}
		if (supervisorPrograms.length > 0 && !supervisorPrograms.some((program) => program.id === programId)) setProgramId(supervisorPrograms[0].id);
	}, [
		programId,
		role,
		supervisorPrograms
	]);
	const scopedCases = useMemo(() => {
		if (role !== "Program Supervisor" || !programId) return visibleCases;
		return cases.filter((caseRecord) => caseRecord.enrollments.some((enrollment) => enrollment.programId === programId && enrollment.supervisorId === currentStaffId));
	}, [
		cases,
		currentStaffId,
		programId,
		role,
		visibleCases
	]);
	const filteredCases = useMemo(() => {
		const loweredQuery = query.trim().toLowerCase();
		return scopedCases.filter((caseRecord) => {
			const matchesStatus = statusFilter === "All" || caseRecord.status === statusFilter;
			const matchesQuery = !loweredQuery || caseRecord.displayName.toLowerCase().includes(loweredQuery) || caseRecord.id.toLowerCase().includes(loweredQuery) || caseRecord.county.toLowerCase().includes(loweredQuery);
			return matchesStatus && matchesQuery;
		});
	}, [
		query,
		scopedCases,
		statusFilter
	]);
	useEffect(() => {
		setPage(1);
	}, [
		programId,
		query,
		statusFilter
	]);
	const totalPages = Math.max(1, Math.ceil(filteredCases.length / PAGE_SIZE));
	const pageCases = filteredCases.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const activeProgram = programId ? getProgram(programId) : void 0;
	return /* @__PURE__ */ jsxs(Stack, {
		gap: "lg",
		children: [/* @__PURE__ */ jsx(Group, {
			align: "flex-start",
			justify: "space-between",
			children: /* @__PURE__ */ jsxs(Box, { children: [
				/* @__PURE__ */ jsx(Text, {
					c: "dimmed",
					fw: 700,
					size: "sm",
					tt: "uppercase",
					children: "Cases"
				}),
				/* @__PURE__ */ jsx(Title, {
					order: 1,
					size: "h2",
					children: role === "Caseworker" ? "Assigned cases" : role === "Program Supervisor" ? activeProgram?.name ?? "Program cases" : "All cases"
				}),
				/* @__PURE__ */ jsxs(Text, {
					c: "dimmed",
					mt: 4,
					children: [
						filteredCases.length,
						" case",
						filteredCases.length === 1 ? "" : "s",
						" - 20 per page"
					]
				})
			] })
		}), /* @__PURE__ */ jsxs(Box, {
			className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
			children: [/* @__PURE__ */ jsxs(Group, {
				align: "flex-end",
				gap: "sm",
				children: [
					/* @__PURE__ */ jsx(TextInput, {
						className: "min-w-[240px] flex-1",
						leftSection: /* @__PURE__ */ jsx(Search, { size: 16 }),
						label: "Search",
						placeholder: "Name, case ID, county",
						value: query,
						onChange: (event) => setQuery(event.currentTarget.value)
					}),
					/* @__PURE__ */ jsx(Select, {
						allowDeselect: false,
						data: caseStatusOptions,
						label: "Status",
						onChange: (value) => setStatusFilter(value ?? "All"),
						value: statusFilter,
						w: 150
					}),
					role === "Program Supervisor" ? /* @__PURE__ */ jsx(Select, {
						allowDeselect: false,
						data: supervisorPrograms.map((program) => ({
							value: program.id,
							label: program.name
						})),
						label: "Program",
						onChange: setProgramId,
						value: programId,
						w: 260
					}) : null
				]
			}), pageCases.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Table.ScrollContainer, {
				minWidth: 920,
				mt: "md",
				children: /* @__PURE__ */ jsxs(Table, {
					highlightOnHover: true,
					verticalSpacing: "sm",
					children: [/* @__PURE__ */ jsx(Table.Thead, { children: /* @__PURE__ */ jsxs(Table.Tr, { children: [
						/* @__PURE__ */ jsx(Table.Th, { children: "Client" }),
						/* @__PURE__ */ jsx(Table.Th, { children: "Status" }),
						/* @__PURE__ */ jsx(Table.Th, { children: "Programs" }),
						/* @__PURE__ */ jsx(Table.Th, { children: "Assigned staff" }),
						/* @__PURE__ */ jsx(Table.Th, { children: "Last contact" }),
						/* @__PURE__ */ jsx(Table.Th, { children: "Risk" })
					] }) }), /* @__PURE__ */ jsx(Table.Tbody, { children: pageCases.map((caseRecord) => /* @__PURE__ */ jsxs(Table.Tr, {
						className: "cursor-pointer",
						onClick: () => navigate({
							to: "/cases/$caseId",
							params: { caseId: caseRecord.id }
						}),
						role: "link",
						tabIndex: 0,
						onKeyDown: (event) => {
							if (event.key === "Enter" || event.key === " ") {
								event.preventDefault();
								navigate({
									to: "/cases/$caseId",
									params: { caseId: caseRecord.id }
								});
							}
						},
						children: [
							/* @__PURE__ */ jsxs(Table.Td, { children: [/* @__PURE__ */ jsx(Text, {
								fw: 700,
								children: caseRecord.displayName
							}), /* @__PURE__ */ jsxs(Text, {
								c: "dimmed",
								size: "sm",
								children: [
									caseRecord.id,
									" - ",
									caseRecord.county,
									" County"
								]
							})] }),
							/* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsx(CaseStatusBadge, { status: caseRecord.status }) }),
							/* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsx(Group, {
								gap: 6,
								children: caseRecord.enrollments.length > 0 ? caseRecord.enrollments.map((enrollment) => {
									return /* @__PURE__ */ jsx(ProgramBadge, { program: getProgram(enrollment.programId) }, enrollment.id);
								}) : /* @__PURE__ */ jsx(Text, {
									c: "dimmed",
									size: "sm",
									children: "None"
								})
							}) }),
							/* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsx(Stack, {
								gap: 4,
								children: caseRecord.enrollments.slice(0, 2).map((enrollment) => /* @__PURE__ */ jsxs(Group, {
									gap: 6,
									children: [/* @__PURE__ */ jsx(ProgramStatusBadge, { status: enrollment.status }), /* @__PURE__ */ jsx(Text, {
										size: "sm",
										children: getStaff(enrollment.caseworkerId)?.name
									})]
								}, enrollment.id))
							}) }),
							/* @__PURE__ */ jsx(Table.Td, { children: caseRecord.lastContact }),
							/* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsx(RiskBadge, { risk: caseRecord.risk }) })
						]
					}, caseRecord.id)) })]
				})
			}), /* @__PURE__ */ jsxs(Group, {
				justify: "space-between",
				mt: "md",
				children: [/* @__PURE__ */ jsxs(Text, {
					c: "dimmed",
					size: "sm",
					children: [
						"Page ",
						page,
						" of ",
						totalPages
					]
				}), /* @__PURE__ */ jsx(Pagination, {
					onChange: setPage,
					total: totalPages,
					value: page
				})]
			})] }) : /* @__PURE__ */ jsx(Box, {
				mt: "md",
				children: /* @__PURE__ */ jsx(EmptyState, {
					icon: Search,
					title: "No cases match these filters"
				})
			})]
		})]
	});
}
//#endregion
//#region src/routes/cases.tsx?tsr-split=component
var SplitComponent = CasesIndex;
//#endregion
export { SplitComponent as component };
