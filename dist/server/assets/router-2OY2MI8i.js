import { n as DemoWorkspaceProvider, t as useDemoWorkspace } from "./useDemoWorkspace-xnVl1622.js";
import { t as Route$5 } from "./_caseId-DkNVV6vA.js";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AppShell, Box, Button, ColorSchemeScript, Group, MantineProvider, SegmentedControl, Select, Stack, Text, ThemeIcon, Title, createTheme } from "@mantine/core";
import { BriefcaseBusiness, FileChartColumn, HeartHandshake, LayoutDashboard, Plus } from "lucide-react";
//#region src/components/AppFrame.tsx
var navigation = [
	{
		label: "Dashboard",
		to: "/",
		icon: LayoutDashboard
	},
	{
		label: "Cases",
		to: "/cases",
		icon: BriefcaseBusiness
	},
	{
		label: "Reports",
		to: "/reports",
		icon: FileChartColumn
	}
];
function AppFrame({ children }) {
	const { currentStaffId, role, setCurrentStaffId, setRole, staffChoices } = useDemoWorkspace();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	return /* @__PURE__ */ jsxs(AppShell, {
		header: { height: 64 },
		navbar: {
			width: 268,
			breakpoint: "sm"
		},
		padding: 0,
		children: [
			/* @__PURE__ */ jsx(AppShell.Header, {
				className: "border-b border-slate-200 bg-white",
				children: /* @__PURE__ */ jsxs(Group, {
					className: "h-full px-4 sm:px-6",
					justify: "space-between",
					children: [/* @__PURE__ */ jsxs(Group, {
						gap: "sm",
						wrap: "nowrap",
						children: [/* @__PURE__ */ jsx(ThemeIcon, {
							color: "frcBlue",
							radius: 6,
							size: 40,
							children: /* @__PURE__ */ jsx(HeartHandshake, { size: 22 })
						}), /* @__PURE__ */ jsxs(Box, {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx(Title, {
								order: 1,
								size: "h3",
								children: "FRC CaseWorks"
							}), /* @__PURE__ */ jsx(Text, {
								c: "dimmed",
								size: "sm",
								children: "River Valley Family Resource Center"
							})]
						})]
					}), /* @__PURE__ */ jsx(Button, {
						leftSection: /* @__PURE__ */ jsx(Plus, { size: 17 }),
						radius: 6,
						children: "New intake"
					})]
				})
			}),
			/* @__PURE__ */ jsx(AppShell.Navbar, {
				className: "border-r border-slate-200 bg-white",
				p: "md",
				children: /* @__PURE__ */ jsxs(Stack, {
					gap: "lg",
					children: [/* @__PURE__ */ jsx(Stack, {
						gap: 6,
						children: navigation.map((item) => /* @__PURE__ */ jsx(NavItem, {
							active: item.to === "/" ? pathname === "/" : pathname.startsWith(item.to),
							icon: item.icon,
							label: item.label,
							to: item.to
						}, item.to))
					}), /* @__PURE__ */ jsxs(Stack, {
						gap: "sm",
						children: [
							/* @__PURE__ */ jsx(Text, {
								c: "dimmed",
								fw: 700,
								size: "sm",
								tt: "uppercase",
								children: "Workspace"
							}),
							/* @__PURE__ */ jsx(SegmentedControl, {
								color: "frcBlue",
								data: [
									"Caseworker",
									"Program Supervisor",
									"Executive Director"
								],
								onChange: (value) => setRole(value),
								orientation: "vertical",
								radius: 6,
								value: role
							}),
							/* @__PURE__ */ jsx(Select, {
								allowDeselect: false,
								data: staffChoices.map((person) => ({
									value: person.id,
									label: person.name
								})),
								label: "Active user",
								onChange: (value) => value ? setCurrentStaffId(value) : void 0,
								value: currentStaffId
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(AppShell.Main, {
				className: "min-h-screen bg-[#F6F8FB]",
				children: /* @__PURE__ */ jsx(Box, {
					className: "mx-auto max-w-[1500px] px-4 py-5 sm:px-6",
					children
				})
			})
		]
	});
}
function NavItem({ active, icon: Icon, label, to }) {
	return /* @__PURE__ */ jsxs(Link, {
		className: ["flex h-11 items-center gap-3 rounded-md border px-3 text-sm font-bold no-underline transition", active ? "border-[#1C5380] bg-[#EAF4FB] text-[#1C5380]" : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50"].join(" "),
		to,
		children: [/* @__PURE__ */ jsx(Icon, { size: 18 }), /* @__PURE__ */ jsx("span", { children: label })]
	});
}
//#endregion
//#region src/routes/__root.tsx
var theme = createTheme({
	primaryColor: "frcBlue",
	colors: { frcBlue: [
		"#eaf4fb",
		"#cfe4f2",
		"#a1c8df",
		"#70aaca",
		"#4a91b8",
		"#307fac",
		"#246f9e",
		"#1c5380",
		"#18476d",
		"#123957"
	] },
	defaultRadius: 6,
	fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
	headings: { fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif" }
});
var Route$4 = createRootRoute({
	head: () => ({ meta: [
		{ charSet: "utf-8" },
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1"
		},
		{ title: "FRC CaseWorks" },
		{
			name: "description",
			content: "FRC CaseWorks case management demo for multi-program family resource centers."
		}
	] }),
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(MantineProvider, {
		theme,
		children: /* @__PURE__ */ jsx(DemoWorkspaceProvider, { children: /* @__PURE__ */ jsx(AppFrame, { children: /* @__PURE__ */ jsx(Outlet, {}) }) })
	}) });
}
function RootDocument({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [/* @__PURE__ */ jsx(ColorSchemeScript, { defaultColorScheme: "light" }), /* @__PURE__ */ jsx(HeadContent, {})] }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
//#endregion
//#region src/routes/reports.tsx
var $$splitComponentImporter$3 = () => import("./reports-JLdfXd35.js");
var Route$3 = createFileRoute("/reports")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/cases/route.tsx
var $$splitComponentImporter$2 = () => import("./route-BoHY-RXt.js");
var Route$2 = createFileRoute("/cases")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$1 = () => import("./routes-Chfg7RbX.js");
var Route$1 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
//#endregion
//#region src/routes/cases/index.tsx
var $$splitComponentImporter = () => import("./cases-UVBbZUMz.js");
var Route = createFileRoute("/cases/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var ReportsRoute = Route$3.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => Route$4
});
var CasesRouteRoute = Route$2.update({
	id: "/cases",
	path: "/cases",
	getParentRoute: () => Route$4
});
var IndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$4
});
var CasesIndexRoute = Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => CasesRouteRoute
});
var CasesRouteRouteChildren = {
	CasesCaseIdRoute: Route$5.update({
		id: "/$caseId",
		path: "/$caseId",
		getParentRoute: () => CasesRouteRoute
	}),
	CasesIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	CasesRouteRoute: CasesRouteRoute._addFileChildren(CasesRouteRouteChildren),
	ReportsRoute
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true
	});
}
//#endregion
export { getRouter };
