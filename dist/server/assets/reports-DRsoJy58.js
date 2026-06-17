import { t as useDemoWorkspace } from "./useDemoWorkspace-CZNFquIu.js";
import { r as formatCurrency, t as buildGrantReport } from "./demo-data-BsOXExLV.js";
import { r as MetricTile } from "./CaseworkUI-CJDE9kkn.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Box, Button, Group, Select, SimpleGrid, Stack, Table, Text, Title } from "@mantine/core";
import { Download, FileChartColumn } from "lucide-react";
//#region src/components/ReportsOverview.tsx
var grantors = [
	"ANFRC",
	"A-RESET",
	"Private Foundation",
	"Medicaid"
];
function ReportsOverview() {
	const { cases, notes, services } = useDemoWorkspace();
	const [grantor, setGrantor] = useState("ANFRC");
	const [message, setMessage] = useState("");
	const report = buildGrantReport(cases, notes, services, grantor);
	function exportReport() {
		setMessage(`${grantor} CSV prepared with ${report.totalEnrollments} enrollments and ${formatCurrency(report.dollarsSpent)} in services.`);
	}
	return /* @__PURE__ */ jsxs(Stack, {
		gap: "lg",
		children: [
			/* @__PURE__ */ jsxs(Group, {
				align: "flex-start",
				justify: "space-between",
				children: [/* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx(Text, {
					c: "dimmed",
					fw: 700,
					size: "sm",
					tt: "uppercase",
					children: "Reports"
				}), /* @__PURE__ */ jsx(Title, {
					order: 1,
					size: "h2",
					children: "Grantor reporting"
				})] }), /* @__PURE__ */ jsx(Button, {
					leftSection: /* @__PURE__ */ jsx(Download, { size: 17 }),
					onClick: exportReport,
					radius: 6,
					children: "Export CSV"
				})]
			}),
			/* @__PURE__ */ jsxs(Box, {
				className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
				children: [
					/* @__PURE__ */ jsx(Select, {
						allowDeselect: false,
						data: grantors,
						label: "Grantor",
						onChange: (value) => {
							setMessage("");
							if (value) setGrantor(value);
						},
						value: grantor,
						w: 260
					}),
					/* @__PURE__ */ jsxs(SimpleGrid, {
						cols: {
							base: 1,
							sm: 2,
							lg: 5
						},
						mt: "md",
						children: [
							/* @__PURE__ */ jsx(MetricTile, {
								helper: "Active in grant programs",
								icon: FileChartColumn,
								label: "Active clients",
								value: report.activeClients
							}),
							/* @__PURE__ */ jsx(MetricTile, {
								helper: "Total grant enrollments",
								icon: FileChartColumn,
								label: "Enrollments",
								value: report.totalEnrollments
							}),
							/* @__PURE__ */ jsx(MetricTile, {
								helper: "Concrete service rows",
								icon: FileChartColumn,
								label: "Services",
								value: report.servicesProvided
							}),
							/* @__PURE__ */ jsx(MetricTile, {
								helper: "Grant-attributed spend",
								icon: FileChartColumn,
								label: "Dollars",
								value: formatCurrency(report.dollarsSpent)
							}),
							/* @__PURE__ */ jsx(MetricTile, {
								helper: "Program-specific notes",
								icon: FileChartColumn,
								label: "Notes",
								value: report.caseNotes
							})
						]
					}),
					message ? /* @__PURE__ */ jsx(Box, {
						className: "mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3",
						children: /* @__PURE__ */ jsx(Text, {
							c: "green",
							fw: 700,
							size: "sm",
							children: message
						})
					}) : null
				]
			}),
			/* @__PURE__ */ jsxs(Box, {
				className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
				children: [/* @__PURE__ */ jsx(Title, {
					order: 2,
					size: "h4",
					children: "Report templates"
				}), /* @__PURE__ */ jsx(Table.ScrollContainer, {
					minWidth: 780,
					mt: "md",
					children: /* @__PURE__ */ jsxs(Table, {
						verticalSpacing: "sm",
						children: [/* @__PURE__ */ jsx(Table.Thead, { children: /* @__PURE__ */ jsxs(Table.Tr, { children: [
							/* @__PURE__ */ jsx(Table.Th, { children: "Grantor" }),
							/* @__PURE__ */ jsx(Table.Th, { children: "Monthly report" }),
							/* @__PURE__ */ jsx(Table.Th, { children: "Annual report" }),
							/* @__PURE__ */ jsx(Table.Th, { children: "Primary fields" })
						] }) }), /* @__PURE__ */ jsxs(Table.Tbody, { children: [/* @__PURE__ */ jsxs(Table.Tr, { children: [
							/* @__PURE__ */ jsx(Table.Td, { children: "ANFRC" }),
							/* @__PURE__ */ jsx(Table.Td, { children: "Families, contacts, services" }),
							/* @__PURE__ */ jsx(Table.Td, { children: "Unduplicated clients, outcomes" }),
							/* @__PURE__ */ jsx(Table.Td, { children: "Program, county, concrete services" })
						] }), /* @__PURE__ */ jsxs(Table.Tr, { children: [
							/* @__PURE__ */ jsx(Table.Td, { children: "A-RESET" }),
							/* @__PURE__ */ jsx(Table.Td, { children: "Employment activities, supports" }),
							/* @__PURE__ */ jsx(Table.Td, { children: "Training and job outcomes" }),
							/* @__PURE__ */ jsx(Table.Td, { children: "Service type, spend, status" })
						] })] })]
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/routes/reports.tsx?tsr-split=component
var SplitComponent = ReportsOverview;
//#endregion
export { SplitComponent as component };
