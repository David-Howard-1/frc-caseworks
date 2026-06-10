import { Box, Group, SimpleGrid, Stack, Table, Text, Title } from '@mantine/core'
import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  DollarSign,
} from 'lucide-react'
import {
  formatDate,
  formatCurrency,
  getProgram,
  programs,
} from '~/domain/demo-data'
import { useDemoWorkspace } from '~/hooks/useDemoWorkspace'
import { CaseStatusBadge, MetricTile, ProgramBadge } from './CaseworkUI'

const caseStatuses = ['Open', 'Pending', 'Closed'] as const

export function DashboardOverview() {
  const { metrics, role, services, visibleCases } = useDemoWorkspace()
  const visibleCaseIds = new Set(
    visibleCases.map((caseRecord) => caseRecord.id),
  )
  const visibleServices = services.filter((service) =>
    visibleCaseIds.has(service.caseId),
  )

  const programRows = programs.map((program) => {
    const enrollments = visibleCases.flatMap((caseRecord) =>
      caseRecord.enrollments.filter(
        (enrollment) => enrollment.programId === program.id,
      ),
    )

    return {
      program,
      enrollments,
      active: enrollments.filter((enrollment) => enrollment.status === 'Active')
        .length,
    }
  })

  return (
    <Stack gap="lg">
      <Group align="flex-start" justify="space-between">
        <Box>
          <Text c="dimmed" fw={700} size="sm" tt="uppercase">
            Dashboard
          </Text>
          <Title order={1} size="h2">
            {role} overview
          </Title>
        </Box>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <MetricTile
          helper="Active in at least one program"
          icon={BriefcaseBusiness}
          label="Open cases"
          value={metrics.openCases}
        />
        <MetricTile
          helper="Intake completed, no program assigned"
          icon={ClipboardList}
          label="Pending intakes"
          value={metrics.pendingCases}
        />
        <MetricTile
          helper="Visible program-level assignments"
          icon={Building2}
          label="Active enrollments"
          value={metrics.activeEnrollments}
        />
        <MetricTile
          helper="Visible concrete services"
          icon={DollarSign}
          label="Service spend"
          value={formatCurrency(metrics.serviceSpend)}
        />
      </SimpleGrid>

      <Box className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Box className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <Title order={2} size="h4">
            Program activity
          </Title>
          <Table.ScrollContainer minWidth={620} mt="md">
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Program</Table.Th>
                  <Table.Th>Grantor</Table.Th>
                  <Table.Th ta="right">Enrollments</Table.Th>
                  <Table.Th ta="right">Active</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {programRows.map(({ active, enrollments, program }) => (
                  <Table.Tr key={program.id}>
                    <Table.Td>
                      <ProgramBadge program={program} />
                      <Text fw={700} mt={4}>
                        {program.name}
                      </Text>
                    </Table.Td>
                    <Table.Td>{program.grantor}</Table.Td>
                    <Table.Td ta="right">{enrollments.length}</Table.Td>
                    <Table.Td ta="right">{active}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Box>

        <Box className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <Title order={2} size="h4">
            Case status
          </Title>
          <Stack gap="sm" mt="md">
            {caseStatuses.map((status) => (
              <Group
                className="rounded-md border border-slate-200 p-3"
                justify="space-between"
                key={status}
              >
                <CaseStatusBadge status={status} />
                <Text fw={700}>
                  {
                    visibleCases.filter(
                      (caseRecord) => caseRecord.status === status,
                    ).length
                  }
                </Text>
              </Group>
            ))}
          </Stack>
        </Box>
      </Box>

      <Box className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <Title order={2} size="h4">
          Recent concrete services
        </Title>
        <Table.ScrollContainer minWidth={700} mt="md">
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Program</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th ta="right">Amount</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {visibleServices.slice(0, 5).map((service) => {
                const caseRecord = visibleCases.find(
                  (item) => item.id === service.caseId,
                )
                const enrollment = caseRecord?.enrollments.find(
                  (item) => item.id === service.enrollmentId,
                )
                const program = enrollment
                  ? getProgram(enrollment.programId)
                  : undefined

                return (
                  <Table.Tr key={service.id}>
                    <Table.Td>{formatDate(service.date)}</Table.Td>
                    <Table.Td>
                      <ProgramBadge program={program} />
                    </Table.Td>
                    <Table.Td>{service.description}</Table.Td>
                    <Table.Td ta="right">
                      {formatCurrency(service.amount)}
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Box>
    </Stack>
  )
}
