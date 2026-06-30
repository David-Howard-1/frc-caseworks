import { a as formatDate } from "./workspace-DnvJ3Qsu.js";
import { t as useDemoWorkspace } from "./useDemoWorkspace-13E_3_e1.js";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Alert, Badge, Box, Button, Checkbox, Grid, Group, Select, Stack, Table, TableOfContents, Text, TextInput, Textarea, ThemeIcon, Title } from "@mantine/core";
import { AlertTriangle, ArrowLeft, Check, FilePlus2, Info, RotateCcw, Search, UserPlus } from "lucide-react";
//#region src/components/IntakeWorkflow.tsx
var today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var housingOptions = [
	"Stable housing",
	"Temporary housing",
	"Shelter",
	"Transitional housing",
	"Doubled up",
	"Unsheltered",
	"In custody",
	"Hospital or treatment facility",
	"Unknown",
	"Other"
];
var benefitOptions = [
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
	"Other public assistance"
];
var emptyForm = {
	firstName: "",
	lastName: "",
	middleName: "",
	preferredName: "",
	dateOfBirth: "",
	ssn: "",
	phone: "",
	email: "",
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
	overrideReason: ""
};
var sectionHeadings = [
	{
		id: "client",
		value: "Client"
	},
	{
		id: "demographics",
		value: "Demographics"
	},
	{
		id: "income",
		value: "Income"
	},
	{
		id: "benefits",
		value: "Benefits"
	},
	{
		id: "contacts",
		value: "Contacts"
	},
	{
		id: "legal",
		value: "Legal"
	},
	{
		id: "housing",
		value: "Housing"
	}
];
function splitLookupName(name = "") {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	return {
		firstName: parts[0] ?? "",
		lastName: parts.length > 1 ? parts.slice(1).join(" ") : ""
	};
}
var valueOrEmpty = (value) => value === void 0 ? "" : String(value);
function buildInitialSearch(search) {
	return {
		name: search?.name ?? "",
		dateOfBirth: search?.dateOfBirth ?? "",
		ssn: search?.ssn ?? "",
		phone: search?.phone ?? "",
		email: search?.email ?? ""
	};
}
function getInitialForm(person, search) {
	const splitName = splitLookupName(search?.name);
	return {
		...emptyForm,
		firstName: person?.firstName ?? splitName.firstName,
		lastName: person?.lastName ?? splitName.lastName,
		middleName: person?.middleName ?? "",
		preferredName: person?.preferredName ?? "",
		dateOfBirth: person?.dateOfBirth ?? search?.dateOfBirth ?? "",
		ssn: search?.ssn ?? "",
		phone: person?.phone ?? search?.phone ?? "",
		email: person?.email ?? search?.email ?? "",
		approximateAge: person?.approximateAge ?? "",
		line1: person?.addressLine1 ?? "",
		line2: person?.addressLine2 ?? "",
		city: person?.city ?? "",
		state: person?.state ?? "KY",
		postalCode: person?.postalCode ?? "",
		county: person?.county ?? ""
	};
}
function titleCaseField(field) {
	return field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
function compactSearch(search) {
	return Object.fromEntries(Object.entries(search).filter(([, value]) => value.trim()));
}
function IntakeMatchFinder({ initialSearch }) {
	const { findIntakeMatches } = useDemoWorkspace();
	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState(buildInitialSearch(initialSearch));
	const [hasSearched, setHasSearched] = useState(false);
	const matches = useMemo(() => {
		if (!hasSearched) return [];
		const { firstName, lastName } = splitLookupName(searchInput.name);
		return findIntakeMatches({
			firstName,
			lastName,
			dateOfBirth: searchInput.dateOfBirth,
			phone: searchInput.phone,
			email: searchInput.email,
			ssn: searchInput.ssn
		});
	}, [
		findIntakeMatches,
		hasSearched,
		searchInput
	]);
	function handleSearchField(field) {
		return (event) => {
			const { value } = event.currentTarget;
			setSearchInput((current) => ({
				...current,
				[field]: value
			}));
		};
	}
	function clearSearch() {
		setSearchInput(buildInitialSearch());
		setHasSearched(false);
	}
	function startNewIntake() {
		navigate({
			to: "/intake/new",
			search: compactSearch(searchInput)
		});
	}
	return /* @__PURE__ */ jsxs(Stack, {
		gap: "lg",
		children: [/* @__PURE__ */ jsxs(Group, {
			align: "flex-start",
			justify: "space-between",
			children: [/* @__PURE__ */ jsxs(Box, { children: [
				/* @__PURE__ */ jsx(Text, {
					c: "dimmed",
					fw: 700,
					size: "sm",
					tt: "uppercase",
					children: "Intake"
				}),
				/* @__PURE__ */ jsx(Title, {
					order: 1,
					size: "h2",
					children: "Find Potential Matches"
				}),
				/* @__PURE__ */ jsx(Text, {
					c: "dimmed",
					mt: 4,
					children: "Search all people before starting a primary intake."
				})
			] }), /* @__PURE__ */ jsx(Button, {
				leftSection: /* @__PURE__ */ jsx(FilePlus2, { size: 17 }),
				onClick: startNewIntake,
				variant: "outline",
				children: "Start New Intake"
			})]
		}), /* @__PURE__ */ jsxs(Box, {
			className: "rounded-md border border-slate-200 bg-white p-5 shadow-sm",
			children: [
				/* @__PURE__ */ jsxs(Group, {
					align: "flex-start",
					justify: "space-between",
					children: [/* @__PURE__ */ jsxs(Group, {
						gap: "sm",
						children: [/* @__PURE__ */ jsx(ThemeIcon, {
							color: "frcBlue",
							radius: 6,
							variant: "light",
							children: /* @__PURE__ */ jsx(Search, { size: 18 })
						}), /* @__PURE__ */ jsxs(Box, { children: [/* @__PURE__ */ jsx(Title, {
							order: 2,
							size: "h4",
							children: "Search People"
						}), /* @__PURE__ */ jsx(Text, {
							c: "dimmed",
							size: "sm",
							children: "Look up people by name, date of birth, SSN, phone, or email."
						})] })]
					}), /* @__PURE__ */ jsx(Box, {
						className: "max-w-sm rounded-md bg-slate-50 p-3",
						children: /* @__PURE__ */ jsxs(Group, {
							align: "flex-start",
							gap: "sm",
							wrap: "nowrap",
							children: [/* @__PURE__ */ jsx(Info, {
								size: 18,
								className: "mt-0.5 text-[#1C5380]"
							}), /* @__PURE__ */ jsx(Text, {
								c: "dimmed",
								size: "sm",
								children: "Results include people with cases and people without cases."
							})]
						})
					})]
				}),
				/* @__PURE__ */ jsxs(Grid, {
					align: "flex-end",
					mt: "md",
					children: [
						/* @__PURE__ */ jsx(Grid.Col, {
							span: {
								base: 12,
								md: 4
							},
							children: /* @__PURE__ */ jsx(TextInput, {
								leftSection: /* @__PURE__ */ jsx(Search, { size: 16 }),
								label: "Name",
								onChange: handleSearchField("name"),
								placeholder: "First and last name",
								value: searchInput.name
							})
						}),
						/* @__PURE__ */ jsx(Grid.Col, {
							span: {
								base: 12,
								sm: 6,
								md: 2
							},
							children: /* @__PURE__ */ jsx(TextInput, {
								label: "Date Of Birth",
								onChange: handleSearchField("dateOfBirth"),
								placeholder: "YYYY-MM-DD",
								value: searchInput.dateOfBirth
							})
						}),
						/* @__PURE__ */ jsx(Grid.Col, {
							span: {
								base: 12,
								sm: 6,
								md: 2
							},
							children: /* @__PURE__ */ jsx(TextInput, {
								label: "SSN",
								onChange: handleSearchField("ssn"),
								placeholder: "Last 4 or full SSN",
								value: searchInput.ssn
							})
						}),
						/* @__PURE__ */ jsx(Grid.Col, {
							span: {
								base: 12,
								sm: 6,
								md: 2
							},
							children: /* @__PURE__ */ jsx(TextInput, {
								label: "Phone",
								onChange: handleSearchField("phone"),
								placeholder: "(555) 555-5555",
								value: searchInput.phone
							})
						}),
						/* @__PURE__ */ jsx(Grid.Col, {
							span: {
								base: 12,
								sm: 6,
								md: 2
							},
							children: /* @__PURE__ */ jsx(TextInput, {
								label: "Email",
								onChange: handleSearchField("email"),
								placeholder: "name@example.org",
								value: searchInput.email
							})
						}),
						/* @__PURE__ */ jsx(Grid.Col, {
							span: 12,
							children: /* @__PURE__ */ jsxs(Group, {
								justify: "space-between",
								children: [/* @__PURE__ */ jsxs(Group, { children: [/* @__PURE__ */ jsx(Button, {
									leftSection: /* @__PURE__ */ jsx(Search, { size: 16 }),
									onClick: () => setHasSearched(true),
									children: "Search"
								}), /* @__PURE__ */ jsx(Button, {
									leftSection: /* @__PURE__ */ jsx(RotateCcw, { size: 16 }),
									onClick: clearSearch,
									variant: "subtle",
									children: "Clear"
								})] }), /* @__PURE__ */ jsx(Button, {
									leftSection: /* @__PURE__ */ jsx(UserPlus, { size: 17 }),
									onClick: startNewIntake,
									children: "Start New Intake"
								})]
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs(Box, {
					mt: "lg",
					children: [/* @__PURE__ */ jsxs(Group, {
						justify: "space-between",
						mb: "xs",
						children: [/* @__PURE__ */ jsx(Text, {
							fw: 700,
							children: "Potential Matches"
						}), hasSearched ? /* @__PURE__ */ jsxs(Badge, {
							color: matches.length > 0 ? "yellow" : "green",
							children: [matches.length, " found"]
						}) : null]
					}), hasSearched ? matches.length > 0 ? /* @__PURE__ */ jsxs(Stack, { children: [/* @__PURE__ */ jsx(Alert, {
						color: "yellow",
						icon: /* @__PURE__ */ jsx(AlertTriangle, { size: 18 }),
						children: "Review possible matches before creating a new intake."
					}), /* @__PURE__ */ jsx(Table.ScrollContainer, {
						minWidth: 900,
						children: /* @__PURE__ */ jsxs(Table, {
							verticalSpacing: "sm",
							children: [/* @__PURE__ */ jsx(Table.Thead, { children: /* @__PURE__ */ jsxs(Table.Tr, { children: [
								/* @__PURE__ */ jsx(Table.Th, { children: "Name" }),
								/* @__PURE__ */ jsx(Table.Th, { children: "Phone / Email" }),
								/* @__PURE__ */ jsx(Table.Th, { children: "Case Status" }),
								/* @__PURE__ */ jsx(Table.Th, { children: "Program Area" }),
								/* @__PURE__ */ jsx(Table.Th, { children: "Last Updated" }),
								/* @__PURE__ */ jsx(Table.Th, { children: "Match" }),
								/* @__PURE__ */ jsx(Table.Th, { children: "Action" })
							] }) }), /* @__PURE__ */ jsx(Table.Tbody, { children: matches.map((match) => /* @__PURE__ */ jsxs(Table.Tr, { children: [
								/* @__PURE__ */ jsxs(Table.Td, { children: [/* @__PURE__ */ jsx(Text, {
									fw: 700,
									children: match.clientName
								}), /* @__PURE__ */ jsx(Text, {
									c: "dimmed",
									size: "sm",
									children: match.dateOfBirth ? `DOB ${formatDate(match.dateOfBirth)}` : "DOB not recorded"
								})] }),
								/* @__PURE__ */ jsxs(Table.Td, { children: [/* @__PURE__ */ jsx(Text, {
									size: "sm",
									children: match.phone ?? "No phone"
								}), /* @__PURE__ */ jsx(Text, {
									c: "dimmed",
									size: "sm",
									children: match.email ?? "No email"
								})] }),
								/* @__PURE__ */ jsx(Table.Td, { children: match.caseStatus ?? "No case" }),
								/* @__PURE__ */ jsx(Table.Td, { children: match.programArea }),
								/* @__PURE__ */ jsx(Table.Td, { children: match.lastUpdated ? formatDate(match.lastUpdated.slice(0, 10)) : "Not recorded" }),
								/* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsx(Badge, {
									color: match.strength.startsWith("High") ? "red" : "yellow",
									children: match.strength
								}) }),
								/* @__PURE__ */ jsx(Table.Td, { children: match.action === "view_case" && match.caseId ? /* @__PURE__ */ jsx(Button, {
									onClick: () => navigate({
										to: "/cases/$caseId",
										params: { caseId: String(match.caseId) }
									}),
									size: "xs",
									variant: "light",
									children: "View Case"
								}) : /* @__PURE__ */ jsx(Button, {
									onClick: () => navigate({
										to: "/intake/new",
										search: {
											personId: match.personId,
											caseId: match.caseId,
											mode: match.action === "reintake" ? "reintake" : void 0
										}
									}),
									size: "xs",
									children: match.action === "reintake" ? "Re-Intake" : "Start Intake"
								}) })
							] }, match.personId)) })]
						})
					})] }) : /* @__PURE__ */ jsx(Alert, {
						color: "green",
						icon: /* @__PURE__ */ jsx(FilePlus2, { size: 18 }),
						children: "No matching people were found. You can start a new primary intake."
					}) : /* @__PURE__ */ jsx(Box, {
						className: "rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 text-center",
						children: /* @__PURE__ */ jsx(Text, {
							c: "dimmed",
							fw: 700,
							children: "Run a search to see potential matches."
						})
					})]
				})
			]
		})]
	});
}
function PrimaryIntakeFormPage({ search }) {
	const { cases, createCaseFromIntake, currentStaffId, people } = useDemoWorkspace();
	const navigate = useNavigate();
	const selectedPerson = people.find((person) => person.id === search?.personId);
	const selectedCase = cases.find((caseRecord) => caseRecord.id === search?.caseId);
	const [form, setForm] = useState(() => getInitialForm(selectedPerson, search));
	const [incomeSources, setIncomeSources] = useState([]);
	const [benefits, setBenefits] = useState([]);
	const [contacts, setContacts] = useState([]);
	const [error, setError] = useState("");
	function updateForm(field, value) {
		setForm((current) => ({
			...current,
			[field]: value
		}));
	}
	function handleTextFormField(field) {
		return (event) => {
			const { value } = event.currentTarget;
			updateForm(field, value);
		};
	}
	function handleCheckboxFormField(field) {
		return (event) => {
			const { checked } = event.currentTarget;
			updateForm(field, checked);
		};
	}
	function handleIncomeSourceField(index, field) {
		return (event) => {
			const { value } = event.currentTarget;
			setIncomeSources((current) => current.map((item, itemIndex) => itemIndex === index ? {
				...item,
				[field]: value
			} : item));
		};
	}
	function handleBenefitField(index, field) {
		return (event) => {
			const { value } = event.currentTarget;
			setBenefits((current) => current.map((item, itemIndex) => itemIndex === index ? {
				...item,
				[field]: value
			} : item));
		};
	}
	function handleContactField(index, field) {
		return (event) => {
			const { value } = event.currentTarget;
			setContacts((current) => current.map((item, itemIndex) => itemIndex === index ? {
				...item,
				[field]: value
			} : item));
		};
	}
	function addIncomeSource() {
		setIncomeSources((current) => [...current, {
			id: `income-${Date.now()}`,
			type: "Employment wages",
			sourceName: "",
			amount: "",
			frequency: "Monthly"
		}]);
	}
	function addBenefit() {
		setBenefits((current) => [...current, {
			id: `benefit-${Date.now()}`,
			type: "SNAP",
			isReceiving: true
		}]);
	}
	function addContact() {
		setContacts((current) => [...current, {
			id: `contact-${Date.now()}`,
			name: "",
			relationship: "Emergency contact",
			permissionToContact: true
		}]);
	}
	async function saveIntake() {
		if (!currentStaffId) {
			setError("Add and select a user before creating casework data.");
			return;
		}
		const hasContact = Boolean(form.phone || form.email);
		if (!form.firstName.trim() || !form.lastName.trim() || !form.dateOfBirth && !form.approximateAge.trim() || !hasContact || !form.housingStatus) {
			setError("The intake could not be saved. Please complete required client, contact, age or DOB, and housing fields.");
			return;
		}
		const createdDate = today();
		const duplicateWarnings = search?.mode === "reintake" && selectedCase ? [`Re-intake for closed case ${selectedCase.id}: ${selectedCase.displayName}`] : [];
		const caseId = await createCaseFromIntake({
			status: duplicateWarnings.length > 0 ? "Duplicate Review" : "Draft",
			createdById: currentStaffId,
			startedAt: `${createdDate}T09:00:00`,
			duplicateWarnings,
			duplicateOverrideReason: form.overrideReason || void 0,
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
				contactRestrictions: form.contactRestrictions
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
				maritalStatus: form.maritalStatus
			},
			address: {
				line1: form.line1,
				line2: form.line2,
				city: form.city,
				state: form.state,
				postalCode: form.postalCode,
				county: form.county
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
				notes: form.legalNotes
			},
			housing: {
				status: form.housingStatus,
				currentLocation: form.currentLocation,
				lengthOfStay: form.lengthOfStay,
				safeHousing: form.safeHousing,
				atRisk: form.housingAtRisk,
				evictionPending: form.evictionPending,
				livingWithFamily: form.livingWithFamily,
				notes: form.housingNotes
			}
		}, {
			existingPersonId: search?.personId,
			existingCaseId: search?.caseId,
			mode: search?.mode === "reintake" ? "reintake" : "new_case"
		});
		if (caseId) navigate({
			to: "/cases/$caseId",
			params: { caseId: String(caseId) }
		});
	}
	const pageTitle = search?.mode === "reintake" ? "Primary Re-Intake" : "Primary Intake Form";
	return /* @__PURE__ */ jsxs(Stack, {
		gap: "lg",
		children: [
			/* @__PURE__ */ jsxs(Group, {
				align: "flex-start",
				justify: "space-between",
				children: [/* @__PURE__ */ jsxs(Box, { children: [
					/* @__PURE__ */ jsx(Button, {
						component: Link,
						leftSection: /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
						mb: "sm",
						to: "/intake",
						variant: "subtle",
						children: "Back To Matches"
					}),
					/* @__PURE__ */ jsx(Text, {
						c: "dimmed",
						fw: 700,
						size: "sm",
						tt: "uppercase",
						children: "Intake"
					}),
					/* @__PURE__ */ jsx(Title, {
						order: 1,
						size: "h2",
						children: pageTitle
					}),
					/* @__PURE__ */ jsx(Text, {
						c: "dimmed",
						mt: 4,
						children: "Complete the primary intake details for the selected person."
					})
				] }), /* @__PURE__ */ jsx(Button, {
					leftSection: /* @__PURE__ */ jsx(Check, { size: 17 }),
					onClick: saveIntake,
					children: search?.mode === "reintake" ? "Save And Reopen Case" : "Save And Create Case"
				})]
			}),
			error ? /* @__PURE__ */ jsx(Alert, {
				color: "red",
				icon: /* @__PURE__ */ jsx(AlertTriangle, { size: 18 }),
				children: error
			}) : null,
			selectedPerson ? /* @__PURE__ */ jsxs(Alert, {
				color: "blue",
				icon: /* @__PURE__ */ jsx(Info, { size: 18 }),
				children: [
					"Form started for ",
					[selectedPerson.firstName, selectedPerson.lastName].filter(Boolean).join(" "),
					"."
				]
			}) : null,
			/* @__PURE__ */ jsxs(Grid, {
				align: "stretch",
				children: [/* @__PURE__ */ jsx(Grid.Col, {
					span: {
						base: 12,
						lg: 9
					},
					children: /* @__PURE__ */ jsxs(Stack, {
						id: "primary-intake-form",
						gap: "md",
						children: [
							/* @__PURE__ */ jsx(FormSection, {
								id: "client",
								title: "Client",
								children: /* @__PURE__ */ jsxs(Grid, { children: [
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 6
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label: "First Name",
											required: true,
											value: form.firstName,
											onChange: handleTextFormField("firstName")
										})
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 6
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label: "Last Name",
											required: true,
											value: form.lastName,
											onChange: handleTextFormField("lastName")
										})
									}),
									[
										["middleName", "Middle Name"],
										["preferredName", "Preferred Name"],
										["dateOfBirth", "Date Of Birth"],
										["approximateAge", "Approximate Age"],
										["ssn", "SSN"],
										["phone", "Phone"],
										["alternatePhone", "Alternate Phone"],
										["email", "Email"]
									].map(([field, label]) => /* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 4
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label,
											value: form[field],
											onChange: handleTextFormField(field)
										})
									}, field)),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 4
										},
										children: /* @__PURE__ */ jsx(Select, {
											data: [
												"Phone",
												"Text",
												"Email",
												"Mail"
											],
											label: "Preferred Contact",
											value: form.preferredContactMethod || null,
											onChange: (value) => updateForm("preferredContactMethod", value ?? "")
										})
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: 12,
										children: /* @__PURE__ */ jsx(TextInput, {
											label: "Address Line 1",
											value: form.line1,
											onChange: handleTextFormField("line1")
										})
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: 12,
										children: /* @__PURE__ */ jsx(TextInput, {
											label: "Address Line 2",
											value: form.line2,
											onChange: handleTextFormField("line2")
										})
									}),
									[
										["city", "City"],
										["state", "State"],
										["postalCode", "ZIP Code"],
										["county", "County"]
									].map(([field, label]) => /* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 3
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label,
											value: form[field],
											onChange: handleTextFormField(field)
										})
									}, field)),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: 12,
										children: /* @__PURE__ */ jsxs(Group, { children: [
											/* @__PURE__ */ jsx(Checkbox, {
												checked: form.safeToCall,
												label: "Safe To Call",
												onChange: handleCheckboxFormField("safeToCall")
											}),
											/* @__PURE__ */ jsx(Checkbox, {
												checked: form.safeToText,
												label: "Safe To Text",
												onChange: handleCheckboxFormField("safeToText")
											}),
											/* @__PURE__ */ jsx(Checkbox, {
												checked: form.safeToEmail,
												label: "Safe To Email",
												onChange: handleCheckboxFormField("safeToEmail")
											})
										] })
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: 12,
										children: /* @__PURE__ */ jsx(Textarea, {
											label: "Contact Restrictions",
											value: form.contactRestrictions,
											onChange: handleTextFormField("contactRestrictions")
										})
									})
								] })
							}),
							/* @__PURE__ */ jsx(FormSection, {
								id: "demographics",
								title: "Demographics",
								children: /* @__PURE__ */ jsxs(Grid, { children: [[
									"gender",
									"race",
									"ethnicity",
									"primaryLanguage",
									"veteranStatus",
									"disabilityStatus",
									"householdSize",
									"dependents",
									"maritalStatus"
								].map((field) => /* @__PURE__ */ jsx(Grid.Col, {
									span: {
										base: 12,
										md: 4
									},
									children: /* @__PURE__ */ jsx(TextInput, {
										label: titleCaseField(field),
										value: String(form[field]),
										onChange: handleTextFormField(field)
									})
								}, field)), /* @__PURE__ */ jsx(Grid.Col, {
									span: 12,
									children: /* @__PURE__ */ jsx(Checkbox, {
										checked: form.interpreterNeeded,
										label: "Interpreter Needed",
										onChange: handleCheckboxFormField("interpreterNeeded")
									})
								})] })
							}),
							/* @__PURE__ */ jsx(FormSection, {
								action: /* @__PURE__ */ jsx(Button, {
									onClick: addIncomeSource,
									children: "Add Income"
								}),
								id: "income",
								title: "Income",
								children: /* @__PURE__ */ jsxs(Stack, { children: [incomeSources.length === 0 ? /* @__PURE__ */ jsx(Text, {
									c: "dimmed",
									size: "sm",
									children: "No income sources added."
								}) : null, incomeSources.map((source, index) => /* @__PURE__ */ jsx(Grid, { children: [
									["type", "Income Type"],
									["sourceName", "Employer / Source"],
									["amount", "Amount"],
									["frequency", "Frequency"]
								].map(([field, label]) => /* @__PURE__ */ jsx(Grid.Col, {
									span: {
										base: 12,
										md: 3
									},
									children: /* @__PURE__ */ jsx(TextInput, {
										label,
										value: valueOrEmpty(source[field]),
										onChange: handleIncomeSourceField(index, field)
									})
								}, field)) }, source.id))] })
							}),
							/* @__PURE__ */ jsx(FormSection, {
								action: /* @__PURE__ */ jsx(Button, {
									onClick: addBenefit,
									children: "Add Benefit"
								}),
								id: "benefits",
								title: "Benefits",
								children: /* @__PURE__ */ jsxs(Stack, { children: [benefits.length === 0 ? /* @__PURE__ */ jsx(Text, {
									c: "dimmed",
									size: "sm",
									children: "No benefits added."
								}) : null, benefits.map((benefit, index) => /* @__PURE__ */ jsxs(Grid, { children: [
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 4
										},
										children: /* @__PURE__ */ jsx(Select, {
											data: benefitOptions,
											label: "Benefit",
											value: benefit.type,
											onChange: (value) => setBenefits((current) => current.map((item, itemIndex) => itemIndex === index ? {
												...item,
												type: value ?? item.type
											} : item))
										})
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 4
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label: "Monthly Amount",
											value: benefit.monthlyAmount ?? "",
											onChange: handleBenefitField(index, "monthlyAmount")
										})
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 4
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label: "Agency / Provider",
											value: benefit.agency ?? "",
											onChange: handleBenefitField(index, "agency")
										})
									})
								] }, benefit.id))] })
							}),
							/* @__PURE__ */ jsx(FormSection, {
								action: /* @__PURE__ */ jsx(Button, {
									onClick: addContact,
									children: "Add Contact"
								}),
								id: "contacts",
								title: "Contacts",
								children: /* @__PURE__ */ jsxs(Stack, { children: [contacts.length === 0 ? /* @__PURE__ */ jsx(Text, {
									c: "dimmed",
									size: "sm",
									children: "No contacts added."
								}) : null, contacts.map((contact, index) => /* @__PURE__ */ jsx(Grid, { children: [
									["name", "Name"],
									["relationship", "Relationship"],
									["phone", "Phone"],
									["email", "Email"]
								].map(([field, label]) => /* @__PURE__ */ jsx(Grid.Col, {
									span: {
										base: 12,
										md: 3
									},
									children: /* @__PURE__ */ jsx(TextInput, {
										label,
										value: valueOrEmpty(contact[field]),
										onChange: handleContactField(index, field)
									})
								}, field)) }, contact.id))] })
							}),
							/* @__PURE__ */ jsx(FormSection, {
								id: "legal",
								title: "Legal",
								children: /* @__PURE__ */ jsxs(Grid, { children: [
									/* @__PURE__ */ jsx(Grid.Col, {
										span: 12,
										children: /* @__PURE__ */ jsx(Checkbox, {
											checked: form.hasCourtInvolvement,
											label: "Court Involvement",
											onChange: handleCheckboxFormField("hasCourtInvolvement")
										})
									}),
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
										"legalStatus"
									].map((field) => /* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 4
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label: titleCaseField(field),
											value: String(form[field]),
											onChange: handleTextFormField(field)
										})
									}, field)),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: 12,
										children: /* @__PURE__ */ jsx(Checkbox, {
											checked: form.warrantsKnown,
											label: "Warrants Known",
											onChange: handleCheckboxFormField("warrantsKnown")
										})
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: 12,
										children: /* @__PURE__ */ jsx(Textarea, {
											label: "Legal Notes",
											value: form.legalNotes,
											onChange: handleTextFormField("legalNotes")
										})
									})
								] })
							}),
							/* @__PURE__ */ jsx(FormSection, {
								id: "housing",
								title: "Housing",
								children: /* @__PURE__ */ jsxs(Grid, { children: [
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 4
										},
										children: /* @__PURE__ */ jsx(Select, {
											data: housingOptions,
											label: "Housing Status",
											onChange: (value) => updateForm("housingStatus", value ?? ""),
											required: true,
											value: form.housingStatus || null
										})
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 4
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label: "Current Location",
											value: form.currentLocation,
											onChange: handleTextFormField("currentLocation")
										})
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 4
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label: "Length Of Stay",
											value: form.lengthOfStay,
											onChange: handleTextFormField("lengthOfStay")
										})
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: 12,
										children: /* @__PURE__ */ jsxs(Group, { children: [
											/* @__PURE__ */ jsx(Checkbox, {
												checked: form.safeHousing,
												label: "Safe Housing",
												onChange: handleCheckboxFormField("safeHousing")
											}),
											/* @__PURE__ */ jsx(Checkbox, {
												checked: form.housingAtRisk,
												label: "At Risk",
												onChange: handleCheckboxFormField("housingAtRisk")
											}),
											/* @__PURE__ */ jsx(Checkbox, {
												checked: form.evictionPending,
												label: "Eviction Pending",
												onChange: handleCheckboxFormField("evictionPending")
											}),
											/* @__PURE__ */ jsx(Checkbox, {
												checked: form.livingWithFamily,
												label: "Living With Family / Friends",
												onChange: handleCheckboxFormField("livingWithFamily")
											})
										] })
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: 12,
										children: /* @__PURE__ */ jsx(Textarea, {
											label: "Housing Notes",
											value: form.housingNotes,
											onChange: handleTextFormField("housingNotes")
										})
									})
								] })
							})
						]
					})
				}), /* @__PURE__ */ jsx(Grid.Col, {
					className: "self-stretch",
					span: {
						base: 12,
						lg: 3
					},
					children: /* @__PURE__ */ jsxs(Box, {
						className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24",
						children: [/* @__PURE__ */ jsx(Text, {
							c: "dimmed",
							fw: 700,
							mb: "sm",
							size: "sm",
							tt: "uppercase",
							children: "Sections"
						}), /* @__PURE__ */ jsx(TableOfContents, {
							color: "frcBlue",
							initialData: sectionHeadings.map((heading) => ({
								...heading,
								depth: 1
							})),
							radius: 6,
							scrollSpyOptions: {
								selector: "#primary-intake-form [data-intake-heading]",
								getDepth: () => 1,
								getValue: (element) => element.getAttribute("data-intake-heading") || "",
								offset: 96
							},
							size: "sm",
							variant: "light",
							getControlProps: ({ data }) => ({
								onClick: () => data.getNode().closest("[data-intake-section]")?.scrollIntoView({ block: "start" }),
								children: data.value
							})
						})]
					})
				})]
			})
		]
	});
}
function FormSection({ action, children, id, title }) {
	return /* @__PURE__ */ jsxs(Box, {
		className: "scroll-mt-24 rounded-md border border-slate-200 bg-white p-5 shadow-sm",
		"data-intake-section": true,
		id,
		children: [/* @__PURE__ */ jsxs(Group, {
			justify: "space-between",
			mb: "md",
			children: [/* @__PURE__ */ jsx(Title, {
				"data-intake-heading": title,
				id: `${id}-heading`,
				order: 2,
				size: "h4",
				children: title
			}), action]
		}), children]
	});
}
//#endregion
export { PrimaryIntakeFormPage as n, IntakeMatchFinder as t };
