import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Grid,
  Group,
  Select,
  Stack,
  Table,
  TableOfContents,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  FilePlus2,
  Info,
  RotateCcw,
  Search,
  UserPlus,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import type {
  EntityId,
  IntakeBenefit,
  IntakeContact,
  IntakeIncomeSource,
  IntakeSubmission,
  Person,
} from '~/domain/workspace'
import { formatDate } from '~/domain/workspace'
import { useDemoWorkspace } from '~/hooks/useDemoWorkspace'

const today = () => new Date().toISOString().slice(0, 10)

const housingOptions = [
  'Stable housing',
  'Temporary housing',
  'Shelter',
  'Transitional housing',
  'Doubled up',
  'Unsheltered',
  'In custody',
  'Hospital or treatment facility',
  'Unknown',
  'Other',
]

const benefitOptions = [
  'SNAP',
  'TANF',
  'Medicaid',
  'Medicare',
  'WIC',
  'Housing assistance',
  'Utility assistance',
  'Child care assistance',
  'Unemployment benefits',
  'Social Security benefits',
  'Veterans benefits',
  'Other public assistance',
]

export type IntakeLookupSearch = {
  name?: string
  dateOfBirth?: string
  ssn?: string
  phone?: string
  email?: string
}

export type IntakeFormSearch = IntakeLookupSearch & {
  personId?: number
  caseId?: number
  mode?: 'reintake'
}

type SearchInput = Required<IntakeLookupSearch>

type IntakeFormState = {
  firstName: string
  lastName: string
  middleName: string
  preferredName: string
  dateOfBirth: string
  ssn: string
  phone: string
  email: string
  approximateAge: string
  alternatePhone: string
  preferredContactMethod: string
  line1: string
  line2: string
  city: string
  state: string
  postalCode: string
  county: string
  gender: string
  race: string
  ethnicity: string
  primaryLanguage: string
  interpreterNeeded: boolean
  veteranStatus: string
  disabilityStatus: string
  householdSize: string
  dependents: string
  maritalStatus: string
  safeToCall: boolean
  safeToText: boolean
  safeToEmail: boolean
  contactRestrictions: string
  housingStatus: string
  currentLocation: string
  lengthOfStay: string
  safeHousing: boolean
  housingAtRisk: boolean
  evictionPending: boolean
  livingWithFamily: boolean
  housingNotes: string
  hasCourtInvolvement: boolean
  matterType: string
  courtName: string
  legalCounty: string
  legalCaseNumber: string
  judge: string
  attorney: string
  officer: string
  nextCourtDate: string
  courtTime: string
  legalStatus: string
  warrantsKnown: boolean
  legalNotes: string
  overrideReason: string
}

const emptyForm: IntakeFormState = {
  firstName: '',
  lastName: '',
  middleName: '',
  preferredName: '',
  dateOfBirth: '',
  ssn: '',
  phone: '',
  email: '',
  approximateAge: '',
  alternatePhone: '',
  preferredContactMethod: '',
  line1: '',
  line2: '',
  city: '',
  state: 'KY',
  postalCode: '',
  county: '',
  gender: '',
  race: '',
  ethnicity: '',
  primaryLanguage: '',
  interpreterNeeded: false,
  veteranStatus: '',
  disabilityStatus: '',
  householdSize: '',
  dependents: '',
  maritalStatus: '',
  safeToCall: true,
  safeToText: true,
  safeToEmail: true,
  contactRestrictions: '',
  housingStatus: '',
  currentLocation: '',
  lengthOfStay: '',
  safeHousing: true,
  housingAtRisk: false,
  evictionPending: false,
  livingWithFamily: false,
  housingNotes: '',
  hasCourtInvolvement: false,
  matterType: '',
  courtName: '',
  legalCounty: '',
  legalCaseNumber: '',
  judge: '',
  attorney: '',
  officer: '',
  nextCourtDate: '',
  courtTime: '',
  legalStatus: '',
  warrantsKnown: false,
  legalNotes: '',
  overrideReason: '',
}

const sectionHeadings = [
  { id: 'client', value: 'Client' },
  { id: 'demographics', value: 'Demographics' },
  { id: 'income', value: 'Income' },
  { id: 'benefits', value: 'Benefits' },
  { id: 'contacts', value: 'Contacts' },
  { id: 'legal', value: 'Legal' },
  { id: 'housing', value: 'Housing' },
]

function splitLookupName(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const firstName = parts[0] ?? ''
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : ''

  return { firstName, lastName }
}

const valueOrEmpty = (value?: string | number) =>
  value === undefined ? '' : String(value)

function buildInitialSearch(search?: IntakeLookupSearch): SearchInput {
  return {
    name: search?.name ?? '',
    dateOfBirth: search?.dateOfBirth ?? '',
    ssn: search?.ssn ?? '',
    phone: search?.phone ?? '',
    email: search?.email ?? '',
  }
}

function getInitialForm(person?: Person, search?: IntakeFormSearch): IntakeFormState {
  const splitName = splitLookupName(search?.name)

  return {
    ...emptyForm,
    firstName: person?.firstName ?? splitName.firstName,
    lastName: person?.lastName ?? splitName.lastName,
    middleName: person?.middleName ?? '',
    preferredName: person?.preferredName ?? '',
    dateOfBirth: person?.dateOfBirth ?? search?.dateOfBirth ?? '',
    ssn: search?.ssn ?? '',
    phone: person?.phone ?? search?.phone ?? '',
    email: person?.email ?? search?.email ?? '',
    approximateAge: person?.approximateAge ?? '',
    line1: person?.addressLine1 ?? '',
    line2: person?.addressLine2 ?? '',
    city: person?.city ?? '',
    state: person?.state ?? 'KY',
    postalCode: person?.postalCode ?? '',
    county: person?.county ?? '',
  }
}

function titleCaseField(field: string) {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase())
}

function compactSearch(search: SearchInput) {
  return Object.fromEntries(
    Object.entries(search).filter(([, value]) => value.trim()),
  )
}

export function IntakeMatchFinder({ initialSearch }: { initialSearch?: IntakeLookupSearch }) {
  const { findIntakeMatches } = useDemoWorkspace()
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState<SearchInput>(
    buildInitialSearch(initialSearch),
  )
  const [hasSearched, setHasSearched] = useState(false)

  const matches = useMemo(() => {
    if (!hasSearched) {
      return []
    }

    const { firstName, lastName } = splitLookupName(searchInput.name)

    return findIntakeMatches({
      firstName,
      lastName,
      dateOfBirth: searchInput.dateOfBirth,
      phone: searchInput.phone,
      email: searchInput.email,
      ssn: searchInput.ssn,
    })
  }, [findIntakeMatches, hasSearched, searchInput])

  function handleSearchField(field: keyof SearchInput) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      setSearchInput((current) => ({ ...current, [field]: value }))
    }
  }

  function clearSearch() {
    setSearchInput(buildInitialSearch())
    setHasSearched(false)
  }

  function startNewIntake() {
    navigate({
      to: '/intake/new',
      search: compactSearch(searchInput),
    })
  }

  return (
    <Stack gap="lg">
      <Group align="flex-start" justify="space-between">
        <Box>
          <Text c="dimmed" fw={700} size="sm" tt="uppercase">
            Intake
          </Text>
          <Title order={1} size="h2">
            Find Potential Matches
          </Title>
          <Text c="dimmed" mt={4}>
            Search all people before starting a primary intake.
          </Text>
        </Box>
        <Button
          leftSection={<FilePlus2 size={17} />}
          onClick={startNewIntake}
          variant="outline"
        >
          Start New Intake
        </Button>
      </Group>

      <Box className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <Group align="flex-start" justify="space-between">
          <Group gap="sm">
            <ThemeIcon color="frcBlue" radius={6} variant="light">
              <Search size={18} />
            </ThemeIcon>
            <Box>
              <Title order={2} size="h4">
                Search People
              </Title>
              <Text c="dimmed" size="sm">
                Look up people by name, date of birth, SSN, phone, or email.
              </Text>
            </Box>
          </Group>
          <Box className="max-w-sm rounded-md bg-slate-50 p-3">
            <Group align="flex-start" gap="sm" wrap="nowrap">
              <Info size={18} className="mt-0.5 text-[#1C5380]" />
              <Text c="dimmed" size="sm">
                Results include people with cases and people without cases.
              </Text>
            </Group>
          </Box>
        </Group>

        <Grid align="flex-end" mt="md">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              leftSection={<Search size={16} />}
              label="Name"
              onChange={handleSearchField('name')}
              placeholder="First and last name"
              value={searchInput.name}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <TextInput
              label="Date Of Birth"
              onChange={handleSearchField('dateOfBirth')}
              placeholder="YYYY-MM-DD"
              value={searchInput.dateOfBirth}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <TextInput
              label="SSN"
              onChange={handleSearchField('ssn')}
              placeholder="Last 4 or full SSN"
              value={searchInput.ssn}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <TextInput
              label="Phone"
              onChange={handleSearchField('phone')}
              placeholder="(555) 555-5555"
              value={searchInput.phone}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <TextInput
              label="Email"
              onChange={handleSearchField('email')}
              placeholder="name@example.org"
              value={searchInput.email}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Group justify="space-between">
              <Group>
                <Button
                  leftSection={<Search size={16} />}
                  onClick={() => setHasSearched(true)}
                >
                  Search
                </Button>
                <Button
                  leftSection={<RotateCcw size={16} />}
                  onClick={clearSearch}
                  variant="subtle"
                >
                  Clear
                </Button>
              </Group>
              <Button leftSection={<UserPlus size={17} />} onClick={startNewIntake}>
                Start New Intake
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        <Box mt="lg">
          <Group justify="space-between" mb="xs">
            <Text fw={700}>Potential Matches</Text>
            {hasSearched ? (
              <Badge color={matches.length > 0 ? 'yellow' : 'green'}>
                {matches.length} found
              </Badge>
            ) : null}
          </Group>

          {hasSearched ? (
            matches.length > 0 ? (
              <Stack>
                <Alert color="yellow" icon={<AlertTriangle size={18} />}>
                  Review possible matches before creating a new intake.
                </Alert>
                <Table.ScrollContainer minWidth={900}>
                  <Table verticalSpacing="sm">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Phone / Email</Table.Th>
                        <Table.Th>Case Status</Table.Th>
                        <Table.Th>Program Area</Table.Th>
                        <Table.Th>Last Updated</Table.Th>
                        <Table.Th>Match</Table.Th>
                        <Table.Th>Action</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {matches.map((match) => (
                        <Table.Tr key={match.personId}>
                          <Table.Td>
                            <Text fw={700}>{match.clientName}</Text>
                            <Text c="dimmed" size="sm">
                              {match.dateOfBirth
                                ? `DOB ${formatDate(match.dateOfBirth)}`
                                : 'DOB not recorded'}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{match.phone ?? 'No phone'}</Text>
                            <Text c="dimmed" size="sm">
                              {match.email ?? 'No email'}
                            </Text>
                          </Table.Td>
                          <Table.Td>{match.caseStatus ?? 'No case'}</Table.Td>
                          <Table.Td>{match.programArea}</Table.Td>
                          <Table.Td>
                            {match.lastUpdated
                              ? formatDate(match.lastUpdated.slice(0, 10))
                              : 'Not recorded'}
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              color={
                                match.strength.startsWith('High') ? 'red' : 'yellow'
                              }
                            >
                              {match.strength}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            {match.action === 'view_case' && match.caseId ? (
                              <Button
                                onClick={() =>
                                  navigate({
                                    to: '/cases/$caseId',
                                    params: { caseId: String(match.caseId) },
                                  })
                                }
                                size="xs"
                                variant="light"
                              >
                                View Case
                              </Button>
                            ) : (
                              <Button
                                onClick={() =>
                                  navigate({
                                    to: '/intake/new',
                                    search: {
                                      personId: match.personId,
                                      caseId: match.caseId,
                                      mode:
                                        match.action === 'reintake'
                                          ? 'reintake'
                                          : undefined,
                                    },
                                  })
                                }
                                size="xs"
                              >
                                {match.action === 'reintake'
                                  ? 'Re-Intake'
                                  : 'Start Intake'}
                              </Button>
                            )}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              </Stack>
            ) : (
              <Alert color="green" icon={<FilePlus2 size={18} />}>
                No matching people were found. You can start a new primary intake.
              </Alert>
            )
          ) : (
            <Box className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <Text c="dimmed" fw={700}>
                Run a search to see potential matches.
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Stack>
  )
}

export function PrimaryIntakeFormPage({ search }: { search?: IntakeFormSearch }) {
  const { cases, createCaseFromIntake, currentStaffId, people } = useDemoWorkspace()
  const navigate = useNavigate()
  const selectedPerson = people.find((person) => person.id === search?.personId)
  const selectedCase = cases.find((caseRecord) => caseRecord.id === search?.caseId)
  const [form, setForm] = useState<IntakeFormState>(() =>
    getInitialForm(selectedPerson, search),
  )
  const [incomeSources, setIncomeSources] = useState<IntakeIncomeSource[]>([])
  const [benefits, setBenefits] = useState<IntakeBenefit[]>([])
  const [contacts, setContacts] = useState<IntakeContact[]>([])
  const [error, setError] = useState('')

  function updateForm<K extends keyof IntakeFormState>(
    field: K,
    value: IntakeFormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleTextFormField(field: keyof IntakeFormState) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.currentTarget
      updateForm(field, value as never)
    }
  }

  function handleCheckboxFormField(field: keyof IntakeFormState) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.currentTarget
      updateForm(field, checked as never)
    }
  }

  function handleIncomeSourceField(
    index: number,
    field: keyof IntakeIncomeSource,
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      setIncomeSources((current) =>
        current.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      )
    }
  }

  function handleBenefitField(index: number, field: keyof IntakeBenefit) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      setBenefits((current) =>
        current.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      )
    }
  }

  function handleContactField(index: number, field: keyof IntakeContact) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      setContacts((current) =>
        current.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      )
    }
  }

  function addIncomeSource() {
    setIncomeSources((current) => [
      ...current,
      {
        id: `income-${Date.now()}`,
        type: 'Employment wages',
        sourceName: '',
        amount: '',
        frequency: 'Monthly',
      },
    ])
  }

  function addBenefit() {
    setBenefits((current) => [
      ...current,
      {
        id: `benefit-${Date.now()}`,
        type: 'SNAP',
        isReceiving: true,
      },
    ])
  }

  function addContact() {
    setContacts((current) => [
      ...current,
      {
        id: `contact-${Date.now()}`,
        name: '',
        relationship: 'Emergency contact',
        permissionToContact: true,
      },
    ])
  }

  async function saveIntake() {
    if (!currentStaffId) {
      setError('Add and select a user before creating casework data.')
      return
    }

    const hasContact = Boolean(form.phone || form.email)
    const missingCore =
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      (!form.dateOfBirth && !form.approximateAge.trim()) ||
      !hasContact ||
      !form.housingStatus

    if (missingCore) {
      setError(
        'The intake could not be saved. Please complete required client, contact, age or DOB, and housing fields.',
      )
      return
    }

    const createdDate = today()
    const duplicateWarnings =
      search?.mode === 'reintake' && selectedCase
        ? [`Re-intake for closed case ${selectedCase.id}: ${selectedCase.displayName}`]
        : []
    const intake: Omit<IntakeSubmission, 'id'> = {
      status: duplicateWarnings.length > 0 ? 'Duplicate Review' : 'Draft',
      createdById: currentStaffId,
      startedAt: `${createdDate}T09:00:00`,
      duplicateWarnings,
      duplicateOverrideReason: form.overrideReason || undefined,
      client: {
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        preferredName: form.preferredName,
        dateOfBirth: form.dateOfBirth,
        ssn: form.ssn,
        approximateAge: form.approximateAge,
        phone: form.phone,
        alternatePhone: form.alternatePhone,
        email: form.email,
        preferredContactMethod: form.preferredContactMethod,
        safeToCall: form.safeToCall,
        safeToText: form.safeToText,
        safeToEmail: form.safeToEmail,
        contactRestrictions: form.contactRestrictions,
      },
      demographics: {
        gender: form.gender,
        race: form.race,
        ethnicity: form.ethnicity,
        primaryLanguage: form.primaryLanguage,
        interpreterNeeded: form.interpreterNeeded,
        veteranStatus: form.veteranStatus,
        disabilityStatus: form.disabilityStatus,
        householdSize: form.householdSize,
        dependents: form.dependents,
        maritalStatus: form.maritalStatus,
      },
      address: {
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        county: form.county,
      },
      incomeSources,
      benefits,
      relevantContacts: contacts.filter((contact) => contact.name.trim()),
      legal: {
        hasCourtInvolvement: form.hasCourtInvolvement,
        matterType: form.matterType,
        courtName: form.courtName,
        county: form.legalCounty,
        caseNumber: form.legalCaseNumber,
        judge: form.judge,
        attorney: form.attorney,
        officer: form.officer,
        nextCourtDate: form.nextCourtDate,
        courtTime: form.courtTime,
        legalStatus: form.legalStatus,
        warrantsKnown: form.warrantsKnown,
        notes: form.legalNotes,
      },
      housing: {
        status: form.housingStatus,
        currentLocation: form.currentLocation,
        lengthOfStay: form.lengthOfStay,
        safeHousing: form.safeHousing,
        atRisk: form.housingAtRisk,
        evictionPending: form.evictionPending,
        livingWithFamily: form.livingWithFamily,
        notes: form.housingNotes,
      },
    }

    const caseId = await createCaseFromIntake(intake, {
      existingPersonId: search?.personId,
      existingCaseId: search?.caseId,
      mode: search?.mode === 'reintake' ? 'reintake' : 'new_case',
    })
    if (caseId) {
      navigate({ to: '/cases/$caseId', params: { caseId: String(caseId) } })
    }
  }

  const pageTitle = search?.mode === 'reintake' ? 'Primary Re-Intake' : 'Primary Intake Form'

  return (
    <Stack gap="lg">
      <Group align="flex-start" justify="space-between">
        <Box>
          <Button
            component={Link}
            leftSection={<ArrowLeft size={16} />}
            mb="sm"
            to="/intake"
            variant="subtle"
          >
            Back To Matches
          </Button>
          <Text c="dimmed" fw={700} size="sm" tt="uppercase">
            Intake
          </Text>
          <Title order={1} size="h2">
            {pageTitle}
          </Title>
          <Text c="dimmed" mt={4}>
            Complete the primary intake details for the selected person.
          </Text>
        </Box>
        <Button leftSection={<Check size={17} />} onClick={saveIntake}>
          {search?.mode === 'reintake' ? 'Save And Reopen Case' : 'Save And Create Case'}
        </Button>
      </Group>

      {error ? (
        <Alert color="red" icon={<AlertTriangle size={18} />}>
          {error}
        </Alert>
      ) : null}

      {selectedPerson ? (
        <Alert color="blue" icon={<Info size={18} />}>
          Form started for {[selectedPerson.firstName, selectedPerson.lastName].filter(Boolean).join(' ')}.
        </Alert>
      ) : null}

      <Grid align="stretch">
        <Grid.Col span={{ base: 12, lg: 9 }}>
          <Stack id="primary-intake-form" gap="md">
            <FormSection id="client" title="Client">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="First Name"
                    required
                    value={form.firstName}
                    onChange={handleTextFormField('firstName')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Last Name"
                    required
                    value={form.lastName}
                    onChange={handleTextFormField('lastName')}
                  />
                </Grid.Col>
                {(
                  [
                    ['middleName', 'Middle Name'],
                    ['preferredName', 'Preferred Name'],
                    ['dateOfBirth', 'Date Of Birth'],
                    ['approximateAge', 'Approximate Age'],
                    ['ssn', 'SSN'],
                    ['phone', 'Phone'],
                    ['alternatePhone', 'Alternate Phone'],
                    ['email', 'Email'],
                  ] as const
                ).map(([field, label]) => (
                  <Grid.Col key={field} span={{ base: 12, md: 4 }}>
                    <TextInput
                      label={label}
                      value={form[field]}
                      onChange={handleTextFormField(field)}
                    />
                  </Grid.Col>
                ))}
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    data={['Phone', 'Text', 'Email', 'Mail']}
                    label="Preferred Contact"
                    value={form.preferredContactMethod || null}
                    onChange={(value) =>
                      updateForm('preferredContactMethod', value ?? '')
                    }
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="Address Line 1"
                    value={form.line1}
                    onChange={handleTextFormField('line1')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="Address Line 2"
                    value={form.line2}
                    onChange={handleTextFormField('line2')}
                  />
                </Grid.Col>
                {(
                  [
                    ['city', 'City'],
                    ['state', 'State'],
                    ['postalCode', 'ZIP Code'],
                    ['county', 'County'],
                  ] as const
                ).map(([field, label]) => (
                  <Grid.Col key={field} span={{ base: 12, md: 3 }}>
                    <TextInput
                      label={label}
                      value={form[field]}
                      onChange={handleTextFormField(field)}
                    />
                  </Grid.Col>
                ))}
                <Grid.Col span={12}>
                  <Group>
                    <Checkbox
                      checked={form.safeToCall}
                      label="Safe To Call"
                      onChange={handleCheckboxFormField('safeToCall')}
                    />
                    <Checkbox
                      checked={form.safeToText}
                      label="Safe To Text"
                      onChange={handleCheckboxFormField('safeToText')}
                    />
                    <Checkbox
                      checked={form.safeToEmail}
                      label="Safe To Email"
                      onChange={handleCheckboxFormField('safeToEmail')}
                    />
                  </Group>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Textarea
                    label="Contact Restrictions"
                    value={form.contactRestrictions}
                    onChange={handleTextFormField('contactRestrictions')}
                  />
                </Grid.Col>
              </Grid>
            </FormSection>

            <FormSection id="demographics" title="Demographics">
              <Grid>
                {(
                  [
                    'gender',
                    'race',
                    'ethnicity',
                    'primaryLanguage',
                    'veteranStatus',
                    'disabilityStatus',
                    'householdSize',
                    'dependents',
                    'maritalStatus',
                  ] as const
                ).map((field) => (
                  <Grid.Col key={field} span={{ base: 12, md: 4 }}>
                    <TextInput
                      label={titleCaseField(field)}
                      value={String(form[field])}
                      onChange={handleTextFormField(field)}
                    />
                  </Grid.Col>
                ))}
                <Grid.Col span={12}>
                  <Checkbox
                    checked={form.interpreterNeeded}
                    label="Interpreter Needed"
                    onChange={handleCheckboxFormField('interpreterNeeded')}
                  />
                </Grid.Col>
              </Grid>
            </FormSection>

            <FormSection
              action={<Button onClick={addIncomeSource}>Add Income</Button>}
              id="income"
              title="Income"
            >
              <Stack>
                {incomeSources.length === 0 ? (
                  <Text c="dimmed" size="sm">
                    No income sources added.
                  </Text>
                ) : null}
                {incomeSources.map((source, index) => (
                  <Grid key={source.id}>
                    {(
                      [
                        ['type', 'Income Type'],
                        ['sourceName', 'Employer / Source'],
                        ['amount', 'Amount'],
                        ['frequency', 'Frequency'],
                      ] as const
                    ).map(([field, label]) => (
                      <Grid.Col key={field} span={{ base: 12, md: 3 }}>
                        <TextInput
                          label={label}
                          value={valueOrEmpty(source[field])}
                          onChange={handleIncomeSourceField(index, field)}
                        />
                      </Grid.Col>
                    ))}
                  </Grid>
                ))}
              </Stack>
            </FormSection>

            <FormSection
              action={<Button onClick={addBenefit}>Add Benefit</Button>}
              id="benefits"
              title="Benefits"
            >
              <Stack>
                {benefits.length === 0 ? (
                  <Text c="dimmed" size="sm">
                    No benefits added.
                  </Text>
                ) : null}
                {benefits.map((benefit, index) => (
                  <Grid key={benefit.id}>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <Select
                        data={benefitOptions}
                        label="Benefit"
                        value={benefit.type}
                        onChange={(value) =>
                          setBenefits((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, type: value ?? item.type }
                                : item,
                            ),
                          )
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <TextInput
                        label="Monthly Amount"
                        value={benefit.monthlyAmount ?? ''}
                        onChange={handleBenefitField(index, 'monthlyAmount')}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <TextInput
                        label="Agency / Provider"
                        value={benefit.agency ?? ''}
                        onChange={handleBenefitField(index, 'agency')}
                      />
                    </Grid.Col>
                  </Grid>
                ))}
              </Stack>
            </FormSection>

            <FormSection
              action={<Button onClick={addContact}>Add Contact</Button>}
              id="contacts"
              title="Contacts"
            >
              <Stack>
                {contacts.length === 0 ? (
                  <Text c="dimmed" size="sm">
                    No contacts added.
                  </Text>
                ) : null}
                {contacts.map((contact, index) => (
                  <Grid key={contact.id}>
                    {(
                      [
                        ['name', 'Name'],
                        ['relationship', 'Relationship'],
                        ['phone', 'Phone'],
                        ['email', 'Email'],
                      ] as const
                    ).map(([field, label]) => (
                      <Grid.Col key={field} span={{ base: 12, md: 3 }}>
                        <TextInput
                          label={label}
                          value={valueOrEmpty(contact[field])}
                          onChange={handleContactField(index, field)}
                        />
                      </Grid.Col>
                    ))}
                  </Grid>
                ))}
              </Stack>
            </FormSection>

            <FormSection id="legal" title="Legal">
              <Grid>
                <Grid.Col span={12}>
                  <Checkbox
                    checked={form.hasCourtInvolvement}
                    label="Court Involvement"
                    onChange={handleCheckboxFormField('hasCourtInvolvement')}
                  />
                </Grid.Col>
                {(
                  [
                    'matterType',
                    'courtName',
                    'legalCounty',
                    'legalCaseNumber',
                    'judge',
                    'attorney',
                    'officer',
                    'nextCourtDate',
                    'courtTime',
                    'legalStatus',
                  ] as const
                ).map((field) => (
                  <Grid.Col key={field} span={{ base: 12, md: 4 }}>
                    <TextInput
                      label={titleCaseField(field)}
                      value={String(form[field])}
                      onChange={handleTextFormField(field)}
                    />
                  </Grid.Col>
                ))}
                <Grid.Col span={12}>
                  <Checkbox
                    checked={form.warrantsKnown}
                    label="Warrants Known"
                    onChange={handleCheckboxFormField('warrantsKnown')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Textarea
                    label="Legal Notes"
                    value={form.legalNotes}
                    onChange={handleTextFormField('legalNotes')}
                  />
                </Grid.Col>
              </Grid>
            </FormSection>

            <FormSection id="housing" title="Housing">
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    data={housingOptions}
                    label="Housing Status"
                    onChange={(value) => updateForm('housingStatus', value ?? '')}
                    required
                    value={form.housingStatus || null}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Current Location"
                    value={form.currentLocation}
                    onChange={handleTextFormField('currentLocation')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Length Of Stay"
                    value={form.lengthOfStay}
                    onChange={handleTextFormField('lengthOfStay')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Group>
                    <Checkbox
                      checked={form.safeHousing}
                      label="Safe Housing"
                      onChange={handleCheckboxFormField('safeHousing')}
                    />
                    <Checkbox
                      checked={form.housingAtRisk}
                      label="At Risk"
                      onChange={handleCheckboxFormField('housingAtRisk')}
                    />
                    <Checkbox
                      checked={form.evictionPending}
                      label="Eviction Pending"
                      onChange={handleCheckboxFormField('evictionPending')}
                    />
                    <Checkbox
                      checked={form.livingWithFamily}
                      label="Living With Family / Friends"
                      onChange={handleCheckboxFormField('livingWithFamily')}
                    />
                  </Group>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Textarea
                    label="Housing Notes"
                    value={form.housingNotes}
                    onChange={handleTextFormField('housingNotes')}
                  />
                </Grid.Col>
              </Grid>
            </FormSection>
          </Stack>
        </Grid.Col>

        <Grid.Col className="self-stretch" span={{ base: 12, lg: 3 }}>
          <Box className="rounded-md border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
            <Text c="dimmed" fw={700} mb="sm" size="sm" tt="uppercase">
              Sections
            </Text>
            <TableOfContents
              color="frcBlue"
              initialData={sectionHeadings.map((heading) => ({
                ...heading,
                depth: 1,
              }))}
              radius={6}
              scrollSpyOptions={{
                selector: '#primary-intake-form [data-intake-heading]',
                getDepth: () => 1,
                getValue: (element) =>
                  element.getAttribute('data-intake-heading') || '',
                offset: 96,
              }}
              size="sm"
              variant="light"
              getControlProps={({ data }) => ({
                onClick: () =>
                  data
                    .getNode()
                    .closest('[data-intake-section]')
                    ?.scrollIntoView({ block: 'start' }),
                children: data.value,
              })}
            />
          </Box>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

function FormSection({
  action,
  children,
  id,
  title,
}: {
  action?: ReactNode
  children: ReactNode
  id: string
  title: string
}) {
  return (
    <Box
      className="scroll-mt-24 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
      data-intake-section
      id={id}
    >
      <Group justify="space-between" mb="md">
        <Title data-intake-heading={title} id={`${id}-heading`} order={2} size="h4">
          {title}
        </Title>
        {action}
      </Group>
      {children}
    </Box>
  )
}
