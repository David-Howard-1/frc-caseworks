import { createServerFn } from '@tanstack/react-start'
import type { CaseProgramEnrollment, CaseStatus, Intake } from '~/domain/demo-data'
import * as workspace from './workspace'

export const loadWorkspaceFn = createServerFn({ method: 'GET' }).handler(() =>
  workspace.loadWorkspace(),
)

export const updateCaseStatusFn = createServerFn({ method: 'POST' })
  .validator((input: { caseId: string; status: CaseStatus }) => input)
  .handler(({ data }) => workspace.updateCaseStatus(data))

export const updateEnrollmentFn = createServerFn({ method: 'POST' })
  .validator(
    (input: {
      enrollmentId: string
      patch: Partial<CaseProgramEnrollment>
    }) => input,
  )
  .handler(({ data }) => workspace.updateEnrollment(data))

export const addCaseworkerAssignmentFn = createServerFn({ method: 'POST' })
  .validator(
    (input: { enrollment: CaseProgramEnrollment; staffId: string }) => input,
  )
  .handler(({ data }) => workspace.addCaseworkerAssignment(data))

export const removeCaseworkerAssignmentFn = createServerFn({ method: 'POST' })
  .validator((input: { enrollmentId: string; staffId: string }) => input)
  .handler(({ data }) => workspace.removeCaseworkerAssignment(data))

export const setPrimaryCaseworkerFn = createServerFn({ method: 'POST' })
  .validator((input: { enrollmentId: string; staffId: string }) => input)
  .handler(({ data }) => workspace.setPrimaryCaseworker(data))

export const updateIntakeFieldFn = createServerFn({ method: 'POST' })
  .validator(
    (input: { caseId: string; field: keyof Intake; value: string }) => input,
  )
  .handler(({ data }) => workspace.updateIntakeField(data))

export const addNoteFn = createServerFn({ method: 'POST' })
  .validator(
    (input: {
      caseId: string
      currentStaffId: string
      note: workspace.AddNoteInput
      noteId?: string
    }) => input,
  )
  .handler(({ data }) => workspace.addNote(data))

export const editNoteFn = createServerFn({ method: 'POST' })
  .validator(
    (input: {
      noteId: string
      note: workspace.AddNoteInput
    }) => input,
  )
  .handler(({ data }) => workspace.editNote(data))

export const addConcreteServiceFn = createServerFn({ method: 'POST' })
  .validator(
    (input: {
      caseRecord: Parameters<typeof workspace.addConcreteService>[0]['caseRecord']
      currentStaffId: string
      service: workspace.AddServiceInput
      serviceId?: string
    }) => input,
  )
  .handler(({ data }) => workspace.addConcreteService(data))

export const createCaseFromIntakeFn = createServerFn({ method: 'POST' })
  .validator(
    (input: Parameters<typeof workspace.createCaseFromIntake>[0]) => input,
  )
  .handler(({ data }) => workspace.createCaseFromIntake(data))
