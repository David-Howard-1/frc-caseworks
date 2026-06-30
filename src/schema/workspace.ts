import { z } from 'zod'

export const EntityIdSchema = z.number().int().positive()

export const CaseStatusSchema = z.enum(['Open', 'Pending', 'Closed'])
export const ProgramStatusSchema = z.enum([
  'Active',
  'Pending',
  'Completed',
  'Inactive',
  'Waitlisted',
])

export const IntakeFieldSchema = z.enum([
  'intakeDate',
  'referralSource',
  'county',
  'phone',
  'email',
  'householdIncome',
  'housing',
  'strengths',
  'needs',
])

export const AddNoteSchema = z.object({
  enrollmentId: EntityIdSchema,
  contactType: z.string(),
  summary: z.string(),
  body: z.string().min(1),
  isSession: z.boolean(),
  sessionHours: z.number().positive().optional(),
})

export const AddServiceSchema = z.object({
  enrollmentId: EntityIdSchema,
  category: z.string().min(1),
  description: z.string().min(1),
  amount: z.number().positive(),
})

export const CreateEnrollmentSchema = z.object({
  caseId: EntityIdSchema,
  programId: EntityIdSchema,
  supervisorId: EntityIdSchema.optional(),
  status: ProgramStatusSchema.default('Active'),
  opened: z.string(),
  target: z.string().optional(),
  goal: z.string().optional(),
})

const IntakeClientSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
  preferredName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  ssn: z.string().optional(),
  approximateAge: z.string().optional(),
  phone: z.string().optional(),
  alternatePhone: z.string().optional(),
  email: z.string().optional(),
  preferredContactMethod: z.string().optional(),
  safeToCall: z.boolean(),
  safeToText: z.boolean(),
  safeToEmail: z.boolean(),
  contactRestrictions: z.string().optional(),
})

const IntakeDemographicsSchema = z.object({
  gender: z.string().optional(),
  race: z.string().optional(),
  ethnicity: z.string().optional(),
  primaryLanguage: z.string().optional(),
  interpreterNeeded: z.boolean(),
  veteranStatus: z.string().optional(),
  disabilityStatus: z.string().optional(),
  householdSize: z.string().optional(),
  dependents: z.string().optional(),
  maritalStatus: z.string().optional(),
})

const IntakeAddressSchema = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  county: z.string().optional(),
})

const IntakeIncomeSourceSchema = z.object({
  id: z.string(),
  type: z.string(),
  sourceName: z.string(),
  amount: z.string(),
  frequency: z.string(),
  notes: z.string().optional(),
})

const IntakeBenefitSchema = z.object({
  id: z.string(),
  type: z.string(),
  isReceiving: z.boolean(),
  monthlyAmount: z.string().optional(),
  caseNumber: z.string().optional(),
  agency: z.string().optional(),
  notes: z.string().optional(),
})

const IntakeContactSchema = z.object({
  id: z.string(),
  name: z.string(),
  relationship: z.string(),
  organization: z.string().optional(),
  role: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  permissionToContact: z.boolean(),
  notes: z.string().optional(),
})

const IntakeLegalSchema = z.object({
  hasCourtInvolvement: z.boolean(),
  matterType: z.string().optional(),
  courtName: z.string().optional(),
  county: z.string().optional(),
  caseNumber: z.string().optional(),
  judge: z.string().optional(),
  attorney: z.string().optional(),
  officer: z.string().optional(),
  nextCourtDate: z.string().optional(),
  courtTime: z.string().optional(),
  legalStatus: z.string().optional(),
  warrantsKnown: z.boolean(),
  notes: z.string().optional(),
})

const IntakeHousingSchema = z.object({
  status: z.string(),
  currentLocation: z.string().optional(),
  lengthOfStay: z.string().optional(),
  safeHousing: z.boolean(),
  atRisk: z.boolean(),
  evictionPending: z.boolean(),
  livingWithFamily: z.boolean(),
  notes: z.string().optional(),
})

export const IntakeSubmissionInputSchema = z.object({
  status: z.enum(['Draft', 'Duplicate Review', 'Rejected', 'Converted to Case']),
  createdById: EntityIdSchema,
  convertedById: EntityIdSchema.optional(),
  caseId: EntityIdSchema.optional(),
  startedAt: z.string(),
  savedAt: z.string().optional(),
  duplicateWarnings: z.array(z.string()),
  duplicateOverrideReason: z.string().optional(),
  client: IntakeClientSchema,
  demographics: IntakeDemographicsSchema,
  address: IntakeAddressSchema,
  incomeSources: z.array(IntakeIncomeSourceSchema),
  benefits: z.array(IntakeBenefitSchema),
  relevantContacts: z.array(IntakeContactSchema),
  legal: IntakeLegalSchema,
  housing: IntakeHousingSchema,
})

export const UpdateCaseStatusSchema = z.object({
  caseId: EntityIdSchema,
  status: CaseStatusSchema,
})

export const UpdateEnrollmentSchema = z.object({
  enrollmentId: EntityIdSchema,
  patch: z.object({
    status: ProgramStatusSchema.optional(),
    opened: z.string().optional(),
    target: z.string().optional(),
    goal: z.string().optional(),
  }),
})

export const AddCaseworkerAssignmentSchema = z.object({
  enrollmentId: EntityIdSchema,
  isFirstAssignment: z.boolean(),
  staffId: EntityIdSchema,
})

export const AssignmentByStaffSchema = z.object({
  enrollmentId: EntityIdSchema,
  staffId: EntityIdSchema,
})

export const UpdateIntakeFieldSchema = z.object({
  caseId: EntityIdSchema,
  field: IntakeFieldSchema,
  value: z.string(),
})

export const AddNoteRecordSchema = z.object({
  caseId: EntityIdSchema,
  currentStaffId: EntityIdSchema,
  note: AddNoteSchema,
})

export const EditNoteRecordSchema = z.object({
  noteId: EntityIdSchema,
  note: AddNoteSchema,
})

export const AddConcreteServiceRecordSchema = z.object({
  caseId: EntityIdSchema,
  currentStaffId: EntityIdSchema,
  service: AddServiceSchema,
})

export const CreateCaseFromIntakeSchema = z.object({
  intake: IntakeSubmissionInputSchema,
  currentStaffId: EntityIdSchema,
})

export type AddNoteInput = z.infer<typeof AddNoteSchema>
export type AddServiceInput = z.infer<typeof AddServiceSchema>
export type CreateEnrollmentInput = z.infer<typeof CreateEnrollmentSchema>
export type IntakeSubmissionInput = z.infer<typeof IntakeSubmissionInputSchema>
export type UpdateCaseStatusInput = z.infer<typeof UpdateCaseStatusSchema>
export type UpdateEnrollmentInput = z.infer<typeof UpdateEnrollmentSchema>
export type AddCaseworkerAssignmentInput = z.infer<
  typeof AddCaseworkerAssignmentSchema
>
export type AssignmentByStaffInput = z.infer<typeof AssignmentByStaffSchema>
export type UpdateIntakeFieldInput = z.infer<typeof UpdateIntakeFieldSchema>
export type AddNoteRecordInput = z.infer<typeof AddNoteRecordSchema>
export type EditNoteRecordInput = z.infer<typeof EditNoteRecordSchema>
export type AddConcreteServiceRecordInput = z.infer<
  typeof AddConcreteServiceRecordSchema
>
export type CreateCaseFromIntakeInput = z.infer<typeof CreateCaseFromIntakeSchema>
