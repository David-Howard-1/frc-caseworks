# FRC CaseWorks

Web app demo for a SaaS version of FRC CaseWorks.

## Stack

- TanStack Start for routing
- Mantine UI for components
- Tailwind CSS for styling
- Drizzle ORM for schema/query building
- MySQL for persistence

## Run

```bash
pnpm install
pnpm dev
```

## Routes

- `/` - Simple dashboard overview
- `/cases` - Role-aware, paginated cases list
- `/cases/$caseId` - Case detail with program-scoped notes and concrete services
- `/reports` - Grantor reporting preview

Caseworkers see assigned cases by default. Executive Directors see all cases.
Program Supervisors see cases for their selected supervised program.
