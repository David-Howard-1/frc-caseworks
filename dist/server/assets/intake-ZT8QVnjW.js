import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/intake/index.tsx
var $$splitComponentImporter = () => import("./intake-BjUuVIaI.js");
var Route = createFileRoute("/intake/")({
	validateSearch: (search) => ({
		name: typeof search.name === "string" ? search.name : void 0,
		dateOfBirth: typeof search.dateOfBirth === "string" ? search.dateOfBirth : void 0,
		ssn: typeof search.ssn === "string" ? search.ssn : void 0,
		phone: typeof search.phone === "string" ? search.phone : void 0,
		email: typeof search.email === "string" ? search.email : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
