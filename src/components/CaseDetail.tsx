import {
  Badge,
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  ClipboardList,
  DollarSign,
  FileText,
  Save,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { CaseStatus, ProgramStatus } from '~/domain/demo-data'
import {
  formatExactCurrency,
  getProgram,
  getStaff,
  staff,
} from '~/domain/demo-data'
import { useDemoWorkspace } from '~/hooks/useDemoWorkspace'
import {
  CaseStatusBadge,
  EmptyState,
  ProgramBadge,
  ProgramStatusBadge,
  RiskBadge,
} from './CaseworkUI'

const caseStatusOptions: CaseStatus[] = ['Open', 'Pending', 'Closed']
const programStatusOptions: ProgramStatus[] = [
  'Active',
  'Pending',
  'Completed',
  'Inactive',
  'Waitlisted',
]
const serviceCategories = [
  'Family supplies',
  'Medication',
  'Training',
  'Work supports',
  'Transportation',
  'Housing',
]

export function CaseDetail({ caseId }: { caseId: string }) {
  const {
    addConcreteService,
    addNote,
    cases,
    notes,
    services,
    updateCaseStatus,
    updateEnrollment,
    visibleCases,
  } = useDemoWorkspace()
  const navigate = useNavigate()
  const [clientInfoOpen, clientInfoHandlers] = useDisclosure(false)
  const caseRecord = cases.find((item) => item.id === caseId)
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(
    caseRecord?.enrollments[0]?.id ?? '',
  )
  const [noteDraft, setNoteDraft] = useState({
    contactType: 'Phone',
    summary: '',
    body: '',
  })
  const [serviceDraft, setServiceDraft] = useState<{
    category: string
    description: string
    amount: number | ''
  }>({
    category: 'Family supplies',
    description: '',
    amount: '',
  })

  useEffect(() => {
    if (!caseRecord) {
      return
    }

    const selectedStillExists = caseRecord.enrollments.some(
      (enrollment) => enrollment.id === selectedEnrollmentId,
    )

    if (!selectedStillExists) {
      setSelectedEnrollmentId(caseRecord.enrollments[0]?.id ?? '')
    }
  }, [caseRecord, selectedEnrollmentId])

  const canViewCase = visibleCases.some((item) => item.id === caseRecord?.id)
  const selectedEnrollment = caseRecord?.enrollments.find(
    (enrollment) => enrollment.id === selectedEnrollmentId,
  )
  const selectedProgram = selectedEnrollment
    ? getProgram(selectedEnrollment.programId)
    : undefined
  const programNotes = notes
    .filter(
      (note) =>
        note.caseId === caseRecord?.id &&
        note.enrollmentId === selectedEnrollmentId,
    )
    .sort((a, b) => b.date.localeCompare(a.date))
  const programServices = services
    .filter(
      (service) =>
        service.caseId === caseRecord?.id &&
        service.enrollmentId === selectedEnrollmentId,
    )
    .sort((a, b) => b.date.localeCompare(a.date))
  const caseServicesTotal = useMemo(
    () =>
      services
        .filter((service) => service.caseId === caseRecord?.id)
        .reduce((sum, service) => sum + service.amount, 0),
    [caseRecord?.id, services],
  )

  if (!caseRecord) {
    return (
      <Stack gap="md">
        <Button
          component={Link}
          leftSection={<ArrowLeft size={16} />}
          radius={6}
          to="/cases"
          variant="subtle"
          w="fit-content"
        >
          Cases
        </Button>
        <EmptyState icon={ClipboardList} title="Case not found" />
      </Stack>
    )
  }

  function handleSaveNote() {
    if (!selectedEnrollmentId) {
      return
    }

    addNote(caseRecord!.id, {
      enrollmentId: selectedEnrollmentId,
      contactType: noteDraft.contactType,
      summary: noteDraft.summary,
      body: noteDraft.body,
    })
    setNoteDraft((current) => ({ ...current, summary: '', body: '' }))
  }

  function handleAddService() {
    if (!selectedEnrollmentId || serviceDraft.amount === '') {
      return
    }

    addConcreteService(caseRecord!.id, {
      enrollmentId: selectedEnrollmentId,
      category: serviceDraft.category,
      description: serviceDraft.description,
      amount: Number(serviceDraft.amount),
    })
    setServiceDraft((current) => ({
      ...current,
      description: '',
      amount: '',
    }))
  }

  return (
    <>
      <Modal
        opened={clientInfoOpen}
        onClose={clientInfoHandlers.close}
        title="Client information"
      >
        <Stack gap="sm">
          <InfoLine label="Name" value={caseRecord.displayName} />
          <InfoLine label="Pronouns" value={caseRecord.pronouns ?? 'Not set'} />
          <InfoLine label="Age" value={caseRecord.age.toString()} />
          <InfoLine label="County" value={caseRecord.county} />
          <InfoLine label="Phone" value={caseRecord.intake.phone ?? 'Not set'} />
          <InfoLine label="Email" value={caseRecord.intake.email ?? 'Not set'} />
          <InfoLine
            label="Referral source"
            value={caseRecord.intake.referralSource ?? 'Not set'}
          />
          <InfoLine
            label="Household income"
            value={caseRecord.intake.householdIncome ?? 'Not set'}
          />
          <InfoLine label="Housing" value={caseRecord.intake.housing ?? 'Not set'} />
        </Stack>
      </Modal>

      <Stack gap="lg">
        <Group align="flex-start" justify="space-between">
          <Stack gap={6}>
            <Button
              component={Link}
              leftSection={<ArrowLeft size={16} />}
              radius={6}
              to="/cases"
              variant="subtle"
              w="fit-content"
            >
              Cases
            </Button>
            <Group gap="xs">
              <Title order={1} size="h2">
                {caseRecord.displayName}
              </Title>
              <CaseStatusBadge status={caseRecord.status} />
            </Group>
            <Text c="dimmed">
              {caseRecord.id} - Last contact {caseRecord.lastContact}
            </Text>
          </Stack>
          <Button
            leftSection={<UserRound size={17} />}
            onClick={clientInfoHandlers.open}
            radius={6}
            variant="light"
          >
            Client info
          </Button>
        </Group>

        {!canViewCase ? (
          <Box className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
            <Text c="yellow" fw={700} size="sm">
              This case is outside the current role scope.
            </Text>
          </Box>
        ) : null}

        <Box className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <Group align="center" justify="space-between">
            <Title order={2} size="h4">
              Case status
            </Title>
            <RiskBadge risk={caseRecord.risk} />
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mt="md">
            <Box className="rounded-md border border-slate-200 p-3">
              <Select
                allowDeselect={false}
                data={caseStatusOptions}
                label="Overall status"
                onChange={(value) =>
                  value ? updateCaseStatus(caseRecord.id, value as CaseStatus) : undefined
                }
                value={caseRecord.status}
              />
            </Box>
            <StatusTile label="Opened" value={caseRecord.opened} />
            <StatusTile label="Last contact" value={caseRecord.lastContact} />
            <StatusTile
              label="Concrete services"
              value={formatExactCurrency(caseServicesTotal)}
            />
          </SimpleGrid>
        </Box>

        <Box className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <Group align="flex-start" justify="space-between">
            <Box>
              <Title order={2} size="h4">
                Program scope
              </Title>
              <Text c="dimmed" size="sm">
                Notes and concrete services follow the selected program.
              </Text>
            </Box>
            {selectedProgram ? <ProgramBadge program={selectedProgram} /> : null}
          </Group>

          {caseRecord.enrollments.length > 0 ? (
            <>
              <SimpleGrid cols={{ base: 1, lg: 3 }} mt="md">
                {caseRecord.enrollments.map((enrollment) => {
                  const program = getProgram(enrollment.programId)
                  const selected = enrollment.id === selectedEnrollmentId

                  return (
                    <button
                      className={[
                        'rounded-md border bg-white p-3 text-left transition',
                        selected
                          ? 'border-[#1C5380] ring-2 ring-[#1C5380]/15'
                          : 'border-slate-200 hover:border-slate-300',
                      ].join(' ')}
                      key={enrollment.id}
                      onClick={() => setSelectedEnrollmentId(enrollment.id)}
                      type="button"
                    >
                      <Group justify="space-between">
                        <ProgramBadge program={program} />
                        <ProgramStatusBadge status={enrollment.status} />
                      </Group>
                      <Text fw={700} mt="sm">
                        {program?.name}
                      </Text>
                      <Text c="dimmed" size="sm">
                        {getStaff(enrollment.caseworkerId)?.name}
                      </Text>
                    </button>
                  )
                })}
              </SimpleGrid>

              {selectedEnrollment ? (
                <Box className="mt-4 rounded-md border border-slate-200 p-4">
                  <SimpleGrid cols={{ base: 1, md: 3 }}>
                    <Select
                      allowDeselect={false}
                      data={programStatusOptions}
                      label="Program status"
                      onChange={(value) =>
                        value
                          ? updateEnrollment(caseRecord.id, selectedEnrollment.id, {
                              status: value as ProgramStatus,
                            })
                          : undefined
                      }
                      value={selectedEnrollment.status}
                    />
                    <Select
                      allowDeselect={false}
                      data={staff
                        .filter(
                          (person) =>
                            person.role === 'Caseworker' &&
                            person.programs.includes(
                              selectedEnrollment.programId,
                            ),
                        )
                        .map((person) => ({
                          value: person.id,
                          label: person.name,
                        }))}
                      label="Caseworker"
                      onChange={(value) =>
                        value
                          ? updateEnrollment(caseRecord.id, selectedEnrollment.id, {
                              caseworkerId: value,
                            })
                          : undefined
                      }
                      value={selectedEnrollment.caseworkerId}
                    />
                    <TextInput
                      label="Target date"
                      value={selectedEnrollment.target}
                      onChange={(event) =>
                        updateEnrollment(caseRecord.id, selectedEnrollment.id, {
                          target: event.currentTarget.value,
                        })
                      }
                    />
                  </SimpleGrid>
                  <Textarea
                    autosize
                    label="Program goal"
                    minRows={2}
                    mt="md"
                    value={selectedEnrollment.goal}
                    onChange={(event) =>
                      updateEnrollment(caseRecord.id, selectedEnrollment.id, {
                        goal: event.currentTarget.value,
                      })
                    }
                  />
                </Box>
              ) : null}

              <Tabs color="frcBlue" defaultValue="notes" keepMounted={false} mt="lg">
                <Tabs.List>
                  <Tabs.Tab leftSection={<FileText size={16} />} value="notes">
                    Notes
                  </Tabs.Tab>
                  <Tabs.Tab
                    leftSection={<DollarSign size={16} />}
                    value="services"
                  >
                    Concrete services
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="notes">
                  <ProgramNotesPortal
                    notes={programNotes}
                    noteDraft={noteDraft}
                    onDraftChange={setNoteDraft}
                    onSave={handleSaveNote}
                  />
                </Tabs.Panel>

                <Tabs.Panel value="services">
                  <ConcreteServicesPortal
                    onAdd={handleAddService}
                    onDraftChange={setServiceDraft}
                    serviceDraft={serviceDraft}
                    services={programServices}
                  />
                </Tabs.Panel>
              </Tabs>
            </>
          ) : (
            <Box mt="md">
              <EmptyState
                icon={ClipboardList}
                title="No programs assigned to this case"
              />
            </Box>
          )}
        </Box>

        <Box className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <Group justify="space-between">
            <Title order={2} size="h4">
              Related people
            </Title>
            <Badge leftSection={<UsersRound size={14} />} variant="light">
              {caseRecord.relatedPeople.length}
            </Badge>
          </Group>
          <Table.ScrollContainer minWidth={620} mt="md">
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Relationship</Table.Th>
                  <Table.Th>Age</Table.Th>
                  <Table.Th>Household</Table.Th>
                  <Table.Th>Linked case</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {caseRecord.relatedPeople.map((person) => (
                  <Table.Tr key={person.id}>
                    <Table.Td fw={700}>{person.name}</Table.Td>
                    <Table.Td>{person.relationship}</Table.Td>
                    <Table.Td>{person.age}</Table.Td>
                    <Table.Td>{person.inHousehold ? 'Yes' : 'No'}</Table.Td>
                    <Table.Td>
                      {person.linkedCaseId ? (
                        <Button
                          onClick={() =>
                            navigate({
                              to: '/cases/$caseId',
                              params: { caseId: person.linkedCaseId! },
                            })
                          }
                          radius={6}
                          size="xs"
                          variant="light"
                        >
                          {person.linkedCaseId}
                        </Button>
                      ) : (
                        <Text c="dimmed" size="sm">
                          None
                        </Text>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Box>
      </Stack>
    </>
  )
}

function ProgramNotesPortal({
  noteDraft,
  notes,
  onDraftChange,
  onSave,
}: {
  noteDraft: { contactType: string; summary: string; body: string }
  notes: Array<{
    id: string
    authorId: string
    contactType: string
    date: string
    summary: string
    body: string
  }>
  onDraftChange: (draft: {
    contactType: string
    summary: string
    body: string
  }) => void
  onSave: () => void
}) {
  return (
    <Stack gap="md" mt="md">
      <Box className="rounded-md border border-slate-200 p-4">
        <SimpleGrid cols={{ base: 1, md: 3 }}>
          <Select
            allowDeselect={false}
            data={[
              'Phone',
              'Home visit',
              'Office visit',
              'Service coordination',
              'Closure',
            ]}
            label="Contact"
            onChange={(value) =>
              onDraftChange({
                ...noteDraft,
                contactType: value ?? 'Phone',
              })
            }
            value={noteDraft.contactType}
          />
          <TextInput
            className="md:col-span-2"
            label="Summary"
            value={noteDraft.summary}
            onChange={(event) =>
              onDraftChange({
                ...noteDraft,
                summary: event.currentTarget.value,
              })
            }
          />
        </SimpleGrid>
        <Textarea
          autosize
          label="Note"
          minRows={4}
          mt="md"
          value={noteDraft.body}
          onChange={(event) =>
            onDraftChange({
              ...noteDraft,
              body: event.currentTarget.value,
            })
          }
        />
        <Group justify="flex-end" mt="md">
          <Button leftSection={<Save size={17} />} onClick={onSave} radius={6}>
            Save note
          </Button>
        </Group>
      </Box>

      {notes.length > 0 ? (
        notes.map((note) => (
          <Box className="rounded-md border border-slate-200 p-4" key={note.id}>
            <Group justify="space-between">
              <Text fw={700}>{note.summary}</Text>
              <Text c="dimmed" size="sm">
                {note.date}
              </Text>
            </Group>
            <Text c="dimmed" mt={4} size="sm">
              {note.contactType} - {getStaff(note.authorId)?.name}
            </Text>
            <Text mt="sm">{note.body}</Text>
          </Box>
        ))
      ) : (
        <EmptyState icon={FileText} title="No notes for this program" />
      )}
    </Stack>
  )
}

function ConcreteServicesPortal({
  onAdd,
  onDraftChange,
  serviceDraft,
  services,
}: {
  onAdd: () => void
  onDraftChange: (draft: {
    category: string
    description: string
    amount: number | ''
  }) => void
  serviceDraft: {
    category: string
    description: string
    amount: number | ''
  }
  services: Array<{
    id: string
    date: string
    category: string
    description: string
    amount: number
  }>
}) {
  return (
    <Stack gap="md" mt="md">
      <Box className="rounded-md border border-slate-200 p-4">
        <SimpleGrid cols={{ base: 1, md: 4 }}>
          <Select
            allowDeselect={false}
            data={serviceCategories}
            label="Category"
            onChange={(value) =>
              onDraftChange({
                ...serviceDraft,
                category: value ?? 'Family supplies',
              })
            }
            value={serviceDraft.category}
          />
          <TextInput
            className="md:col-span-2"
            label="Description"
            value={serviceDraft.description}
            onChange={(event) =>
              onDraftChange({
                ...serviceDraft,
                description: event.currentTarget.value,
              })
            }
          />
          <NumberInput
            decimalScale={2}
            fixedDecimalScale
            label="Amount"
            min={0}
            prefix="$"
            value={serviceDraft.amount}
            onChange={(value) =>
              onDraftChange({
                ...serviceDraft,
                amount: typeof value === 'number' ? value : '',
              })
            }
          />
        </SimpleGrid>
        <Group justify="flex-end" mt="md">
          <Button leftSection={<DollarSign size={17} />} onClick={onAdd} radius={6}>
            Add service
          </Button>
        </Group>
      </Box>

      {services.length > 0 ? (
        <Table.ScrollContainer minWidth={680}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th ta="right">Amount</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {services.map((service) => (
                <Table.Tr key={service.id}>
                  <Table.Td>{service.date}</Table.Td>
                  <Table.Td>{service.category}</Table.Td>
                  <Table.Td>{service.description}</Table.Td>
                  <Table.Td ta="right">
                    {formatExactCurrency(service.amount)}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      ) : (
        <EmptyState
          icon={DollarSign}
          title="No concrete services for this program"
        />
      )}
    </Stack>
  )
}

function StatusTile({ label, value }: { label: string; value: string }) {
  return (
    <Box className="rounded-md border border-slate-200 p-3">
      <Text c="dimmed" fw={700} size="sm" tt="uppercase">
        {label}
      </Text>
      <Text fw={700} mt={6}>
        {value}
      </Text>
    </Box>
  )
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Text c="dimmed" size="sm">
        {label}
      </Text>
      <Text fw={700} ta="right">
        {value}
      </Text>
    </Group>
  )
}
