import { a as formatDate, t as useDemoWorkspace } from "./useDemoWorkspace-hb7yBQ3W.js";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Alert, Badge, Box, Button, Checkbox, Divider, Grid, Group, Select, Stack, Table, Tabs, Text, TextInput, Textarea, Title } from "@mantine/core";
import { AlertTriangle, Check, FilePlus2, Search } from "lucide-react";
//#region src/components/IntakeWorkflow.tsx
var TODAY = "2026-06-10";
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
	overrideReason: ""
};
function IntakeWorkflow() {
	const { createCaseFromIntake, currentStaffId, findIntakeMatches } = useDemoWorkspace();
	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState({
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		phone: "",
		email: ""
	});
	const [hasSearched, setHasSearched] = useState(false);
	const [form, setForm] = useState(emptyForm);
	const [incomeSources, setIncomeSources] = useState([]);
	const [benefits, setBenefits] = useState([]);
	const [contacts, setContacts] = useState([]);
	const [error, setError] = useState("");
	const matches = useMemo(() => hasSearched ? findIntakeMatches(searchInput) : [], [
		findIntakeMatches,
		hasSearched,
		searchInput
	]);
	function updateForm(field, value) {
		setForm((current) => ({
			...current,
			[field]: value
		}));
	}
	function handleSearchField(field) {
		return (event) => {
			const { value } = event.currentTarget;
			setSearchInput((current) => ({
				...current,
				[field]: value
			}));
		};
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
	function saveIntake() {
		const hasContact = Boolean(searchInput.phone || searchInput.email);
		if (!searchInput.firstName.trim() || !searchInput.lastName.trim() || !searchInput.dateOfBirth && !form.approximateAge.trim() || !hasContact || !form.housingStatus) {
			setError("The intake could not be saved. Please complete required client, contact, age or DOB, and housing fields.");
			return;
		}
		const duplicateWarnings = matches.map((match) => `${match.strength}: ${match.clientName} (${match.recordType})`);
		navigate({
			to: "/cases/$caseId",
			params: { caseId: createCaseFromIntake({
				id: "pending-intake",
				status: matches.length > 0 ? "Duplicate Review" : "Draft",
				createdById: currentStaffId,
				startedAt: `${TODAY}T09:00:00`,
				duplicateWarnings,
				duplicateOverrideReason: form.overrideReason || void 0,
				client: {
					firstName: searchInput.firstName,
					middleName: form.middleName,
					lastName: searchInput.lastName,
					preferredName: form.preferredName,
					dateOfBirth: searchInput.dateOfBirth,
					approximateAge: form.approximateAge,
					phone: searchInput.phone,
					alternatePhone: form.alternatePhone,
					email: searchInput.email,
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
			}) }
		});
	}
	return /* @__PURE__ */ jsxs(Stack, {
		gap: "lg",
		children: [
			/* @__PURE__ */ jsxs(Group, {
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
						children: "New intake workflow"
					}),
					/* @__PURE__ */ jsx(Text, {
						c: "dimmed",
						mt: 4,
						children: "Search first, review possible matches, then convert a completed intake into a case."
					})
				] }), /* @__PURE__ */ jsx(Button, {
					leftSection: /* @__PURE__ */ jsx(Check, { size: 17 }),
					onClick: saveIntake,
					children: "Save and create case"
				})]
			}),
			error ? /* @__PURE__ */ jsx(Alert, {
				color: "red",
				icon: /* @__PURE__ */ jsx(AlertTriangle, { size: 18 }),
				children: error
			}) : null,
			/* @__PURE__ */ jsxs(Box, {
				className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
				children: [/* @__PURE__ */ jsxs(Group, {
					align: "flex-end",
					children: [
						/* @__PURE__ */ jsx(TextInput, {
							label: "First name",
							onChange: handleSearchField("firstName"),
							required: true,
							value: searchInput.firstName
						}),
						/* @__PURE__ */ jsx(TextInput, {
							label: "Last name",
							onChange: handleSearchField("lastName"),
							required: true,
							value: searchInput.lastName
						}),
						/* @__PURE__ */ jsx(TextInput, {
							label: "Date of birth",
							onChange: handleSearchField("dateOfBirth"),
							placeholder: "YYYY-MM-DD",
							value: searchInput.dateOfBirth
						}),
						/* @__PURE__ */ jsx(TextInput, {
							label: "Phone",
							onChange: handleSearchField("phone"),
							value: searchInput.phone
						}),
						/* @__PURE__ */ jsx(TextInput, {
							label: "Email",
							onChange: handleSearchField("email"),
							value: searchInput.email
						}),
						/* @__PURE__ */ jsx(Button, {
							leftSection: /* @__PURE__ */ jsx(Search, { size: 16 }),
							onClick: () => setHasSearched(true),
							children: "Check matches"
						})
					]
				}), hasSearched ? matches.length > 0 ? /* @__PURE__ */ jsxs(Stack, {
					mt: "md",
					children: [
						/* @__PURE__ */ jsx(Alert, {
							color: "yellow",
							icon: /* @__PURE__ */ jsx(AlertTriangle, { size: 18 }),
							children: "Possible existing records found. Review these before creating a new intake."
						}),
						/* @__PURE__ */ jsx(Table.ScrollContainer, {
							minWidth: 860,
							children: /* @__PURE__ */ jsxs(Table, {
								verticalSpacing: "sm",
								children: [/* @__PURE__ */ jsx(Table.Thead, { children: /* @__PURE__ */ jsxs(Table.Tr, { children: [
									/* @__PURE__ */ jsx(Table.Th, { children: "Client" }),
									/* @__PURE__ */ jsx(Table.Th, { children: "Record" }),
									/* @__PURE__ */ jsx(Table.Th, { children: "Status" }),
									/* @__PURE__ */ jsx(Table.Th, { children: "Program area" }),
									/* @__PURE__ */ jsx(Table.Th, { children: "Last updated" }),
									/* @__PURE__ */ jsx(Table.Th, { children: "Assigned staff" }),
									/* @__PURE__ */ jsx(Table.Th, { children: "Match" })
								] }) }), /* @__PURE__ */ jsx(Table.Tbody, { children: matches.map((match) => /* @__PURE__ */ jsxs(Table.Tr, { children: [
									/* @__PURE__ */ jsxs(Table.Td, { children: [/* @__PURE__ */ jsx(Text, {
										fw: 700,
										children: match.clientName
									}), /* @__PURE__ */ jsx(Text, {
										c: "dimmed",
										size: "sm",
										children: [match.phone, match.email].filter(Boolean).join(" - ")
									})] }),
									/* @__PURE__ */ jsx(Table.Td, { children: match.recordType }),
									/* @__PURE__ */ jsx(Table.Td, { children: match.caseStatus ?? "Draft" }),
									/* @__PURE__ */ jsx(Table.Td, { children: match.programArea }),
									/* @__PURE__ */ jsx(Table.Td, { children: formatDate(match.lastUpdated.slice(0, 10)) }),
									/* @__PURE__ */ jsx(Table.Td, { children: match.assignedStaff ?? "Unassigned" }),
									/* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsx(Badge, {
										color: match.strength.startsWith("High") ? "red" : "yellow",
										children: match.strength
									}) })
								] }, `${match.recordType}-${match.id}`)) })]
							})
						}),
						/* @__PURE__ */ jsx(Textarea, {
							label: "Duplicate override note",
							onChange: handleTextFormField("overrideReason"),
							placeholder: "Reason for creating a new intake anyway",
							value: form.overrideReason
						})
					]
				}) : /* @__PURE__ */ jsx(Alert, {
					color: "green",
					icon: /* @__PURE__ */ jsx(FilePlus2, { size: 18 }),
					mt: "md",
					children: "No matching clients, intakes, or cases were found. Continue creating a new intake."
				}) : null]
			}),
			/* @__PURE__ */ jsx(Box, {
				className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm",
				children: /* @__PURE__ */ jsxs(Tabs, {
					defaultValue: "client",
					children: [
						/* @__PURE__ */ jsxs(Tabs.List, { children: [
							/* @__PURE__ */ jsx(Tabs.Tab, {
								value: "client",
								children: "Client"
							}),
							/* @__PURE__ */ jsx(Tabs.Tab, {
								value: "demographics",
								children: "Demographics"
							}),
							/* @__PURE__ */ jsx(Tabs.Tab, {
								value: "income",
								children: "Income"
							}),
							/* @__PURE__ */ jsx(Tabs.Tab, {
								value: "contacts",
								children: "Contacts"
							}),
							/* @__PURE__ */ jsx(Tabs.Tab, {
								value: "legal",
								children: "Legal"
							}),
							/* @__PURE__ */ jsx(Tabs.Tab, {
								value: "housing",
								children: "Housing"
							})
						] }),
						/* @__PURE__ */ jsx(Tabs.Panel, {
							pt: "md",
							value: "client",
							children: /* @__PURE__ */ jsxs(Grid, { children: [
								/* @__PURE__ */ jsx(Grid.Col, {
									span: {
										base: 12,
										md: 4
									},
									children: /* @__PURE__ */ jsx(TextInput, {
										label: "Middle name",
										value: form.middleName,
										onChange: handleTextFormField("middleName")
									})
								}),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: {
										base: 12,
										md: 4
									},
									children: /* @__PURE__ */ jsx(TextInput, {
										label: "Preferred name",
										value: form.preferredName,
										onChange: handleTextFormField("preferredName")
									})
								}),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: {
										base: 12,
										md: 4
									},
									children: /* @__PURE__ */ jsx(TextInput, {
										label: "Approximate age",
										value: form.approximateAge,
										onChange: handleTextFormField("approximateAge")
									})
								}),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: {
										base: 12,
										md: 4
									},
									children: /* @__PURE__ */ jsx(TextInput, {
										label: "Alternate phone",
										value: form.alternatePhone,
										onChange: handleTextFormField("alternatePhone")
									})
								}),
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
										label: "Preferred contact",
										value: form.preferredContactMethod || null,
										onChange: (value) => updateForm("preferredContactMethod", value ?? "")
									})
								}),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: {
										base: 12,
										md: 4
									},
									children: /* @__PURE__ */ jsx(TextInput, {
										label: "County",
										value: form.county,
										onChange: handleTextFormField("county")
									})
								}),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: 12,
									children: /* @__PURE__ */ jsx(TextInput, {
										label: "Address",
										value: form.line1,
										onChange: handleTextFormField("line1")
									})
								}),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: {
										base: 12,
										md: 4
									},
									children: /* @__PURE__ */ jsx(TextInput, {
										label: "City",
										value: form.city,
										onChange: handleTextFormField("city")
									})
								}),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: {
										base: 12,
										md: 4
									},
									children: /* @__PURE__ */ jsx(TextInput, {
										label: "State",
										value: form.state,
										onChange: handleTextFormField("state")
									})
								}),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: {
										base: 12,
										md: 4
									},
									children: /* @__PURE__ */ jsx(TextInput, {
										label: "ZIP code",
										value: form.postalCode,
										onChange: handleTextFormField("postalCode")
									})
								}),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: 12,
									children: /* @__PURE__ */ jsxs(Group, { children: [
										/* @__PURE__ */ jsx(Checkbox, {
											checked: form.safeToCall,
											label: "Safe to call",
											onChange: handleCheckboxFormField("safeToCall")
										}),
										/* @__PURE__ */ jsx(Checkbox, {
											checked: form.safeToText,
											label: "Safe to text",
											onChange: handleCheckboxFormField("safeToText")
										}),
										/* @__PURE__ */ jsx(Checkbox, {
											checked: form.safeToEmail,
											label: "Safe to email",
											onChange: handleCheckboxFormField("safeToEmail")
										})
									] })
								})
							] })
						}),
						/* @__PURE__ */ jsx(Tabs.Panel, {
							pt: "md",
							value: "demographics",
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
									label: field.replace(/([A-Z])/g, " $1"),
									value: String(form[field]),
									onChange: handleTextFormField(field)
								})
							}, field)), /* @__PURE__ */ jsx(Grid.Col, {
								span: 12,
								children: /* @__PURE__ */ jsx(Checkbox, {
									checked: form.interpreterNeeded,
									label: "Interpreter needed",
									onChange: handleCheckboxFormField("interpreterNeeded")
								})
							})] })
						}),
						/* @__PURE__ */ jsxs(Tabs.Panel, {
							pt: "md",
							value: "income",
							children: [
								/* @__PURE__ */ jsxs(Group, {
									justify: "space-between",
									children: [/* @__PURE__ */ jsx(Title, {
										order: 2,
										size: "h4",
										children: "Income sources"
									}), /* @__PURE__ */ jsx(Button, {
										onClick: addIncomeSource,
										children: "Add income"
									})]
								}),
								/* @__PURE__ */ jsx(Stack, {
									mt: "sm",
									children: incomeSources.map((source, index) => /* @__PURE__ */ jsxs(Grid, { children: [
										/* @__PURE__ */ jsx(Grid.Col, {
											span: {
												base: 12,
												md: 3
											},
											children: /* @__PURE__ */ jsx(TextInput, {
												label: "Income type",
												value: source.type,
												onChange: handleIncomeSourceField(index, "type")
											})
										}),
										/* @__PURE__ */ jsx(Grid.Col, {
											span: {
												base: 12,
												md: 3
											},
											children: /* @__PURE__ */ jsx(TextInput, {
												label: "Employer/source",
												value: source.sourceName,
												onChange: handleIncomeSourceField(index, "sourceName")
											})
										}),
										/* @__PURE__ */ jsx(Grid.Col, {
											span: {
												base: 12,
												md: 3
											},
											children: /* @__PURE__ */ jsx(TextInput, {
												label: "Amount",
												value: source.amount,
												onChange: handleIncomeSourceField(index, "amount")
											})
										}),
										/* @__PURE__ */ jsx(Grid.Col, {
											span: {
												base: 12,
												md: 3
											},
											children: /* @__PURE__ */ jsx(TextInput, {
												label: "Frequency",
												value: source.frequency,
												onChange: handleIncomeSourceField(index, "frequency")
											})
										})
									] }, source.id))
								}),
								/* @__PURE__ */ jsx(Divider, { my: "md" }),
								/* @__PURE__ */ jsxs(Group, {
									justify: "space-between",
									children: [/* @__PURE__ */ jsx(Title, {
										order: 2,
										size: "h4",
										children: "Benefits"
									}), /* @__PURE__ */ jsx(Button, {
										onClick: addBenefit,
										children: "Add benefit"
									})]
								}),
								/* @__PURE__ */ jsx(Stack, {
									mt: "sm",
									children: benefits.map((benefit, index) => /* @__PURE__ */ jsxs(Grid, { children: [
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
												label: "Monthly amount",
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
												label: "Agency/provider",
												value: benefit.agency ?? "",
												onChange: handleBenefitField(index, "agency")
											})
										})
									] }, benefit.id))
								})
							]
						}),
						/* @__PURE__ */ jsxs(Tabs.Panel, {
							pt: "md",
							value: "contacts",
							children: [/* @__PURE__ */ jsxs(Group, {
								justify: "space-between",
								children: [/* @__PURE__ */ jsx(Title, {
									order: 2,
									size: "h4",
									children: "Relevant contacts"
								}), /* @__PURE__ */ jsx(Button, {
									onClick: addContact,
									children: "Add contact"
								})]
							}), /* @__PURE__ */ jsx(Stack, {
								mt: "sm",
								children: contacts.map((contact, index) => /* @__PURE__ */ jsxs(Grid, { children: [
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 3
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label: "Name",
											value: contact.name,
											onChange: handleContactField(index, "name")
										})
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 3
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label: "Relationship",
											value: contact.relationship,
											onChange: handleContactField(index, "relationship")
										})
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 3
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label: "Phone",
											value: contact.phone ?? "",
											onChange: handleContactField(index, "phone")
										})
									}),
									/* @__PURE__ */ jsx(Grid.Col, {
										span: {
											base: 12,
											md: 3
										},
										children: /* @__PURE__ */ jsx(TextInput, {
											label: "Email",
											value: contact.email ?? "",
											onChange: handleContactField(index, "email")
										})
									})
								] }, contact.id))
							})]
						}),
						/* @__PURE__ */ jsx(Tabs.Panel, {
							pt: "md",
							value: "legal",
							children: /* @__PURE__ */ jsxs(Grid, { children: [
								/* @__PURE__ */ jsx(Grid.Col, {
									span: 12,
									children: /* @__PURE__ */ jsx(Checkbox, {
										checked: form.hasCourtInvolvement,
										label: "Court involvement",
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
										label: field.replace(/([A-Z])/g, " $1"),
										value: String(form[field]),
										onChange: handleTextFormField(field)
									})
								}, field)),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: 12,
									children: /* @__PURE__ */ jsx(Checkbox, {
										checked: form.warrantsKnown,
										label: "Warrants known",
										onChange: handleCheckboxFormField("warrantsKnown")
									})
								}),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: 12,
									children: /* @__PURE__ */ jsx(Textarea, {
										label: "Legal notes",
										value: form.legalNotes,
										onChange: handleTextFormField("legalNotes")
									})
								})
							] })
						}),
						/* @__PURE__ */ jsx(Tabs.Panel, {
							pt: "md",
							value: "housing",
							children: /* @__PURE__ */ jsxs(Grid, { children: [
								/* @__PURE__ */ jsx(Grid.Col, {
									span: {
										base: 12,
										md: 4
									},
									children: /* @__PURE__ */ jsx(Select, {
										data: housingOptions,
										label: "Housing status",
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
										label: "Current location",
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
										label: "Length of stay",
										value: form.lengthOfStay,
										onChange: handleTextFormField("lengthOfStay")
									})
								}),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: 12,
									children: /* @__PURE__ */ jsxs(Group, { children: [
										/* @__PURE__ */ jsx(Checkbox, {
											checked: form.safeHousing,
											label: "Safe housing",
											onChange: handleCheckboxFormField("safeHousing")
										}),
										/* @__PURE__ */ jsx(Checkbox, {
											checked: form.housingAtRisk,
											label: "At risk",
											onChange: handleCheckboxFormField("housingAtRisk")
										}),
										/* @__PURE__ */ jsx(Checkbox, {
											checked: form.evictionPending,
											label: "Eviction pending",
											onChange: handleCheckboxFormField("evictionPending")
										}),
										/* @__PURE__ */ jsx(Checkbox, {
											checked: form.livingWithFamily,
											label: "Living with family/friends",
											onChange: handleCheckboxFormField("livingWithFamily")
										})
									] })
								}),
								/* @__PURE__ */ jsx(Grid.Col, {
									span: 12,
									children: /* @__PURE__ */ jsx(Textarea, {
										label: "Housing notes",
										value: form.housingNotes,
										onChange: handleTextFormField("housingNotes")
									})
								})
							] })
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region src/routes/intake.tsx?tsr-split=component
var SplitComponent = IntakeWorkflow;
//#endregion
export { SplitComponent as component };
