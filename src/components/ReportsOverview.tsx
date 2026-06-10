import {
  Box,
  Button,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { Download, FileChartColumn } from 'lucide-react'
import { useState } from 'react'
import type { Grantor } from '~/domain/demo-data'
import {
  buildGrantReport,
  formatCurrency,
} from '~/domain/demo-data'
import { useDemoWorkspace } from '~/hooks/useDemoWorkspace'
import { MetricTile } from './CaseworkUI'

const grantors: Grantor[] = [
  'ANFRC',
  'A-RESET',
  'Private Foundation',
  'Medicaid',
]

export function ReportsOverview() {
  const { cases, notes, services } = useDemoWorkspace()
  const [grantor, setGrantor] = useState<Grantor>('ANFRC')
  const [message, setMessage] = useState('')
  const report = buildGrantReport(cases, notes, services, grantor)

  function exportReport() {
    setMessage(
      `${grantor} CSV prepared with ${report.totalEnrollments} enrollments and ${formatCurrency(
        report.dollarsSpent,
      )} in services.`,
    )
  }

  return (
    <Stack gap="lg">
      <Group align="flex-start" justify="space-between">
        <Box>
          <Text c="dimmed" fw={700} size="sm" tt="uppercase">
            Reports
          </Text>
          <Title order={1} size="h2">
            Grantor reporting
          </Title>
        </Box>
        <Button
          leftSection={<Download size={17} />}
          onClick={exportReport}
          radius={6}
        >
          Export CSV
        </Button>
      </Group>

      <Box className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <Select
          allowDeselect={false}
          data={grantors}
          label="Grantor"
          onChange={(value) => {
            setMessage('')
            if (value) {
              setGrantor(value as Grantor)
            }
          }}
          value={grantor}
          w={260}
        />

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} mt="md">
          <MetricTile
            helper="Active in grant programs"
            icon={FileChartColumn}
            label="Active clients"
            value={report.activeClients}
          />
          <MetricTile
            helper="Total grant enrollments"
            icon={FileChartColumn}
            label="Enrollments"
            value={report.totalEnrollments}
          />
          <MetricTile
            helper="Concrete service rows"
            icon={FileChartColumn}
            label="Services"
            value={report.servicesProvided}
          />
          <MetricTile
            helper="Grant-attributed spend"
            icon={FileChartColumn}
            label="Dollars"
            value={formatCurrency(report.dollarsSpent)}
          />
          <MetricTile
            helper="Program-specific notes"
            icon={FileChartColumn}
            label="Notes"
            value={report.caseNotes}
          />
        </SimpleGrid>

        {message ? (
          <Box className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3">
            <Text c="green" fw={700} size="sm">
              {message}
            </Text>
          </Box>
        ) : null}
      </Box>

      <Box className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <Title order={2} size="h4">
          Report templates
        </Title>
        <Table.ScrollContainer minWidth={780} mt="md">
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Grantor</Table.Th>
                <Table.Th>Monthly report</Table.Th>
                <Table.Th>Annual report</Table.Th>
                <Table.Th>Primary fields</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>ANFRC</Table.Td>
                <Table.Td>Families, contacts, services</Table.Td>
                <Table.Td>Unduplicated clients, outcomes</Table.Td>
                <Table.Td>Program, county, concrete services</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>A-RESET</Table.Td>
                <Table.Td>Employment activities, supports</Table.Td>
                <Table.Td>Training and job outcomes</Table.Td>
                <Table.Td>Service type, spend, status</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Box>
    </Stack>
  )
}
