import {
  AppShell,
  Box,
  Button,
  Group,
  Select,
  SegmentedControl,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  BriefcaseBusiness,
  FileChartColumn,
  HeartHandshake,
  ClipboardList,
  LayoutDashboard,
  Plus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { UserRole } from '~/domain/demo-data'
import { useDemoWorkspace } from '~/hooks/useDemoWorkspace'

const navigation: Array<{
  label: string
  to: '/'
  icon: LucideIcon
} | {
  label: string
  to: '/cases'
  icon: LucideIcon
} 
// | {
//   label: string
//   to: '/intake'
//   icon: LucideIcon
// } 
| {
  label: string
  to: '/reports'
  icon: LucideIcon
}> = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  // { label: 'Intake', to: '/intake', icon: ClipboardList },
  { label: 'Cases', to: '/cases', icon: BriefcaseBusiness },
  { label: 'Reports', to: '/reports', icon: FileChartColumn },
]

export function AppFrame({ children }: Readonly<{ children: ReactNode }>) {
  const {
    currentStaffId,
    role,
    setCurrentStaffId,
    setRole,
    staffChoices,
  } = useDemoWorkspace()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 268, breakpoint: 'sm' }}
      padding={0}
    >
      <AppShell.Header className="border-b border-slate-200 bg-white">
        <Group className="h-full px-4 sm:px-6" justify="space-between">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon color="frcBlue" radius={6} size={40}>
              <HeartHandshake size={22} />
            </ThemeIcon>
            <Box className="min-w-0">
              <Title order={1} size="h3">
                FRC CaseWorks
              </Title>
              <Text c="dimmed" size="sm">
                River Valley Family Resource Center
              </Text>
            </Box>
          </Group>
          <Button
            component={Link}
            leftSection={<Plus size={17} />}
            radius={6}
            to="/intake"
          >
            New intake
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className="border-r border-slate-200 bg-white" p="md">
        <Stack gap="lg">
          <Stack gap={6}>
            {navigation.map((item) => (
              <NavItem
                active={
                  item.to === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.to)
                }
                icon={item.icon}
                key={item.to}
                label={item.label}
                to={item.to}
              />
            ))}
          </Stack>

          <Stack gap="sm">
            <Text c="dimmed" fw={700} size="sm" tt="uppercase">
              Workspace
            </Text>
            <SegmentedControl
              color="frcBlue"
              data={['Caseworker', 'Program Supervisor', 'Executive Director']}
              onChange={(value) => setRole(value as UserRole)}
              orientation="vertical"
              radius={6}
              value={role}
            />
            <Select
              allowDeselect={false}
              data={staffChoices.map((person) => ({
                value: person.id,
                label: person.name,
              }))}
              label="Active user"
              onChange={(value) =>
                value ? setCurrentStaffId(value) : undefined
              }
              value={currentStaffId}
            />
          </Stack>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main className="min-h-screen bg-[#F6F8FB]">
        <Box className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6">
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}

function NavItem({
  active,
  icon: Icon,
  label,
  to,
}: {
  active: boolean
  icon: LucideIcon
  label: string
  to: '/' | '/intake' | '/cases' | '/reports'
}) {
  return (
    <Link
      className={[
        'flex h-11 items-center gap-3 rounded-md border px-3 text-sm font-bold no-underline transition',
        active
          ? 'border-[#1C5380] bg-[#EAF4FB] text-[#1C5380]'
          : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50',
      ].join(' ')}
      to={to}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  )
}
