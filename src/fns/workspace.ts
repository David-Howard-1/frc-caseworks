import { createServerFn } from '@tanstack/react-start'
import {
  AddCaseworkerAssignmentSchema,
  AddConcreteServiceRecordSchema,
  AddNoteRecordSchema,
  AssignmentByStaffSchema,
  CreateEnrollmentSchema,
  CreateCaseFromIntakeSchema,
  EditNoteRecordSchema,
  UpdateCaseStatusSchema,
  UpdateEnrollmentSchema,
  UpdateIntakeFieldSchema,
} from '~/schema/workspace'
import {
  addCaseworkerAssignmentUseCase,
  addConcreteServiceUseCase,
  addNoteUseCase,
  createEnrollmentUseCase,
  createCaseFromIntakeUseCase,
  editNoteUseCase,
  loadWorkspaceUseCase,
  removeCaseworkerAssignmentUseCase,
  setPrimaryCaseworkerUseCase,
  updateCaseStatusUseCase,
  updateEnrollmentUseCase,
  updateIntakeFieldUseCase,
} from '~/use-cases/workspace'

export const loadWorkspaceFn = createServerFn({ method: 'GET' }).handler(() =>
  loadWorkspaceUseCase(),
)

export const updateCaseStatusFn = createServerFn({ method: 'POST' })
  .validator((input) => UpdateCaseStatusSchema.parse(input))
  .handler(({ data }) => updateCaseStatusUseCase(data))

export const updateEnrollmentFn = createServerFn({ method: 'POST' })
  .validator((input) => UpdateEnrollmentSchema.parse(input))
  .handler(({ data }) => updateEnrollmentUseCase(data))

export const addCaseworkerAssignmentFn = createServerFn({ method: 'POST' })
  .validator((input) => AddCaseworkerAssignmentSchema.parse(input))
  .handler(({ data }) => addCaseworkerAssignmentUseCase(data))

export const createEnrollmentFn = createServerFn({ method: 'POST' })
  .validator((input) => CreateEnrollmentSchema.parse(input))
  .handler(({ data }) => createEnrollmentUseCase(data))

export const removeCaseworkerAssignmentFn = createServerFn({ method: 'POST' })
  .validator((input) => AssignmentByStaffSchema.parse(input))
  .handler(({ data }) => removeCaseworkerAssignmentUseCase(data))

export const setPrimaryCaseworkerFn = createServerFn({ method: 'POST' })
  .validator((input) => AssignmentByStaffSchema.parse(input))
  .handler(({ data }) => setPrimaryCaseworkerUseCase(data))

export const updateIntakeFieldFn = createServerFn({ method: 'POST' })
  .validator((input) => UpdateIntakeFieldSchema.parse(input))
  .handler(({ data }) => updateIntakeFieldUseCase(data))

export const addNoteFn = createServerFn({ method: 'POST' })
  .validator((input) => AddNoteRecordSchema.parse(input))
  .handler(({ data }) => addNoteUseCase(data))

export const editNoteFn = createServerFn({ method: 'POST' })
  .validator((input) => EditNoteRecordSchema.parse(input))
  .handler(({ data }) => editNoteUseCase(data))

export const addConcreteServiceFn = createServerFn({ method: 'POST' })
  .validator((input) => AddConcreteServiceRecordSchema.parse(input))
  .handler(({ data }) => addConcreteServiceUseCase(data))

export const createCaseFromIntakeFn = createServerFn({ method: 'POST' })
  .validator((input) => CreateCaseFromIntakeSchema.parse(input))
  .handler(({ data }) => createCaseFromIntakeUseCase(data))
