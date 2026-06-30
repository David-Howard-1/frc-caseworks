import {
	Alert,
	Badge,
	Box,
	Button,
	Checkbox,
	Divider,
	Grid,
	Group,
	Select,
	Stack,
	Table,
	Tabs,
	Text,
	TextInput,
	Textarea,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import {
	AlertTriangle,
	Check,
	FilePlus2,
	Info,
	RotateCcw,
	Search,
	UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type {
	IntakeBenefit,
	IntakeContact,
	IntakeIncomeSource,
	IntakeSubmission,
} from "~/domain/workspace";
import { formatDate } from "~/domain/workspace";
import { useDemoWorkspace } from "~/hooks/useDemoWorkspace";

const today = () => new Date().toISOString().slice(0, 10);

const housingOptions = [
	"Stable housing",
	"Temporary housing",
	"Shelter",
	"Transitional housing",
	"Doubled up",
	"Unsheltered",
	"In custody",
	"Hospital or treatment facility",
	"Unknown",
	"Other",
];

const benefitOptions = [
	"SNAP",
	"TANF",
	"Medicaid",
	"Medicare",
	"WIC",
	"Housing assistance",
	"Utility assistance",
	"Child care assistance",
	"Unemployment benefits",
	"Social Security benefits",
	"Veterans benefits",
	"Other public assistance",
];

type SearchInput = {
	name: string;
	dateOfBirth: string;
	ssn: string;
	phone: string;
	email: string;
};

type IntakeFormState = {
	middleName: string;
	preferredName: string;
	approximateAge: string;
	alternatePhone: string;
	preferredContactMethod: string;
	line1: string;
	line2: string;
	city: string;
	state: string;
	postalCode: string;
	county: string;
	gender: string;
	race: string;
	ethnicity: string;
	primaryLanguage: string;
	interpreterNeeded: boolean;
	veteranStatus: string;
	disabilityStatus: string;
	householdSize: string;
	dependents: string;
	maritalStatus: string;
	safeToCall: boolean;
	safeToText: boolean;
	safeToEmail: boolean;
	contactRestrictions: string;
	housingStatus: string;
	currentLocation: string;
	lengthOfStay: string;
	safeHousing: boolean;
	housingAtRisk: boolean;
	evictionPending: boolean;
	livingWithFamily: boolean;
	housingNotes: string;
	hasCourtInvolvement: boolean;
	matterType: string;
	courtName: string;
	legalCounty: string;
	legalCaseNumber: string;
	judge: string;
	attorney: string;
	officer: string;
	nextCourtDate: string;
	courtTime: string;
	legalStatus: string;
	warrantsKnown: boolean;
	legalNotes: string;
	overrideReason: string;
};

const emptyForm: IntakeFormState = {
	middleName: "",
	preferredName: "",
	approximateAge: "",
	alternatePhone: "",
	preferredContactMethod: "",
	line1: "",
	line2: "",
	city: "",
	state: "KY",
	postalCode: "",
	county: "",
	gender: "",
	race: "",
	ethnicity: "",
	primaryLanguage: "",
	interpreterNeeded: false,
	veteranStatus: "",
	disabilityStatus: "",
	householdSize: "",
	dependents: "",
	maritalStatus: "",
	safeToCall: true,
	safeToText: true,
	safeToEmail: true,
	contactRestrictions: "",
	housingStatus: "",
	currentLocation: "",
	lengthOfStay: "",
	safeHousing: true,
	housingAtRisk: false,
	evictionPending: false,
	livingWithFamily: false,
	housingNotes: "",
	hasCourtInvolvement: false,
	matterType: "",
	courtName: "",
	legalCounty: "",
	legalCaseNumber: "",
	judge: "",
	attorney: "",
	officer: "",
	nextCourtDate: "",
	courtTime: "",
	legalStatus: "",
	warrantsKnown: false,
	legalNotes: "",
	overrideReason: "",
};

function splitLookupName(name: string) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	const firstName = parts[0] ?? "";
	const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";

	return { firstName, lastName };
}

export function IntakeWorkflow() {
	const { createCaseFromIntake, currentStaffId, findIntakeMatches } =
		useDemoWorkspace();
	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState<SearchInput>({
		name: "",
		dateOfBirth: "",
		ssn: "",
		phone: "",
		email: "",
	});
	const [hasSearched, setHasSearched] = useState(false);
	const [intakeStarted, setIntakeStarted] = useState(false);
	const [form, setForm] = useState<IntakeFormState>(emptyForm);
	const [incomeSources, setIncomeSources] = useState<IntakeIncomeSource[]>(
		[],
	);
	const [benefits, setBenefits] = useState<IntakeBenefit[]>([]);
	const [contacts, setContacts] = useState<IntakeContact[]>([]);
	const [error, setError] = useState("");

	const matches = useMemo(
		() => {
			if (!hasSearched) {
				return [];
			}

			const { firstName, lastName } = splitLookupName(searchInput.name);

			return findIntakeMatches({
				firstName,
				lastName,
				dateOfBirth: searchInput.dateOfBirth,
				phone: searchInput.phone,
				email: searchInput.email,
				ssn: searchInput.ssn,
			});
		},
		[findIntakeMatches, hasSearched, searchInput],
	);

	function updateForm<K extends keyof IntakeFormState>(
		field: K,
		value: IntakeFormState[K],
	) {
		setForm((current) => ({ ...current, [field]: value }));
	}

	function handleSearchField(field: keyof SearchInput) {
		return (event: ChangeEvent<HTMLInputElement>) => {
			const { value } = event.currentTarget;
			setSearchInput((current) => ({ ...current, [field]: value }));
		};
	}

	function clearSearch() {
		setSearchInput({
			name: "",
			dateOfBirth: "",
			ssn: "",
			phone: "",
			email: "",
		});
		setHasSearched(false);
	}

	function continueWithNewPerson() {
		setIntakeStarted(true);
	}

	function handleTextFormField(field: keyof IntakeFormState) {
		return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { value } = event.currentTarget;
			updateForm(field, value as never);
		};
	}

	function handleCheckboxFormField(field: keyof IntakeFormState) {
		return (event: ChangeEvent<HTMLInputElement>) => {
			const { checked } = event.currentTarget;
			updateForm(field, checked as never);
		};
	}

	function handleIncomeSourceField(
		index: number,
		field: keyof IntakeIncomeSource,
	) {
		return (event: ChangeEvent<HTMLInputElement>) => {
			const { value } = event.currentTarget;
			setIncomeSources((current) =>
				current.map((item, itemIndex) =>
					itemIndex === index ? { ...item, [field]: value } : item,
				),
			);
		};
	}

	function handleBenefitField(index: number, field: keyof IntakeBenefit) {
		return (event: ChangeEvent<HTMLInputElement>) => {
			const { value } = event.currentTarget;
			setBenefits((current) =>
				current.map((item, itemIndex) =>
					itemIndex === index ? { ...item, [field]: value } : item,
				),
			);
		};
	}

	function handleContactField(index: number, field: keyof IntakeContact) {
		return (event: ChangeEvent<HTMLInputElement>) => {
			const { value } = event.currentTarget;
			setContacts((current) =>
				current.map((item, itemIndex) =>
					itemIndex === index ? { ...item, [field]: value } : item,
				),
			);
		};
	}

	function addIncomeSource() {
		setIncomeSources((current) => [
			...current,
			{
				id: `income-${Date.now()}`,
				type: "Employment wages",
				sourceName: "",
				amount: "",
				frequency: "Monthly",
			},
		]);
	}

	function addBenefit() {
		setBenefits((current) => [
			...current,
			{
				id: `benefit-${Date.now()}`,
				type: "SNAP",
				isReceiving: true,
			},
		]);
	}

	function addContact() {
		setContacts((current) => [
			...current,
			{
				id: `contact-${Date.now()}`,
				name: "",
				relationship: "Emergency contact",
				permissionToContact: true,
			},
		]);
	}

	async function saveIntake() {
		if (!currentStaffId) {
			setError("Add and select a user before creating casework data.");
			return;
		}

		const { firstName, lastName } = splitLookupName(searchInput.name);
		const hasContact = Boolean(searchInput.phone || searchInput.email);
		const missingCore =
			!firstName.trim() ||
			!lastName.trim() ||
			(!searchInput.dateOfBirth && !form.approximateAge.trim()) ||
			!hasContact ||
			!form.housingStatus;

		if (missingCore) {
			setError(
				"The intake could not be saved. Please complete required client, contact, age or DOB, and housing fields.",
			);
			return;
		}

		const duplicateWarnings = matches.map(
			(match) =>
				`${match.strength}: ${match.clientName} (${match.recordType})`,
		);
		const createdDate = today();
		const intake: Omit<IntakeSubmission, "id"> = {
			status: matches.length > 0 ? "Duplicate Review" : "Draft",
			createdById: currentStaffId,
			startedAt: `${createdDate}T09:00:00`,
			duplicateWarnings,
			duplicateOverrideReason: form.overrideReason || undefined,
			client: {
				firstName,
				middleName: form.middleName,
				lastName,
				preferredName: form.preferredName,
				dateOfBirth: searchInput.dateOfBirth,
				ssn: searchInput.ssn,
				approximateAge: form.approximateAge,
				phone: searchInput.phone,
				alternatePhone: form.alternatePhone,
				email: searchInput.email,
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
		};

		const caseId = await createCaseFromIntake(intake);
		if (caseId) {
			navigate({ to: "/cases/$caseId", params: { caseId: String(caseId) } });
		}
	}

	return (
		<Stack gap='lg'>
			<Group align='flex-start' justify='space-between'>
				<Box>
					<Text c='dimmed' fw={700} size='sm' tt='uppercase'>
						Intake
					</Text>
					<Title order={1} size='h2'>
						New Intake
					</Title>
					<Text c='dimmed' mt={4}>
						Check for an existing person before starting a new
						intake record.
					</Text>
				</Box>
				<Button leftSection={<Check size={17} />} onClick={saveIntake}>
					Save and Create Case
				</Button>
			</Group>

			{error ? (
				<Alert color='red' icon={<AlertTriangle size={18} />}>
					{error}
				</Alert>
			) : null}

			<Box className='rounded-md border border-slate-200 bg-white p-5 shadow-sm'>
				<Group align='flex-start' justify='space-between'>
					<Box>
						<Group gap='sm'>
							<ThemeIcon color='frcBlue' radius={6} variant='light'>
								<Search size={18} />
							</ThemeIcon>
							<Box>
								<Title order={2} size='h4'>
									Step 1: Search for Potential Matches
								</Title>
								<Text c='dimmed' size='sm'>
									Look up people by name, DOB, SSN, phone, or
									email before beginning the intake.
								</Text>
							</Box>
						</Group>
					</Box>
					<Box className='max-w-sm rounded-md bg-slate-50 p-3'>
						<Group align='flex-start' gap='sm' wrap='nowrap'>
							<Info size={18} className='mt-0.5 text-[#1C5380]' />
							<Text c='dimmed' size='sm'>
								Search includes existing cases and unfinished
								intake drafts in this workspace.
							</Text>
						</Group>
					</Box>
				</Group>

				<Grid align='flex-end' mt='md'>
					<Grid.Col span={{ base: 12, md: 4 }}>
						<TextInput
							leftSection={<Search size={16} />}
							label='Name'
							onChange={handleSearchField("name")}
							placeholder='First and last name'
							value={searchInput.name}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
						<TextInput
							label='Date of birth'
							onChange={handleSearchField("dateOfBirth")}
							placeholder='YYYY-MM-DD'
							value={searchInput.dateOfBirth}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
						<TextInput
							label='SSN'
							onChange={handleSearchField("ssn")}
							placeholder='Last 4 or full SSN'
							value={searchInput.ssn}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
						<TextInput
							label='Phone'
							onChange={handleSearchField("phone")}
							placeholder='(555) 555-5555'
							value={searchInput.phone}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
						<TextInput
							label='Email'
							onChange={handleSearchField("email")}
							placeholder='name@example.org'
							value={searchInput.email}
						/>
					</Grid.Col>
					<Grid.Col span={12}>
						<Group justify='space-between'>
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
									variant='subtle'
								>
									Clear
								</Button>
							</Group>
							<Button
								leftSection={<UserPlus size={17} />}
								onClick={continueWithNewPerson}
								variant={intakeStarted ? "light" : "outline"}
							>
								Continue with New Person
							</Button>
						</Group>
					</Grid.Col>
				</Grid>

				<Box mt='lg'>
					<Group justify='space-between' mb='xs'>
						<Text fw={700}>Potential Matches</Text>
						{hasSearched ? (
							<Badge color={matches.length > 0 ? "yellow" : "green"}>
								{matches.length} found
							</Badge>
						) : null}
					</Group>

					{hasSearched ? (
						matches.length > 0 ? (
							<Stack>
								<Alert
									color='yellow'
									icon={<AlertTriangle size={18} />}
								>
									Possible existing records found. Review these
									before creating a new intake.
								</Alert>
								<Table.ScrollContainer minWidth={900}>
									<Table verticalSpacing='sm'>
										<Table.Thead>
											<Table.Tr>
												<Table.Th>Name</Table.Th>
												<Table.Th>Phone / Email</Table.Th>
												<Table.Th>Record</Table.Th>
												<Table.Th>Status</Table.Th>
												<Table.Th>Program area</Table.Th>
												<Table.Th>Last updated</Table.Th>
												<Table.Th>Match</Table.Th>
												<Table.Th>Action</Table.Th>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{matches.map((match) => (
												<Table.Tr
													key={`${match.recordType}-${match.id}`}
												>
													<Table.Td>
														<Text fw={700}>
															{match.clientName}
														</Text>
														<Text c='dimmed' size='sm'>
															{match.dateOfBirth
																? `DOB ${formatDate(match.dateOfBirth)}`
																: "DOB not recorded"}
														</Text>
													</Table.Td>
													<Table.Td>
														<Text size='sm'>
															{match.phone ?? "No phone"}
														</Text>
														<Text c='dimmed' size='sm'>
															{match.email ?? "No email"}
														</Text>
													</Table.Td>
													<Table.Td>
														{match.recordType}
													</Table.Td>
													<Table.Td>
														{match.caseStatus ??
															"Draft"}
													</Table.Td>
													<Table.Td>
														{match.programArea}
													</Table.Td>
													<Table.Td>
														{formatDate(
															match.lastUpdated.slice(
																0,
																10,
															),
														)}
													</Table.Td>
													<Table.Td>
														<Badge
															color={
																match.strength.startsWith(
																	"High",
																)
																	? "red"
																	: "yellow"
															}
														>
															{match.strength}
														</Badge>
													</Table.Td>
													<Table.Td>
														<Button size='xs' variant='light'>
															View
														</Button>
													</Table.Td>
												</Table.Tr>
											))}
										</Table.Tbody>
									</Table>
								</Table.ScrollContainer>
								<Textarea
									label='Duplicate override note'
									onChange={handleTextFormField("overrideReason")}
									placeholder='Reason for creating a new intake anyway'
									value={form.overrideReason}
								/>
							</Stack>
						) : (
							<Alert
								color='green'
								icon={<FilePlus2 size={18} />}
							>
								No matching clients, intakes, or cases were found.
								Continue creating a new intake.
							</Alert>
						)
					) : (
						<Box className='rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 text-center'>
							<Text c='dimmed' fw={700}>
								Run a search to see potential matches.
							</Text>
						</Box>
					)}
				</Box>
			</Box>

			<Divider
				label='Begin a new intake below'
				labelPosition='center'
				my='xs'
			/>

			<Box className='rounded-md border border-slate-200 bg-white p-5 shadow-sm'>
				<Group align='flex-start' justify='space-between' mb='md'>
					<Box>
						<Group gap='sm'>
							<ThemeIcon color='green' radius={6} variant='light'>
								<UserPlus size={18} />
							</ThemeIcon>
							<Box>
								<Title order={2} size='h4'>
									Step 2: Begin New Intake
								</Title>
								<Text c='dimmed' size='sm'>
									Complete the intake details for the person
									you are adding.
								</Text>
							</Box>
						</Group>
					</Box>
					{intakeStarted ? (
						<Badge color='green'>New person selected</Badge>
					) : (
						<Badge color='gray' variant='light'>
							Awaiting lookup
						</Badge>
					)}
				</Group>

				<Tabs defaultValue='client'>
					<Tabs.List>
						<Tabs.Tab value='client'>Client</Tabs.Tab>
						<Tabs.Tab value='demographics'>Demographics</Tabs.Tab>
						<Tabs.Tab value='income'>Income</Tabs.Tab>
						<Tabs.Tab value='contacts'>Contacts</Tabs.Tab>
						<Tabs.Tab value='legal'>Legal</Tabs.Tab>
						<Tabs.Tab value='housing'>Housing</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel pt='md' value='client'>
						<Grid>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<TextInput
									label='Middle name'
									value={form.middleName}
									onChange={handleTextFormField("middleName")}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<TextInput
									label='Preferred name'
									value={form.preferredName}
									onChange={handleTextFormField(
										"preferredName",
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<TextInput
									label='Approximate age'
									value={form.approximateAge}
									onChange={handleTextFormField(
										"approximateAge",
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<TextInput
									label='Alternate phone'
									value={form.alternatePhone}
									onChange={handleTextFormField(
										"alternatePhone",
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<Select
									data={["Phone", "Text", "Email", "Mail"]}
									label='Preferred contact'
									value={form.preferredContactMethod || null}
									onChange={(value) =>
										updateForm(
											"preferredContactMethod",
											value ?? "",
										)
									}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<TextInput
									label='County'
									value={form.county}
									onChange={handleTextFormField("county")}
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<TextInput
									label='Address'
									value={form.line1}
									onChange={handleTextFormField("line1")}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<TextInput
									label='City'
									value={form.city}
									onChange={handleTextFormField("city")}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<TextInput
									label='State'
									value={form.state}
									onChange={handleTextFormField("state")}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<TextInput
									label='ZIP code'
									value={form.postalCode}
									onChange={handleTextFormField("postalCode")}
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<Group>
									<Checkbox
										checked={form.safeToCall}
										label='Safe to call'
										onChange={handleCheckboxFormField(
											"safeToCall",
										)}
									/>
									<Checkbox
										checked={form.safeToText}
										label='Safe to text'
										onChange={handleCheckboxFormField(
											"safeToText",
										)}
									/>
									<Checkbox
										checked={form.safeToEmail}
										label='Safe to email'
										onChange={handleCheckboxFormField(
											"safeToEmail",
										)}
									/>
								</Group>
							</Grid.Col>
						</Grid>
					</Tabs.Panel>

					<Tabs.Panel pt='md' value='demographics'>
						<Grid>
							{(
								[
									"gender",
									"race",
									"ethnicity",
									"primaryLanguage",
									"veteranStatus",
									"disabilityStatus",
									"householdSize",
									"dependents",
									"maritalStatus",
								] as const
							).map((field) => (
								<Grid.Col
									key={field}
									span={{ base: 12, md: 4 }}
								>
									<TextInput
										label={field.replace(/([A-Z])/g, " $1")}
										value={String(form[field])}
										onChange={handleTextFormField(field)}
									/>
								</Grid.Col>
							))}
							<Grid.Col span={12}>
								<Checkbox
									checked={form.interpreterNeeded}
									label='Interpreter needed'
									onChange={handleCheckboxFormField(
										"interpreterNeeded",
									)}
								/>
							</Grid.Col>
						</Grid>
					</Tabs.Panel>

					<Tabs.Panel pt='md' value='income'>
						<Group justify='space-between'>
							<Title order={2} size='h4'>
								Income sources
							</Title>
							<Button onClick={addIncomeSource}>
								Add income
							</Button>
						</Group>
						<Stack mt='sm'>
							{incomeSources.map((source, index) => (
								<Grid key={source.id}>
									<Grid.Col span={{ base: 12, md: 3 }}>
										<TextInput
											label='Income type'
											value={source.type}
											onChange={handleIncomeSourceField(
												index,
												"type",
											)}
										/>
									</Grid.Col>
									<Grid.Col span={{ base: 12, md: 3 }}>
										<TextInput
											label='Employer/source'
											value={source.sourceName}
											onChange={handleIncomeSourceField(
												index,
												"sourceName",
											)}
										/>
									</Grid.Col>
									<Grid.Col span={{ base: 12, md: 3 }}>
										<TextInput
											label='Amount'
											value={source.amount}
											onChange={handleIncomeSourceField(
												index,
												"amount",
											)}
										/>
									</Grid.Col>
									<Grid.Col span={{ base: 12, md: 3 }}>
										<TextInput
											label='Frequency'
											value={source.frequency}
											onChange={handleIncomeSourceField(
												index,
												"frequency",
											)}
										/>
									</Grid.Col>
								</Grid>
							))}
						</Stack>
						<Divider my='md' />
						<Group justify='space-between'>
							<Title order={2} size='h4'>
								Benefits
							</Title>
							<Button onClick={addBenefit}>Add benefit</Button>
						</Group>
						<Stack mt='sm'>
							{benefits.map((benefit, index) => (
								<Grid key={benefit.id}>
									<Grid.Col span={{ base: 12, md: 4 }}>
										<Select
											data={benefitOptions}
											label='Benefit'
											value={benefit.type}
											onChange={(value) =>
												setBenefits((current) =>
													current.map(
														(item, itemIndex) =>
															itemIndex === index
																? {
																		...item,
																		type:
																			value ??
																			item.type,
																	}
																: item,
													),
												)
											}
										/>
									</Grid.Col>
									<Grid.Col span={{ base: 12, md: 4 }}>
										<TextInput
											label='Monthly amount'
											value={benefit.monthlyAmount ?? ""}
											onChange={handleBenefitField(
												index,
												"monthlyAmount",
											)}
										/>
									</Grid.Col>
									<Grid.Col span={{ base: 12, md: 4 }}>
										<TextInput
											label='Agency/provider'
											value={benefit.agency ?? ""}
											onChange={handleBenefitField(
												index,
												"agency",
											)}
										/>
									</Grid.Col>
								</Grid>
							))}
						</Stack>
					</Tabs.Panel>

					<Tabs.Panel pt='md' value='contacts'>
						<Group justify='space-between'>
							<Title order={2} size='h4'>
								Relevant contacts
							</Title>
							<Button onClick={addContact}>Add contact</Button>
						</Group>
						<Stack mt='sm'>
							{contacts.map((contact, index) => (
								<Grid key={contact.id}>
									<Grid.Col span={{ base: 12, md: 3 }}>
										<TextInput
											label='Name'
											value={contact.name}
											onChange={handleContactField(
												index,
												"name",
											)}
										/>
									</Grid.Col>
									<Grid.Col span={{ base: 12, md: 3 }}>
										<TextInput
											label='Relationship'
											value={contact.relationship}
											onChange={handleContactField(
												index,
												"relationship",
											)}
										/>
									</Grid.Col>
									<Grid.Col span={{ base: 12, md: 3 }}>
										<TextInput
											label='Phone'
											value={contact.phone ?? ""}
											onChange={handleContactField(
												index,
												"phone",
											)}
										/>
									</Grid.Col>
									<Grid.Col span={{ base: 12, md: 3 }}>
										<TextInput
											label='Email'
											value={contact.email ?? ""}
											onChange={handleContactField(
												index,
												"email",
											)}
										/>
									</Grid.Col>
								</Grid>
							))}
						</Stack>
					</Tabs.Panel>

					<Tabs.Panel pt='md' value='legal'>
						<Grid>
							<Grid.Col span={12}>
								<Checkbox
									checked={form.hasCourtInvolvement}
									label='Court involvement'
									onChange={handleCheckboxFormField(
										"hasCourtInvolvement",
									)}
								/>
							</Grid.Col>
							{(
								[
									"matterType",
									"courtName",
									"legalCounty",
									"legalCaseNumber",
									"judge",
									"attorney",
									"officer",
									"nextCourtDate",
									"courtTime",
									"legalStatus",
								] as const
							).map((field) => (
								<Grid.Col
									key={field}
									span={{ base: 12, md: 4 }}
								>
									<TextInput
										label={field.replace(/([A-Z])/g, " $1")}
										value={String(form[field])}
										onChange={handleTextFormField(field)}
									/>
								</Grid.Col>
							))}
							<Grid.Col span={12}>
								<Checkbox
									checked={form.warrantsKnown}
									label='Warrants known'
									onChange={handleCheckboxFormField(
										"warrantsKnown",
									)}
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<Textarea
									label='Legal notes'
									value={form.legalNotes}
									onChange={handleTextFormField("legalNotes")}
								/>
							</Grid.Col>
						</Grid>
					</Tabs.Panel>

					<Tabs.Panel pt='md' value='housing'>
						<Grid>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<Select
									data={housingOptions}
									label='Housing status'
									onChange={(value) =>
										updateForm("housingStatus", value ?? "")
									}
									required
									value={form.housingStatus || null}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<TextInput
									label='Current location'
									value={form.currentLocation}
									onChange={handleTextFormField(
										"currentLocation",
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<TextInput
									label='Length of stay'
									value={form.lengthOfStay}
									onChange={handleTextFormField(
										"lengthOfStay",
									)}
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<Group>
									<Checkbox
										checked={form.safeHousing}
										label='Safe housing'
										onChange={handleCheckboxFormField(
											"safeHousing",
										)}
									/>
									<Checkbox
										checked={form.housingAtRisk}
										label='At risk'
										onChange={handleCheckboxFormField(
											"housingAtRisk",
										)}
									/>
									<Checkbox
										checked={form.evictionPending}
										label='Eviction pending'
										onChange={handleCheckboxFormField(
											"evictionPending",
										)}
									/>
									<Checkbox
										checked={form.livingWithFamily}
										label='Living with family/friends'
										onChange={handleCheckboxFormField(
											"livingWithFamily",
										)}
									/>
								</Group>
							</Grid.Col>
							<Grid.Col span={12}>
								<Textarea
									label='Housing notes'
									value={form.housingNotes}
									onChange={handleTextFormField(
										"housingNotes",
									)}
								/>
							</Grid.Col>
						</Grid>
					</Tabs.Panel>
				</Tabs>
			</Box>
		</Stack>
	);
}
