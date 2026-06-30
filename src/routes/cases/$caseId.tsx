import { createFileRoute } from "@tanstack/react-router";
import { CaseDetail } from "~/components/CaseDetail";

export const Route = createFileRoute("/cases/$caseId")({
	validateSearch: (search): { programId?: number } => ({
		programId:
			typeof search.programId === "string"
				? Number(search.programId)
				: undefined,
	}),
	component: CaseDetailRoute,
});

function CaseDetailRoute() {
	const { caseId } = Route.useParams();
	const { programId } = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<CaseDetail
			caseId={Number(caseId)}
			onProgramFilterChange={(nextProgramId) =>
				navigate({
					search: nextProgramId
						? { programId: nextProgramId }
						: {},
					resetScroll: false,
				})
			}
			programId={programId}
		/>
	);
}
