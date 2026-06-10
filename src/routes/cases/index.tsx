import { createFileRoute } from "@tanstack/react-router";
import { CasesIndex } from "~/components/CasesIndex";

export const Route = createFileRoute("/cases/")({
	component: CasesIndex,
});
