import { createFileRoute } from "@tanstack/react-router";
import { CaseDetail } from "~/components/CaseDetail";

export const Route = createFileRoute("/cases/$caseId")({
	component: CaseDetailRoute,
});

function CaseDetailRoute() {
	const { caseId } = Route.useParams();

	return <CaseDetail caseId={caseId} />;
}
