import { jsx, jsxs } from "react/jsx-runtime";
import { Badge, Box, Group, Text, ThemeIcon, Title } from "@mantine/core";
//#region src/components/CaseworkUI.tsx
function MetricTile({ icon: Icon, label, value, helper }) {
	return /* @__PURE__ */ jsxs(Box, {
		className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
		children: [/* @__PURE__ */ jsxs(Group, {
			justify: "space-between",
			wrap: "nowrap",
			children: [/* @__PURE__ */ jsxs(Box, {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsx(Text, {
					c: "dimmed",
					fw: 700,
					size: "sm",
					tt: "uppercase",
					children: label
				}), /* @__PURE__ */ jsx(Title, {
					order: 3,
					mt: 4,
					size: "h2",
					children: value
				})]
			}), /* @__PURE__ */ jsx(ThemeIcon, {
				color: "frcBlue",
				radius: 6,
				size: 40,
				variant: "light",
				children: /* @__PURE__ */ jsx(Icon, { size: 21 })
			})]
		}), /* @__PURE__ */ jsx(Text, {
			c: "dimmed",
			mt: "sm",
			size: "sm",
			children: helper
		})]
	});
}
function CaseStatusBadge({ status }) {
	return /* @__PURE__ */ jsx(Badge, {
		color: caseStatusColor(status),
		children: status
	});
}
function ProgramStatusBadge({ status }) {
	return /* @__PURE__ */ jsx(Badge, {
		color: programStatusColor(status),
		children: status
	});
}
function RiskBadge({ risk }) {
	return /* @__PURE__ */ jsx(Badge, {
		color: riskColor(risk),
		variant: "dot",
		children: risk
	});
}
function ProgramBadge({ program }) {
	if (!program) return /* @__PURE__ */ jsx(Badge, {
		color: "gray",
		children: "Program"
	});
	return /* @__PURE__ */ jsx(Badge, {
		style: {
			backgroundColor: `${program.color}16`,
			color: program.color
		},
		children: program.code
	});
}
function EmptyState({ icon: Icon, title }) {
	return /* @__PURE__ */ jsxs(Box, {
		className: "rounded-md border border-dashed border-slate-300 bg-white p-8 text-center",
		children: [/* @__PURE__ */ jsx(ThemeIcon, {
			color: "gray",
			mx: "auto",
			radius: 6,
			size: 42,
			variant: "light",
			children: /* @__PURE__ */ jsx(Icon, { size: 22 })
		}), /* @__PURE__ */ jsx(Text, {
			c: "dimmed",
			fw: 700,
			mt: "sm",
			children: title
		})]
	});
}
function caseStatusColor(status) {
	if (status === "Open") return "frcBlue";
	if (status === "Pending") return "yellow";
	return "gray";
}
function programStatusColor(status) {
	if (status === "Active") return "green";
	if (status === "Pending" || status === "Waitlisted") return "yellow";
	if (status === "Completed") return "frcBlue";
	return "gray";
}
function riskColor(risk) {
	if (risk === "High") return "red";
	if (risk === "Medium") return "yellow";
	return "green";
}
//#endregion
export { ProgramStatusBadge as a, ProgramBadge as i, EmptyState as n, RiskBadge as o, MetricTile as r, CaseStatusBadge as t };
