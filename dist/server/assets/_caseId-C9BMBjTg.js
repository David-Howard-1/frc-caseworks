import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/cases/$caseId.tsx
var $$splitComponentImporter = () => import("./_caseId-BEbmSnW9.js");
var Route = createFileRoute("/cases/$caseId")({
	validateSearch: (search) => ({ programId: typeof search.programId === "string" ? search.programId : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
