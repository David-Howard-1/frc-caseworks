import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/intake/new.tsx
var $$splitComponentImporter = () => import("./new-zilh3d2F.js");
var Route = createFileRoute("/intake/new")({
	validateSearch: (search) => ({
		name: typeof search.name === "string" ? search.name : void 0,
		dateOfBirth: typeof search.dateOfBirth === "string" ? search.dateOfBirth : void 0,
		ssn: typeof search.ssn === "string" ? search.ssn : void 0,
		phone: typeof search.phone === "string" ? search.phone : void 0,
		email: typeof search.email === "string" ? search.email : void 0,
		personId: typeof search.personId === "string" ? Number(search.personId) : typeof search.personId === "number" ? search.personId : void 0,
		caseId: typeof search.caseId === "string" ? Number(search.caseId) : typeof search.caseId === "number" ? search.caseId : void 0,
		mode: search.mode === "reintake" ? "reintake" : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
