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

## Database

The MySQL Drizzle schema in `src/db/schema.ts` is the source of truth. The app
will still boot with the bundled fixture data when `DATABASE_URL` is not set,
but setting `DATABASE_URL` enables server-backed persistence for the first-draft
casework flows.

```bash
DATABASE_URL="mysql://user:password@localhost:3306/frc_caseworks"
pnpm db:push
pnpm dev
```

On the first request against an empty database, the app seeds the existing demo
workspace into normalized MySQL tables. Drizzle migrations are generated into
`drizzle/`.

## Routes

- `/` - Simple dashboard overview
- `/cases` - Role-aware, paginated cases list
- `/cases/$caseId` - Case detail with program-scoped notes and concrete services
- `/reports` - Grantor reporting preview

Caseworkers see assigned cases by default. Executive Directors see all cases.
Program Supervisors see cases for their selected supervised program.
