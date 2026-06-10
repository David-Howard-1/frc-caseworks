import { Badge, Box, Group, Text, ThemeIcon, Title } from '@mantine/core'
import type { LucideIcon } from 'lucide-react'
import type {
  CaseStatus,
  ClientCase,
  Program,
  ProgramStatus,
} from '~/domain/demo-data'

export function MetricTile({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: LucideIcon
  label: string
  value: number | string
  helper: string
}) {
  return (
    <Box className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <Group justify="space-between" wrap="nowrap">
        <Box className="min-w-0">
          <Text c="dimmed" fw={700} size="sm" tt="uppercase">
            {label}
          </Text>
          <Title order={3} mt={4} size="h2">
            {value}
          </Title>
        </Box>
        <ThemeIcon color="frcBlue" radius={6} size={40} variant="light">
          <Icon size={21} />
        </ThemeIcon>
      </Group>
      <Text c="dimmed" mt="sm" size="sm">
        {helper}
      </Text>
    </Box>
  )
}

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  return <Badge color={caseStatusColor(status)}>{status}</Badge>
}

export function ProgramStatusBadge({ status }: { status: ProgramStatus }) {
  return <Badge color={programStatusColor(status)}>{status}</Badge>
}

export function RiskBadge({ risk }: { risk: ClientCase['risk'] }) {
  return (
    <Badge color={riskColor(risk)} variant="dot">
      {risk}
    </Badge>
  )
}

export function ProgramBadge({ program }: { program: Program | undefined }) {
  if (!program) {
    return <Badge color="gray">Program</Badge>
  }

  return (
    <Badge
      style={{
        backgroundColor: `${program.color}16`,
        color: program.color,
      }}
    >
      {program.code}
    </Badge>
  )
}

export function EmptyState({
  icon: Icon,
  title,
}: {
  icon: LucideIcon
  title: string
}) {
  return (
    <Box className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center">
      <ThemeIcon color="gray" mx="auto" radius={6} size={42} variant="light">
        <Icon size={22} />
      </ThemeIcon>
      <Text c="dimmed" fw={700} mt="sm">
        {title}
      </Text>
    </Box>
  )
}

export function caseStatusColor(status: CaseStatus) {
  if (status === 'Open') {
    return 'frcBlue'
  }
  if (status === 'Pending') {
    return 'yellow'
  }
  return 'gray'
}

export function programStatusColor(status: ProgramStatus) {
  if (status === 'Active') {
    return 'green'
  }
  if (status === 'Pending' || status === 'Waitlisted') {
    return 'yellow'
  }
  if (status === 'Completed') {
    return 'frcBlue'
  }
  return 'gray'
}

function riskColor(risk: ClientCase['risk']) {
  if (risk === 'High') {
    return 'red'
  }
  if (risk === 'Medium') {
    return 'yellow'
  }
  return 'green'
}
